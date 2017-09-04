// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  "bootstrap": {
    "service_url_extension": "/api_v3/index.php",
    "parameters_error": "Invalid Application Parameters! Please restart application"
  },
  "liveEntryService": {
    "streamStatusIntervalTimeInMs": 5000,
    "streamHealthIntervalTimeInMs": 10000,
    "liveAnalyticsIntervalTimeInMs": 30000,
    "streamSessionGracePeriodInMs": 60000,
    "maxBeaconHealthReportsToShow": 50,
    "apiCallsMaxRetriesAttempts": 2,
    "apiCallDelayOnException": 10000
  },
  "externalLinks": {
    "LEARN_MORE": "https://knowledge.kaltura.com/getting-started-kaltura-live"
  },
  "flavorsDefinitions": {
    "sourceFlavorId": "32"
  }
};
