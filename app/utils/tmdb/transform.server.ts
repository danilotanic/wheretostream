import {
  BuyRentData,
  FlatRateData,
  ProviderListData,
} from "~/utils/tmdb/types";

export type TransformedData = {
  [key: string]: {
    [key: string]: {
      buy?: BuyRentData;
      rent?: BuyRentData;
      stream?: FlatRateData;
    };
  };
};

export function transformData(data: ProviderListData): TransformedData {
  const transformed: TransformedData = {};

  for (const country in data.results) {
    const countryData = data.results[country];

    for (const flatrate in countryData.flatrate) {
      const provider = countryData.flatrate[Number(flatrate)];

      const providerName: string = provider.provider_name
        .replace(/\s+/g, "_")
        .toLowerCase();

      if (!transformed[providerName]) {
        transformed[providerName] = {};
      }

      if (!transformed[providerName][country]) {
        transformed[providerName][country] = {};
      }

      transformed[providerName][country].stream = provider;
    }

    for (const buy in countryData.buy) {
      const provider = countryData.buy[Number(buy)];

      const providerName: string = provider.provider_name
        .replace(/\s+/g, "_")
        .toLowerCase();

      if (!transformed[providerName]) {
        transformed[providerName] = {};
      }

      if (!transformed[providerName][country]) {
        transformed[providerName][country] = {};
      }

      transformed[providerName][country].buy = provider;
    }

    for (const rent in countryData.rent) {
      const provider = countryData.rent[Number(rent)];

      const providerName: string = provider.provider_name
        .replace(/\s+/g, "_")
        .toLowerCase();

      if (!transformed[providerName]) {
        transformed[providerName] = {};
      }

      if (!transformed[providerName][country]) {
        transformed[providerName][country] = {};
      }

      transformed[providerName][country].rent = provider;
    }
  }

  return transformed;
}
