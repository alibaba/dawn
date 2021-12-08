declare module "postcss-preset-env" {
  import { AcceptedPlugin, PluginCreator } from "postcss";
  import { Options as AutoprefixerOptions } from "autoprefixer";

  type FeatureKeys =
    | "all-property"
    | "any-link-pseudo-class"
    | "blank-pseudo-class"
    | "break-properties"
    | "case-insensitive-attributes"
    | "color-functional-notation"
    | "custom-media-queries"
    | "custom-properties"
    | "custom-selectors"
    | "dir-pseudo-class"
    | "double-position-gradients"
    | "environment-variables"
    | "focus-visible-pseudo-class"
    | "focus-within-pseudo-class"
    | "font-variant-property"
    | "gap-properties"
    | "has-pseudo-class"
    | "hexadecimal-alpha-notation"
    | "image-set-function"
    | "lab-function"
    | "logical-properties-and-values"
    | "media-query-ranges"
    | "nesting-rules"
    | "not-pseudo-class"
    | "overflow-property"
    | "overflow-wrap-property"
    | "place-properties"
    | "prefers-color-scheme-query"
    | "rebeccapurple-color"
    | "system-ui-font-family";

  interface VariableObject {
    customMedia?: Record<string, string>;
    customProperties?: Record<string, string>;
    customSelectors?: Record<string, string>;
    environmentVariables?: Record<string, string>;
  }
  type VariableSource = string | VariableObject | (() => VariableObject);
  export interface PostcssPresetEnvOptions {
    stage?: 0 | 1 | 2 | 3 | 4 | false;
    features?: Record<FeatureKeys, boolean | Record<PropertyKey, any>>;
    browsers?: string | string[];
    insertBefore?: Record<FeatureKeys, AcceptedPlugin | AcceptedPlugin[]>;
    insertAfter?: Record<FeatureKeys, AcceptedPlugin | AcceptedPlugin[]>;
    autoprefixer?: AutoprefixerOptions;
    preserve?: boolean;
    importFrom?: VariableSource | VariableSource[];
    exportTo?: VariableSource | VariableSource[];
  }

  const postcssPresetEnv: PluginCreator<PostcssPresetEnvOptions>;

  export default postcssPresetEnv;
}
