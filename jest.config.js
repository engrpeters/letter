module.exports = {
   testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
    preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
  };