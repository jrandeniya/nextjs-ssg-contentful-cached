# NextJS SSG + Contentful + File System Caching

> This project is an implementation of one of the ideas in https://github.com/vercel/next.js/discussions/11272 to allow data being shared between `getStaticPaths` and `getStaticProps`.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) that fetches data from [Contentful](https://www.contentful.com/) at build time via Server Side Generation (SSG).

The problem it solves is that NextJS SSG cannot share data between routes, so you have to fetch from Contentful for each route. This solution aims to separate the data fetching from Contentful and Next's SSG. Allowing you to fetch the content upfront, cache it on your file system, then reuse it for subsequent calls from `getStaticPaths` or `getStaticProps`.

In the example below, we only have to make 1 API call to Contentful even though we have 1,000 albums. Without this caching layer, it will have to make 1,001 API calls.

This works with `next dev`, `next start` and `next build` and is fully typed by parsing your Contentful schema at build time.

## Local Development

1. Run `npm install`
2. Make a copy of `.env.sample` and rename it to `.env.local` (see [NextJS Environments](https://nextjs.org/docs/basic-features/environment-variables))
3. Set the values for `CONTENTFUL_SPACE_ID`, `CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN` and `CONTENTFUL_ACCESS_TOKEN` which can be generated from your Contentful Space -> Settings -> API Keys.

> Please note, that the `CONTENTFUL_ACCESS_TOKEN` is required to fetch data at build time and the `CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN` is used to generate the Typescript definitions, specific to your space schema. If you are not using Typescript, then you don't need the `CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN`.

4. This step is optional, but if you want to run this application as-is then you have to import the Contentful schema + data found in `./contentful/sample-import.json`. You can follow the Contentful Import steps [here](https://www.contentful.com/developers/docs/tutorials/cli/import-and-export/).

5. Run `npm run dev`. This will generate the Typescript definitions by scanning your Contentful Space's schema, start your local NextJS server and fetch data as it is requested.

6. Visit `http://localhost:3000` and navigate around to see the data fetched & cached accordingly. In your terminal, you will see if it was a cache hit or whether Next had to go to Contentful.

## Build

1. Run `npm run build`. This will generate the Typescript definitions, clear out your local file-system cache and statically generate your application by fetching/caching from Contentful as needed.

## Customizing to your Contentful schema

Per entity in your Contentful space, you need to create a overload function in `./api/index.ts`.

For example, in the sample Contentful space there are 3 entities (Artist, Album & Song) so we have 3 overloads:

```
export function fetchEntity(type: "artist"): EntityFetcher<IArtist>;
export function fetchEntity(type: "album"): EntityFetcher<IAlbum>;
export function fetchEntity(type: "song"): EntityFetcher<ISong>;
```

Then in any React component, either in `useEffect`, `getStaticPaths` or `getStaticProps`, you can run `fetchEntity`:

```js
import { fetchEntity } from "../../api";

// Let's assume we have 1,000 albums in Contentful.

export const getStaticPaths: GetStaticPaths = async () => {
  // First call to this entity will go to Contentful, fetch 1,000 records at a time until all records are fetched.
  const albums = await fetchEntity("album").all();

  const paths = albums.map((album) => ({
    params: {
      id: album.fields.slug,
    },
  }));

  // This will tell Nextjs to create 1,000 pages that match the path convention: /pages/albums/[slug].ts
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<AlbumProps> = async ({
  params,
}) => {
  const slug = params?.id;

  if (typeof slug !== "string") throw new Error("Album slug not provided");

  // All subsequent calls to the same entity, will be retrieved from the cache.
  // Without this caching layer, you would make 1,001 API calls:
  // - Once for getStaticPaths
  // - Once per path for getSaticProps (1,000 paths)

  const album = await fetchEntity("album").findOne(
    (album) => album.fields.slug === slug
  );

  if (!album) throw new Error(`Album ${slug} not found`);

  return { props: { album } };
};
```
