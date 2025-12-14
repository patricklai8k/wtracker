const { withMainApplication } = require('@expo/config-plugins');

module.exports = function withWorkoutWidgetMainApplication(config) {
  return withMainApplication(config, (config) => {
    const { modResults } = config;
    let contents = modResults.contents;

    // Extract the package name from the file
    const packageMatch = contents.match(/package\s+([\w.]+)/);
    const packageName = packageMatch ? packageMatch[1] : 'com.anonymous.wtracker';

    // Add import statement
    if (!contents.includes('WorkoutWidgetPackage')) {
      // Find the package declaration line and add import after it
      const packageLineMatch = contents.match(/(package\s+[\w.]+\s*\n)/);
      if (packageLineMatch) {
        const insertIndex = packageLineMatch.index + packageLineMatch[0].length;
        contents = 
          contents.slice(0, insertIndex) + 
          '\nimport ' + packageName + '.WorkoutWidgetPackage\n' + 
          contents.slice(insertIndex);
      }
    }

    // Add package to getPackages() method
    if (!contents.includes('WorkoutWidgetPackage()')) {
      // Find the packages list in getPackages()
      const packagesPattern = /override\s+fun\s+getPackages\(\)[\s\S]*?List<ReactPackage>\(\s*\n/;
      const match = contents.match(packagesPattern);
      
      if (match) {
        const insertIndex = match.index + match[0].length;
        contents = 
          contents.slice(0, insertIndex) + 
          '        WorkoutWidgetPackage(),\n' + 
          contents.slice(insertIndex);
      }
    }

    modResults.contents = contents;
    return config;
  });
};
