returncode: 1
stdout:
> e_commerce_dashboard@1.0.0 start /home/ipshqxog/backend
> node dist/index.js
stderr:
npm WARN lifecycle The node binary used for scripts is /home/ipshqxog/nodevenv/backend/14/bin/node but npm is using /opt/alt/alt-nodejs14/root/usr/bin/node itself. Use the `--scripts-prepend-node-path` option to include the path for the node binary npm was executed with.
/home/ipshqxog/backend/node_modules/sequelize/lib/sequelize.js:192
        throw new Error(`The dialect ${this.getDialect()} is not supported. Supported dialects: mssql, mariadb, mysql, oracle, postgres, db2 and sqlite.`);
        ^

Error: The dialect localhost is not supported. Supported dialects: mssql, mariadb, mysql, oracle, postgres, db2 and sqlite.
    at new Sequelize (/home/ipshqxog/backend/node_modules/sequelize/lib/sequelize.js:192:15)
    at Object.<anonymous> (/home/ipshqxog/backend/dist/models/index.js:15:17)
    at Module._compile (internal/modules/cjs/loader.js:1085:14)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
    at Module.load (internal/modules/cjs/loader.js:950:32)
    at Function.Module._load (internal/modules/cjs/loader.js:790:12)
    at Module.require (internal/modules/cjs/loader.js:974:19)
    at require (internal/modules/cjs/helpers.js:101:18)
    at Object.<anonymous> (/home/ipshqxog/backend/dist/index.js:31:34)
    at Module._compile (internal/modules/cjs/loader.js:1085:14)
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! e_commerce_dashboard@1.0.0 start: `node dist/index.js`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the e_commerce_dashboard@1.0.0 start script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/ipshqxog/.npm/_logs/2024-01-29T18_13_52_095Z-debug.log