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
const dotenv = require('dotenv');
dotenv.config();
const Debug = require('debug');
const debug = Debug("app:startup");
const request = require('request-promise-native');
const googlelocation = require("./location");
const entity = require("./entities");
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
var validateObject = function (obj, callback) {
    try {
        setTimeout(() => {
            throw (new Error("My Bad nobody handled me"));
            if (typeof obj === 'object') {
                return callback(new Error('Invalid object'), 3);
            }
            return callback(new Error('valid object'), 5);
        }, 2000);
    }
    catch (err) {
        console.log('I was handled');
        return callback(err, 3);
    }
};
validateObject('123', function (err, result) {
    console.log('Callback: ' + err.message + " " + result);
});
console.log('I left');
function googleMap() {
    googlelocation. // Geocode an address.
        googleMapsClient.geocode({
        address: '1600 Amphitheatre Parkway, Mountain View, CA'
    }, function (err, response) {
        if (!err) {
            let x = response.json.results;
            console.log('hi');
        }
        else {
            console.log(err);
        }
    });
}
//constructPrayerTimeObject (queryString);
function constructPrayerTimeObject(query) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield request.get(query, function (err, response, body) {
            if (err) {
                return;
            }
            let y = JSON.parse(body);
            // console.log(y);
            console.log(y.code);
            console.log(y.data.timings.Fajr);
        });
        let PrayersTimings = new Array();
        PrayersTimings.push({ prayerName: entity.Prayers.ASR, time: Date.now(), adjustment: 2 });
        debug(PrayersTimings + 'hi');
    });
}
