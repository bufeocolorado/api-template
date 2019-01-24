
const { AwsUtils } = require('lib-common/helpers');
const SecurityDb = require('../db/auth/TemplateDb');

class TemplateService {
  static async getUser(event) {
    const payload = AwsUtils.getPayloadRequest(event);
    const result = await SecurityDb.getUser(payload);
    return result;
  }

  static async getUserByLambda(event) {
    const config = { region: process.env.region, identityPool: process.env.AWS_IDENTITY_POOL };
    const request = AwsUtils.buildRequest(event);
    const result = await AwsUtils.invokeFunctionLambda(process.env.LAMBDA_GETUSER, request, config);
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
