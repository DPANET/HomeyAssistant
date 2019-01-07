"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require('debug');
const debug = Debug("app:startup");
const request = require('request-promise-native');
const await_to_js_1 = __importDefault(require("await-to-js"));
const { googleMapsClient } = require("./location");
const util = require('util');
//console.log(process.env.GOOGLE_API_KEY);
//googleMap();
var queryString = {
    url: 'http://api.aladhan.com/v1/timingsByCity/' + '01-01-2019',
    qs: {
        city: "Abu Dhabi",
        country: "AE",
        method: "04",
    }
};
googleMap();
function googleMap() {
    return __awaiter(this, void 0, void 0, function* () {
        let err, result, locationObject;
        try {
            [err, result] = yield await_to_js_1.default(googleMapsClient.geocode({ address: "marina square", language: "en", components: { country: "AE" } }).asPromise());
            console.log(util.inspect(result.json.results[0].location, { showHidden: false, depth: null }));
        }
        catch (err) {
            console.log(err.message);
        }
    });
}
// constructPrayerTimeObject (queryString)
// .then((result)=>{
//     console.log('SUCEEED');
//     console.log(result);
// })
// .catch((err)=>
// {
//     console.log('FAILED');
//     console.log(err.message);
// }   
// );
function constructPrayerTimeObject(query, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let err, result, prayerObject, notification;
        [err, result] = yield await_to_js_1.default(request.get(query));
        if (!err)
            [err, prayerObject] = yield await_to_js_1.default(JSON.parse(result));
        else
            return Promise.reject(err);
        console.log('finished');
        // let PrayersTimings: Array<entity.IPrayerTime> = new Array();
        // PrayersTimings.push({ prayerName: entity.Prayers.ASR, time: Date.now(), adjustment: 2 });
        // debug(PrayersTimings + 'hi');
    });
}
