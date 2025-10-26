"use client";

import { useEffect, useCallback, useReducer, ChangeEvent } from 'react';
import * as E from 'fp-ts/Either';
import { ArrowRight } from 'lucide-react';

import { ConversionData } from '@/lib/conversion-data';
import { performConversion, ConversionError } from '@/lib/converter';
import { useLanguage } from '@/hooks/use-language';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type ConversionInterfaceProps = {
  categoryId: string;
  conversionData: ConversionData;
};

export function ConversionInterface({ categoryId, conversionData }: ConversionInterfaceProps) {
  const { language, t } = useLanguage();
  const category = conversionData[categoryId];
  
  if (!category) {
    return null;
  }

  const historicalUnits = Object.keys(category.historical);
  const modernUnits = Object.keys(category.modern);

  type State = {
    fromUnit: string;
    toUnit: string;
    inputValue: string;
    result: string | null;
  };

  type Action =
    | { type: 'setFrom'; payload: string }
    | { type: 'setTo'; payload: string }
    | { type: 'setInput'; payload: string }
    | { type: 'setResult'; payload: string | null }
    | { type: 'reset'; payload: { fromUnit: string; toUnit: string; inputValue?: string } };

  const initialState: State = {
    fromUnit: historicalUnits[0],
    toUnit: modernUnits[0],
    inputValue: '1',
    result: null,
  };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'setFrom':
        return { ...state, fromUnit: action.payload };
      case 'setTo':
        return { ...state, toUnit: action.payload };
      case 'setInput':
        return { ...state, inputValue: action.payload };
      case 'setResult':
        return { ...state, result: action.payload };
      case 'reset':
        return {
          ...state,
          fromUnit: action.payload.fromUnit,
          toUnit: action.payload.toUnit,
          inputValue: action.payload.inputValue ?? '1',
          result: null,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  
  const getUnitName = useCallback((unitKey: string) => {
    return t.units[unitKey as keyof typeof t.units] || unitKey;
  }, [t.units]);

  const handleConvert = useCallback(() => {
    const conversionResult = performConversion(categoryId, state.fromUnit, state.toUnit, state.inputValue, language, conversionData);
    const errorToString = (err: ConversionError) => {
      switch (err.type) {
        case 'EmptyInput':
          return t.errorEmpty;
        case 'InvalidNumber':
          return t.errorInvalid;
        case 'UnitSelection':
          return t.errorUnitSelection;
        case 'UnitNotFound': {
          const categoryName =
            t.categories[err.category as keyof typeof t.categories] || err.category;
          return t.errorUnitNotFound(categoryName);
        }
        default:
          return String(err) || 'Unknown error';
      }
    };

    E.fold(
      (error: ConversionError) => dispatch({ type: 'setResult', payload: errorToString(error) }),
      (value: number) => {
        const fromUnitName = getUnitName(state.fromUnit);
        const toUnitName = getUnitName(state.toUnit);
        const formattedValue = value.toLocaleString(undefined, {
          maximumFractionDigits: 5,
        });
        dispatch({
          type: 'setResult',
          payload: `${state.inputValue} ${fromUnitName} ${t.is} ${formattedValue} ${toUnitName}`,
        });
      }
    )(conversionResult);
  }, [categoryId, state.fromUnit, state.toUnit, state.inputValue, language, getUnitName, t.is, conversionData]);
  
  useEffect(() => {
    const nextFrom = historicalUnits[0] ?? '';
    const nextTo = modernUnits[0] ?? '';
    dispatch({ type: 'reset', payload: { fromUnit: nextFrom, toUnit: nextTo, inputValue: '1' } });
  }, [categoryId]);

  useEffect(() => {
    handleConvert();
  }, [handleConvert]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/[eE]/.test(value)) {
      return;
    }
    if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.')) {
      dispatch({ type: 'setInput', payload: parseFloat(value).toString() });
      return;
    }
    dispatch({ type: 'setInput', payload: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-11 items-end gap-4">
        <div className="md:col-span-3 space-y-2">
          <Label htmlFor={`value-${categoryId}`}>{t.valueLabel}</Label>
          <Input
            id={`value-${categoryId}`}
            type="number"
            value={state.inputValue}
            onChange={handleInputChange}
            placeholder={`${t.enterPlaceholder} ${t.categories[categoryId as keyof typeof t.categories]}`}
            className="text-base"
          />
        </div>
        <div className="md:col-span-3 space-y-2">
          <Label htmlFor={`from-${categoryId}`}>{t.fromLabel}</Label>
          <Select value={state.fromUnit} onValueChange={(v) => dispatch({ type: 'setFrom', payload: v })}>
            <SelectTrigger id={`from-${categoryId}`}>
              <SelectValue placeholder={t.selectHistoricalUnit} />
            </SelectTrigger>
            <SelectContent>
              {historicalUnits.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {getUnitName(unit)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center md:col-span-1">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="md:col-span-3 space-y-2">
          <Label htmlFor={`to-${categoryId}`}>{t.toLabel}</Label>
          <Select value={state.toUnit} onValueChange={(v) => dispatch({ type: 'setTo', payload: v })}>
            <SelectTrigger id={`to-${categoryId}`}>
              <SelectValue placeholder={t.selectModernUnit} />
            </SelectTrigger>
            <SelectContent>
              {modernUnits.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {getUnitName(unit)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {state.result && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="flex ip-4">
            <p className="text-center font-medium">{state.result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
