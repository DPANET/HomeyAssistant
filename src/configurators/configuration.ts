const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import { isNullOrUndefined } from 'util';
import lowdb from "lowdb";
import { default as FileAsync } from "lowdb/adapters/FileASync";
import { DateUtil } from '../util/utility';
import _ = require('lodash');
import * as prayers from '../entities/prayer';
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
export interface IPrayersConfig {
    method: prayers.Methods;
    midnight: prayers.MidnightMode;
    school: prayers.Schools;
    latitudeAdjustment: prayers.LatitudeMethod;
    startDate: Date;
    endDate: Date;
    adjustments:prayers.IPrayerAdjustments[];
}
export interface ILocationConfig {
    location: {
        latitude?: number,
        longtitude?: number,
        city?: string,
        countryCode?: string,
        countryName?: string,
        address?: string
    };
    timezone: {
        timeZoneId?: string,
        timeZoneName?: string,
        dstOffset?: number,
        rawOffset?: number
    };
}
export interface IConfig {
    getPrayerConfig(): Promise<IPrayersConfig>;
    savePrayerConfig(prayerConfigs:IPrayersConfig): Promise<boolean>;
    getLocationConfig(): Promise<ILocationConfig>;
    saveLocationConfig(locationConfig: ILocationConfig): Promise<boolean>;
}

export  class Configurator implements IConfig {

    private _db: lowdb.LowdbAsync<any>;
    private readonly _fileName: string;
    constructor(fileName?:string) {
        if(!isNullOrUndefined(fileName))
        this._fileName = fileName;
        else
       this._fileName= 'config/config.json';
    }
    saveLocationConfig(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getLocationConfig(): Promise<ILocationConfig> {
        throw new Error("Method not implemented.");
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
            startDate: DateUtil.formatDate(result.startDate as string),
            endDate: DateUtil.formatDate(result.endDate as string),
            adjustments: result.adjustments
        };

    }
    private async  getDB(): Promise<lowdb.LowdbAsync<any>> {
        if (isNullOrUndefined(this._db))
            return this._db = await lowdb(new FileAsync(this._fileName));
        else
            return this._db;


    }


}