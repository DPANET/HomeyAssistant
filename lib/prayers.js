"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const app = express();
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
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
    //prayer constructors, with timing,
    constructor(prayersDate, prayers) {
        this._prayersDate = prayersDate;
        this._prayers = prayers;
        // this._prayersTimings = new Array();
    }
}
exports.PrayersTime = PrayersTime;
class PrayersSettings {
    constructor(prayersSettings) {
        this._prayersSettings = prayersSettings;
    }
}
exports.PrayersSettings = PrayersSettings;
class PrayersTimeFactory {
    static async createPrayersTimeFactory(location, prayerSettings) {
        return;
    }
    static async createPrayersSettingFactory(prayerSettings) {
        //ifPrayersSettings are not passed, read it from config
        return;
    }
}
exports.PrayersTimeFactory = PrayersTimeFactory;
