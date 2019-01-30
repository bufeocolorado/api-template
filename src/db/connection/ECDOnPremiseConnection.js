const { OracleDatabase } = require('lib-common/db');

let poolConnection;

const dbconfig = {
  user: process.env.ECD_ONPREMISE_USER,
  password: process.env.ECD_ONPREMISE_PASSWORD,
  connectString: process.env.ECD_ONPREMISE_CONNECTSTRING,
  poolMax: 20,
  poolMin: 10,
  poolIncrement: 5,
  poolTimeout: 1,
};

class ECDOnPremiseConnection {
  static async _createPool() {
    if (!poolConnection) {
      poolConnection = await OracleDatabase.createPool(dbconfig);
    }
  }

  static async executeSQL(sql, bindParams, target) {
    await this._createPool();
    const connection = await OracleDatabase.getConnection(poolConnection);
    const result = await OracleDatabase.executeSQL(sql, bindParams, target, connection);
    // TODO: Se esta trabajando en una mejor form de cerrar el pool de conexiones
    // await OracleDatabase.closePool(poolConnection);
    return result;
  }

  static async executeSP(sql, bindParams, target) {
    await this._createPool();
    const connection = await OracleDatabase.getConnection(poolConnection);
    const result = await OracleDatabase.executeSP(sql, bindParams, target, connection);
    // await OracleDatabase.closePool(poolConnection);
    return result;
  }
}

module.exports = ECDOnPremiseConnection;
