export interface IContext {
  /**
   * Current workspace package.json content
   * Based on `this.ctx`
   */
  project: { name?: string };
}
