import React from "react";
import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);

    app.customFields.register({
      name: "bible-verse-picker",
      pluginId: pluginId, // the custom field is created by a color-picker plugin
      type: "string", // the color will be stored as a string
      intlLabel: {
        id: `${pluginId}.bible-verse-picker.label`,
        defaultMessage: "Bible Verse",
      },
      intlDescription: {
        id: `${pluginId}.bible-verse-picker.description`,
        defaultMessage: "Enter a valid Bible verse",
      },
      // icon: ColorPickerIcon, // don't forget to create/import your icon component
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "input-component" */ "./components/BibleVersePicker"
          ),
      },
      options: {
        // declare options here
      },
    });
  },

  bootstrap(app) {},
  async registerTrads(app) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
