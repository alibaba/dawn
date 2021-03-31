interface IOpts {
    typescript?: boolean;
    env?: object;
    react?: boolean | object;
    reactRequire?: boolean;
    transformRuntime?: object;
}
declare const _default: (opts?: IOpts) => {
    presets: any;
    plugins: any;
};
export default _default;
