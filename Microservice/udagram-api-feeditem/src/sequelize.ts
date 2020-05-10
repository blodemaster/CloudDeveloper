import {Sequelize} from 'sequelize-typescript';
import {config} from './config/config';
import { Dialect } from 'sequelize/types';


export const sequelize = new Sequelize({
  'username': config.username,
  'password': config.password,
  'database': config.database,
  'host': config.host,

  'dialect': config.dialect as Dialect,
  'storage': ':memory:',
});
