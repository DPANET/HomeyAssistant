import Debug = require('debug');
import config from "config";
const debug = Debug("app:router");
const to = require('await-to-js').default;
import { isNullOrUndefined } from '../util/isNullOrUndefined';
import lowdb from "lowdb";
import lowdbfile from "lowdb/adapters/FileAsync";
import { DateUtil } from '../util/utility';
//import _ = require('lodash');
import ramda= require('ramda'); 
//import * as prayers from '../entities/prayer';
import {IPrayersConfig,ILocationConfig,IConfig} from "./inteface.configuration";
import path from "path";
const configPaths =
{
    
    prayerConfig: 'config.prayerConfig.calculations',
    locationConfig: 'config.locationConfig'
}
const ConfigErrorMessages =
{
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    TIME_OUT: 'Connection cannot be made to prayer provider, please try again after a while',
    FILE_NOT_FOUND: 'Config file not found, please try again',
    SAVE_FAILED: 'Confile file saving failed'
}

export  class Configurator implements IConfig {

    private _db: lowdb.LowdbAsync<any>;
    private readonly _fileName: string;
    constructor(fileName?:string) {
        if(!isNullOrUndefined(fileName))
        this._fileName = fileName;
        else
       this._fileName= path.join(config.get("CONFIG_FOLDER_PATH"),config.get("PRAYER_CONFIG"));
    }
    public async saveLocationConfig(locationConfig: ILocationConfig): Promise<boolean> {
        try {
            let original: ILocationConfig = await this.getLocationConfig();
            let updated:ILocationConfig;
            updated= ramda.merge<ILocationConfig,ILocationConfig>(original,locationConfig);
            console.log(updated);
            await this.getDB()
            .then(result=> result.get(configPaths.locationConfig)
            .assign(updated)
            .write()
            );
            return true;
        } catch (err) {
            return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
        }
    }
    public async getLocationConfig(): Promise<ILocationConfig> {
        let err: Error, result: any;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.locationConfig).value()));
        if (err || isNullOrUndefined(result))
            return Promise.reject(new Error(ConfigErrorMessages.BAD_INPUT));
        return {
            location:
            {
            latitude: result.location.latitude,
            longtitude: result.location.longtitude,
            city: result.location.city,
            countryCode: result.location.countryCode,
            countryName:result.location.countryName,
            address: result.location.address
            },
            timezone:{
                timeZoneId:result.timezone.timeZoneId,
                timeZoneName: result.timezone.timeZoneName,
                dstOffset: result.timezone.dstOffset,
                rawOffset: result.timezone.rawOffset
            }

        };    
    }
    public async savePrayerConfig(prayerConfigs: IPrayersConfig): Promise<boolean> {
        try {
            let err:Error,result:any;
            let original: IPrayersConfig = await this.getPrayerConfig();
            let updated:any;
            let originalIndexBy = ramda.indexBy(ramda.prop('prayerName'));
            let updateIndexBy = ramda.indexBy(ramda.prop('prayerName'))
            let concatPrayers = (k:any,l:any,r:any)=> l.prayerName ==r.prayerName ? r:l
            let concatValues= (k:any,l:any,r:any)=> k==="adjustments" ? (ramda.values(ramda.mergeDeepWithKey(concatPrayers,originalIndexBy(l),updateIndexBy(r)))) : r
            let mergedList:any =ramda.mergeDeepWithKey(concatValues,original,prayerConfigs)
            updated = ramda.omit(['startDate','endDate'],mergedList);
            //updated= _.merge<any,any>(ramda.omit(['startDate','endDate'],original),ramda.omit(['startDate','endDate'],prayerConfigs));
          //  console.log(updated);
             result =await this.getDB()
            .then(async (result)=>{return await result.get(configPaths.prayerConfig)
            .assign(updated)
            .write()
            });

            if(isNullOrUndefined(result))
            return Promise.reject(ConfigErrorMessages.SAVE_FAILED);
            if(result)
            return Promise.resolve(true);

            //.then((value)=>console.log(`save success: ${value}`))
            //.catch((err)=> Promise.reject(err));
            
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async getPrayerConfig(): Promise<IPrayersConfig> {

        let err: Error, result: any;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.prayerConfig).value()));
        if (err || isNullOrUndefined(result))
            return Promise.reject(new Error(ConfigErrorMessages.BAD_INPUT));
        return {
            method: result.method,
            midnight: result.midnight,
            school: result.school,
            latitudeAdjustment: result.latitudeAdjustment,
            adjustmentMethod:result.adjustmentMethod,
            startDate:isNullOrUndefined(result.startDate) ? DateUtil.getNowDate() : DateUtil.formatDate(result.startDate as string),
            endDate: isNullOrUndefined(result.endDate) ?  DateUtil.addMonth(1, DateUtil.getNowDate()): DateUtil.formatDate(result.endDate as string),
            adjustments: result.adjustments,
            
        };
    }
    private async  getDB(): Promise<lowdb.LowdbAsync<any>> {
        if (isNullOrUndefined(this._db))
            return this._db = await lowdb(new lowdbfile(this._fileName));
        else
            return this._db;


    }


}