import { Strapi } from "@strapi/strapi";
import pluginPkg from "../package.json";

const pluginId = pluginPkg.name.replace(
  /^(@[^-,.][\w,-]+\/|strapi-)plugin-/i,
  ""
);
export default ({ strapi }: { strapi: Strapi }) => {
  // registration phase
  strapi.customFields.register({
    name: "bible-verse-picker",
    plugin: pluginId,
    type: "string",
  });
};
