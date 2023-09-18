import {LifeCycleObserver, lifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import mongoose from 'mongoose';

type DefaultConfig = {
  options: {
    dbName: string;
  };
  url: string;
};

@lifeCycleObserver('datasource.db')
export class DbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  private readonly defaultConfig: DefaultConfig = {
    url: [process.env.MONGO_DB_URL].toString(),
    options: {
      dbName: 'abk-frontend',
    },
  };

  constructor() {
    super();
  }

  start() {
    console.log('process.env>>', process.env);
    console.log('process.env.MONGO_DB_URL>>', process.env.MONGO_DB_URL);
    mongoose.connect(this.defaultConfig.url, this.defaultConfig.options).then(
      () => {
        console.log('Database connected');
      },
      err => {
        console.log('Error connecting to database', err);
      },
    );
  }

  stop() {
    mongoose.disconnect().then(
      () => {
        console.log('Database disconnected');
      },
      err => {
        console.log('Error disconnecting from database', err);
      },
    );
  }
}
