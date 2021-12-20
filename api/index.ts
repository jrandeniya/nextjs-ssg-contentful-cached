import { CONTENT_TYPE, IAlbum, IArtist, ISong } from "../@types/contentful";
import { fetch } from "./fetch";

interface EntityFetcher<T> {
  all: () => Promise<Array<T>>;
  findOne: (cb: (entity: T) => boolean) => Promise<T | undefined>;
}

export function fetchEntity(type: "artist"): EntityFetcher<IArtist>;
export function fetchEntity(type: "album"): EntityFetcher<IAlbum>;
export function fetchEntity(type: "song"): EntityFetcher<ISong>;

export function fetchEntity(type: CONTENT_TYPE): EntityFetcher<unknown> {
  return {
    all: () => fetch(type),
    findOne: async (cb) => {
      const entities = await fetch(type);
      return entities.find(cb);
    },
  };
}
