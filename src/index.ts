import type { Readable } from 'stream';

import mysql from 'mysql';
import type { Connection, Pool, PoolConfig } from 'mysql';
import Sql from 'mysql-bricks';
import type {
    FunctionApplication,
    DeleteStatement,
    InsertStatement,
    SelectStatement,
    Statement,
    UpdateStatement,
} from 'mysql-bricks';

import { sqlFunctions } from './functions';

class MysqlBricksException extends Error {};

class TableStatement<Table> {
    private table: string
    private client: Client<any>
    
    constructor(client: Client<any>, table: string) {
        this.client = client;
        this.table = table;
    }
    select<Col extends (keyof Table) & string>(...columns: Array<Col | SelectStatement<any> | FunctionApplication>): SelectStatement<Table> {
        const sql = Sql.select<Table, Col>(...columns).from(this.table);
        sql.run = () => this.client.run(sql);
        sql.runOne = () => this.client.run<any>(sql).then((res: Array<any>) => {
            if (res.length !== 1) {
                throw new MysqlBricksException(`Expected one result but found ${res.length}`);
            }
            return res[0];
        });
        return sql;
    }
    insert(...values: Array<Partial<Table>>): InsertStatement<Table> {
        const sql = Sql.insert<Table>(this.table, ...values);
        sql.run = () => this.client.run(sql).then((r: any) => r.affectedRows);

        const that = this;
        sql.select = function(...args: Array<any>) { // dynamic this
            const select = Sql.insert.prototype.select.apply(this, args);
            select.run = () => that.client.run(select);
            select.runOne = () => that.client.run<any>(sql).then((res: Array<any>) => {
                if (res.length !== 1) {
                    throw new MysqlBricksException(`Expected one result but found ${res.length}`);
                }
                return res[0];
            });
            return select;
        };
        return sql;
    }
    update(...values: Array<Partial<Table>>): UpdateStatement<Table> {
        const sql = Sql.update<Table>(this.table, ...values);
        sql.run = () => this.client.run(sql).then((r: any) => r.affectedRows);
        return sql;
    }
    delete(): DeleteStatement<Table> {
        const sql = Sql.delete<Table>(this.table);
        sql.run = () => this.client.run(sql).then((r: any) => r.affectedRows);
        return sql;
    }
}

type ClientConfig = {
    connection: string | PoolConfig | Pool,
//    camelCase?: boolean,
};

class Client<Schema = any> {
    private pool: Pool
    constructor(configuration: ClientConfig) {
        const connectionConf = configuration.connection;
        if (typeof connectionConf === 'string') {
            this.pool = mysql.createPool(connectionConf);
        } else if ('query' in connectionConf) {
            this.pool = connectionConf;
        } else {
            
        }
    }

    table<T extends (keyof Schema) & string>(table: T): TableStatement<Schema[T]> {
        return new TableStatement<Schema[T]>(this, table);
    }

    run<T>(query: Statement, conn: Pool | Connection = this.pool): Promise<T> {
        return new Promise((resolve, reject) => {
            const { text, values } = query.toParams();
            conn.query({ sql: text, values }, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results)
                }
            });
        });
    }

    stream<T>(query: Statement, opts?: { highWaterMark: number }): Readable {
        const { text, values } = query.toParams();
        return this.pool.query({ sql: text, values }).stream(opts);
    }

    /**
     * Runs the passed queries in a transaction then returns a list of the results
     */
    transaction(...queries: Array<Statement>): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, conn) => {
                conn.beginTransaction(async (error: Error) => {
                    if (error) {
                        reject(error);
                    }
                    const results = await Promise.all(queries.map(q => this.run(q, conn)));
                    conn.release();
                    resolve(results);
                });
            });
        });
    }
};

/**
 * @param config.connection Can be one of: a connection string, a mysql pool config, or a mysql pool.
 */
const createClient = <Schema>(config: ClientConfig): Client<Schema> & { readonly [P in keyof Schema]: TableStatement<Schema[P]> } => {
    return new Proxy(new Client(config), {
        get: (client: any, prop: string) => {
            if (prop in client) {
                return client[prop];
            }
            return client.table(prop);
        }
    });
};

/* TODO
 * camelCase conversion
 * expose pool metrics
 * Implement asc and desc
 */

export type {
    Client,
    ClientConfig,
    TableStatement,
};
export {
    createClient,
    Sql as sql,
    sqlFunctions as fn,
};
