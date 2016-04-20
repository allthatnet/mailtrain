'use strict';

let config = require('config');
let spawn = require('child_process').spawn;
let log = require('npmlog');

log.level = 'verbose';

function createDump(callback) {
    let cmd = spawn('mysqldump', ['-h', config.mysql.host || 'localhost', '-P', config.mysql.port || 3306, '-u', config.mysql.user, '-p' + config.mysql.password, '--opt', config.mysql.database]);

    cmd.stdout.pipe(process.stdout);
    cmd.stderr.pipe(process.stderr);

    cmd.on('close', code => {
        if (code) {
            return callback(new Error('mysqldump command exited with code ' + code));
        }
        return callback(null, true);
    });
}

createDump(err => {
    if (err) {
        log.error('sqldump', err);
        process.exit(1);
    }
    log.info('sqldump', 'MySQL Dump Completed');
    process.exit(0);
});
