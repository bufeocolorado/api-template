const AWS = require('aws-sdk');
const HttpConstants = require('../../common/constants/httpConstants');
const BusinessError = require('../../common/models/BusinessError');
const ErrorConstants = require('../constants/errorConstants');

class AwsUtils {
  static async invokeFunction(functionName, event) {
    const trace = this.getTraceRequest(event);
    const payload = this.getPayloadRequest(event);

    AWS.config.region = process.env.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: process.env.AWS_IDENTITY_POOL,
    });

    const lambda = new AWS.Lambda();
    const traceAux = Object.assign({}, trace);
    traceAux.channelCode = HttpConstants.REQUEST_CHANNELS.CHANNEL02;
    let result;

    try {
      result = await lambda.invoke({
        InvocationType: 'RequestResponse',
        FunctionName: functionName,
        Payload: JSON.stringify({
          request: {
            trace: traceAux,
            payload: payload,
          },
        }),
      }).promise();
    } catch (e) {
      console.log(e);
      throw new BusinessError({
        code: e.code,
        httpCode: e.statusCode,
        messages: [e.message],
      });
    }

    const responsePayload = JSON.parse(result.Payload);

    if (!responsePayload.response.status.success) {
      const { response: { status: { error } } } = responsePayload;
      throw new BusinessError({
        code: error.code,
        httpCode: error.httpCode,
        messages: error.messages,
      });
    }

    return responsePayload.response.payload;
  }

  static buildRequest(trace, payload) {
    const request = {
      request: {
        trace: trace,
        payload: payload,
      },
    };

    return request;
  }

  static getRequest(event) {
    let request;
    if (event.body) {
      ({ request } = JSON.parse(event.body));
    } else {
      ({ request } = event);
    }
    return request;
  }

  static getPayloadRequest(event) {
    const request = this.getRequest(event);
    return request.payload;
  }

  static getTraceRequest(event) {
    const request = this.getRequest(event);
    return request.trace;
  }

  static buildResponse(event, payload) {
    const request = this.getRequest(event);
    const obj = {
      response: {
        trace: request.trace,
        payload: payload,
        status: {
          success: true,
        },
      },
    };

    if (HttpConstants.REQUEST_CHANNELS.CHANNEL01 === request.trace.channelCode.toUpperCase()) {
      const response = {
        statusCode: HttpConstants.OK_STATUS.code,
        body: JSON.stringify(obj),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
      };
      return response;
    }
    return obj;
  }

  static buildErrorResponse(event, error) {
    const obj = {
      response: {
        trace: null,
        payload: null,
        status: {
          success: false,
          error: error,
        },
      },
    };

    const bodyValid = !(ErrorConstants.BODY_NOT_VALID.code === error.code);
    let isChannelWeb = false;
    if (bodyValid) {
      const trace = this.getTraceRequest(event);
      obj.response.trace = trace;
      isChannelWeb = HttpConstants.REQUEST_CHANNELS.CHANNEL01 === trace.channelCode.toUpperCase();
    }

    if (isChannelWeb || !bodyValid) {
      const response = {
        statusCode: error.httpCode,
        body: JSON.stringify(obj),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
      };
      return response;
    }
    return obj;
  }


  static getResponse(event) {
    let response;
    if (event.body) {
      ({ response } = JSON.parse(event.body));
    } else {
      ({ response } = event);
    }

    if (!response) {
      throw new BusinessError({
        code: ErrorConstants.BODY_NOT_VALID.code,
        httpCode: HttpConstants.BAD_REQUEST_STATUS.code,
        messages: [ErrorConstants.BODY_NOT_VALID.message],
      });
    }
    return response;
  }

  static getPayloadResponse(event) {
    const response = this.getResponse(event);
    return response.payload;
  }

  static getTraceResponse(event) {
    if (event.body) {
      return JSON.parse(event.body).response.trace;
    }
    return event.response.trace;
  }
}

module.exports = AwsUtils;
