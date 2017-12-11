export const environment = {
  production: true,
  "bootstrap": {
    "service_url_extension": "/api_v3/index.php",
    "default_lang": "en",
    "uiConf_id_tag": "lived_player",
    "parameters_error": "Invalid Application Parameters! Please restart application"
  },
  "liveEntryService": {
    "stream_status_interval_time_in_ms": 5000,
    "stream_health_interval_time_in_ms": 10000,
    "stream_diagnostics_interval_time_in_ms": 30000,
    "live_analytics_interval_time_in_ms": 30000,
    "stream_session_grace_period_in_ms": 180000,
    "max_beacon_health_reports_to_show": 50,
    "api_calls_max_retries_attempts": 5,
    "api_calls_delay_on_exception": 10000
  },
  "externalLinks": {
    "LEARN_MORE": "https://knowledge.kaltura.com/getting-started-kaltura-live"
  },
  "loadingError": {
    "liveEntryFailed": "Failed to load Live Entry. Please restart application"
  },
  "flavorsDefinitions": {
    "source_flavor_id": "32"
  },
  "healthNotifications": {
    "max_notifications_to_display": 50
  }
};
