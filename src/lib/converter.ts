import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ConversionData } from './conversion-data';
import { Language, translations } from './localization';

const parseInput = (input: string, lang: Language): E.Either<string, number> => {
  if (input.trim() === '') {
    return E.left(translations[lang].errorEmpty);
  }
  const num = parseFloat(input);
  return isNaN(num) || !isFinite(num)
    ? E.left(translations[lang].errorInvalid)
    : E.right(num);
};

const getUnit = (category: string, unitName: string, conversionData: ConversionData): O.Option<{ toStandard: number }> => {
  return pipe(
    O.fromNullable(conversionData[category]),
    O.chain(cat => O.fromNullable(cat.historical[unitName] || cat.modern[unitName]))
  );
};

export const performConversion = (
  category: string,
  fromUnitName: string,
  toUnitName: string,
  inputValue: string,
  lang: Language,
  conversionData: ConversionData,
): E.Either<string, number> => {
  return pipe(
    parseInput(inputValue, lang),
    E.chain(value => {
      const units = pipe(
        O.fromNullable(fromUnitName),
        O.chain(from => O.fromNullable(toUnitName)),
        O.map(() => ({ from: fromUnitName, to: toUnitName }))
      );

      return pipe(
        units,
        E.fromOption(() => translations[lang].errorUnitSelection),
        E.chain(({ from, to }) => {
          const fromFactor = getUnit(category, from, conversionData);
          const toFactor = getUnit(category, to, conversionData);
          
          const combinedFactors = pipe(
            O.Do,
            O.apS('from', fromFactor),
            O.apS('to', toFactor)
          );

          return pipe(
            combinedFactors,
            E.fromOption(() => {
                const categoryName = translations[lang].categories[category as keyof typeof translations.en.categories] || category;
                return translations[lang].errorUnitNotFound(categoryName);
            }),
            E.map(({ from, to }) => {
              const valueInStandard = value * from.toStandard;
              return valueInStandard / to.toStandard;
            })
          );
        })
      );
    })
  );
};
