export const en = {
  title: 'NVue Debug Tool',
  navbar: {
    help: 'Help',
    environmentSetting: 'Environment',
    bundlesToggle: 'Pages'
  },
  home: {
    languageTitle: '切换语言',
    welcomMessage: 'Welcome to nvue debugging tool',
    tabs: {
      debugName: 'Debug',
      pageName: 'Pages'
    },
    tips: {
      quickStartTitle: 'Quick start',
      quickStartDesc: 'Quickly learn how to use the nvue debugging tool',
      quickStartUrl: 'http://nvue.apache.org/tools/toolkit.html#debug',
      guideTitle: 'Tutorial',
      guideDesc: 'Detailed instructions for using each function',
      guideUrl: 'https://nvue.apache.org/guide/debug/debug.html',
      integerTitle: 'Integrate NVue Devtool',
      integerDesc: 'Learn how to integrate the NVue Devtool SDK into your app',
      integerUrl: 'https://nvue.apache.org/guide/debug/integrate-devtool-to-android.html',
      helpTitle: 'Help & Feedback',
      helpDesc: 'Submit a Github issue to help NVue Devtool be better',
      helpUrl: 'https://github.com/weexteam/weex-toolkit/issues/new?labels=@weex-cli/debug',
      noJsBundle: 'There is no preview page yet, you can compile the page with the following command'
    },
    toastTips: {
      copySuccess: 'Copy success',
      openPage: 'Open page'
    },
    version: 'Version'
  },
  defaultPage: {
    title: 'Performance',
    pageDescription: 'The page is under development...'
  },
  weexDebugPage: {
    title: 'NVue Debug',
    appInfo: 'APP Info',
    sdkVersion: 'SDK Version',
    jsDebug: 'JS Debug',
    network: 'Network',
    logLevel: 'LogLevel',
    elementMode: 'ElementMode',
    clearHistory: 'Clean',
    workerJsDesc: 'WorkerJS is a debugging intermediate file, the file starts with \`[Runtime]-\`',
    jsServiceDesc: 'JSService is using <a href="http://nvue.apache.org/cn/references/js-service.html" target="_blank">JSService API</a>register in the run, multiple files separated by commas',
    dependenceJsDesc: 'DependenceJS is the JS file injected by NVue in the JS environment before creating the instance',
    jsFrameworkDesc: 'JSFramework is the JS that provides the initial environment for nvue to run',
    environmentSettingOkDesc: 'Change Setting',
    environmentSettingCancelDesc: 'Reset',
    reloadDesc: 'Refresh',
    restoreDesc: 'Restore',
    mockTips: 'Mock file',
    generatorFile: 'Generate File',
    environmentSetting: 'Environment Setting',
    generatingFile: 'New Files',
    generateFile: 'New File',
    reloadSuccess: 'Reload Success',
    reloading: 'Reloading',
    ensureDeleteHistory: 'Delete History?',
    changeEnvSetting: 'Change Environment',
    changeSettingSuccess: 'Change Success',
    noEmptyUrl: 'Url should not be empty',
    loadingTip: 'Loading',
    loadingSuccess: 'Load Success',
    noPages: 'No pages'
  },
  sideBar: {
    weex: {
      title: 'NVUE DEBUG'
    },
    analyze: {
      title: 'PERFORMENCE'
    }
  },
  tour: {
    step_1: 'Click here to control the <strong>JS Debug</strong> switch, and start JS debugging after opening!',
    step_2: 'Click here to select Log log level',
    step_3: 'Click here to refresh the NVue page after entering the debug page',
    step_4: 'Enter the JSBundle file you want to access locally, press Enter to jump',
    step_5: 'Click here to configure for the NVue runtime environment',
    step_6: 'Click here to Mock replace the file',
    step_7: 'Click here to make the environment configuration take effect',
    step_8: 'Click here to reset the environment',
    nextText: 'Next',
    prevText: 'Prev',
    finishText: 'Finish',
    skip: 'Skip'
  }
}
