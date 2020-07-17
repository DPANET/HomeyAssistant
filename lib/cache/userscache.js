"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrayerTimeCache = void 0;
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
const cfgSchema = __importStar(require("./schema.userscache"));
const prayer_1 = require("../entities/prayer");
const serializr_1 = require("serializr");
const ConfigErrorMessages = {
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    TIME_OUT: 'Connection cannot be made to data provider, please try again after a while',
    FILE_NOT_FOUND: 'Config file not found, please try again',
    SAVE_FAILED: 'Confile file saving failed'
};
class PrayerTimeCache {
    constructor() {
        this._userCacheModel = cfgSchema.prayerTimeModel;
    }
    async createPrayerTimeCache(config, prayersTime) {
        try {
            let newPrayerTimeCache;
            let newPrayerTimeModel = cfgSchema.prayerTimeModel;
            newPrayerTimeCache = new newPrayerTimeModel();
            newPrayerTimeCache.deviceID = config.deviceID;
            newPrayerTimeCache.prayersTime = serializr_1.serialize(prayer_1.PrayersTime, prayersTime);
            //  newPrayerTimeCache.expireAt = new Date(Date.now() + (10*1000));
            newPrayerTimeCache = await newPrayerTimeCache.save();
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async getPrayerTimeCache(config) {
        try {
            let result = await this._userCacheModel
                .findOne({ deviceID: config.deviceID }, null, { lean: true });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            return Promise.resolve(result.prayersTime);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async updatePrayerTimeCache(config, prayerTime) {
        try {
            let result = await this._userCacheModel
                .findOneAndUpdate({ deviceID: config.deviceID }, { prayersTime: serializr_1.serialize(prayerTime) });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async deletePrayerTimeCache(config) {
        try {
            let result = await this._userCacheModel
                .findOneAndDelete({ deviceID: config.deviceID });
            if (isNullOrUndefined_1.isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
exports.PrayerTimeCache = PrayerTimeCache;
//# sourceMappingURL=userscache.js.map