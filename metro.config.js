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

// Fix for <anonymous> errors in Metro
config.server = {
  enhanceMiddleware: middleware => (req, res, next) => {
    if (req.url.includes('/symbolicate')) {
      try {
        const body = JSON.parse(req.rawBody);
        body.stack = (body.stack || []).filter(
          frame => !frame.file?.startsWith('/home/project/<anonymous>')
        );
        req.rawBody = JSON.stringify(body);
      } catch (e) {
        // Ignore parsing errors
      }
    }
    return middleware(req, res, next);
  },
};

// Disable inline requires to avoid anonymous eval blocks
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: { 
      experimentalImportSupport: false, 
      inlineRequires: false 
    },
  }),
};

module.exports = config;