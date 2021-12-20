const { loadEnvConfig } = require("@next/env");
const contentfulManagement = require("contentful-management");

module.exports = async () => {
  loadEnvConfig(process.cwd());

  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN;

  const contentfulClient = contentfulManagement.createClient({ accessToken });
  const space = await contentfulClient.getSpace(spaceId);

  return space.getEnvironment("master");
};
