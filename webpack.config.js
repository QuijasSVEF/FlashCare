const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-web', 'react-native-reanimated']
      }
    },
    argv
  );

  // Ensure proper module resolution for react-native components
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native/Libraries/Image/Image': 'react-native-web/dist/exports/Image',
    'react-native/Libraries/Components/View/View': 'react-native-web/dist/exports/View',
  };

  return config;
};