import * as T from 'fp-ts/Task';

export type UnitDetails = {
  name: string;
  toStandard: number;
};

export type UnitCategory = {
  name: string;
  standardUnit: string;
  historical: Record<string, UnitDetails>;
  modern: Record<string, UnitDetails>;
};

export type ConversionData = Record<string, UnitCategory>;

export const fetchConversionData: T.Task<ConversionData> = async () => {
  try {
    const response = await fetch('/api/conversion-data.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return await response.json();
  } catch (reason) {
    throw new Error(`Failed to load conversion data: ${reason}`);
  }
};
