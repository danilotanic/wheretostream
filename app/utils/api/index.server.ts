import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Result, TransformedData } from "~/utils/api/types";
import { MovieData } from "~/utils/tmdb/types";

export async function getSteamingInfo({
  id,
  context,
}: {
  id: MovieData["id"];
  context: LoaderFunctionArgs["context"];
}): Promise<TransformedData> {
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
    const transformed: TransformedData = transformData(raw.result);

    return transformed;
  } else {
    const error: { message: string } = await response.json();
    return Promise.reject(error.message);
  }
}

export default function transformData(data: Result) {
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
