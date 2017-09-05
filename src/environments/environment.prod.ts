export const environment = {
  production: true,
  "bootstrap": {
    "service_url_extension": "/api_v3/index.php",
    "parameters_error": "Invalid Application Parameters!"
  },
  "liveEntryService": {
    "streamStatusIntervalTimeInMs": 5000,
    "streamHealthIntervalTimeInMs": 10000,
    "liveAnalyticsIntervalTimeInMs": 30000,
    "streamSessionGracePeriodInMs": 180000,
    "maxBeaconHealthReportsToShow": 50,
    "apiCallsMaxRetriesAttempts": 5,
    "apiCallDelayOnException": 10000
  },
  "externalLinks": {
    "LEARN_MORE": "https://knowledge.kaltura.com/getting-started-kaltura-live"
  },
  "loadingError": {
    "liveEntryFailed": "Failed to load Live Entry. Please restart application"
  },
  "flavorsDefinitions": {
    "sourceFlavorId": "32"
  }
};
