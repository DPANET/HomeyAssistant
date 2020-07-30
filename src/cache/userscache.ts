import { isNullOrUndefined } from '../util/isNullOrUndefined';
import mongoose from 'mongoose';
import * as cfgSchema from "./schema.userscache";
import { IPrayersTimeCache} from "../configurators/interface.userscache";
import {IConfig} from "../configurators/inteface.configuration";
import {IPrayersTime, PrayersTime} from "../entities/prayer";
import {
    serialize,
    deserialize
} from 'serializr';
const ConfigErrorMessages =
{
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    TIME_OUT: 'Connection cannot be made to data provider, please try again after a while',
    FILE_NOT_FOUND: 'Config file not found, please try again',
    SAVE_FAILED: 'Confile file saving failed'
}
export class PrayerTimeCache implements IPrayersTimeCache
{

    private _userCacheModel: mongoose.Model<cfgSchema.IPrayerTimeSchemaModel>;
    constructor()
    {
        this._userCacheModel = cfgSchema.prayerTimeModel;

    }
    public async createPrayerTimeCache(config: IConfig, prayersTime: IPrayersTime): Promise<boolean> {
        try {
            let newPrayerTimeCache: cfgSchema.IPrayerTimeSchemaModel;

            let newPrayerTimeModel: mongoose.Model<cfgSchema.IPrayerTimeSchemaModel> = cfgSchema.prayerTimeModel;
            newPrayerTimeCache  = new newPrayerTimeModel();
            newPrayerTimeCache.profileID = config.profileID;
            newPrayerTimeCache.prayersTime = serialize(PrayersTime,prayersTime);
          //  newPrayerTimeCache.expireAt = new Date(Date.now() + (10*1000));
            newPrayerTimeCache = await newPrayerTimeCache.save();
            return Promise.resolve(true);
        } catch (err) {
            return Promise.reject(err);
        }
    }    
    public async getPrayerTimeCache(config: IConfig): Promise<IPrayersTime> {
        try {
            let result: cfgSchema.IPrayerTimeSchemaModel = await this._userCacheModel
                .findOne({ profileID: config.profileID }, null, { lean: true });
            if (isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            return Promise.resolve(result.prayersTime);
        }
        catch (err) {
            return Promise.reject(err);
        }   
     }
    public async updatePrayerTimeCache(config: IConfig, prayerTime:IPrayersTime): Promise<boolean> {
        try {
            let result: cfgSchema.IPrayerTimeSchemaModel = await this._userCacheModel
                .findOneAndUpdate({ profileID: config.profileID },{prayersTime:serialize(prayerTime)});
            if (isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }      
    }
    public async deletePrayerTimeCache(config: IConfig): Promise<boolean> {
        try {
            let result: cfgSchema.IPrayerTimeSchemaModel = await this._userCacheModel
                .findOneAndDelete({ profileID: config.profileID });
            if (isNullOrUndefined(result))
                return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }     
    }

    
}
