"use client";

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import * as E from 'fp-ts/Either';
import { ArrowRight } from 'lucide-react';

import { ConversionData } from '@/lib/conversion-data';
import { performConversion } from '@/lib/converter';
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

  const [fromUnit, setFromUnit] = useState(historicalUnits[0]);
  const [toUnit, setToUnit] = useState(modernUnits[0]);
  const [inputValue, setInputValue] = useState('1');
  const [result, setResult] = useState<string | null>(null);
  
  const getUnitName = useCallback((unitKey: string) => {
    return t.units[unitKey as keyof typeof t.units] || unitKey;
  }, [t.units]);

  const handleConvert = useCallback(() => {
    const conversionResult = performConversion(categoryId, fromUnit, toUnit, inputValue, language, conversionData);
    E.fold(
      (error: string) => setResult(error),
      (value: number) => {
        const fromUnitName = getUnitName(fromUnit);
        const toUnitName = getUnitName(toUnit);
        const formattedValue = value.toLocaleString(undefined, {
          maximumFractionDigits: 5,
        });
        setResult(`${inputValue} ${fromUnitName} ${t.is} ${formattedValue} ${toUnitName}`);
      }
    )(conversionResult);
  }, [categoryId, fromUnit, toUnit, inputValue, language, getUnitName, t.is, conversionData]);
  
  useEffect(() => {
    handleConvert();
  }, [handleConvert]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/[eE]/.test(value)) {
      return;
    }
    if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.')) {
      setInputValue(parseFloat(value).toString());
      return;
    }
    setInputValue(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-11 items-end gap-4">
        <div className="md:col-span-3 space-y-2">
          <Label htmlFor={`value-${categoryId}`}>{t.valueLabel}</Label>
          <Input
            id={`value-${categoryId}`}
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={`${t.enterPlaceholder} ${t.categories[categoryId as keyof typeof t.categories]}`}
            className="text-base"
          />
        </div>
        <div className="md:col-span-3 space-y-2">
          <Label htmlFor={`from-${categoryId}`}>{t.fromLabel}</Label>
          <Select value={fromUnit} onValueChange={setFromUnit}>
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
          <Select value={toUnit} onValueChange={setToUnit}>
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
      {result && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="flex ip-4">
            <p className="text-center font-medium">{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
