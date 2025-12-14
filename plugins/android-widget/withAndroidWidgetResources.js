const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withAndroidWidgetResources = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const { platformProjectRoot } = config.modRequest;
      
      // Copy widget XML files
      const pluginDir = path.join(__dirname, 'android', 'app', 'src', 'main');
      const targetDir = path.join(platformProjectRoot, 'app', 'src', 'main');
      
      // Ensure directories exist
      const resXmlDir = path.join(targetDir, 'res', 'xml');
      const resLayoutDir = path.join(targetDir, 'res', 'layout');
      
      if (!fs.existsSync(resXmlDir)) {
        fs.mkdirSync(resXmlDir, { recursive: true });
      }
      if (!fs.existsSync(resLayoutDir)) {
        fs.mkdirSync(resLayoutDir, { recursive: true });
      }
      
      // Copy widget files if they exist in plugin directory
      const widgetInfoSrc = path.join(pluginDir, 'res', 'xml', 'workout_widget_info.xml');
      const widgetLayoutSrc = path.join(pluginDir, 'res', 'layout', 'workout_widget.xml');
      
      if (fs.existsSync(widgetInfoSrc)) {
        fs.copyFileSync(widgetInfoSrc, path.join(resXmlDir, 'workout_widget_info.xml'));
      }
      if (fs.existsSync(widgetLayoutSrc)) {
        fs.copyFileSync(widgetLayoutSrc, path.join(resLayoutDir, 'workout_widget.xml'));
      }
      
      return config;
    },
  ]);
};

module.exports = withAndroidWidgetResources;
