import * as TE from 'fp-ts/TaskEither';

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

export const fetchConversionData = (
  fetchFn: typeof fetch = fetch,
): TE.TaskEither<Error, ConversionData> =>
  TE.tryCatch(
    async () => {
      const response = await fetchFn('/api/conversion-data.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      return (await response.json()) as ConversionData;
    },
    (reason) =>
      reason instanceof Error
        ? reason
        : new Error(`Failed to load conversion data: ${String(reason)}`),
  );
