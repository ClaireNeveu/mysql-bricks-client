# mysql-bricks-client
This is a simple mysql client built on top of [SQL Bricks](http://csnw.github.io/sql-bricks/). API documentation can be found [here](https://claireneveu.github.io/mysql-bricks-client/)

## Schema
mysql-bricks-client adds limited schema support via typescript allowing you to statically verify that you're referencing columns that actually exist (and getting back correct return types).

```typescript
import { createClient } from 'mysql-bricks-client';

type DbSchema = {
  employees: {
    id: number,
    name: string,
    age: number,
  },
  departments: {
    id: number,
    name: string,
  },
};

const db = createClient<DbSchema>(config);

db.employees.select('id', 'name').run() // Allowed
db.employees.select('id', 'birthday').run() // Compile error
```

No attempt is made to comprehensively type SQL and joins and function usage will revert types to `any`.
