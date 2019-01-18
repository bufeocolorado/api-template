const OracleDatabase = require('../../common/db/OracleDatabase');

let poolConnection;

const dbconfig = {
  user: process.env.SAS_USER,
  password: process.env.SAS_PASSWORD,
  connectString: process.env.SAS_CONNECTSTRING,
  poolMax: 20,
  poolMin: 10,
  poolIncrement: 5,
  poolTimeout: 1,
};

class SasConnection {
  static async _createPool() {
    if (typeof poolConnection === 'undefined') {
      poolConnection = await OracleDatabase.createPool(dbconfig);
    }
  }

  static async executeSQL(sql, bindParams, target) {
    await this._createPool();
    const connection = await OracleDatabase.getConnection(poolConnection);
    const result = await OracleDatabase.executeSQL(sql, bindParams, target, connection);
    // TODO: Se esta trabajando en una mejor form de cerrar el pool de conexiones
    await OracleDatabase.closePool(poolConnection);
    return result;
  }

  static async executeSP(sql, bindParams, target) {
    await this._createPool();
    const connection = await OracleDatabase.getConnection(poolConnection);
    const result = await OracleDatabase.executeSP(sql, bindParams, target, connection);
    await OracleDatabase.closePool(poolConnection);
    return result;
  }
}

module.exports = SasConnection;
