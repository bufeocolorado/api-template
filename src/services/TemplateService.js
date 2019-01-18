
const SecurityDb = require('../db/auth/TemplateDb');
const AwsUtils = require('../common/helpers/AwsUtils');

class TemplateService {
  static async getUser(event) {
    const payload = AwsUtils.getPayloadRequest(event);
    const result = await SecurityDb.getUser(payload);
    return result;
  }

  static async getUserByLambda(event) {
    const result = await AwsUtils.invokeFunction(
      process.env.LAMBDA_GETUSER,
      event,
    );
    return result;
  }

  static async executeQueryOracle(event) {
    const payload = AwsUtils.getPayloadRequest(event);
    const result = await SecurityDb.executeQueryOracle(payload);
    return result;
  }

  static async executeProcedureOracle(event) {
    const payload = AwsUtils.getPayloadRequest(event);
    const result = await SecurityDb.executeProcedureOracle(payload);
    return result;
  }

  static async executeQueryMySql(event) {
    const payload = AwsUtils.getPayloadRequest(event);
    const result = await SecurityDb.executeQueryMySql(payload);
    return result;
  }
}

module.exports = TemplateService;
