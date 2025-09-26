import knex from 'knex';
import config from '#config';
import 'dotenv/config';

const environment = process.env.ENVIRONMENT || 'development';
const db = knex(config[environment]);

export default db;
