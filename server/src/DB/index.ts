import mysql, { ConnectionConfig, Connection, MysqlError } from 'mysql';
import ENV from '../env';

class Database {
  private _connection: Connection = undefined;

  constructor(config?: ConnectionConfig) {
    const dbServer = ENV.db;

    this._connection = mysql.createConnection(config || dbServer);
  }

  public query = (sql: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this._connection.query(sql, (err: MysqlError, rows: any) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };
  public close = () => {
    return new Promise((resolve, reject) => {
      this._connection.end((err: MysqlError) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };
}

export default Database;
