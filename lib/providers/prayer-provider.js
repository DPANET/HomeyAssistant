"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const ramda = require("ramda");
const util_1 = require("util");
const lowdb_1 = __importDefault(require("lowdb"));
const FileASync_1 = __importDefault(require("lowdb/adapters/FileASync"));
const request = __importStar(require("request-promise-native"));
var PrayerProviderName;
(function (PrayerProviderName) {
    PrayerProviderName["PRAYER_TIME"] = "Prayer Time";
    PrayerProviderName["APPLE"] = "Apple";
})(PrayerProviderName = exports.PrayerProviderName || (exports.PrayerProviderName = {}));
const prayerTimePaths = {
    latitude: 'apis.prayersAPI.latitude',
    methods: 'api.prayersAPI.methods',
    apiurl: 'apis.urls',
    methodsUrl: 'apis.prayersAPI.urls.prayerMethodsUrl',
    adjustment: 'settings.adjustments',
    calculations: 'settings.calcuations',
};
const PrayerErrorMessages = {
    BAD_INPUT: 'Location input provided are not valid',
    LATITUDE_NOT_FOUND: 'Latitude record is not found, please try again',
    BAD_RESULT: 'Location provided results have caused unexpected error, please try different input',
    TIME_OUT: 'Connection cannot be made to prayer provider, please try again after a while',
    FILE_NOT_FOUND: 'Connection cannot be made to prayer provider, try to reinstall the app'
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
        this.fileName = 'src/configurators/prayers.json';
    }
    async getDB() {
        if (util_1.isNullOrUndefined(this._db))
            return this._db = await lowdb_1.default(new FileASync_1.default(this.fileName));
        else
            return this._db;
    }
    async getPrayerLatitude() {
        return await this.getDB().then(result => result.get(prayerTimePaths.latitude).value());
    }
    async getPrayerLatitudeById(index) {
        let err, prayerLatitudeList, prayerLatitude;
        let filterById = ramda.where({ id: ramda.equals(index) });
        [err, prayerLatitudeList] = await to(this.getPrayerLatitude());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        prayerLatitude = ramda.filter(filterById, prayerLatitudeList).pop();
        if (!util_1.isNullOrUndefined(prayerLatitude))
            return prayerLatitude;
        else
            return Promise.reject(PrayerErrorMessages.LATITUDE_NOT_FOUND);
    }
    async getPrayerMethodUrl() {
        return await this.getDB().then(result => result.get(prayerTimePaths.methodsUrl).value());
    }
    parsePrayerMethods(prayerMethodsJson) {
        console.log(prayerMethodsJson);
        return;
    }
    async getPrayerMethods() {
        let err, body, result, prayerObject, notification, url;
        [err, url] = await to(this.getPrayerMethodUrl());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        console.log(url);
        let queryString = [
            {
                method: 'GET',
                json: true,
                resolveWithFullResponse: false
            }
        ];
        [err, result] = await to(request.get(url, queryString));
        if (err)
            return Promise.reject(PrayerErrorMessages.TIME_OUT);
        return this.parsePrayerMethods(result);
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
