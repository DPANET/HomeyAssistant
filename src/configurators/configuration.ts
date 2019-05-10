import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import { isNullOrUndefined } from 'util';
import lowdb from "lowdb";
import lowdbfile from "lowdb/adapters/FileAsync";
import { DateUtil } from '../util/utility';
import _ = require('lodash');
//import * as prayers from '../entities/prayer';
import {IPrayersConfig,ILocationConfig,IConfig} from "./inteface.configuration";
import * as path from 'path';
const configPaths =
{
    
    prayerConfig: 'config.prayerConfig.calculations',
    locationConfig: 'config.locationConfig'
}
const ConfigErrorMessages =
{
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    TIME_OUT: 'Connection cannot be made to prayer provider, please try again after a while',
    FILE_NOT_FOUND: 'Connection cannot be made to prayer provider, try ensure internet connectivity'
}

export default class Configurator implements IConfig {

    private _db: lowdb.LowdbAsync<any>;
    private readonly _fileName: string;
    constructor(fileName?:string) {
        if(!isNullOrUndefined(fileName))
        this._fileName = fileName;
        else
       this._fileName= 'config/config.json';
    }
    public async saveLocationConfig(locationConfig: ILocationConfig): Promise<boolean> {
        try {
            let original: ILocationConfig = await this.getLocationConfig();
            let updated:ILocationConfig;
            updated= _.merge<ILocationConfig,ILocationConfig>(original,locationConfig);
            console.log(updated);
            await this.getDB()
            .then(result=> result.get(configPaths.locationConfig)
            .assign(updated)
            .write()
            );
            return true;
        } catch (err) {
            return false;
        }
    }
    public async getLocationConfig(): Promise<ILocationConfig> {
        let err: Error, result: any;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.locationConfig).value()));
        if (err || isNullOrUndefined(result))
            return Promise.reject(ConfigErrorMessages.BAD_INPUT);
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
            let original: IPrayersConfig = await this.getPrayerConfig();
            let updated:IPrayersConfig;
            updated= _.merge<IPrayersConfig,IPrayersConfig>(original,prayerConfigs);
            console.log(updated);
            await this.getDB()
            .then(result=> result.get(configPaths.prayerConfig)
            .assign(updated)
            .write()
            );
            return true;
        } catch (err) {
            return false;
        }
    }

    public async getPrayerConfig(): Promise<IPrayersConfig> {

        let err: Error, result: any;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.prayerConfig).value()));
        if (err || isNullOrUndefined(result))
            return Promise.reject(ConfigErrorMessages.BAD_INPUT);
        return {
            method: result.method,
            midnight: result.midnight,
            school: result.school,
            latitudeAdjustment: result.latitudeAdjustment,
            startDate:isNullOrUndefined(result.startDate) ? DateUtil.getNowDate() : DateUtil.formatDate(result.startDate as string),
            endDate: isNullOrUndefined(result.endDate) ?  DateUtil.addMonth(1, DateUtil.getNowDate()): DateUtil.formatDate(result.endDate as string),
            adjustments: result.adjustments
        };
    }
    private async  getDB(): Promise<lowdb.LowdbAsync<any>> {
        if (isNullOrUndefined(this._db))
            return this._db = await lowdb(new lowdbfile(this._fileName));
        else
            return this._db;


    }


}