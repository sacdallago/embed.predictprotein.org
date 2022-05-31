/* TIHA - I have commend it, sonst ERRORS
const PROD = process.env.NODE_ENV === 'production';

const rules= {
  'comma-dangle': ['warn', 'only-multiline'],
  'semi': ['warn', 'always', {'omitLastInOneLineBlock': true}],
  "space-before-function-paren": ["warn", "never"],
  'quotes': ['warn', 'double']
};

if (!PROD) {
  rules['no-debugger'] = ['off'];
}

module.exports = {
  extends: ['standard', 'plugin:import/errors', 'plugin:import/warnings',],
  plugins: ['import'],
  rules,
  root: true,
  env: {
    browser: true
  },
  globals: {
    customElements: false,
  },
  parserOptions: {
    ecmaVersion: 8
  }
};
*/