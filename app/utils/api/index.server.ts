import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Result, TransformedData } from "~/utils/api/types";
import { MovieData } from "~/utils/tmdb/types";

export async function getSteamingInfo({
  id,
  context,
}: {
  id: MovieData["id"];
  context: LoaderFunctionArgs["context"];
}): Promise<API> {
  const response = await fetch(
    `https://streaming-availability.p.rapidapi.com/get?tmdb_id=movie/${id}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-RapidAPI-Key": context.env.RAPID_API_KEY,
        "X-RapidAPI-Host": context.env.RAPID_API_HOST,
      },
    }
  );

  if (response.ok) {
    const raw: { result: Result } = await response.json();
    const transformed = transformDataArray(raw.result);
    return transformed;
  } else {
    const error: { message: string } = await response.json();
    return Promise.reject(error.message);
  }
}

export function transformData(data: Result) {
  const transformed: TransformedData = { ...data, providers: {} };

  for (const locale in data.streamingInfo) {
    const country = data.streamingInfo[locale];

    country.forEach((provider) => {
      if (!transformed.providers[provider.service]) {
        transformed.providers[provider.service] = {
          slug: provider.service,
          logo: `https://www.movieofthenight.com/static/image/icon/service/${provider.service}.svg`,
          countries: {},
        };
      }

      if (!transformed.providers[provider.service].countries[locale]) {
        transformed.providers[provider.service].countries[locale] = [];
      }

      transformed.providers[provider.service].countries[locale].push(provider);
    });
  }

  return transformed;
}
//
//
//
//
export type APIPrice = { amount: string; currency: string; formatted: string };

export type APIOption = {
  link: string;
  availableSince: number;
  price?: APIPrice;
};

export type APICountry = {
  code: string;
  buy?: APIOption;
  rent?: APIOption;
  subscription?: APIOption;
};

export type APIProvider = {
  slug: string;
  logo: string;
  countries: Array<APICountry>;
};

export type API = Array<APIProvider>;

export function transformDataArray(data: Result): API {
  const originalData = data.streamingInfo;
  const transformed: API = [];

  for (const countryCode in originalData) {
    originalData[countryCode].forEach((provider) => {
      // Initialize the provider if not already
      if (transformed.findIndex((p) => p.slug === provider.service) === -1) {
        transformed.push({
          slug: provider.service,
          logo: `https://www.movieofthenight.com/static/image/icon/service/${provider.service}.svg`,
          countries: [],
        });
      }

      // Get the index of the provider and their countries
      const providerIndex = transformed.findIndex(
        (p) => p.slug === provider.service
      );

      // Get the index of the country and add either the buy, rent or stream option
      const providerCountries = transformed[providerIndex].countries;
      const countryIndex = providerCountries.findIndex(
        (c) => c.code === countryCode
      );

      if (countryIndex === -1) {
        // If the country does not exist, initialize it with the current data
        const newData = {
          code: countryCode,
          [provider.streamingType]: {
            link: provider.link,
            price: provider.price,
            availableSince: provider.availableSince,
          },
        };
        providerCountries.push(newData);
      } else {
        // If the country already exists, update it with new type data
        providerCountries[countryIndex] = {
          ...providerCountries[countryIndex],
          [provider.streamingType]: {
            link: provider.link,
            price: provider.price,
            availableSince: provider.availableSince,
          },
        };
      }
    });
  }

  return transformed;
}
