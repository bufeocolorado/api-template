const Joi = require('joi');
const ErrorConstants = require('../constants/errorConstants');
const HttpConstants = require('../constants/httpConstants');
const BusinessError = require('../models/BusinessError');
const validationMessages = require('./validation-messages.json');
const AwsUtils = require('../helpers/AwsUtils');

class AppValidator {
  static async validateRequest(event, schema) {
    const request = AwsUtils.getRequest(event);
    this._validateBody(request);
    const trace = AwsUtils.getTraceRequest(event);
    const payload = AwsUtils.getPayloadRequest(event);
    this._validateRequest(request);
    this._validateTrace(trace);

    if (schema) {
      this._validate(schema, payload);
    }
  }

  static _validateHeader(event) {
    const { channelCode } = AwsUtils.getTraceRequest(event);
    const isChannelWeb = HttpConstants.REQUEST_CHANNELS.CHANNEL01 === channelCode.toUpperCase();

    if (isChannelWeb && (!event.headers.Authorization || !event.headers.ApiKey)) {
      throw new BusinessError({
        code: ErrorConstants.HEADER_NOT_VALID.code,
        httpCode: HttpConstants.BAD_REQUEST_STATUS.code,
        messages: [ErrorConstants.HEADER_NOT_VALID.message],
      });
    }
  }

  static _validateBody(request) {
    if (!request || !request.trace || !request.payload) {
      throw new BusinessError({
        code: ErrorConstants.BODY_NOT_VALID.code,
        httpCode: HttpConstants.BAD_REQUEST_STATUS.code,
        messages: [ErrorConstants.BODY_NOT_VALID.message],
      });
    }
  }

  static _validateRequest(request) {
    const schema = Joi.object().keys({
      trace: Joi.required(),
      payload: Joi.required(),
    });

    this._validate(schema, request);
  }

  // static async _validateToken(headers) {
  // try {
  // const credentials = await AwsUtils.getCredentials(headers);
  // console.log(credentials);
  // } catch (error) {
  //   console.log('ERROR _validateToken');
  //   throw new BusinessError({
  //     code: error.code,
  //     httpCode: HttpConstants.FORBIDDEN_STATUS.code,
  //     messages: [error.message, error.originalError.message],
  //   });
  // }
  // const credentials = await AwsUtils.getCredentials(event);
  // if (!credentials.sessionToken) {
  //   console.log('Invalid Token');
  //   throw new BusinessError({
  //     code: ErrorConstants.TOKEN_NOT_VALID.code,
  //     httpCode: HttpConstants.FORBIDDEN_STATUS.code,
  //     messages: ['El token no es válido'],
  //   });
  // }
  // }

  static _validateTrace(trace) {
    const schema = Joi.object().keys({
      serviceId: Joi.string().min(5).max(30)
        .required()
        .label('serviceId'),
      consumerId: Joi.required().label('ConsumerId'),
      moduleId: Joi.required().label('ModuleId'),
      channelCode: Joi.required().label('ChannelCode'),
      traceId: Joi.required().label('TraceId'),
      timestamp: Joi.required().label('Timestamp'),
    });

    this._validate(schema, trace);
  }

  static _validate(schema, src) {
    const validation = Joi.validate(src, schema, {
      allowUnknown: true,
      abortEarly: false,
      language: validationMessages,
    });

    if (validation.error) {
      console.log(validation.error.details);
      const messagesError = [];
      validation.error.details.forEach((value) => {
        messagesError.push(value.message);
      });

      throw new BusinessError({
        code: ErrorConstants.DATA_NOT_VALID.code,
        httpCode: HttpConstants.BAD_REQUEST_STATUS.code,
        messages: messagesError,
      });
    }
  }
}

module.exports = AppValidator;
