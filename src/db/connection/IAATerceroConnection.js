const MySqlDatabase = require('../../common/db/MySqlDatabase');

let poolConnection;

const dbconfig = {
  user: process.env.SAS_CLOUD_USER,
  password: process.env.SAS_CLOUD_PASSWORD,
  host: process.env.SAS_CLOUD_HOST,
  database: process.env.SAS_CLOUD_DATABASE,
};

class CloudConnection {
  static async _createPool() {
    if (typeof poolConnection === 'undefined') {
      poolConnection = await MySqlDatabase.createPool(dbconfig);
    }
  }

  static async executeSQL(sql, bindParams, target) {
    await this._createPool();
    const result = await MySqlDatabase.executeSQL(sql, bindParams, target, poolConnection);
    // TODO: Se esta trabajando en una mejor form de cerrar el pool de conexiones
    await MySqlDatabase.closePool(poolConnection);
    return result;
  }
}

module.exports = CloudConnection;
