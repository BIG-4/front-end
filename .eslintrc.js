module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  extends: ['airbnb-base'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    quotes: [2, 'single'],
    semi: [2, 'never'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-console': 0,
    'no-shadow': 0,
    'no-param-reassign': 0,
    'func-names': ['error', 'never'],
    'no-unused-vars': 0,
  },
}
