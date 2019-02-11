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
const utility_1 = require("../util/utility");
var PrayerProviderName;
(function (PrayerProviderName) {
    PrayerProviderName["PRAYER_TIME"] = "Prayer Time";
    // APPLE = "Apple"
})(PrayerProviderName = exports.PrayerProviderName || (exports.PrayerProviderName = {}));
const prayerTimePaths = {
    latitude: 'apis.prayersAPI.latitude',
    methods: 'api.prayersAPI.methods',
    apiurl: 'apis.urls',
    methodsUrl: 'apis.prayersAPI.urls.prayerMethodsUrl',
    prayerTimeUrl: 'apis.prayersAPI.urls.prayersByCoordinatesUrl.monthly',
    adjustment: 'apis.prayersAPI.settings.calcuations.adjustments',
    calculations: 'settings.calcuations',
    schools: 'apis.prayersAPI.schools',
    settings: 'apis.prayersAPI.settings.calculations',
    midnight: 'apis.prayersAPI.midnight'
};
const PrayerErrorMessages = {
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    LATITUDE_NOT_FOUND: 'Latitude record is not found, please try again',
    PRAYERMETHOD_NOT_FOUND: 'Prayer Method record is not found, please try again',
    SCHOOLS_NOT_FOUND: 'School Method record is not found, please try again',
    MIDNIGHT_NOT_FOUND: 'Midnight Calculations record is not found, please try again',
    TIME_OUT: 'Connection cannot be made to prayer provider, please try again after a while',
    FILE_NOT_FOUND: 'Connection cannot be made to prayer provider, try ensure internet connectivity'
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
        this.fileName = require.resolve('../configurators/prayers.json'); ////''/configurators/prayers.json';
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
        return await this.getObjectById(index, () => this.getPrayerLatitude());
    }
    async getPrayerMethodUrl() {
        return await this.getDB().then(result => result.get(prayerTimePaths.methodsUrl).value());
    }
    parsePrayerMethods(prayerMethodsJson) {
        let collection = new Array();
        const result = (value, key) => {
            if (!util_1.isNullOrUndefined(value.name)) {
                collection.push({
                    id: value.id,
                    methodName: value.name
                });
            }
        };
        ramda.forEachObjIndexed(result, prayerMethodsJson);
        return collection;
    }
    async getPrayerMethods() {
        let err, result, url;
        [err, url] = await to(this.getPrayerMethodUrl());
        if (err)
            return Promise.reject(err.message = PrayerErrorMessages.FILE_NOT_FOUND);
        let queryString = {
            uri: url.methods,
            method: 'GET',
            json: true,
            resolveWithFullResponse: false
        };
        [err, result] = await to(request.get(queryString));
        if (err)
            return Promise.reject(err.message = PrayerErrorMessages.TIME_OUT);
        return this.parsePrayerMethods(result['data']);
    }
    async getPrayerMethodsById(index) {
        return await this.getObjectById(index, () => this.getPrayerMethods());
    }
    async getPrayerSchools() {
        return await this.getDB().then(result => result.get(prayerTimePaths.schools).value());
    }
    async getPrayerSchoolsById(index) {
        return await this.getObjectById(index, () => this.getPrayerSchools());
    }
    async getPrayerTime(prayerSettings, prayerLocation) {
        let duration = utility_1.DateUtil.getMonthsDifference(prayerSettings.startDate, prayerSettings.endDate);
        let err, result, url, queryString;
        let date = prayerSettings.startDate;
        let prayersList = new Array();
        for (let i = 0; i <= duration; i++) {
            [err, url] = await to(this.getPrayerTimeUrl());
            if (err)
                return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
            queryString = this.buildPrayerAPIQueryString(url, prayerSettings, prayerLocation, date);
            date = utility_1.DateUtil.addMonth(1, date);
            [err, result] = await to(request.get(queryString));
            if (err)
                return Promise.reject(PrayerErrorMessages.TIME_OUT);
            prayersList = ramda.concat(prayersList, this.buildPrayersObject(result['data'], prayerLocation)); //.concat(this.buildPrayersObject(result['data']))
        }
        return prayersList.filter(n => (n.prayersDate >= prayerSettings.startDate && n.prayersDate <= prayerSettings.endDate));
        ;
    }
    buildPrayersObject(result, prayerLocation) {
        let prayersTimingList = new Array();
        let prayersList = new Array();
        let i = 0;
        let dateString;
        let fnPrayer = (value, key) => {
            prayersTimingList.push({
                prayerName: key,
                prayerTime: utility_1.DateUtil.getTime(dateString, value)
            });
        };
        let fn = (n) => {
            prayersTimingList = [];
            dateString = n.date.readable;
            ramda.forEachObjIndexed(fnPrayer, n.timings);
            prayersList.push({
                prayerTime: prayersTimingList,
                prayersDate: utility_1.DateUtil.formatDate(n.date.readable)
            });
        };
        ramda.forEach(fn, result);
        return prayersList;
    }
    async getPrayerTimeUrl() {
        return await this.getDB().then(result => result.get(prayerTimePaths.prayerTimeUrl).value());
    }
    buildPrayerAPIQueryString(url, prayerSettings, prayerLocation, date) {
        let queryString = {
            uri: url,
            qs: {
                uri: url,
                latitude: prayerLocation.latitude,
                longitude: prayerLocation.longtitude,
                month: utility_1.DateUtil.getMonth(date),
                year: utility_1.DateUtil.getYear(date),
                method: prayerSettings.method.id,
                school: prayerSettings.school.id,
                midnightMode: prayerSettings.midnight.id,
                timezonestring: prayerLocation.timeZoneId,
                latitudeAdjustmentMethod: prayerSettings.latitudeAdjustment.id,
                tune: prayerSettings.adjustments.map(n => n.adjustments).toString()
            },
            method: 'GET',
            json: true,
            resolveWithFullResponse: false
        };
        return queryString;
    }
    async getPrayerMidnight() {
        return await this.getDB().then(result => result.get(prayerTimePaths.midnight).value());
    }
    async getPrayerMidnightById(index) {
        return await this.getObjectById(index, () => this.getPrayerMidnight());
    }
    async getObjectById(index, fn) {
        let err, list, listObject;
        const filterById = ramda.where({ id: ramda.equals(index) });
        [err, list] = await to(fn());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        listObject = ramda.filter(filterById, list).pop();
        if (!util_1.isNullOrUndefined(listObject))
            return listObject;
        else
            return Promise.reject(PrayerErrorMessages.BAD_INPUT);
    }
}
class PrayerProviderFactory {
    static createPrayerProviderFactory(prayerProviderName) {
        switch (prayerProviderName) {
            case PrayerProviderName.PRAYER_TIME:
                return new PrayerTimeProvider();
                break;
        }
    }
}
exports.PrayerProviderFactory = PrayerProviderFactory;
