module.exports = {
    root: true,
    parserOptions: {
      sourceType: 'module',
      parser: 'babel-eslint'
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: ['plugin:vue/base'],
    // required to lint *.vue files
    plugins: [
      'vue'
    ],
    // add your custom rules here
    'rules': {
      // allow paren-less arrow functions
      'arrow-parens': 0,
      // allow async-await
      'generator-star-spacing': 0,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      'handle-callback-err': 0,
      'space-before-function-paren': 0,
      'object-property-newline': 0,
      'no-useless-escape': 0
    },
    'globals': {
      '_': true,
      'simpleLocalDb': true,
      'sessionStorage': true,
      '$': true
    }
  }
  