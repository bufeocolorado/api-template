const AWS = require('aws-sdk');
const { HttpConstants } = require('lib-common/constants');
const { BusinessError } = require('lib-common/models');

const DomainConstants = require('../constants/DomainConstants');
const ErrorConstants = require('../constants/ErrorConstants');
const ECDOnPremiseConnection = require('./connection/ECDOnPremiseConnection');
const AXOnPremiseConnection = require('./connection/AXOnPremiseConnection');
const ECDCloudConnection = require('./connection/ECDCloudConnection');

const TemplateReq = require('../models/request/TemplateReq');
const TemplateRes = require('../models/response/TemplateRes');

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
        code: ErrorConstants.ERROR_100301.code,
        httpCode: HttpConstants.BAD_REQUEST_STATUS.code,
        messages: [ErrorConstants.ERROR_100301.message],
      });
    }

    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    const result = await cognitoidentityserviceprovider.listUsers(params).promise();
    if (!result.Users.length) {
      throw new BusinessError({
        code: ErrorConstants.ERROR_100302.code,
        httpCode: HttpConstants.BAD_REQUEST_STATUS.code,
        messages: [ErrorConstants.ERROR_100302.message],
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
      const result = await ECDOnPremiseConnection.executeSQL(
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
      const result = await ECDOnPremiseConnection.executeSP(query, bindvars, templateRes);
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

  static async executeQueryOracle9i(payload) {
    const templateRes = {
      codRamo: undefined,
      descRamo: undefined,
    };

    payload.idepol = 125933;
    payload.numcert = 1;
    
    try {
      const query = `
        select distinct r.codramo, r.descramo
        from certificado c, cert_ramo cr, ramo r, cobert_cert cc
        where c.numcert = cr.numcert and
        cr.numcert = cc.numcert and
        c.idepol = cr.idepol and
        cr.idepol = cc.idepol and
        cr.codramocert = cc.codramocert and
        r.codramo = cr.codramocert and
        c.stscert in ('ACT', 'REN') and
        cr.stscertramo in ('ACT', 'REN') and
        cc.stscobert not in ('VAL', 'INC', 'EXC', 'ANU') 
        and c.idepol = :idepol and c.numcert = :numcert
      `;
      const result = await AXOnPremiseConnection.executeSQL(
        query, [payload.idepol, payload.numcert], templateRes
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

  static async executeQueryMySql(payload) {
    const templateReq = new TemplateReq(payload);
    const templateRes = new TemplateRes({});
    try {
      const query = `
        SELECT * FROM APP_IAA_TERCERO.TER_TERCERO where idetercero in (?,2,3)
      `;
      const result = await ECDCloudConnection.executeSQL(
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

  static async executeParallelQuery(payload) {
    const templateReq = new TemplateReq(payload);
    const templateRes = new TemplateRes({});
    const firstQuery = ECDOnPremiseConnection.executeSQL(
      'select * from app_iaa_tercero.ter_tercero where rownum <= 30',
      [],
      templateRes
    );
    const secondQuery = ECDOnPremiseConnection.executeSP(
      'begin app_iaa_tercero.pq_iaa_persona.sp_obt_persona(:idetercero, :cursor); end;',
      { idetercero: templateReq.ideTercero },
      templateRes
    );
    try {
      const data = await Promise.all([firstQuery, secondQuery]);
      const result = [...data[0], ...data[1]];
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
