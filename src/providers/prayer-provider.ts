const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import config = require('config');
import { isNullOrUndefined } from 'util';
import { IPrayerAdjustments, IPrayerLatitude, IPrayerMethods, IPrayerSchools, IPrayersSettings, IPrayersTime, IPrayers, IPrayersTiming, PrayersName, IPrayerMidnight } from '../entities/prayers';
import lowdb from "lowdb";
import { default as FileAsync } from "lowdb/adapters/FileASync";
import * as request from 'request-promise-native';
import {DateUtil} from '../util/utility';
import { start } from 'repl';
import { ILocationEntity } from '../entities/location';
export enum PrayerProviderName {
    PRAYER_TIME = "Prayer Time",
    APPLE = "Apple"

}
const prayerTimePaths =
{
    latitude: 'apis.prayersAPI.latitude',
    methods: 'api.prayersAPI.methods',
    apiurl: 'apis.urls',
    methodsUrl: 'apis.prayersAPI.urls.prayerMethodsUrl',
    prayerTimeUrl: 'apis.prayersAPI.urls.prayersByCoordinatesUrl.monthly',
    adjustment: 'settings.adjustments',
    calculations: 'settings.calcuations',
    schools: 'apis.prayersAPI.schools',
    settings: 'apis.prayersAPI.settings.calculations',
    midnight: 'apis.prayersAPI.schools'


}
const PrayerErrorMessages =
{
    BAD_INPUT: 'Location input provided are not valid',
    LATITUDE_NOT_FOUND: 'Latitude record is not found, please try again',
    PRAYERMETHOD_NOT_FOUND: 'Prayer Method record is not found, please try again',
    SCHOOLS_NOT_FOUND: 'School Method record is not found, please try again',
    MIDNIGHT_NOT_FOUND: 'Midnight Calculations record is not found, please try again',
    TIME_OUT: 'Connection cannot be made to prayer provider, please try again after a while',
    FILE_NOT_FOUND: 'Connection cannot be made to prayer provider, try ensure internet connectivity'
}
export interface IPrayerProvider {
    getProviderName(): PrayerProviderName;
    getPrayerLatitude(): Promise<Array<IPrayerLatitude>>;
    getPrayerLatitudeById(index: number): Promise<IPrayerLatitude>;
    getPrayerMethods(): Promise<Array<IPrayerMethods>>;
    getPrayerMethodsById(index: number): Promise<IPrayerMethods>;
    getPrayerSchools(): Promise<Array<IPrayerSchools>>;
    getPrayerSchoolsById(index: number): Promise<IPrayerSchools>;
    getPrayerSettings(): Promise<IPrayersSettings>;
    getPrayerMidnight():Promise<Array<IPrayerMidnight>>;
    getPrayerMidnightById(index:number):Promise<IPrayerMidnight>;
    savePrayerSettings(prayerSettings:IPrayersSettings):Promise<boolean>;
    getPrayerTime(prayerSettings: IPrayersSettings, prayerLocation: ILocationEntity): Promise<Array<IPrayers>>;
}
abstract class PrayerProvider implements IPrayerProvider {
    private _providerName: PrayerProviderName;
    constructor(providerName: PrayerProviderName) {
        this._providerName = providerName;
    }

    getProviderName(): PrayerProviderName {
        return this._providerName;
    }
    abstract getPrayerLatitude(): Promise<Array<IPrayerLatitude>>;
    abstract getPrayerLatitudeById(index: number): Promise<IPrayerLatitude>;
    abstract getPrayerMethods(): Promise<IPrayerMethods[]>;
    abstract getPrayerMethodsById(index: number): Promise<IPrayerMethods>;
    abstract getPrayerSchools(): Promise<Array<IPrayerSchools>>;
    abstract getPrayerSchoolsById(index: number): Promise<IPrayerSchools>;
    abstract getPrayerSettings(): Promise<IPrayersSettings>;
    abstract savePrayerSettings(prayerSettings:IPrayersSettings):Promise<boolean>;
    abstract getPrayerMidnight():Promise<Array<IPrayerMidnight>>;
    abstract getPrayerMidnightById(index:number):Promise<IPrayerMidnight>;
    abstract getPrayerTime(prayerSettings: IPrayersSettings, prayerLocation: ILocationEntity): Promise<Array<IPrayers>>;
}

export class PrayerTimeProvider extends PrayerProvider {

    private _prayerLatitude: IPrayerLatitude;
    private _prayerMethod: IPrayerMethods;
    private _prayerSchools: IPrayerSchools;
    private _prayerSettings: IPrayersSettings;
    private _prayerTime: IPrayersTime;
    private _prayers: IPrayers;
    private _db: lowdb.LowdbAsync<any>;
    private readonly fileName: string
    constructor() {
        super(PrayerProviderName.PRAYER_TIME);
        this.fileName = 'src/configurators/prayers.json';
    }
    private async  getDB(): Promise<lowdb.LowdbAsync<any>> {
        if (isNullOrUndefined(this._db))
            return this._db = await lowdb(new FileAsync(this.fileName));
        else
            return this._db;


    }
    async getPrayerLatitude(): Promise<Array<IPrayerLatitude>> {

        return await this.getDB().then(result => result.get(prayerTimePaths.latitude).value());
    }
    async getPrayerLatitudeById(index: number): Promise<IPrayerLatitude> {
        let err, prayerLatitudeList: Array<IPrayerLatitude>, prayerLatitude: IPrayerLatitude;
        const filterById = ramda.where({ id: ramda.equals(index) });
        [err, prayerLatitudeList] = await to(this.getPrayerLatitude());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        prayerLatitude = ramda.filter<IPrayerLatitude>(filterById, prayerLatitudeList).pop();
        if (!isNullOrUndefined(prayerLatitude))
            return prayerLatitude;
        else
            return Promise.reject(PrayerErrorMessages.LATITUDE_NOT_FOUND);

    }
    private async getPrayerMethodUrl(): Promise<any> {
        return await this.getDB().then(result => result.get(prayerTimePaths.methodsUrl).value());
    }
    private parsePrayerMethods(prayerMethodsJson: object): Array<IPrayerMethods> {

        let collection: Array<IPrayerMethods> = new Array<IPrayerMethods>();
        const result = (value:any, key:string) => {
            if (!isNullOrUndefined(value.name)) {
                collection.push({
                    id: value.id,
                    methodName: value.name
                });
            }
        }

        ramda.forEachObjIndexed(result, prayerMethodsJson);
        return collection;

    }
    public async getPrayerMethods(): Promise<IPrayerMethods[]> {
        let err, result: any, url: any;
        [err, url] = await to(this.getPrayerMethodUrl());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        let queryString: any =
        {
            uri: url.methods,
            method: 'GET',
            json: true,
            resolveWithFullResponse: false

        };
        [err, result] = await to(request.get(queryString));
        if (err)
            return Promise.reject(PrayerErrorMessages.TIME_OUT);
        return this.parsePrayerMethods(result['data']);
    }
    public async getPrayerMethodsById(index: number): Promise<IPrayerMethods> {
        let err, prayerMethodsList: Array<IPrayerMethods>, prayerMethod: IPrayerMethods;
        const filterById = ramda.where({ id: ramda.equals(index) });
        [err, prayerMethodsList] = await to(this.getPrayerMethods());
        if (err)
            return Promise.reject(PrayerErrorMessages.TIME_OUT);
        prayerMethod = ramda.filter<IPrayerMethods>(filterById, prayerMethodsList).pop();
        if (!isNullOrUndefined(prayerMethod))
            return prayerMethod;
        else
            return Promise.reject(PrayerErrorMessages.PRAYERMETHOD_NOT_FOUND);
    }
    public async getPrayerSchools(): Promise<IPrayerSchools[]> {
        return await this.getDB().then(result => result.get(prayerTimePaths.schools).value());
    }
    public async getPrayerSchoolsById(index: number): Promise<IPrayerSchools> {
        let err:Error, prayerSchoolsList: Array<IPrayerSchools>, prayerSchool: IPrayerSchools;
        const filterById = ramda.where({ id: ramda.equals(index) });
        [err, prayerSchoolsList] = await to(this.getPrayerSchools());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        prayerSchool = ramda.filter<IPrayerSchools>(filterById, prayerSchoolsList).pop();
        if (!isNullOrUndefined(prayerSchool))
            return prayerSchool;
        else
            return Promise.reject(PrayerErrorMessages.SCHOOLS_NOT_FOUND);

    }
    
    public async getPrayerSettings(): Promise<IPrayersSettings> {
        
        let err:Error, result: any;
        [err, result] = await to(this.getDB().then(result => result.get(prayerTimePaths.settings).value()));
        if (err || isNullOrUndefined(result))
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
           
        return {
            method: await this.getPrayerMethodsById(result.method as number),
            midnight: await this.getPrayerMidnightById(result.method as number),
            school: await this.getPrayerSchoolsById(result.school as number),
            latitudeAdjustment: await this.getPrayerLatitudeById(result.latitudeAdjustment as number),
            startDate: DateUtil.formatDate(result.startDate as string),
            endDate: DateUtil.formatDate(result.endDate as string),
            adjustments:result.adjustments
        };

    }
    public async savePrayerSettings(prayerSettings:IPrayersSettings):Promise<boolean>
    {
        let err:Error, result:IPrayersSettings;
        let db :lowdb.LowdbAsync<any>;
        db = await this.getDB();
        [err]= await to(db.get(prayerTimePaths.calculations).remove().write());
        if(err)
        {
        Promise.reject(err);
        return false;
        }
        else
        return true;
    }
    public async getPrayerTime(prayerSettings: IPrayersSettings, prayerLocation: ILocationEntity): Promise<IPrayers[]> {
        let duration: number = DateUtil.getMonthsDifference(prayerSettings.startDate, prayerSettings.endDate);
        let err:Error, result: any, url: any, queryString: any;
        let date:Date = prayerSettings.startDate;
        let prayersList:Array<IPrayers> = new Array<IPrayers>();

        for( let i:number = 0; i <= duration;i++)
        {
        [err, url] = await to(this.getPrayerTimeUrl());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        queryString = this.buildPrayerAPIQueryString(url, prayerSettings, prayerLocation,date);
    
        date= DateUtil.addMonth(1,date);

        [err, result] = await to(request.get(queryString));
        if (err)
            return Promise.reject(PrayerErrorMessages.TIME_OUT);

        prayersList= ramda.concat(prayersList,this.buildPrayersObject(result['data']));//.concat(this.buildPrayersObject(result['data']));

        }
        
        return prayersList.filter(n=> ( n.prayersDate>= prayerSettings.startDate && n.prayersDate<= prayerSettings.endDate));;
    }
    private buildPrayersObject(result: any): Array<IPrayers> {

        let prayersTimingList: Array<IPrayersTiming> = new Array<IPrayersTiming>();
        let prayersList: Array<IPrayers> = new Array<IPrayers>();
        let  i:number =0;
        let fnPrayer = (value:any, key:string) => {

            prayersTimingList.push({
                prayerName: key as PrayersName,
                prayerTime: (value as string).substring(0, 5)
            });
        };
        let fn = (n:any) => {
            prayersTimingList = [];
            ramda.forEachObjIndexed(fnPrayer, n.timings);
            prayersList.push({
                prayerTime: prayersTimingList,
                prayersDate: DateUtil.formatDate(n.date.readable)
            });
        }
        ramda.forEach(fn, result);
        return prayersList;
    }

    private async getPrayerTimeUrl(): Promise<any> {
        return await this.getDB().then(result => result.get(prayerTimePaths.prayerTimeUrl).value());
    }

    private buildPrayerAPIQueryString(url: string, prayerSettings: IPrayersSettings, prayerLocation: ILocationEntity,date:Date): any {
        let queryString: any =
        {
            uri: url,
            qs: {
                uri: url,
                latitude: prayerLocation.latitude,
                longitude: prayerLocation.longtitude,
                month: DateUtil.getMonth(date),
                year: DateUtil.getYear(date),
                method: prayerSettings.method.id,
                school: prayerSettings.school.id,
                midnightMode: prayerSettings.midnight.id,
                timezonestring: prayerLocation.timeZoneId,
                latitudeAdjustmentMethod:prayerSettings.latitudeAdjustment.id,
                tune: prayerSettings.adjustments.map(n=> n.adjustments).toString()
                
            },
            method: 'GET',
            json: true,
            resolveWithFullResponse: false

        };

        return queryString;
    }
    public async getPrayerMidnight(): Promise<Array<IPrayerMidnight>>
    {
        return await this.getDB().then(result => result.get(prayerTimePaths.midnight).value());

    }
    public async getPrayerMidnightById(index:number) : Promise<IPrayerMidnight>
    {
        let err:Error, prayerMidnightList: Array<IPrayerMidnight>, prayerMidnight: IPrayerMidnight;
        const filterById = ramda.where({ id: ramda.equals(index) });
        [err, prayerMidnightList] = await to(this.getPrayerMidnight());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        prayerMidnight = ramda.filter<IPrayerMidnight>(filterById, prayerMidnightList).pop();
        if (!isNullOrUndefined(prayerMidnight))
            return prayerMidnight;
        else
            return Promise.reject(PrayerErrorMessages.MIDNIGHT_NOT_FOUND);

    }

}