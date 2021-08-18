declare module Module {
  export function register(
    moduleName: string,
    moduleProperties: {
      data?: any;
      defaults?: any;
      getDom?: Function;
      getHeader?: Function;
      getScripts?: Function;
      getStyles?: Function;
      getTemplate?: Function;
      getTemplateData?: Function;
      getTranslations?: Function;
      loadData?: Function;
      notificationReceived?: Function;
      scheduleUpdate?: Function;
      socketNotificationReceived?: Function;
      start?: Function;
    }
  ): void;
}

declare const config: any