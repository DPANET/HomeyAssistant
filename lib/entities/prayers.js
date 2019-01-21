"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const app = express();
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
var Prayers;
(function (Prayers) {
    Prayers["FAJR"] = "Fajr";
    Prayers["SUNRISE"] = "Sunrise";
    Prayers["DHUHR"] = "Dhuhr";
    Prayers["ASR"] = "Asr";
    Prayers["MAGHRIB"] = "Maghrib";
    Prayers["SUNSET"] = "Sunset";
    Prayers["ISHA"] = "Isha";
    Prayers["MIDNIGHT"] = "Midnight";
})(Prayers = exports.Prayers || (exports.Prayers = {}));
;
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
