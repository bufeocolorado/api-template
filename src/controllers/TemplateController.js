const { AwsUtils } = require('lib-common/helpers');
const { AppValidator } = require('lib-common/validations');

const TemplateService = require('../services/TemplateService');
const TemplateValidator = require('../validators/TemplateValidator');


class TemplateController {
  static async getUser(event, context) {
    try {
      await AppValidator.validateRequest(event, TemplateValidator.getUser());
      const result = await TemplateService.getUser(event);
      return AwsUtils.buildResponse(event, result);
    } catch (error) {
      console.log(error);
      return AwsUtils.buildErrorResponse(event, error);
    }
  }

  static async getUserByLambda(event, context) {
    try {
      await AppValidator.validateRequest(event, TemplateValidator.getUser());
      const result = await TemplateService.getUserByLambda(event);
      return AwsUtils.buildResponse(event, result);
    } catch (error) {
      console.log(error);
      return AwsUtils.buildErrorResponse(event, error);
    }
  }

  static async executeQueryOracle(event, context) {
    try {
      await AppValidator.validateRequest(event);
      const result = await TemplateService.executeQueryOracle(event);
      return AwsUtils.buildResponse(event, result);
    } catch (error) {
      console.log(error);
      return AwsUtils.buildErrorResponse(event, error);
    }
  }

  static async executeProcedureOracle(event, context) {
    try {
      await AppValidator.validateRequest(event);
      const result = await TemplateService.executeProcedureOracle(event);
      return AwsUtils.buildResponse(event, result);
    } catch (error) {
      console.log(error);
      return AwsUtils.buildErrorResponse(event, error);
    }
  }

  static async executeQueryMySql(event) {
    try {
      await AppValidator.validateRequest(event);
      const result = await TemplateService.executeQueryMySql(event);
      return AwsUtils.buildResponse(event, result);
    } catch (error) {
      console.log(error);
      return AwsUtils.buildErrorResponse(event, error);
    }
  }

  static async executeParallelQuery(event) {
    try {
      await AppValidator.validateRequest(event);
      const result = await TemplateService.executeParallelQuery(event);
      return AwsUtils.buildResponse(event, result);
    } catch (error) {
      console.log(error);
      return AwsUtils.buildErrorResponse(event, error);
    }
  }

  static async executeParallelFunctionLambda(event) {
    try {
      await AppValidator.validateRequest(event);
      const result = await TemplateService.executeParallelFunctionLambda(event);
      return AwsUtils.buildResponse(event, result);
    } catch (error) {
      console.log(error);
      return AwsUtils.buildErrorResponse(event, error);
    }
  }
}

module.exports = TemplateController;
