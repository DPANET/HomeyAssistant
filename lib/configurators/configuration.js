"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const util_1 = require("util");
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const utility_1 = require("../util/utility");
const _ = require("lodash");
const configPaths = {
    prayerConfig: 'config.prayerConfig.calculations',
    locationConfig: 'config.locationConfig'
};
const ConfigErrorMessages = {
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    TIME_OUT: 'Connection cannot be made to prayer provider, please try again after a while',
    FILE_NOT_FOUND: 'Connection cannot be made to prayer provider, try ensure internet connectivity'
};
class Configurator {
    constructor(fileName) {
        if (!util_1.isNullOrUndefined(fileName))
            this._fileName = fileName;
        else
            this._fileName = 'config/config.json';
    }
    saveLocationConfig() {
        throw new Error("Method not implemented.");
    }
    getLocationConfig() {
        throw new Error("Method not implemented.");
    }
    async savePrayerConfig(prayerConfigs) {
        try {
            let original = await this.getPrayerConfig();
            let updated;
            updated = _.merge(original, prayerConfigs);
            console.log(updated);
            await this.getDB()
                .then(result => result.get(configPaths.prayerConfig)
                .assign(updated)
                .write());
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async getPrayerConfig() {
        let err, result;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.prayerConfig).value()));
        if (err || util_1.isNullOrUndefined(result))
            return Promise.reject(ConfigErrorMessages.BAD_INPUT);
        return {
            method: result.method,
            midnight: result.midnight,
            school: result.school,
            latitudeAdjustment: result.latitudeAdjustment,
            startDate: util_1.isNullOrUndefined(result.startDate) ? utility_1.DateUtil.getNowDate() : utility_1.DateUtil.formatDate(result.startDate),
            endDate: util_1.isNullOrUndefined(result.endDate) ? utility_1.DateUtil.addMonth(1, utility_1.DateUtil.getNowDate()) : utility_1.DateUtil.formatDate(result.endDate),
            adjustments: result.adjustments
        };
    }
    async getDB() {
        if (util_1.isNullOrUndefined(this._db))
            return this._db = await lowdb_1.default(new FileAsync_1.default(this._fileName));
        else
            return this._db;
    }
}
exports.Configurator = Configurator;
