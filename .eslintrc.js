module.exports = {
  extends: 'airbnb',
  env: {
    jest: true,
  },
  rules: {
    quotes: 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
    'object-curly-spacing': 'off',
    'class-methods-use-this': 'off',
    'arrow-parens': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-underscore-dangle': 'off',
    'comma-dangle': ['error', 'only-multiline'],
  },
};
