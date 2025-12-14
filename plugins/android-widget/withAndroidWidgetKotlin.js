const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Plugin to copy widget Kotlin source files into the Android project
 */
module.exports = function withAndroidWidgetKotlin(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const platformRoot = config.modRequest.platformProjectRoot;

      // Find MainApplication.kt by searching the java directory
      const javaDir = path.join(platformRoot, 'app', 'src', 'main', 'java');
      let packageName = 'com.anonymous.wtracker';
      let mainApplicationPath = null;

      // Recursively search for MainApplication.kt
      function findMainApplication(dir) {
        if (!fs.existsSync(dir)) return null;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            const found = findMainApplication(fullPath);
            if (found) return found;
          } else if (entry.name === 'MainApplication.kt') {
            return fullPath;
          }
        }
        return null;
      }

      mainApplicationPath = findMainApplication(javaDir);
      
      if (mainApplicationPath) {
        const contents = fs.readFileSync(mainApplicationPath, 'utf-8');
        const packageMatch = contents.match(/package\s+([\w.]+)/);
        if (packageMatch) {
          packageName = packageMatch[1];
          console.log(`✓ Detected package name: ${packageName}`);
        }
      } else {
        console.warn('⚠ MainApplication.kt not found, using default package name');
      }

      // Determine the destination directory based on package name
      const packagePath = packageName.replace(/\./g, '/');
      const destDir = path.join(
        platformRoot,
        'app',
        'src',
        'main',
        'java',
        packagePath
      );

      // Ensure destination directory exists
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // Copy and process Kotlin template files
      const pluginJavaDir = path.join(
        projectRoot,
        'plugins',
        'android-widget',
        'android',
        'app',
        'src',
        'main',
        'java'
      );

      const kotlinFiles = [
        'WorkoutWidgetProvider.kt.template',
        'WorkoutWidgetModule.kt.template',
        'WorkoutWidgetPackage.kt.template'
      ];

      for (const templateFile of kotlinFiles) {
        const sourcePath = path.join(pluginJavaDir, templateFile);
        const destFileName = templateFile.replace('.template', '');
        const destPath = path.join(destDir, destFileName);

        if (fs.existsSync(sourcePath)) {
          let content = fs.readFileSync(sourcePath, 'utf-8');
          // Replace package name placeholder
          content = content.replace(/{{PACKAGE_NAME}}/g, packageName);
          fs.writeFileSync(destPath, content, 'utf-8');
          console.log(`✓ Copied widget Kotlin file: ${destFileName}`);
        } else {
          console.warn(`⚠ Widget Kotlin template not found: ${templateFile}`);
        }
      }

      return config;
    },
  ]);
};
