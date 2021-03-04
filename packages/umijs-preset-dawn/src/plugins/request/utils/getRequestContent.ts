export default () => {
  return `import * as React from "react";
import qs from "qs";
import rawAxios, { AxiosError, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse, AxiosStatic } from "axios";
import useSWR from "swr/esm/use-swr";
import { ConfigInterface, SWRConfig } from "swr";
import { useAsyncFn } from "react-use";

export const isURLSearchParams = (val: any): boolean => {
  return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
};

// @ts-ignore
const { Axios, create, Cancel, CancelToken, isCancel, all, spread } = rawAxios;
export { Axios, create, Cancel, CancelToken, isCancel, all, spread };

export interface IExtendAxiosRequestConfig<T = any> extends AxiosRequestConfig {
  params?: T;
  data?: T;
}

export interface IExtendAxiosResponse<T = any, U = any> extends AxiosResponse<U> {
  config: IExtendAxiosRequestConfig<T>;
}

export interface IExtendAxiosPromise<T = any, U = any> extends Promise<IExtendAxiosResponse<T, U>> {}

export interface IExtendAxiosError<T = any, U = any> extends AxiosError<U> {
  config: IExtendAxiosRequestConfig<T>;
  response?: IExtendAxiosResponse<T, U>;
}

// @ts-ignore
export interface IExtendAxiosInstance extends AxiosStatic {
  defaults: IExtendAxiosRequestConfig;
  interceptors: {
    request: AxiosInterceptorManager<IExtendAxiosRequestConfig>;
    response: AxiosInterceptorManager<IExtendAxiosResponse>;
  };
  <T = any, U = any>(config: IExtendAxiosRequestConfig<T>): IExtendAxiosPromise<T, U>;
  <T = any, U = any>(url: string, config?: IExtendAxiosRequestConfig<T>): IExtendAxiosPromise<T, U>;

  request<T = any, U = any>(config: IExtendAxiosRequestConfig<T>): IExtendAxiosPromise<T, U>;
  get<T = any, U = any>(url: string, config?: IExtendAxiosRequestConfig<T>): IExtendAxiosPromise<T, U>;
  delete<T = any, U = any>(url: string, config?: IExtendAxiosRequestConfig<T>): IExtendAxiosPromise<T, U>;
  head<T = any, U = any>(url: string, config?: IExtendAxiosRequestConfig<T>): IExtendAxiosPromise<T, U>;
  post<T = any, U = any>(url: string, data?: T, config?: IExtendAxiosRequestConfig<T>): IExtendAxiosPromise<T, U>;
  put<T = any, U = any>(url: string, data?: T, config?: IExtendAxiosRequestConfig<T>): IExtendAxiosPromise<T, U>;
  patch<T = any, U = any>(url: string, data?: T, config?: IExtendAxiosRequestConfig<T>): IExtendAxiosPromise<T, U>;
}

export function createInstance(config?: IExtendAxiosRequestConfig): IExtendAxiosInstance {
  const instance = rawAxios.create({
    withCredentials: true,
    timeout: 0,
    paramsSerializer: params => {
      if (isURLSearchParams(params)) {
        return params.toString();
      } else {
        return qs.stringify(params, { arrayFormat: "comma" });
      }
    },
    ...config,
  }) as IExtendAxiosInstance;

  // @ts-ignore
  instance.Axios = Axios;
  instance.Cancel = Cancel;
  instance.CancelToken = CancelToken;
  instance.isCancel = isCancel;
  instance.all = all;
  instance.spread = spread;

  return instance;
}

export const instance = createInstance();

export type AxiosGetParams<P> = [url: string, config?: IExtendAxiosRequestConfig<P>];
export type KeyType<P = any> = string | AxiosGetParams<P> | any[] | null;

/**
 * Thin wrapper of useSWR, we prefer to use \`useQuery\` hook for data fetching
 * @description we alias \`isValidating\` to \`loading\` in order to be easier to understand
 *
 * @param {string|any[]} key swr key
 * @param {Object} config swr config
 * @returns {Object} swr result
 *
 * @example const { data, loading } = useQuery("/api/bar");
 * @example const { data, error, revalidate, mutate } = useQuery(["/api/foo", { params: { bar: 1 } }]);
 */
export function useQuery<Params = any, Data = any, Err = Error>(
  key: KeyType<Params> | (() => KeyType<Params>),
  config?: ConfigInterface<Data, Err>,
) {
  return useSWR<Data, Err>(key, config);
}

/**
 * TODO
 *
 * @param {Function} mutationFn mf
 * @returns {any} value
 *
 * @example const { loading, run } = useMutate(getProjectById, { pid: 1234 });
 */
export function useMutate(mutationFn: () => Promise<any>) {
  const [{ value: data, ...others }, run] = useAsyncFn(mutationFn, [mutationFn]);
  return { ...others, data, run };
}

// You can use other methods when fetching data, but you'd better not do this.
const fetcher = (...argv: AxiosGetParams<any>) =>
  instance.request({ url: argv[0], method: "GET", ...argv[1] }).then(r => r?.data);

export const RequestProvider = ({ children, ...props }: React.PropsWithChildren<ConfigInterface>) =>
  React.createElement(SWRConfig, { value: { ...props, fetcher } }, children);
RequestProvider.displayName = "RequestProvider";

export default instance;
`;
};
