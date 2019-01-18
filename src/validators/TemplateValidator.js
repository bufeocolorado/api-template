const Joi = require('joi');

class TemplateValidator {
  static getUser() {
    const schema = Joi.object().keys({
      type: Joi.string().required(),
      username: Joi.string().required(),
    });
    return schema;
  }
}

module.exports = TemplateValidator;
