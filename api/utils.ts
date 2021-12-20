import colors from "colors/safe";
import { ContentfulClientApi, Entry } from "contentful";
import { CONTENT_TYPE } from "../@types/contentful";

type RecurseProps = {
  client: ContentfulClientApi;
  type: CONTENT_TYPE;
  skip: number;
  limit: number;
};

export const recurse = async (
  props: RecurseProps
): Promise<Array<Entry<unknown>>> => {
  const { client, type, skip, limit } = props;

  const response = await client.getEntries({
    content_type: type,
    order: "sys.createdAt",
    limit,
    skip,
  });

  if (response.errors) {
    throw new Error(
      JSON.stringify({
        type,
        skip,
        limit,
        errors: response.errors,
      })
    );
  }

  // Contentful provides a `stringifySafe` method that removes all the circular references:
  const safeResponse = JSON.parse(response.stringifySafe());

  if (safeResponse.total > limit + skip) {
    const next = await recurse({ client, type, limit, skip: skip + limit });
    return [...safeResponse.items, ...next];
  }

  return safeResponse.items;
};

export const log = (message: string) =>
  console.log(`\n${colors.green(message)}`);
