"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
// const router = express.Router();
// const Joi= require('joi');
//import dotenviroment= require('dotenv');
//import debug = require('debug');
const entity = require("./entities");
const dotenv = require('dotenv');
dotenv.config();
const Debug = require('debug');
const debug = Debug("app:startup");
const request = require('request-promise-native');
const joi = require('joi');
var queryString = {
    url: "http://api.aladhan.com/v1/calendarByCity",
    qs: {
        city: "Abu Dhabi",
        country: "AE",
        method: "04",
        year: "2018"
    }
};
printPrayers(queryString);
function printPrayers(query) {
    return __awaiter(this, void 0, void 0, function* () {
        let x = yield request.get(query, function (err, response, body) {
            return 3;
        });
        console.log(x);
        let PrayersTimings = new Array();
        PrayersTimings.push({ prayerName: entity.Prayers.ASR, time: Date.now(), adjustment: 2 });
        debug(PrayersTimings + 'hi');
    });
}
