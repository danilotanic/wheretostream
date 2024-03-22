import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { MovieResult } from "~/utils/api/moviedb.types";
import {
  RapidAPIResponse,
  StreamingResponse,
} from "~/utils/api/rapidapi.types";

export async function getSteamingInfo({
  id,
  type,
  context,
  location,
}: {
  id: MovieResult["id"];
  type: "tv" | "movie";
  context: LoaderFunctionArgs["context"];
  location: string | null;
}): Promise<StreamingResponse> {
  const response = await fetch(
    `https://streaming-availability.p.rapidapi.com/get?tmdb_id=${type}/${id}`,
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
    const raw: RapidAPIResponse = await response.json();
    const transformed = transformData(raw);

    if (location) {
      transformed.forEach((provider) => {
        const countryExcists = provider.countries.some(
          (c) => c.code === location
        );

        if (countryExcists) {
          provider.countries.forEach((country) => {
            if (country.code === location) {
              country.user = true;
            }
          });
        }

        if (!countryExcists) {
          provider.countries.push({
            code: location,
            user: true,
          });
        }
      });
    }

    return transformed;
  } else {
    const error: { message: string } = await response.json();
    return Promise.reject(error.message);
  }
}

export function transformData(data: RapidAPIResponse): StreamingResponse {
  const originalData = data.result.streamingInfo;
  const transformed: StreamingResponse = [];

  for (const countryCode in originalData) {
    originalData[countryCode]
      .filter((obj) => !Object.prototype.hasOwnProperty.call(obj, "addon")) // remove addons
      .forEach((provider) => {
        // Initialize the provider if not already
        if (transformed.findIndex((p) => p.slug === provider.service) === -1) {
          transformed.push({
            slug: provider.service,
            logo: `https://www.movieofthenight.com/static/image/icon/service/${provider.service}.svg`,
            countries: [],
            attributes: [],
          });
        }

        // Get the index of the provider and their countries
        const providerIndex = transformed.findIndex(
          (p) => p.slug === provider.service
        );

        // Get the index of the country and add either the buy, rent or stream option
        const providerCountries = transformed[providerIndex].countries;
        const providerAttributes = transformed[providerIndex].attributes;
        const countryIndex = providerCountries.findIndex(
          (c) => c.code === countryCode
        );

        if (countryIndex === -1) {
          // If the country does not exist, initialize it with the current data
          const newData = {
            user: location === countryCode ? true : false,
            code: countryCode,
            [provider.streamingType]: {
              link: provider.link,
              price: provider.price,
              availableSince: provider.availableSince,
            },
          };
          providerCountries.push(newData);

          if (!providerAttributes.includes(provider.streamingType)) {
            providerAttributes.push(provider.streamingType);
          }
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

          if (!providerAttributes.includes(provider.streamingType)) {
            providerAttributes.push(provider.streamingType);
          }
        }
      });
  }

  return transformed;
}
