module.exports = () => {
  return {
    files: ['src/**/*.js', 'index.js'],
    tests: ['tests/*.test.js'],
    env: {
      type: 'node',
      runner: 'node',
    },
    debug: true,
  };
};
