"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./validator.ts" />
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
