declare module Module {
  export function register(
    moduleName: string,
    moduleProperties: {
      defaults: any;
      getStyles: Function;
      getTranslations: Function;
      getTemplate: Function;
      getTemplateData: Function;
      getHeader: Function;
      start: Function;
      scheduleUpdate: Function;
      loadData: Function;
      socketNotificationReceived: Function;
    }
  ): void;
}
