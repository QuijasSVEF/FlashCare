const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure react-native-web is properly aliased for web builds
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native': 'react-native-web',
};

// Prioritize web-specific file extensions
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Ensure proper module resolution for web
config.resolver.resolverMainFields = ['browser', 'main'];

module.exports = config;