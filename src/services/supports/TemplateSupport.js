const { AwsUtils } = require('lib-common/helpers');

class TemplateSupport {
  static async getpromise01(request, config) {
    const promise = AwsUtils.invokeFunctionLambdaPromise(
      process.env.LAMBDA_EXECUTEQUERYORACLE,
      request,
      config
    );
    return promise;
  }

  static async getpromise02(request, config) {
    const promise = AwsUtils.invokeFunctionLambdaPromise(
      process.env.LAMBDA_EXECUTEPROCEDUREORACLE,
      request,
      config
    );
    return promise;
  }

  static async getpromise03(request, config) {
    const promise = AwsUtils.invokeFunctionLambdaPromise(
      process.env.LAMBDA_EXECUTEPARALLELQUERY,
      request,
      config
    );
    return promise;
  }
}

module.exports = TemplateSupport;
