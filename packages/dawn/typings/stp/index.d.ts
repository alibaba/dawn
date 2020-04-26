declare module "stp" {
  function stp(str: string): (options: any) => string;
  function stp(str: string, options?: any): string;
  export default stp;
}
