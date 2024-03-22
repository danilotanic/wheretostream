import { Genre } from "~/utils/api/moviedb.types";

export type RapidAPIResponse = {
  result: {
    type: string;
    title: string;
    year: number;
    imdbId: string;
    tmdbId: number;
    originalTitle: string;
    genres: Genre[];
    directors: string[];
    streamingInfo: StreamingInfo;
  };
};

export type RapidChangesResponse = {
  result: {
    changes: [];
    show: {
      type: string;
      title: string;
      year: number;
      imdbId: string;
      tmdbId: number;
      originalTitle: string;
      genres: Genre[];
      directors: string[];
      streamingInfo: StreamingInfo;
    };
  }[];
  nextCursor: number;
  hasMore: boolean;
};

export type RapidListResponse = {
  result: {
    type: string;
    title: string;
    year: number;
    imdbId: string;
    tmdbId: number;
    originalTitle: string;
    genres: Genre[];
    directors: string[];
    streamingInfo: StreamingInfo;
  }[];
  nextCursor: number;
  hasMore: boolean;
};

export type StreamingResponse = Array<Provider>;

export type Provider = {
  slug: string;
  logo: string;
  attributes: Array<string>;
  countries: Array<Country>;
};

export type Country = {
  code: string;
  user?: boolean;
  buy?: Option;
  rent?: Option;
  subscription?: Option;
};

export type Option = {
  link: string;
  availableSince: number;
  price?: Price;
};

export type Price = { amount: string; currency: string; formatted: string };

type StreamingInfo = { [key: string]: Array<ProviderDetails> };

export type ProviderDetails = {
  addon: string;
  audios: Array<Audio>;
  availableSince: number;
  link: string;
  quality: string;
  service: string;
  streamingType: string;
  subtitles: Array<Subtitle>;
  price?: Price;
};

export type Audio = {
  language: string;
  region: string;
};

export type Subtitle = {
  closedCaptions: boolean;
  locale: {
    language: string;
    region: string;
  };
};
