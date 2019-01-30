const { MySqlDatabase } = require('lib-common/db');

let poolConnection;

const dbconfig = {
  user: process.env.ECD_CLOUD_USER,
  password: process.env.ECD_CLOUD_PASSWORD,
  host: process.env.ECD_CLOUD_HOST,
};

class ECDCloudConnection {
  static async _createPool() {
    if (!poolConnection) {
      poolConnection = await MySqlDatabase.createPool(dbconfig);
    }
  }

  static async executeSQL(sql, bindParams, target) {
    await this._createPool();
    const result = await MySqlDatabase.executeSQL(sql, bindParams, target, poolConnection);
    // TODO: Se esta trabajando en una mejor form de cerrar el pool de conexiones
    // await MySqlDatabase.closePool(poolConnection);
    return result;
  }
}

module.exports = ECDCloudConnection;
