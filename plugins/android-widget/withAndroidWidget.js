const { withAndroidManifest, withStringsXml } = require('@expo/config-plugins');
const withMainApplication = require('./withMainApplication');
const withAndroidWidgetResources = require('./withAndroidWidgetResources');
const withAndroidWidgetKotlin = require('./withAndroidWidgetKotlin');

function addWidgetReceiver(androidManifest) {
  const { manifest } = androidManifest;
  
  if (!Array.isArray(manifest.application)) {
    console.warn('No application array in manifest');
    return androidManifest;
  }

  const application = manifest.application[0];
  
  // Initialize receiver array if it doesn't exist
  if (!application.receiver) {
    application.receiver = [];
  }
  
  // Add widget receiver
  application.receiver.push({
    $: {
      'android:name': '.WorkoutWidgetProvider',
      'android:exported': 'true',
    },
    'intent-filter': [
      {
        action: [
          { $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } }
        ]
      }
    ],
    'meta-data': [
      {
        $: {
          'android:name': 'android.appwidget.provider',
          'android:resource': '@xml/workout_widget_info'
        }
      }
    ]
  });

  return androidManifest;
}

const withAndroidWidget = (config) => {
  // Add widget receiver to AndroidManifest
  config = withAndroidManifest(config, (config) => {
    config.modResults = addWidgetReceiver(config.modResults);
    return config;
  });

  // Add widget description string
  config = withStringsXml(config, (config) => {
    config.modResults.resources.string.push({
      $: { name: 'widget_description' },
      _: 'Track your daily workout progress'
    });
    return config;
  });

  // Copy widget Kotlin source files FIRST (before MainApplication modification)
  config = withAndroidWidgetKotlin(config);

  // Copy widget resources
  config = withAndroidWidgetResources(config);

  // Add package to MainApplication.kt (after Kotlin files exist)
  config = withMainApplication(config);

  return config;
};

module.exports = withAndroidWidget;
