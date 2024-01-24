/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

import type { AppLoadContext as OriginalAppLoadContext } from "@remix-run/server-runtime";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext extends OriginalAppLoadContext {
    env: {
      TMDB_ACCESS_TOKEN: string;
      TMDB_API_KEY: string;
      RAPID_API_KEY: string;
      RAPID_API_HOST: string;
      KV: KVNamespace;
    };
  }
}
