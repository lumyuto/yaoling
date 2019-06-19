// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportConfig = require('../../../app/controller/config');
import ExportHome = require('../../../app/controller/home');

declare module 'egg' {
  interface IController {
    config: ExportConfig;
    home: ExportHome;
  }
}
