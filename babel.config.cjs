/* eslint-disable no-undef */
//babel.config.cjs
module.exports = {
  presets: [
    '@babel/preset-env',    // Soporta características modernas de JavaScript
    '@babel/preset-react',  // Soporta JSX y características de React
    '@babel/preset-typescript', // Soporta TypeScript
  ],
  parserOpts: {
    throwIfNamespace: false, // Agrega esta opción para evitar el error
  },
};