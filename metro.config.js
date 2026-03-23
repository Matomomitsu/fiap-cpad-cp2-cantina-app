const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prevent Metro from resolving "source" field in package.json,
// which causes react-native-svg to load uncompiled .tsx files.
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
