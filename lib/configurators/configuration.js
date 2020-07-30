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
const debug_1 = __importDefault(require("debug"));
const nconf_1 = __importDefault(require("nconf"));
const debug = debug_1.default("app:router");
const to = require('await-to-js').default;
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const utility_1 = require("../util/utility");
//import _ = require('lodash');
const ramda_1 = __importDefault(require("ramda"));
const cfgSchema = __importStar(require("../cache/schema.configuration"));
const path_1 = __importDefault(require("path"));
const configPaths = {
    prayerConfig: 'config.prayerConfig.calculations',
    locationConfig: 'config.locationConfig'
};
const ConfigErrorMessages = {
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    TIME_OUT: 'Connection cannot be made to data provider, please try again after a while',
    FILE_NOT_FOUND: 'Config file not found, please try again',
    SAVE_FAILED: 'Confile file saving failed'
};
var ConfigProviderName;
(function (ConfigProviderName) {
    ConfigProviderName["SERVER"] = "Server";
    ConfigProviderName["CLIENT"] = "Client";
})(ConfigProviderName = exports.ConfigProviderName || (exports.ConfigProviderName = {}));
class ConfigProvider {
    constructor(providerName) {
        this._providerName = providerName;
    }
    mergePrayerConfig(original, target) {
        let originalIndexBy = ramda_1.default.indexBy(ramda_1.default.prop('prayerName'));
        let updated;
        let updateIndexBy = ramda_1.default.indexBy(ramda_1.default.prop('prayerName'));
        let concatPrayers = (k, l, r) => l.prayerName == r.prayerName ? r : l;
        let concatValues = (k, l, r) => k === "adjustments" ? (ramda_1.default.values(ramda_1.default.mergeDeepWithKey(concatPrayers, originalIndexBy(l), updateIndexBy(r)))) : r;
        let mergedList = ramda_1.default.mergeDeepWithKey(concatValues, original, target);
        updated = ramda_1.default.omit(['startDate', 'endDate', '$init'], mergedList);
        return updated;
    }
    mergeLocationConfig(original, target) {
        let updated;
        updated = ramda_1.default.merge(original, target);
        return updated;
    }
}
class ClientConfigurator extends ConfigProvider {
    constructor(fileName) {
        super(ConfigProviderName.CLIENT);
        if (!isNullOrUndefined_1.isNullOrUndefined(fileName))
            this._fileName = fileName;
        else
            this._fileName = path_1.default.join(nconf_1.default.get("CONFIG_FOLDER_PATH"), nconf_1.default.get("PRAYER_CONFIG"));
    }
    async createDefaultConfig(profileID) {
        throw new Error("Method not implemented.");
    }
    async updateLocationConfig(locationConfig, config) {
        try {
            let original = await this.getLocationConfig(config);
            let updated;
            updated = super.mergeLocationConfig(original, locationConfig);
            let result = await this.getDB()
                .then(async (result) => {
                let action = await result.get(configPaths.locationConfig);
                return await action.assign(updated)
                    .write();
            });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(ConfigErrorMessages.SAVE_FAILED);
            if (result)
                return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
        }
    }
    async getLocationConfig(config) {
        let err, result;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.locationConfig).value()));
        if (err || isNullOrUndefined_1.isNullOrUndefined(result))
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
    async updatePrayerConfig(prayerConfigs, config) {
        try {
            let err, result;
            let original = await this.getPrayerConfig(config);
            let updated = super.mergePrayerConfig(original, prayerConfigs);
            //updated= _.merge<any,any>(ramda.omit(['startDate','endDate'],original),ramda.omit(['startDate','endDate'],prayerConfigs));
            //  console.log(updated);
            result = await this.getDB()
                .then(async (result) => {
                let action = result.get(configPaths.prayerConfig);
                return await action.assign(updated)
                    .write();
            });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(ConfigErrorMessages.SAVE_FAILED);
            if (result)
                return Promise.resolve(true);
            //.then((value)=>console.log(`save success: ${value}`))
            //.catch((err)=> Promise.reject(err));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async getPrayerConfig(config) {
        let err, result;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.prayerConfig).value()));
        if (err || isNullOrUndefined_1.isNullOrUndefined(result))
            return Promise.reject(new Error(ConfigErrorMessages.BAD_INPUT));
        return {
            method: result.method,
            midnight: result.midnight,
            school: result.school,
            latitudeAdjustment: result.latitudeAdjustment,
            adjustmentMethod: result.adjustmentMethod,
            startDate: isNullOrUndefined_1.isNullOrUndefined(result.startDate) ? utility_1.DateUtil.getNowDate() : utility_1.DateUtil.formatDate(result.startDate),
            endDate: isNullOrUndefined_1.isNullOrUndefined(result.endDate) ? utility_1.DateUtil.addMonth(1, utility_1.DateUtil.getNowDate()) : utility_1.DateUtil.formatDate(result.endDate),
            adjustments: result.adjustments,
        };
    }
    async getDB() {
        if (isNullOrUndefined_1.isNullOrUndefined(this._db))
            return this._db = await lowdb_1.default(new FileAsync_1.default(this._fileName));
        else
            return this._db;
    }
    async getConfigId(config) {
        return { id: config.id,
            profileID: config.profileID };
    }
}
class ServerConfigurator extends ConfigProvider {
    constructor() {
        super(ConfigProviderName.SERVER);
        this._configModel = cfgSchema.configModel;
    }
    convertToConfig(record) {
        return ({
            id: record.id,
            profileID: record.profileID
        });
    }
    async createDefaultConfig(id) {
        try {
            let newConfigRecord;
            let result = await this._configModel
                .findOne(null, null, { lean: true });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            delete result._id;
            let newConfigModel = cfgSchema.configModel;
            newConfigRecord = new newConfigModel(result);
            newConfigRecord.profileID = id;
            newConfigRecord = await newConfigRecord.save();
            return Promise.resolve(newConfigRecord);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async getPrayerConfig(config) {
        try {
            let result = await this._configModel
                .findOne({ profileID: config.profileID }, null, { lean: true });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            return Promise.resolve(result.config.prayerConfig.calculations);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async updatePrayerConfig(prayerConfigs, config) {
        let err, result;
        try {
            let original = await this.getPrayerConfig(config);
            let updated = super.mergePrayerConfig(original, prayerConfigs);
            await this._configModel.updateOne({ profileID: config.profileID }, { $set: { "config.prayerConfig.calculations": updated } });
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async getLocationConfig(config) {
        try {
            let result = await this._configModel
                .findOne({ profileID: config.profileID }, null, { lean: true });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            return Promise.resolve(result.config.locationConfig);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async updateLocationConfig(locationConfig, config) {
        try {
            let original = await this.getLocationConfig(config);
            let updated;
            updated = super.mergeLocationConfig(original, locationConfig);
            await this._configModel.updateOne({ profileID: config.profileID }, { $set: { "config.locationConfig": updated } });
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async getConfigId(config) {
        try {
            let result = await this._configModel
                .findOne({ profileID: config.profileID }, null, { lean: true });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            return Promise.resolve({
                id: result.id,
                profileID: result.profileID
            });
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
class ConfigProviderFactory {
    static createConfigProviderFactory(configProviderName) {
        let configName;
        configName = isNullOrUndefined_1.isNullOrUndefined(configProviderName) ? nconf_1.default.get("SOURCE") : configProviderName;
        switch (configName) {
            case ConfigProviderName.CLIENT:
                return new ClientConfigurator();
                break;
            case ConfigProviderName.SERVER:
                return new ServerConfigurator();
                break;
        }
    }
}
exports.ConfigProviderFactory = ConfigProviderFactory;
//# sourceMappingURL=configuration.js.map