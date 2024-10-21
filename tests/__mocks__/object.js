module.exports = new Proxy({}, {
  get(target, prop) {
    return prop; // handle CSS-class mocks in tests
  }
});