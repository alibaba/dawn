import { Service as CoreService, IServiceOpts } from "@umijs/core";

export class Service extends CoreService {
  constructor(opts: IServiceOpts) {
    super({
      ...opts,
      presets: [require.resolve("umijs-preset-dawn"), ...(opts.presets || [])],
      plugins: [...(opts.plugins || [])],
    });
  }
}
