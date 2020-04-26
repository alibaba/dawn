import * as config from "../../src/common/config";

(async () => {
  const value = await config.getRc("server", { remote: false });
  console.log(value);
})();
