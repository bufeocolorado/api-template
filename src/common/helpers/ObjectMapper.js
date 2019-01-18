class ObjectMapper {
  static map(source, target) {
    const object = Object.assign({}, target);
    Object.keys(object).forEach((tp) => {
      Object.keys(source).forEach((sp) => {
        if (tp.toUpperCase() === sp) {
          object[tp] = source[sp];
        }
      });
    });
    return object;
  }
}

module.exports = ObjectMapper;
