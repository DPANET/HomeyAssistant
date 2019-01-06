"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const config = require('config');
//const app = express();
const joi = require('joi');
exports.Prayers = {
    FAJR: "Fajr",
    SUNRISE: "Sunrise",
    DHUHR: "Dhuhr",
    ASR: "Asr",
    MAGHRIB: "Maghrib",
    SUNSET: "Sunset",
    ISHA: "Isha",
    MIDNIGHT: "Midnight"
};
class PrayersTime {
    //prayer constructors, with timing, with timing & adjustments,
    PrayersTime(prayersDate) {
        this._prayersDate = prayersDate;
        // this._prayersTimings = new Array();
    }
}
exports.PrayersTime = PrayersTime;
