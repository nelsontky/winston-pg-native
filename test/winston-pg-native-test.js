/**
 * @module 'winston-pg-native-test'
 * @fileoverview Tests of winston transport for logging into PostgreSQL
 * @license MIT
 * @author Andrei Tretyakov <andrei.tretyakov@gmail.com>
 */
const assert = require('assert');
const { Logger } = require('winston');
const vows = require('vows');

const transport = require('abstract-winston-transport');
const Postgres = require('../lib/winston-pg-native.js');

const options = {
  connectionString: `postgres://${process.env.PGUSER}\
:${process.env.PGPASSWORD}\
@${process.env.PGHOST}\
:${process.env.PGPORT}\
/${process.env.PGDATABASE}`,
  poolConfig: {
    idleTimeoutMillis: 1
  }
};

vows
  .describe('winston-pg-native')
  .addBatch({
    'An instance of the Postgres Transport  :::: ': {
      topic: function topic(callback) {
        const logger = new Logger({
          transports: [new Postgres(options)]
        }).transports.Postgres;
        logger
          .init()
          .then(() => callback(null, true))
          .catch((err) => {
            callback(err);
          });
      },
      'should create table': (err, result) => {
        assert.isNull(err);
        assert.ok(result === true);
      }
    }
  })
  .addBatch({
    'An instance of the Postgres Transport': transport({ name: 'Postgres', Transport: Postgres, construct: options })
  })
  .export(module);
