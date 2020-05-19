export interface IOpts {
  /**
   * Server protocol
   * @default http://
   */
  protocol?: string;
  /**
   * Server host
   * @default localhost
   */
  host?: string;
  /**
   * Server port
   */
  port?: number;
  /**
   * Server from path
   * @default ./build
   */
  public?: string;
  /**
   * Auto open url
   * @default true
   */
  autoOpen?: boolean;
  /**
   * Support HTTPs
   * @default undefined
   */
  ssl?: true | { key: string; cert: string };
  /**
   * historyApiFallback
   * @default false
   */
  historyApiFallback?: boolean;
  /**
   * Server config path
   * @default ./server.yml
   */
  configPath?: string;
  https?: any;
}
