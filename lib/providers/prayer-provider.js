"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrayerProviderFactory = exports.PrayerProviderName = void 0;
const to = require('await-to-js').default;
const ramda_1 = __importDefault(require("ramda"));
const Rx = __importStar(require("rxjs"));
const RxAjax = __importStar(require("rxjs/ajax"));
const RxOp = __importStar(require("rxjs/operators"));
const qs = __importStar(require("querystring"));
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
const prayer_1 = require("../entities/prayer");
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const utility_1 = require("../util/utility");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
    adjustmentMethod: 'apis.prayersAPI.adjustmentMethod',
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
    FILE_NOT_FOUND: 'Prayer settings file is not, please try to recreate or resintall package',
    PROVIDER_NOT_AVAILABLE: 'Connection cannot be made to prayer provider, try ensure internet connectivity'
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
        try {
            super(PrayerProviderName.PRAYER_TIME);
            this.fileName = require.resolve('../configurators/prayers.json'); ////''/configurators/prayers.json';
        }
        catch (err) {
            throw new Error(PrayerErrorMessages.FILE_NOT_FOUND);
        }
    }
    async getPrayerAdjustmentMethod() {
        return await this.getDB().then(result => result.get(prayerTimePaths.adjustmentMethod).value());
    }
    async getPrayerAdjustmentMethodById(index) {
        return await this.getObjectById(index, () => this.getPrayerAdjustmentMethod());
    }
    async getDB() {
        try {
            if ((0, isNullOrUndefined_1.isNullOrUndefined)(this._db))
                return this._db = await (0, lowdb_1.default)(new FileAsync_1.default(this.fileName));
            else
                return this._db;
        }
        catch (err) {
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        }
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
            if (!(0, isNullOrUndefined_1.isNullOrUndefined)(value.name)) {
                collection.push({
                    id: value.id,
                    methodName: value.name
                });
            }
        };
        ramda_1.default.forEachObjIndexed(result, prayerMethodsJson);
        return collection;
    }
    async getPrayerMethods() {
        let err, result, url;
        [err, url] = await to(this.getPrayerMethodUrl());
        if (err)
            return Promise.reject(new Error(PrayerErrorMessages.PROVIDER_NOT_AVAILABLE));
        let queryString = {
            url: url.methods,
            method: 'GET',
            responseType: "json",
            async: true,
            createXHR: () => new XMLHttpRequest()
        };
        [err, result] = await to(RxAjax.ajax(queryString).pipe(RxOp.map((result) => result.response.data)).toPromise());
        if (err)
            return Promise.reject(err.message = PrayerErrorMessages.TIME_OUT);
        return this.parsePrayerMethods(result);
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
        let err, result, url, queryString = new Array();
        let date = prayerSettings.startDate;
        let prayersList = new Array();
        [err, url] = await to(this.getPrayerTimeUrl());
        if (err)
            return Promise.reject(new Error(PrayerErrorMessages.PROVIDER_NOT_AVAILABLE));
        prayersList = await this.queryPrayerProvider(duration, queryString, url, prayerSettings, prayerLocation, date, prayersList);
        prayersList = prayersList.filter(n => (n.prayersDate >= prayerSettings.startDate && n.prayersDate <= prayerSettings.endDate));
        //console.log(util.inspect(prayersList, {showHidden: false, depth: null}));
        return prayersList;
    }
    async queryPrayerProvider(duration, queriesString, url, prayerSettings, prayerLocation, date, prayersList) {
        let err, result;
        try {
            for (let i = 0; i <= duration; i++) {
                queriesString.push(this.buildPrayerAPIQueryString(url, prayerSettings, prayerLocation, date));
                date = utility_1.DateUtil.addMonth(1, date);
            }
            let request = Rx.from(queriesString).pipe(RxOp.mergeMap((query) => RxAjax.ajax(query).pipe(RxOp.map((result) => result.response.data))), RxOp.reduce((all, _) => [...all, ..._], []));
            prayersList = await request.toPromise();
            prayersList = this.buildPrayersObject(prayersList, prayerLocation);
            let sorter = ramda_1.default.sortWith([
                ramda_1.default.ascend(ramda_1.default.prop('prayersDate'))
            ]);
            return Promise.resolve(sorter(prayersList));
        }
        catch (err) {
            return Promise.reject(PrayerErrorMessages.TIME_OUT);
        }
        // var fn =  queryString.map((value)=> request.get(value).promise());          
        // await Promise.all(fn)
        // .then((value:any[])=>
        //  value.forEach((result)=> prayersList = ramda.concat(prayersList, this.buildPrayersObject(result['data'],prayerLocation)))
        //  )
        // .catch((err)=> new Error(PrayerErrorMessages.TIME_OUT));
        //  [err, result] = await to(request.get(queryString));
        //      if (err|| isNullOrUndefined(result))
        //          return Promise.reject(new Error(PrayerErrorMessages.TIME_OUT));
        //.concat(this.buildPrayersObject(result['data']))       
    }
    buildPrayersObject(result, prayerLocation) {
        let prayersTimingList = new Array();
        let prayersList = new Array();
        let i = 0;
        let dateString;
        let timeZone;
        let fnPrayer = (value, key) => {
            prayersTimingList.push({
                prayerName: key,
                prayerTime: 
                //DateUtil.getTime(dateString,value)
                utility_1.DateUtil.getDateByTimeZoneFromString(dateString, value, timeZone)
            });
        };
        let fn = (n) => {
            prayersTimingList = [];
            dateString = n.date.readable;
            timeZone = n.meta.timezone;
            ramda_1.default.forEachObjIndexed(fnPrayer, n.timings);
            prayersList.push({
                prayerTime: prayersTimingList,
                prayersDate: utility_1.DateUtil.formatDate(n.date.readable)
            });
        };
        ramda_1.default.forEach(fn, result);
        return prayersList;
    }
    async getPrayerTimeUrl() {
        return await this.getDB().then(result => result.get(prayerTimePaths.prayerTimeUrl).value());
    }
    buildPrayerAPIQueryString(url, prayerSettings, prayerLocation, date) {
        let uri = `${url}/${utility_1.DateUtil.getYear(date)}/${utility_1.DateUtil.getMonth(date)}`;
        let param = qs.stringify({
            //uri: url,
            // uri: `${url}/${DateUtil.getYear(date)}/${DateUtil.getMonth(date)}`,
            headers: {
                'User-Agent': 'Homey-Assistant'
            },
            latitude: prayerLocation.latitude,
            longitude: prayerLocation.longtitude,
            //month: DateUtil.getMonth(date),
            //year: DateUtil.getYear(date),
            method: prayerSettings.method.id,
            school: prayerSettings.school.id,
            midnightMode: prayerSettings.midnight.id,
            timezonestring: prayerLocation.timeZoneId,
            latitudeAdjustmentMethod: prayerSettings.latitudeAdjustment.id,
            tune: this.getPrayersTune(prayerSettings)
        });
        let queryString = {
            url: `${uri}?${param}`,
            async: true,
            method: 'GET',
            responseType: "json",
            crossDomain: true,
            createXHR: () => new XMLHttpRequest()
        };
        return queryString;
    }
    getPrayersTune(prayerSettings) {
        let tune;
        switch (prayerSettings.adjustmentMethod.id) {
            case prayer_1.AdjsutmentMethod.Provider:
                tune = prayerSettings.adjustments.map(n => n.adjustments).toString();
                break;
            case prayer_1.AdjsutmentMethod.Server:
            case prayer_1.AdjsutmentMethod.Client:
                tune = "0,0,0,0,0,0,0,0,0";
                break;
        }
        return tune;
    }
    async getPrayerMidnight() {
        return await this.getDB().then(result => result.get(prayerTimePaths.midnight).value());
    }
    async getPrayerMidnightById(index) {
        return await this.getObjectById(index, () => this.getPrayerMidnight());
    }
    async getObjectById(index, fn) {
        let err, list, listObject;
        const filterById = ramda_1.default.where({ id: ramda_1.default.equals(index) });
        [err, list] = await to(fn());
        if (err || (0, isNullOrUndefined_1.isNullOrUndefined)(list))
            return Promise.reject(new Error(PrayerErrorMessages.BAD_INPUT));
        listObject = ramda_1.default.filter(filterById, list).pop();
        if (!(0, isNullOrUndefined_1.isNullOrUndefined)(listObject))
            return listObject;
        else
            return Promise.reject(new Error(PrayerErrorMessages.BAD_INPUT));
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
