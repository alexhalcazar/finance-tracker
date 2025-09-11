// ESM-friendly minimal config
export default {
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.js', '**/src/__tests__/**/*.test.js'],
  transform: {},            // no Babel/TS transforms needed for plain JS
  moduleNameMapper: {       // optional: keeps relative ESM imports stable
    '^(\\.{1,2}/.*)\\.js$': '$1.js'
  }
};