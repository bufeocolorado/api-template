const AWS = require('aws-sdk');
const { HttpConstants } = require('lib-common/constants');
const { BusinessError } = require('lib-common/models');

const DomainConstants = require('../../helpers/DomainConstants');
const OnPremiseConnection = require('../connection/SasConnection');
const CloudConnection = require('../connection/IAATerceroConnection');

const TemplateReq = require('../../models/request/TemplateReq');
const TemplateRes = require('../../models/response/TemplateRes');

AWS.config.region = process.env.region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.AWS_IDENTITY_POOL,
});

class TemplateDb {
  static async getUser(payload) {
    const filterSentence = payload.username ? `username = "${payload.username}"` : '';
    const params = {
      UserPoolId: undefined,
      AttributesToGet: null,
      Filter: filterSentence,
      Limit: 0,
    };

    if (payload.type && DomainConstants.PERSON_TYPES.TYPE01 === payload.type.toUpperCase()) {
      params.UserPoolId = process.env.AWS_USER_POOL_ID_PERSON;
    } else if (payload.type && DomainConstants.PERSON_TYPES.TYPE02 === payload.type.toUpperCase()) {
      params.UserPoolId = process.env.AWS_USER_POOL_ID_ENTERPRISE;
    } else if (payload.type && DomainConstants.PERSON_TYPES.TYPE03 === payload.type.toUpperCase()) {
      params.UserPoolId = process.env.AWS_USER_POOL_ID_BROKER;
    } else {
      throw new BusinessError({
        code: undefined,
        httpCode: HttpConstants.BAD_REQUEST_STATUS.code,
        messages: ['Debe ingresar un tipo válido.'],
      });
    }

    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    const result = await cognitoidentityserviceprovider.listUsers(params).promise();
    if (!result.Users.length) {
      throw new BusinessError({
        code: 'NotFoundException',
        httpCode: HttpConstants.BAD_REQUEST_STATUS.code,
        messages: ['El usuario no existe.'],
      });
    }

    try {
      const output = [];
      result.Users.forEach((value) => {
        const email = value.Attributes.find(atribute => atribute.Name === 'email');
        const phoneNumber = value.Attributes.find(atribute => atribute.Name === 'phone_number');
        const object = {
          username: value.Username,
          userCreateDate: value.UserCreateDate,
          userLastModifiedDate: value.UserLastModifiedDate,
          enabled: value.Enabled,
          userStatus: value.UserStatus,
          email: email ? email.Value : undefined,
          phoneNumber: phoneNumber ? phoneNumber.Value : undefined,
        };
        output.push(object);
      });

      return output[0];
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: error.code,
        httpCode: error.statusCode,
        messages: [error.message],
      });
    }
  }

  static async executeQueryOracle(payload) {
    const templateReq = new TemplateReq(payload);
    const templateRes = new TemplateRes({});
    try {
      const query = `
        select * from app_iaa_tercero.ter_tercero where idetercero in (:id,14975180,14975181)
      `;
      const result = await OnPremiseConnection.executeSQL(
        query, [templateReq.ideTercero], templateRes
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: error.code,
        httpCode: error.httpCode,
        messages: error.messages,
      });
    }
  }

  static async executeProcedureOracle(payload) {
    const templateReq = new TemplateReq(payload);
    const templateRes = new TemplateRes({});
    try {
      const query = `
      begin
        app_iaa_tercero.pq_iaa_persona.sp_obt_persona(:idetercero, :cursor);
      end;
      `;
      const bindvars = {
        idetercero: templateReq.ideTercero,
      };
      const result = await OnPremiseConnection.executeSP(query, bindvars, templateRes);
      return result;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: error.code,
        httpCode: error.httpCode,
        messages: error.messages,
      });
    }
  }

  static async executeQueryMySql(payload) {
    const templateReq = new TemplateReq(payload);
    const templateRes = new TemplateRes({});
    try {
      const query = `
        SELECT * FROM APP_IAA_TERCERO.TER_TERCERO whedre idetercero in (?,2,3)
      `;
      const result = await CloudConnection.executeSQL(
        query, [templateReq.ideTercero], templateRes
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: error.code,
        httpCode: error.httpCode,
        messages: error.messages,
      });
    }
  }
}

module.exports = TemplateDb;
