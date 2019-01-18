
// process.env.PATH = `${'D:\\instantclient_11_2;'}${process.env.PATH}`;
// const Oracledb = require('oracledb');
const Oracledb = require('oracledb-for-lambda');
const BusinessError = require('../../common/models/BusinessError');
const HttpConstants = require('../../common/constants/httpConstants');
const ObjectMapper = require('../../common/helpers/ObjectMapper');

class OracleDatabase {
  static async createPool(dbconfig) {
    try {
      const poolConnection = await Oracledb.createPool(dbconfig);
      return poolConnection;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: 'DbError',
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [error.stack],
      });
    }
  }

  static async getConnection(pool) {
    try {
      const connection = await pool.getConnection();
      return connection;
    } catch (error) {
      console.log(error);
      if (error instanceof BusinessError) {
        throw new BusinessError({
          code: error.code,
          httpCode: error.httpCode,
          messages: error.messages,
        });
      }
      throw new BusinessError({
        code: 'DbError',
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [error.stack],
      });
    }
  }

  static async _execute(sql, bindParams, options, connection) {
    try {
      const result = await connection.execute(sql, bindParams, options);
      return result;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: 'DbError',
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [error.stack],
      });
    }
  }

  static async releaseConnection(connection) {
    try {
      console.log('liberando conexión del pool');
      await connection.close();
    } catch (error) {
      console.log(error);
    }
  }

  static async closePool(poolConnection) {
    try {
      if (poolConnection) {
        await poolConnection.close();
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

  static async executeSQL(sql, bindParams, target, connection) {
    try {
      const result = await this._execute(
        sql, bindParams, { outFormat: Oracledb.OBJECT }, connection
      );
      const data = result.rows;
      const list = [];
      for (let i = 0, size = data.length; i < size; i += 1) {
        list.push(ObjectMapper.map(data[i], target));
      }
      return list;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: error.code,
        httpCode: error.httpCode,
        messages: error.messages,
      });
    } finally {
      if (connection) {
        try {
          await this.releaseConnection(connection);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  static async _fetchRCFromStream(cursor) {
    // console.log("cursor : ", cursor)
    // console.log("Metadata : ", cursor.metaData)
    let columnas = [];
    const arrayEmpleados = [];

    if (cursor.metaData.length > 0) {
      columnas = cursor.metaData;
    }
    return new Promise((resolve, reject) => {
      const stream = cursor.toQueryStream();
      // console.log("stream : ", stream);
      stream.on('error', (error) => {
        console.error('Error obteniendo datos del resulset : ', error);
        return reject(error);
      });

      stream.on('metaData', (metadata) => {
        console.log('metadataaaa ', metadata);
      });

      stream.on('data', (data) => {
        let index = 0;
        const rowsJson = {};

        columnas.forEach((columna) => {
          // console.log("Nombre Columna", columna.name);
          // console.log("Valor Columna", data[index]);
          rowsJson[columna.name] = data[index];
          index += 1;
        });
        arrayEmpleados.push(rowsJson);
      });

      stream.on('end', () => {
        console.log('Finalizando stream ');
        return resolve(arrayEmpleados);
      });
    });
  }

  static async executeSP(sql, bindParams, target, connection, numRows) {
    try {
      bindParams.cursor = { type: Oracledb.CURSOR, dir: Oracledb.BIND_OUT };
      const result = await this._execute(sql, bindParams, {}, connection);
      const data = await this._fetchRCFromStream(result.outBinds.cursor);
      const list = [];
      for (let i = 0, size = data.length; i < size; i += 1) {
        list.push(ObjectMapper.map(data[i], target));
      }
      return list;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: error.code,
        httpCode: error.httpCode,
        messages: error.messages,
      });
    } finally {
      if (connection) {
        try {
          await this.releaseConnection(connection);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}

module.exports = OracleDatabase;
