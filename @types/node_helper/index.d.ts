/**
 * @author https://github.com/dolanmiu
 */
declare module "node_helper" {
  export function create(object: {
    start(): void;
    socketNotificationReceived<T>(notification: any, config: any): void;
    [key: string]: any;
  }): void;
}
