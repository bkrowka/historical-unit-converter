import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ConversionData } from './conversion-data';
import { Language } from './localization';

export type ConversionError =
  | { type: 'EmptyInput' }
  | { type: 'InvalidNumber' }
  | { type: 'UnitSelection' }
  | { type: 'UnitNotFound'; category: string };

const parseInput = (input: string): E.Either<ConversionError, number> => {
  if (input.trim() === '') {
    return E.left({ type: 'EmptyInput' });
  }
  const num = parseFloat(input);
  return isNaN(num) || !isFinite(num)
    ? E.left({ type: 'InvalidNumber' })
    : E.right(num);
};

const getUnit = (
  category: string,
  unitName: string,
  conversionData: ConversionData
): O.Option<{ toStandard: number }> => {
  return pipe(
    O.fromNullable(conversionData[category]),
    O.chain(cat => O.fromNullable(cat.historical[unitName] || cat.modern[unitName]))
  );
};

const validate = (
  inputValue: string,
  fromUnitName: string | undefined,
  toUnitName: string | undefined
): E.Either<ConversionError, { value: number; from: string; to: string }> =>
  pipe(
    parseInput(inputValue),
    E.chain(value => {
      const units = pipe(
        O.fromNullable(fromUnitName),
        O.chain(from => O.fromNullable(toUnitName)),
        O.map(() => ({ from: fromUnitName as string, to: toUnitName as string }))
      );

      return pipe(
        units,
        E.fromOption(() => ({ type: 'UnitSelection' } as ConversionError)),
        E.map(({ from, to }) => ({ value, from, to }))
      );
    })
  );

const getFactors = (
  category: string,
  from: string,
  to: string,
  conversionData: ConversionData
): E.Either<ConversionError, { from: { toStandard: number }; to: { toStandard: number } }> => {
  const fromFactor = getUnit(category, from, conversionData);
  const toFactor = getUnit(category, to, conversionData);

  const combined = pipe(
    O.Do,
    O.apS('from', fromFactor),
    O.apS('to', toFactor)
  );

  return pipe(
    combined,
    E.fromOption(() => ({ type: 'UnitNotFound', category } as ConversionError))
  );
};

const convert = (
  value: number,
  factors: { from: { toStandard: number }; to: { toStandard: number } }
): number => {
  const valueInStandard = value * factors.from.toStandard;
  return valueInStandard / factors.to.toStandard;
};

export const performConversion = (
  category: string,
  fromUnitName: string,
  toUnitName: string,
  inputValue: string,
  _lang: Language,
  conversionData: ConversionData
): E.Either<ConversionError, number> => {
  return pipe(
    validate(inputValue, fromUnitName, toUnitName),
    E.chain(({ value, from, to }) =>
      pipe(
        getFactors(category, from, to, conversionData),
        E.map(factors => convert(value, factors))
      )
    )
  );
};
