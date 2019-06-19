// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApp = require('../../../app/service/app');
import ExportYaoling = require('../../../app/service/yaoling');

declare module 'egg' {
  interface IService {
    app: ExportApp;
    yaoling: ExportYaoling;
  }
}
