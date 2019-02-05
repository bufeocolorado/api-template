const { AwsUtils } = require('lib-common/helpers');
const TemplateSupport = require('./supports/TemplateSupport')
const SecurityDb = require('../db/TemplateDb');

class TemplateService {
  static async getUser(event) {
    const payload = AwsUtils.getPayloadRequest(event);
    const result = await SecurityDb.getUser(payload);
    return result;
  }

  static async getUserByLambda(event) {
    const config = { region: process.env.region, identityPool: process.env.AWS_IDENTITY_POOL };
    const trace = AwsUtils.getTraceRequest(event);
    const payload = AwsUtils.getPayloadRequest(event);
    const request = AwsUtils.buildRequest(trace, payload);
    const result = await AwsUtils.invokeFunctionLambda(process.env.LAMBDA_GETUSER, request, config);
    return result;
  }

  static async executeQueryOracle(event) {
    const payload = AwsUtils.getPayloadRequest(event);
    const result = await SecurityDb.executeQueryOracle(payload);
    return result;
  }

  static async executeQueryOracle9i(event) {
    const payload = AwsUtils.getPayloadRequest(event);
    const result = await SecurityDb.executeQueryOracle9i(payload);
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

  static async executeParallelQuery(event) {
    const payload = AwsUtils.getPayloadRequest(event);
    const result = await SecurityDb.executeParallelQuery(payload);
    return result;
  }

  static async executeParallelFunctionLambda(event) {
    const config = { region: process.env.region, identityPool: process.env.AWS_IDENTITY_POOL };
    const trace = AwsUtils.getTraceRequest(event);
    const payload = AwsUtils.getPayloadRequest(event);
    const request = AwsUtils.buildRequest(trace, payload);
    const promise01 = TemplateSupport.getpromise01(request, config);
    const promise02 = TemplateSupport.getpromise02(request, config);
    const promise03 = TemplateSupport.getpromise03(request, config);

    const data = await Promise.all([
      promise01,
      promise02,
      promise03,
    ]);
    const result = [...data[0], ...data[1], ...data[2]];
    return result;
  }
}

module.exports = TemplateService;
