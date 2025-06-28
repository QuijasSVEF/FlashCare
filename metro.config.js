const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure web-specific module resolution
config.resolver.alias = {
  ...config.resolver.alias,
  // Ensure react-native components use react-native-web on web platform
  'react-native$': 'react-native-web',
};

// Set platform resolution order
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Configure resolver main fields for web compatibility
config.resolver.resolverMainFields = ['browser', 'module', 'main'];

// Ensure proper source extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.js', 'web.ts', 'web.tsx'];

module.exports = config;