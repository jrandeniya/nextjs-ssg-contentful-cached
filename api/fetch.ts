import { loadEnvConfig } from "@next/env";
import { createClient, Entry } from "contentful";
import fs from "fs";
import { join } from "path";
import { CONTENT_TYPE } from "../@types/contentful";
import { log, recurse } from "./utils";

export async function fetch<T>(type: CONTENT_TYPE): Promise<Array<Entry<T>>> {
  const dir = join(process.cwd(), "api", "cache");
  const path = join(dir, `${type}.json`);

  if (fs.existsSync(path)) {
    log(`Contentful: Cache hit for [${type}]`);
    return JSON.parse(fs.readFileSync(path, "utf8"));
  }

  loadEnvConfig(process.cwd());
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!space) {
    throw new Error("CONTENTFUL_SPACE_ID is not defined in env");
  }

  if (!accessToken) {
    throw new Error("CONTENTFUL_ACCESS_TOKEN is not defined in env");
  }

  log(`Contentful: Fetching all entries for [${type}]`);
  const client = createClient({ space, accessToken });
  const items = await recurse({ client, type, limit: 1000, skip: 0 });

  log(`Contentful: Caching ${items.length} items for [${type}]`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(path, JSON.stringify(items), "utf8");

  return items as Array<Entry<T>>;
}
