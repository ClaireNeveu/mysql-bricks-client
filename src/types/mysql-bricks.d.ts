declare module 'mysql-bricks' {
    // Type definitions for sql-bricks 2.0
    // Project: http://csnw.github.io/sql-bricks
    // Definitions by: Narcisse Assogba <https://github.com/adn05>
    //                 Paleo <https://github.com/paleo>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

    namespace SqlBricks {
        /**
         * Statement is an abstract base class for all statements (SELECT, INSERT, UPDATE, DELETE)
         * and should never be instantiated directly. It is exposed because it can be used with the
         * instanceof operator to easily determine whether something is a SQL Bricks statement: my_var instanceof Statement.
         */
        interface Statement {
            /**
             * Clones a statement so that subsequent modifications do not affect the original statement.
             */
            clone(): this

            /**
             * Returns the non-parameterized SQL for the statement. This is called implicitly by Javascript when using a Statement anywhere that a string is expected (string concatenation, Array.join(), etc).
             * While toString() is easy to use, it is not recommended in most cases because:
             *    It doesn't provide robust protection against SQL injection attacks (it just does basic escaping)
             *    It doesn't provide as much support for complex data types (objects, arrays, etc, are "stringified" before being passed to your database driver, which then has to interpret them correctly)
             *    It does not provide the same level of detail in error messages (see this issue)
             * For the above reasons, it is usually better to use toParams().
             */
            toString(): string

            /**
             * Returns an object with two properties: a parameterized text string and a values array. The values are populated with anything on the right-hand side
             * of a WHERE criteria,as well as any values passed into an insert() or update() (they can be passed explicitly with val() or opted out of with sql())
             * @param options A placeholder option of '?%d' can be passed to generate placeholders compatible with node-sqlite3 (%d is replaced with the parameter #):
             * @example
             * update('person', {'first_name': 'Fred'}).where({'last_name': 'Flintstone'}).toParams({placeholder: '?%d'});
             *    // {"text": "UPDATE person SET first_name = ?1 WHERE last_name = ?2", "values": ["Fred", "Flintstone"]}
             */
            toParams(options?: { placeholder: string }): SqlBricksParam
        }

        interface SqlBricksParam {
            text: string
            values: any[]
        }

        /**
         * @ignore
         */
        type FunctionApplication = { __tag__: 'FunctionApplication' } & string

        type TableName = string | SelectStatement<any>

        interface OnCriteria {
            [column: string]: string
        }

        type WhereObject<Table> = {
            [C in keyof Table]: Table[C]
        }

        interface WhereGroup<Table> {
            op?: string
            expressions: Array<WhereExpression<Table>>
        }

        interface WhereBinary<Table> {
            op: string
            col: string | SelectStatement<any>
            val: any
            quantifier: string
        }

        /**
         * When a non-expression object is passed somewhere a whereExpression is expected,
         * each key/value pair will be ANDed together:
         */
        type WhereExpression<Table> = WhereGroup<Table> | WhereBinary<Table> | WhereObject<Table>

        /**
         * A SELECT statement
         */
        interface SelectStatement<Table> extends Statement {
            /**
             * Appends additional columns to an existing query.
             * @param columns can be passed as multiple arguments, a comma-delimited string or an array.
             */
            select<Col extends (keyof Table) & string>(...columns: Array<Col | SelectStatement<Table> | FunctionApplication>): SelectStatement<Table>
            /**
             * Appends additional columns to an existing query.
             * @param columns can be passed as multiple arguments, a comma-delimited string or an array.
             */
            select<Col extends (keyof Table) & string>(columns: Col[] | SelectStatement<any>[] | FunctionApplication[]): SelectStatement<Table>

            as(alias: string): SelectStatement<Table>

            distinct<Col extends (keyof Table) & string>(...columns: Array<Col | SelectStatement<any> | FunctionApplication>): SelectStatement<Table>
            distinct<Col extends (keyof Table) & string>(columns: Col[] | SelectStatement<Table>[] | FunctionApplication[]): SelectStatement<Table>

            /**
             * Makes the query a SELECT ... INTO query (which creates a new table with the results of the query).
             * @alias intoTable
             * @param tbl new table to create
             */
            into(tbl: TableName): SelectStatement<Table>
            /**
             * Makes the query a SELECT ... INTO query (which creates a new table with the results of the query).
             * @alias into
             * @param tbl new table to create
             */
            intoTable(tbl: TableName): SelectStatement<Table>

            intoTemp(tbl: TableName): SelectStatement<Table>
            intoTempTable(tbl: TableName): SelectStatement<Table>

            /**
             * Table names can be passed in as multiple string arguments, a comma-delimited string or an array.
             * @param tbls table names
             */
            from(...tbls: TableName[]): SelectStatement<any>
            /**
             * Table names can be passed in as multiple string arguments, a comma-delimited string or an array.
             * @param tbls array of table names
             */
            from(tbls: TableName[]): SelectStatement<any>

            /**
             * Adds the specified join to the query.
             * @alias innerJoin
             * @param tbl can include an alias after a space or after the 'AS' keyword ('my_table my_alias').
             * @param onCriteria is optional if a joinCriteria function has been supplied.
             */
            join(tbl: string, criteria?: OnCriteria | string[] | WhereExpression<any>): SelectStatement<any>
            join(tbl: string, onCol1: string, onCol2: string): SelectStatement<any>
            join(firstTbl: string, ...otherTbls: string[]): SelectStatement<any>

            leftJoin(tbl: string, criteria?: OnCriteria | string[] | WhereExpression<any>): SelectStatement<any>
            leftJoin(tbl: string, onCol1: string, onCol2: string): SelectStatement<any>
            leftJoin(firstTbl: string, ...otherTbls: string[]): SelectStatement<any>
            rightJoin(tbl: string, criteria?: OnCriteria | string[] | WhereExpression<any>): SelectStatement<any>
            rightJoin(tbl: string, onCol1: string, onCol2: string): SelectStatement<any>
            rightJoin(firstTbl: string, ...otherTbls: string[]): SelectStatement<any>
            fullJoin(tbl: string, criteria?: OnCriteria | string[] | WhereExpression<any>): SelectStatement<any>
            fullJoin(tbl: string, onCol1: string, onCol2: string): SelectStatement<any>
            fullJoin(firstTbl: string, ...otherTbls: string[]): SelectStatement<any>
            crossJoin(tbl: string, criteria?: OnCriteria | string[] | WhereExpression<any>): SelectStatement<any>
            crossJoin(tbl: string, onCol1: string, onCol2: string): SelectStatement<any>
            crossJoin(firstTbl: string, ...otherTbls: string[]): SelectStatement<any>
            innerJoin(tbl: string, criteria?: OnCriteria | string[] | WhereExpression<any>): SelectStatement<any>
            innerJoin(tbl: string, onCol1: string, onCol2: string): SelectStatement<any>
            innerJoin(firstTbl: string, ...otherTbls: string[]): SelectStatement<any>
            leftOuterJoin(tbl: string, criteria?: OnCriteria | string[] | WhereExpression<any>): SelectStatement<any>
            leftOuterJoin(tbl: string, onCol1: string, onCol2: string): SelectStatement<any>
            leftOuterJoin(firstTbl: string, ...otherTbls: string[]): SelectStatement<any>
            rightOuterJoin(tbl: string, criteria?: OnCriteria | string[] | WhereExpression<any>): SelectStatement<any>
            rightOuterJoin(tbl: string, onCol1: string, onCol2: string): SelectStatement<any>
            rightOuterJoin(firstTbl: string, ...otherTbls: string[]): SelectStatement<any>
            fullOuterJoin(tbl: string, criteria?: OnCriteria | string[] | WhereExpression<any>): SelectStatement<any>
            fullOuterJoin(tbl: string, onCol1: string, onCol2: string): SelectStatement<any>
            fullOuterJoin(firstTbl: string, ...otherTbls: string[]): SelectStatement<any>

            on(onCriteria: OnCriteria | WhereExpression<any>): SelectStatement<Table>
            on(onCol1: string, onCol2: string): SelectStatement<Table>

            /**
             * Joins using USING instead of ON.
             * @param columnList columnList can be passed in as one or more string arguments, a comma-delimited string, or an array.
             * @example
             * select('*').from('person').join('address').using('address_id', 'country_id');
             * // SELECT * FROM person INNER JOIN address USING (address_id, country_id)
             */
            using(...columnList: string[]): SelectStatement<Table>
            using(columnList: string[]): SelectStatement<Table>

            /**
             * Adds the specified natural join to the query.
             * @param tbl can include an alias after a space or after the 'AS' keyword ('my_table my_alias').
             */
            naturalJoin(tbl: string): SelectStatement<any>
            naturalLeftJoin(tbl: string): SelectStatement<any>
            naturalRightJoin(tbl: string): SelectStatement<any>
            naturalFullJoin(tbl: string): SelectStatement<any>

            naturalInnerJoin(tbl: string): SelectStatement<any>
            naturalLeftOuterJoin(tbl: string): SelectStatement<any>
            naturalRightOuterJoin(tbl: string): SelectStatement<any>
            naturalFullOuterJoin(tbl: string): SelectStatement<any>

            where<Col extends (keyof Table) & string>(column?: Col | FunctionApplication | null, value?: Table[Col]): SelectStatement<Table>
            where(...whereExpr: Array<WhereExpression<Table>>): SelectStatement<Table>

            and(...options: any[]): SelectStatement<Table>

            /**
             * Sets or extends the GROUP BY columns.
             * @param columns can take multiple arguments, a single comma-delimited string or an array.
             */
            groupBy<Col extends (keyof Table) & string>(...columns: Array<Col>): SelectStatement<Table>
            groupBy<Col extends (keyof Table) & string>(columns: Array<Col>): SelectStatement<Table>

            having(column: string, value: string): SelectStatement<Table>
            having(whereExpr: WhereExpression<Table>): SelectStatement<Table>

            /**
             * Sets or extends the list of columns in the ORDER BY clause.
             * @param columns can be passed as multiple arguments, a single comma-delimited string or an array.
             */
            orderBy<Col extends (keyof Table) & string>(...columns: Array<Col | FunctionApplication>): SelectStatement<Table>
            orderBy<Col extends (keyof Table) & string>(columns: Array<Col | FunctionApplication>): SelectStatement<Table>
            order<Col extends (keyof Table) & string>(...columns: Array<Col | FunctionApplication>): SelectStatement<Table>
            order<Col extends (keyof Table) & string>(columns: Array<Col | FunctionApplication>): SelectStatement<Table>

            forUpdate(...tbls: string[]): SelectStatement<Table>
            of(tlb: string): SelectStatement<Table>
            noWait(): SelectStatement<Table>

            union(...stmt: Statement[]): SelectStatement<any>
            intersect(...stmt: Statement[]): SelectStatement<any>
            minus(...stmt: Statement[]): SelectStatement<any>
            except(...stmt: Statement[]): SelectStatement<any>

            offset(offset: number): SelectStatement<Table>
            limit(limit: number): SelectStatement<Table>

            run(): Promise<Array<Table>>
            runOne(): Promise<Table>
        }

        /**
         * An INSERT statement
         */
        interface InsertStatement<Table> extends Statement {
            into(tbl: TableName, ...columns: Partial<Table>[]): InsertStatement<Table>
            intoTable(tbl: TableName, ...columns: Partial<Table>[]): InsertStatement<Table>
            select<C extends (keyof Table) & string>(...columns: Array<C | SelectStatement<any>>): SelectStatement<any>
            select<C extends (keyof Table) & string>(columns: Array<C> | SelectStatement<any>[]): SelectStatement<any>
            values(...values: Partial<Table>[]): InsertStatement<Table>
            ignore(): InsertStatement<Table>
            onDuplicateKeyUpdate<C extends (keyof Table) & string>(columns: Array<C>): InsertStatement<Table>
            run(): Promise<number>
        }

        /**
         * An UPDATE statement
         */
        interface UpdateStatement<Table> extends Statement {
            values(...values: Partial<Table>[]): UpdateStatement<Table>
            set(...values: Partial<Table>[]): UpdateStatement<Table>
            where<C extends (keyof Table) & string>(column?: C | FunctionApplication | null, value?: Table[C]): UpdateStatement<Table>
            where(...whereExpr: WhereExpression<Table>[]): UpdateStatement<Table>
            and<C extends (keyof Table) & string>(column?: C | FunctionApplication | null, value?: Table[C]): UpdateStatement<Table>
            and(...whereExpr: WhereExpression<Table>[]): UpdateStatement<Table>
            limit(limit: number): SelectStatement<Table>
            run(): Promise<number>
        }

        /**
         * A DELETE statement
         */
        interface DeleteStatement<Table> extends Statement {
            using(...columnList: string[]): SelectStatement<any>
            using(columnList: string[]): SelectStatement<any>
            where<C extends (keyof Table) & string>(column?: C | FunctionApplication | null, value?: Table[C]): SelectStatement<Table>
            where(...whereExpr: WhereExpression<Table>[]): SelectStatement<Table>
            and<C extends (keyof Table) & string>(column?: C | FunctionApplication | null, value?: Table[C]): SelectStatement<any>
            and(...whereExpr: WhereExpression<Table>[]): SelectStatement<any>
            orderBy<Col extends (keyof Table) & string>(...columns: Array<Col | FunctionApplication>): DeleteStatement<Table>
            limit(limit: number): SelectStatement<Table>
            run(): Promise<number>
        }
    }

    /**
     * @ignore
     */
    type FunctionApplication = { __tag__: 'FunctionApplication' } & string

    interface SqlBricksFn {
        (...params: any[]): any
        
        /**
         * Wraps a value (user-supplied string, number, boolean, etc) so that it can be passed into SQL Bricks
         * anywhere that a column is expected (the left-hand side of WHERE criteria and many other SQL Bricks APIs)
         * @param value value to be wraped
         */
        val(value: any): any

        /**
         * Returns a new INSERT statement. It can be used with or without the new operator.
         * @alias insertInto
         * @param tbl table name
         * @param values a values object or a columns list. Passing a set of columns (as multiple arguments, a comma-delimited string or an array)
         * will put the statement into split keys/values mode, where a matching array of values is expected in values()
         * @example
         * insert('person', {'first_name': 'Fred', 'last_name': 'Flintstone'});
         * // INSERT INTO person (first_name, last_name) VALUES ('Fred', 'Flintstone')
         */
        insert<Table>(tbl?: string, ...values: Partial<Table>[]): SqlBricks.InsertStatement<Table>

        /**
         * Returns a new INSERT statement. It can be used with or without the new operator.
         * @alias insert
         * @param tbl table name
         * @param values a values object or a columns list. Passing a set of columns (as multiple arguments, a comma-delimited string or an array)
         * will put the statement into split keys/values mode, where a matching array of values is expected in values()
         * @example
         * insert('person', {'first_name': 'Fred', 'last_name': 'Flintstone'});
         * // INSERT INTO person (first_name, last_name) VALUES ('Fred', 'Flintstone')
         */
        insertInto<Table>(tbl?: string, ...values: Partial<Table>[]): SqlBricks.InsertStatement<Table>

        /**
         * Returns a new select statement, seeded with a set of columns. It can be used with or without the new keyword.
         * @param columns it can be passed in here (or appended later via sel.select() or sel.distinct()) via multiple arguments
         * or a comma-delimited string or an array. If no columns are specified, toString() will default to SELECT *.
         */
        select<Table extends {}, Col extends (keyof Table) & string>(...columns: Array<Col | SqlBricks.SelectStatement<any> | FunctionApplication>): SqlBricks.SelectStatement<Table>
        select<Table extends {}, Col extends (keyof Table) & string>(columns: Col[] | SqlBricks.SelectStatement<any>[] | FunctionApplication[]): SqlBricks.SelectStatement<Table>

        /**
         * Returns a new UPDATE statement. It can be used with or without the new operator.
         * @param tbl table name
         * @param values
         */
        update<Table>(tbl: string, ...values: Partial<Table>[]): SqlBricks.UpdateStatement<Table>

        /**
         * Returns a new DELETE statement. It can be used with or without the new operator.
         * @alias deleteFrom
         * @param tbl table name
         */
        delete<Table>(tbl?: string): SqlBricks.DeleteStatement<Table>
        /**
         * Returns a new DELETE statement. It can be used with or without the new operator.
         * @alias delete
         * @param tbl table name
         */
        deleteFrom<Table>(tbl?: string): SqlBricks.DeleteStatement<Table>

        /**
         * Registers a set of frequently-used table aliases with SQL Bricks.
         * These table aliases can then be used by themselves in from(), join(), etc
         * and SQL Bricks will automatically expand them to include the table name as well as the alias.
         * @param expansions
         * @example
         * sql.aliasExpansions({'psn': 'person', 'addr': 'address', 'zip': 'zipcode', 'usr': 'user'});
         * select().from('psn').join('addr', {'psn.addr_id': 'addr.id'});
         * // SELECT * FROM person psn INNER JOIN address addr ON psn.addr_id = addr.id
         */
        aliasExpansions(expansions: { [tbl: string]: string }): void

        /**
         * Sets a user-supplied function to automatically generate the .on() criteria for joins whenever it is not supplied explicitly.
         * @param func
         */
        joinCriteria(func?: (...args: any[]) => SqlBricks.OnCriteria): any

        _extension(): any
        prop: number
        conversions: any

        //////////////////////////////////////////
        //////  Where Expression functions  //////
        //////////////////////////////////////////

        /**
         * Joins the passed expressions with AND
         * @param whereExprs
         */
        and<T>(...whereExprs: SqlBricks.WhereExpression<T>[]): SqlBricks.WhereGroup<T>

        /**
         * Joins the passed expressions with OR:
         * @param whereExprs
         */
        or<T>(...whereExprs: SqlBricks.WhereExpression<T>[]): SqlBricks.WhereGroup<T>

        /**
         * Negates the expression by wrapping it in NOT (...)
         * (if it is at the top level, the parentheses are unnecessary and will be omitted)
         * @param whereExpr
         */
        not<T>(whereExpr: SqlBricks.WhereExpression<T>): SqlBricks.WhereGroup<T>

        /**
         * Generates a BETWEEN
         * @param column
         * @param value1
         * @param value2
         */
        between<T, C extends (keyof T) & string>(column: C | FunctionApplication, value1: T[C], value2: T[C]): SqlBricks.WhereExpression<T>
        isNull<T, C extends (keyof T) & string>(column: C | FunctionApplication): SqlBricks.WhereExpression<T>
        isNotNull<T, C extends (keyof T) & string>(column: C | FunctionApplication): SqlBricks.WhereExpression<T>
        like<T, C extends (keyof T) & string>(column: C | FunctionApplication, value: any, escapeStr?: string): SqlBricks.WhereExpression<T>
        exists<T>(stmt: any): SqlBricks.WhereExpression<T>
        in<T, C extends (keyof T) & string>(column: C | FunctionApplication, stmt: SqlBricks.SelectStatement<any>): SqlBricks.WhereExpression<T>
        in<T, C extends (keyof T) & string>(column: C | FunctionApplication, ...values: Array<T>): SqlBricks.WhereExpression<T>

        /**
         * Generates the appropriate relational operator (=, <>, <, <=, > or >=).
         * @param column column name or query result
         * @param value column value
         */
        eq<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        notEq<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        lt<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        lte<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        gt<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        gte<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>

        eqAll<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        notEqAll<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        ltAll<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        lteAll<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        gtAll<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        gteAll<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>

        eqAny<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        notEqAny<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        ltAny<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        lteAny<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        gtAny<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        gteAny<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>

        eqSome<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        notEqSome<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        ltSome<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        lteSome<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        gtSome<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>
        gteSome<T, C extends (keyof T) & string>(column: C | FunctionApplication | SqlBricks.SelectStatement<any>, value?: T[C]): SqlBricks.WhereBinary<T>

    }

    const SqlBricks: SqlBricksFn
    export = SqlBricks
}
