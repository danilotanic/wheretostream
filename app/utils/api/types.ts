export type TransformedData = Result & {
  providers: {
    [key: string]: {
      slug: string;
      logo: string;
      countries: {
        [key: string]: Provider[];
      };
    };
  };
};

export type Result = {
  directors: string[];
  genres: { name: string }[];
  imdbId: string;
  originalTitle: string;
  streamingInfo: { [key: string]: Array<Provider> };
  title: string;
  tmdbId: number;
  type: string;
  year: number;
};

export type Price = { amount: string; currency: string; formatted: string };

export type Provider = {
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
