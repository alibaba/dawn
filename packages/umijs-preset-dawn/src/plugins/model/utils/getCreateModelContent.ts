export default () => {
  return `import * as React from "react";
import { useImmer, UseImmerReturnType } from "./useImmer";

/**
 * createModel
 *
 * @param {Object} defaultInitialValue initial value state
 * @returns {[useModel, ModelProvider, context]} model
 *
 * @example const [useProjectModel, ProjectModelProvider, projectContext] = createModel({...});
 */
export const createModel = <T = any>(defaultInitialValue: T) => {
  const context = React.createContext<UseImmerReturnType<T> | undefined>(undefined);

  const providerFactory = (props: any, children: React.ReactNode) =>
    React.createElement(context.Provider, props, children);

  const ModelProvider: React.FC<{ initialValue?: T }> = ({ children, initialValue }) => {
    const state = useImmer<T>(initialValue !== undefined ? initialValue : defaultInitialValue);
    return providerFactory({ value: state }, children);
  };

  /**
   * useModel
   *
   * @returns {T} model
   * @example const [model, updateModel] = useFooModel();
   */
  const useModel = () => {
    const state = React.useContext(context);
    if (state == null) {
      throw new Error(\`useModel must be used inside a ModelProvider.\`);
    }
    return state;
  };

  return [useModel, ModelProvider, context] as const;
};

export default createModel;
`;
};
