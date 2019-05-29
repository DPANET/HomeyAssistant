"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const util_1 = require("util");
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const utility_1 = require("../util/utility");
const _ = require("lodash");
const ramda = require("ramda");
const configPaths = {
    prayerConfig: 'config.prayerConfig.calculations',
    locationConfig: 'config.locationConfig'
};
const ConfigErrorMessages = {
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    TIME_OUT: 'Connection cannot be made to prayer provider, please try again after a while',
    FILE_NOT_FOUND: 'Config file not found, please try again'
};
class Configurator {
    constructor(fileName) {
        if (!util_1.isNullOrUndefined(fileName))
            this._fileName = fileName;
        else
            this._fileName = 'config/config.json';
    }
    async saveLocationConfig(locationConfig) {
        try {
            let original = await this.getLocationConfig();
            let updated;
            updated = _.merge(original, locationConfig);
            console.log(updated);
            await this.getDB()
                .then(result => result.get(configPaths.locationConfig)
                .assign(updated)
                .write());
            return true;
        }
        catch (err) {
            return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
        }
    }
    async getLocationConfig() {
        let err, result;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.locationConfig).value()));
        if (err || util_1.isNullOrUndefined(result))
            return Promise.reject(new Error(ConfigErrorMessages.BAD_INPUT));
        return {
            location: {
                latitude: result.location.latitude,
                longtitude: result.location.longtitude,
                city: result.location.city,
                countryCode: result.location.countryCode,
                countryName: result.location.countryName,
                address: result.location.address
            },
            timezone: {
                timeZoneId: result.timezone.timeZoneId,
                timeZoneName: result.timezone.timeZoneName,
                dstOffset: result.timezone.dstOffset,
                rawOffset: result.timezone.rawOffset
            }
        };
    }
    async savePrayerConfig(prayerConfigs) {
        try {
            let original = await this.getPrayerConfig();
            let updated;
            let originalIndexBy = ramda.indexBy(ramda.prop('prayerName'));
            let updateIndexBy = ramda.indexBy(ramda.prop('prayerName'));
            let concatPrayers = (k, l, r) => l.prayerName == r.prayerName ? r : l;
            let concatValues = (k, l, r) => k === "adjustments" ? (ramda.values(ramda.mergeDeepWithKey(concatPrayers, originalIndexBy(l), updateIndexBy(r)))) : r;
            let mergedList = ramda.mergeDeepWithKey(concatValues, original, prayerConfigs);
            updated = ramda.omit(['startDate', 'endDate'], mergedList);
            //updated= _.merge<any,any>(ramda.omit(['startDate','endDate'],original),ramda.omit(['startDate','endDate'],prayerConfigs));
            console.log(updated);
            await this.getDB()
                .then(result => result.get(configPaths.prayerConfig)
                .assign(updated)
                .write());
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async getPrayerConfig() {
        let err, result;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.prayerConfig).value()));
        if (err || util_1.isNullOrUndefined(result))
            return Promise.reject(new Error(ConfigErrorMessages.BAD_INPUT));
        return {
            method: result.method,
            midnight: result.midnight,
            school: result.school,
            latitudeAdjustment: result.latitudeAdjustment,
            adjustmentMethod: result.adjustmentMethod,
            startDate: util_1.isNullOrUndefined(result.startDate) ? utility_1.DateUtil.getNowDate() : utility_1.DateUtil.formatDate(result.startDate),
            endDate: util_1.isNullOrUndefined(result.endDate) ? utility_1.DateUtil.addMonth(1, utility_1.DateUtil.getNowDate()) : utility_1.DateUtil.formatDate(result.endDate),
            adjustments: result.adjustments,
        };
    }
    async getDB() {
        if (util_1.isNullOrUndefined(this._db))
            return this._db = await lowdb_1.default(new FileAsync_1.default(this._fileName));
        else
            return this._db;
    }
}
exports.default = Configurator;
//# sourceMappingURL=configuration.js.map