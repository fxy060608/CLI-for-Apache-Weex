#!/usr/bin/env node

const yargsParser = require('yargs-parser');

const debug = require('../commands/debug')

const argv = yargsParser(process.argv.slice(2))

const command = argv._[0]

if (command === 'debug') {
    debug.run({
        logger: console,
        parameters: {
            options: argv
        },
        meta: {
            generateHelp() {}
        }
    })
}
