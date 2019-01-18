const MySqlDb = require('mysql');
const Util = require('util');
const BusinessError = require('../models/BusinessError');
const HttpConstants = require('../constants/httpConstants');
const ObjectMapper = require('../helpers/ObjectMapper');
// const ErrorConstants = require('../../common/constants/errorConstants');

class MySqlDatabase {
  static async createPool(dbconfig) {
    const poolConnection = MySqlDb.createPool(dbconfig);
    poolConnection.query = Util.promisify(poolConnection.query);
    poolConnection.end = Util.promisify(poolConnection.end);
    return poolConnection;
  }

  static async closePool(poolConnection) {
    try {
      if (poolConnection) {
        await poolConnection.end();
      }
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: 'DbError',
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [error.stack],
      });
    }
  }

  static async executeSQL(sql, bindParams, target, pool) {
    try {
      const result = await pool.query(
        sql, bindParams
      );
      const data = result;
      const list = [];
      for (let i = 0, size = data.length; i < size; i += 1) {
        list.push(ObjectMapper.map(data[i], target));
      }
      return list;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: error.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: error.sqlMessage,
      });
    }
  }
}

module.exports = MySqlDatabase;
