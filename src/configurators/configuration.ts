import config from "nconf";
const to = require('await-to-js').default;
import { isNullOrUndefined } from '../util/isNullOrUndefined';
import lowdb from "lowdb";
import lowdbfile from "lowdb/adapters/FileAsync";
import { DateUtil } from '../util/utility';
//import _ = require('lodash');
import ramda from 'ramda';
//import * as prayers from '../entities/prayer';
import { IPrayersConfig, ILocationConfig, IConfigProvider, IConfig } from "./inteface.configuration";
//import mongoose, { mongo, Schema, SchemaType } from 'mongoose';
//import * as cfgSchema from "../cache/schema.configuration";
import path from "path";
import { types } from "util";
import { type } from "os";
const configPaths =
{

    prayerConfig: 'config.prayerConfig.calculations',
    locationConfig: 'config.locationConfig'
}
const ConfigErrorMessages =
{
    BAD_INPUT: 'Prayer setting recond is not found, please try again',
    TIME_OUT: 'Connection cannot be made to data provider, please try again after a while',
    FILE_NOT_FOUND: 'Config file not found, please try again',
    SAVE_FAILED: 'Confile file saving failed'
}
export enum ConfigProviderName {
    SERVER = "Server",
    CLIENT = "Client",
    HOMEY ="Homey",
    CUSTOM= "Customer"
}
export abstract class ConfigProvider implements IConfigProvider {

    private _providerName: ConfigProviderName;
    constructor(providerName: ConfigProviderName) {
        this._providerName = providerName;
    }
    abstract  createDefaultConfig(id?:any): Promise<IConfig>;
    abstract  getPrayerConfig(id?:any): Promise<IPrayersConfig>;
    abstract  updatePrayerConfig(prayerConfigs: IPrayersConfig,id?:any): Promise<boolean>;
    abstract  getLocationConfig(id?:any): Promise<ILocationConfig>;
    abstract  updateLocationConfig(locationConfig: ILocationConfig,id?:any): Promise<boolean>;
    abstract getConfig(id?:any): Promise<IConfig>;

    protected mergePrayerConfig(original: IPrayersConfig, target: IPrayersConfig): IPrayersConfig {
        let originalIndexBy:any = ramda.indexBy<any>(ramda.prop('prayerName'));
        let updated: any;
        let updateIndexBy:any = ramda.indexBy<any>(ramda.prop('prayerName'));
        let concatPrayers = (k: any, l: any, r: any) => l.prayerName == r.prayerName ? r : l
        let concatValues = (k: any, l: any, r: any) => k === "adjustments" ? (ramda.values(ramda.mergeDeepWithKey(concatPrayers, originalIndexBy(l), updateIndexBy(r)))) : r
        let mergedList: any = ramda.mergeDeepWithKey(concatValues, original, target)
        updated = ramda.omit(['startDate', 'endDate', '$init'], mergedList);

        return updated;
    }
    protected mergeLocationConfig(original: ILocationConfig, target: ILocationConfig): ILocationConfig {
        let updated: ILocationConfig;
        updated = ramda.merge<ILocationConfig, ILocationConfig>(original, target);
        return updated

    }
}

export class ClientConfigurator extends ConfigProvider {

    private _db: lowdb.LowdbAsync<any>;
    private readonly _fileName: string;
     constructor(fileName?: string) {
        super(ConfigProviderName.CLIENT);
        if (!isNullOrUndefined(fileName))
            this._fileName = fileName;
        else
            this._fileName = path.join(config.get("CONFIG_FOLDER_PATH"), config.get("PRAYER_CONFIG"));
           // console.log(this._fileName)
    }
    public async createDefaultConfig(id?: any): Promise<IConfig> {
        throw new Error("Method not implemented.");
    }
    public async updateLocationConfig(locationConfig: ILocationConfig, id?: any): Promise<boolean> {
        try {
            let original: ILocationConfig = await this.getLocationConfig(id);
            let updated: ILocationConfig;
            updated = super.mergeLocationConfig(original, locationConfig);
            let result = await this.getDB()
                .then(async (result) => {
                    let action: any = await result.get(configPaths.locationConfig)
                    return await action.assign(updated)
                        .write()
                }
                );
            if (isNullOrUndefined(result))
                return Promise.reject(ConfigErrorMessages.SAVE_FAILED);
            if (result)
                return Promise.resolve(true);
        } catch (err) {
            return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
        }
    }
    public async getLocationConfig(id?: any): Promise<ILocationConfig> {
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
    public async updatePrayerConfig(prayerConfigs: IPrayersConfig, id?:any): Promise<boolean> {
        try {
            let err: Error, result: any;
            let original: IPrayersConfig = await this.getPrayerConfig(id);
            let updated: IPrayersConfig = super.mergePrayerConfig(original, prayerConfigs);
            //updated= _.merge<any,any>(ramda.omit(['startDate','endDate'],original),ramda.omit(['startDate','endDate'],prayerConfigs));
            //  console.log(updated);
            result = await this.getDB()
                .then(async (result) => {
                    let action: any = result.get(configPaths.prayerConfig)
                    return await action.assign(updated)
                        .write()
                });

            if (isNullOrUndefined(result))
                return Promise.reject(ConfigErrorMessages.SAVE_FAILED);
            if (result)
                return Promise.resolve(true);

            //.then((value)=>console.log(`save success: ${value}`))
            //.catch((err)=> Promise.reject(err));

        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async getPrayerConfig(id?: any): Promise<IPrayersConfig> {

        let err: Error, result: any;
        [err, result] = await to(this.getDB().then(result => result.get(configPaths.prayerConfig).value()));
        if (err || isNullOrUndefined(result))
            return Promise.reject(new Error(ConfigErrorMessages.BAD_INPUT));
        return {
            method: result.method,
            midnight: result.midnight,
            school: result.school,
            latitudeAdjustment: result.latitudeAdjustment,
            adjustmentMethod: result.adjustmentMethod,
            startDate: isNullOrUndefined(result.startDate) ? DateUtil.getNowDate() : DateUtil.formatDate(result.startDate as string),
            endDate: isNullOrUndefined(result.endDate) ? DateUtil.addMonth(1, DateUtil.getNowDate()) : DateUtil.formatDate(result.endDate as string),
            adjustments: result.adjustments,

        };
    }
    private async  getDB(): Promise<lowdb.LowdbAsync<any>> {
        if (isNullOrUndefined(this._db))
            return this._db = await lowdb(new lowdbfile(this._fileName));
        else
            return this._db;
    }
    public async getConfig(id?: IConfig): Promise<IConfig> {
        return  {    
            prayerConfig: await this.getPrayerConfig(),
            locationConfig: await this.getLocationConfig()
        };
    }
}
// class ServerConfigurator extends ConfigProvider {

//     private _configModel: mongoose.Model<cfgSchema.IConfigSchemaModel>;
//     constructor() {
//         super(ConfigProviderName.SERVER);
//         this._configModel = cfgSchema.configModel;
//     }
//     private convertToConfig(record:cfgSchema.IConfigSchemaModel):IConfig
//     {
//         return ({
//             id:record.id,
//             profileID: record.profileID
//         })
//     }
//     public async createDefaultConfig(id: Schema.Types.ObjectId): Promise<IConfig> {
//         try {
//             let newConfigRecord: cfgSchema.IConfigSchemaModel;
//             let result: cfgSchema.IConfigSchemaModel = await this._configModel
//                 .findOne(null, null, { lean: true });
//             if (isNullOrUndefined(result))
//                 return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
//             delete result._id
//             let newConfigModel: mongoose.Model<cfgSchema.IConfigSchemaModel> = cfgSchema.configModel;
//             newConfigRecord = new newConfigModel(result);
//             newConfigRecord.profileID = id;
//             newConfigRecord = await newConfigRecord.save();
//             return Promise.resolve(newConfigRecord);
//         } catch (err) {
//             return Promise.reject(err);
//         }

//     }
//     public async getPrayerConfig(config?: IConfig): Promise<IPrayersConfig> {
//         try {
//             let result: cfgSchema.IConfigSchemaModel = await this._configModel
//                 .findOne({ profileID: config.profileID }, null, { lean: true });
//             if (isNullOrUndefined(result))
//                 return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
//             return Promise.resolve(result.config.prayerConfig.calculations);
//         }
//         catch (err) {
//             return Promise.reject(err);
//         }
//     }
//     public async updatePrayerConfig(prayerConfigs: IPrayersConfig, config: IConfig): Promise<boolean> {
//         let err: Error, result: any;
//         try {
//             let original: IPrayersConfig = await this.getPrayerConfig(config);

//             let updated: IPrayersConfig = super.mergePrayerConfig(original, prayerConfigs);
//             await this._configModel.updateOne({ profileID: config.profileID }, { $set: { "config.prayerConfig.calculations": updated } });
//             return Promise.resolve(true);
//         }
//         catch (err) {
//             return Promise.reject(err);
//         }

//     }
//     public async getLocationConfig(config?: IConfig): Promise<ILocationConfig> {
//         try {
//             let result: cfgSchema.IConfigSchemaModel = await this._configModel
//                 .findOne({ profileID: config.profileID }, null, { lean: true });
//             if (isNullOrUndefined(result))
//                 return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
//             return Promise.resolve(result.config.locationConfig);
//         }
//         catch (err) {
//             return Promise.reject(err);
//         }
//     }

//     public async updateLocationConfig(locationConfig: ILocationConfig, config: IConfig): Promise<boolean> {
//         try {
//             let original: ILocationConfig = await this.getLocationConfig(config);
//             let updated: ILocationConfig;
//             updated = super.mergeLocationConfig(original, locationConfig);
//             await this._configModel.updateOne({ profileID: config.profileID }, { $set: { "config.locationConfig": updated } });
//             return Promise.resolve(true);
//         }
//         catch (err) {
//             return Promise.reject(err);
//         }
//     }

//     public async getConfigId(config?: IConfig): Promise<IConfig> {
//         try{
//         let result: cfgSchema.IConfigSchemaModel = await this._configModel
//             .findOne({ profileID: config.profileID }, null, { lean: true });
//         if (isNullOrUndefined(result))
//             return Promise.reject(new Error(ConfigErrorMessages.FILE_NOT_FOUND));
//             return Promise.resolve({
//                 id:result.id,
//                 profileID:result.profileID
//             });
//         }
//         catch(err)
//         {
//             return Promise.reject(err);
//         }

//     }

// }
export class ConfigProviderFactory {
    static createConfigProviderFactory<T extends ConfigProvider = ClientConfigurator,K=any>(providerType:new(configs?:K)=>T,configs?:K):T {
        //let providerFactoryDefault: new (providerName:string) => T
        //let providerFactoryConfig: new (providerName:string,config:K)=>T;
        //let configName: ConfigProviderName;
      //  providerName = isNullOrUndefined(providerName) ? ConfigProviderName.CLIENT : providerName;
        // switch (configName) {
        //     case ConfigProviderName.CLIENT:
        //         return new ClientConfigurator();
        //         break;
            // case ConfigProviderName.SERVER:
            //     return new ServerConfigurator();
            //     break
            //let provider:T;
 
            //let typenName: any =typeof  providerType
            //console.log(typenName);
            if(isNullOrUndefined(config))
            return new providerType();
            else
            return new providerType(configs );

        }
    }


