module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  resetModules: true,
};
