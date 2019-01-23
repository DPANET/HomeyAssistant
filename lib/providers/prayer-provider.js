"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const config = require("config");
var PrayerProviderName;
(function (PrayerProviderName) {
    PrayerProviderName["PRAYER_TIME"] = "Prayer Time";
    PrayerProviderName["APPLE"] = "Apple";
})(PrayerProviderName = exports.PrayerProviderName || (exports.PrayerProviderName = {}));
const prayerTimePaths = {
    latitude: 'apis.prayersAPI.latitude',
    apiurl: 'apis.urls',
    adjustment: 'settings.adjustments',
    calculations: 'settings.calcuations',
};
const LocationErrorMessages = {
    BAD_INPUT: 'Location input provided are not valid',
    NOT_FOUND: 'Location provided cannot be found, try again with different input',
    BAD_RESULT: 'Location provided results have caused unexpected error, please try different input',
    TIME_OUT: 'Connection cannot be made to location provider, please try again after a while'
};
class PrayerProvider {
    constructor(providerName) {
        this._providerName = providerName;
    }
    getProviderName() {
        return this._providerName;
    }
}
class PrayerTimeProvider extends PrayerProvider {
    constructor() {
        super(PrayerProviderName.PRAYER_TIME);
    }
    async getPrayerLatitude() {
        return await config.get(prayerTimePaths.latitude);
    }
    getPrayerLatitudeById(id) {
        throw new Error("Method not implemented.");
    }
    getPrayerMethods() {
        throw new Error("Method not implemented.");
    }
    getPrayerMethodsById(id) {
        throw new Error("Method not implemented.");
    }
    getPrayerSchools() {
        throw new Error("Method not implemented.");
    }
    getPrayerSchoolsById(id) {
        throw new Error("Method not implemented.");
    }
    getPrayerSettings() {
        throw new Error("Method not implemented.");
    }
    getPrayerTime(prayerSettings) {
        throw new Error("Method not implemented.");
    }
}
exports.PrayerTimeProvider = PrayerTimeProvider;
