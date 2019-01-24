"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const ramda = require("ramda");
const config = require("config");
const util_1 = require("util");
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
    LATITUDE_NOT_FOUND: 'Latitude record is not found, please try again',
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
    async getPrayerLatitudeById(index) {
        let err, prayerLatitudeList, prayerLatitude;
        let filterById = ramda.where({ id: ramda.equals(index) });
        [err, prayerLatitudeList] = await to(this.getPrayerLatitude());
        if (err)
            return Promise.reject(err);
        prayerLatitude = ramda.filter(filterById, prayerLatitudeList).pop();
        if (!util_1.isNullOrUndefined(prayerLatitude))
            return prayerLatitude;
        else
            return Promise.reject(LocationErrorMessages.LATITUDE_NOT_FOUND);
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
