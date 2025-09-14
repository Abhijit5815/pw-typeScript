import oracledb from 'oracledb';

export class DbHelper {
  private static pool: oracledb.Pool;

  /**
   * Initialize Oracle DB connection pool
   */
  public static async init() {
    if (!this.pool) {
      this.pool = await oracledb.createPool({
        user: 'your_username',
        password: 'your_password',
        connectString: 'hostname:port/TestDB', // e.g. 'localhost:1521/TestDB'
        poolMin: 1,
        poolMax: 10,
        poolIncrement: 1,
      });
      console.log('Oracle DB connection pool created');
    }
  }

  /**
   * Close Oracle DB connection pool
   */
  public static async close() {
    if (this.pool) {
      await this.pool.close(10); // 10 seconds timeout for closing
      console.log('Oracle DB connection pool closed');
    }
  }

  /**
   * Sample method to get ISINs from table `abc` filtered by cusisp = a
   * @param a string value for cusisp filter
   * @returns array of ISIN strings
   */
  public static async getIsins(a: string): Promise<string[]> {
    let connection: oracledb.Connection | undefined;
    try {
      connection = await this.pool.getConnection();

      const result = await connection.execute<{ ISIN: string }>(
        `SELECT isin FROM abc WHERE cusisp = :cusisp`,
        [a],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      // Map rows to array of ISIN strings
      if (result.rows) {
        return result.rows.map(row => row.ISIN);
      }
      return [];
    } catch (error) {
      console.error('Error querying ISINs:', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          console.error('Error closing connection:', closeError);
        }
      }
    }
  }
}

/**
 * 
 * import { DbHelper } from './DbHelper';

(async () => {
  await DbHelper.init();

  try {
    const isins = await DbHelper.getIsins('CUSIP123');
    console.log('Returned ISINs:', isins);
  } catch (err) {
    console.error('Database query failed:', err);
  } finally {
    await DbHelper.close();
  }
})();
 */