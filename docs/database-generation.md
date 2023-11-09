### Steps for Generating the Database Using TypeORM Migrations:

1. **Setup a config file for the datasource connection**. Refer to 'datasource.config.json'.

   ```typescript
   import * as dotenv from 'dotenv';
   dotenv.config();
   import { DataSource } from 'typeorm';

   export const datasource = new DataSource({
     type: 'postgres',
     host: process.env.DB_HOSTNAME,
     port: parseInt(process.env.DB_PORT),
     database: process.env.DB_NAME,
     username: process.env.DB_USERNAME,
     password: process.env.DB_PASSWORD,
     entities: ['dist/**/*.entity{.ts,.js}'],
     migrations: ['dist/migrations/*{.ts,.js}'],
     migrationsTableName: 'migrations',
   });
   ```

2. **Add the necessary scripts to `package.json`**. See 'package.json':

   ```json
   {
     "typeorm": "ts-node ./node_modules/typeorm/cli",
     "migration:run": "npm run build && npm run typeorm migration:run -- -d ./src/config/datasource.config.ts",
     "migration:generate": "npm run build && npm run typeorm -- -d ./src/config/datasource.config.ts migration:generate",
     "migration:create": "npm run typeorm -- migration:create ./src/migrations/$npm_config_name",
     "migration:revert": "npm run typeorm -- -d ./src/config/datasource.config.ts migration:revert"
   }
   ```

3. **Generate the migrations** using the `migration:generate` command.
4. **Run the migrations** using the `migration:run` command.
5. If you need to **revert the migrations**, use the `migration:revert` command.
