const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import config = require('config');
import { isNullOrUndefined } from 'util';
import { IPrayerAdjustments, IPrayerLatitude, IPrayerMethods, IPrayerSchools, IPrayersSettings, IPrayersTime, IPrayers } from '../entities/prayers';
import lowdb from "lowdb";
import { default as FileAsync } from "lowdb/adapters/FileASync";
import * as request from 'request-promise-native';
import * as mom from 'moment';
import moment = require('moment');
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
    schools:'apis.prayersAPI.schools',
    settings:'apis.prayersAPI.settings.calculations'


}
const PrayerErrorMessages =
{
    BAD_INPUT: 'Location input provided are not valid',
    LATITUDE_NOT_FOUND: 'Latitude record is not found, please try again',
    PRAYERMETHOD_NOT_FOUND: 'Prayer Method record is not found, please try again',
    SCHOOLS_NOT_FOUND: 'School Method record is not found, please try again',
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
    getPrayerTime(prayerSettings: IPrayersSettings,prayerLocation:ILocationEntity): Promise<Array<IPrayers>>;
}
abstract class PrayerProvider implements IPrayerProvider {
    private _providerName;
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
    abstract getPrayerTime(prayerSettings: IPrayersSettings,prayerLocation:ILocationEntity): Promise<Array<IPrayers>>;
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
        const result = (value, key) => {
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
        let err, prayerSchoolsList: Array<IPrayerSchools>, prayerSchool: IPrayerSchools;
        const filterById = ramda.where({ id: ramda.equals(index) });
        [err, prayerSchoolsList] = await to(this.getPrayerLatitude());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        prayerSchool = ramda.filter<IPrayerSchools>(filterById, prayerSchoolsList).pop();
        if (!isNullOrUndefined(prayerSchool))
            return prayerSchool;
        else
            return Promise.reject(PrayerErrorMessages.SCHOOLS_NOT_FOUND);

    }
    public async getPrayerSettings(): Promise<IPrayersSettings> {
       let err, result:IPrayersSettings;
        [err,result]=  await to(this.getDB().then(result => result.get(prayerTimePaths.settings).value()));
        if(err || isNullOrUndefined(result))
        return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        return {
            method: result.method,
            midnight:result.midnight,
            school:result.school,
            latitudeAdjustment:result.latitudeAdjustment,
            startDate:result.startDate,
            endDate:result.endDate,
            adjustments:result.adjustments
        };
    }
    public async getPrayerTime(prayerSettings: IPrayersSettings,prayerLocation:ILocationEntity): Promise<IPrayers[]> {
       let duration:number = this.getMonthsDifference(prayerSettings.startDate,prayerSettings.endDate);
       let err, result: any, url: any,queryString:any;
       [err, url] = await to(this.getPrayerTimeUrl());
       if (err)
           return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        queryString = this.buildPrayerAPIQueryString(url,prayerSettings,prayerLocation);

       [err, result] = await to(request.get(queryString));
       if (err)
           return Promise.reject(PrayerErrorMessages.TIME_OUT);
        this.buildPrayersObject(result['data']);
      // return this.parsePrayerMethods(result['data']);
       return;
    }
   public buildPrayersObject(result: any): Array<IPrayers> {

    }

    private async getPrayerTimeUrl(): Promise<any> {
        return await this.getDB().then(result => result.get(prayerTimePaths.prayerTimeUrl).value());
    }
    private getMonthsDifference(startDate:Date,endDate:Date):number
    {
        let startMoment:mom.Moment = moment(startDate).startOf('M');
        let endMoment:mom.Moment = moment(endDate).startOf('M');
        return   endMoment.diff(startMoment,'M',false)+1;
    
    }
    private buildPrayerAPIQueryString(url:string,prayerSettings: IPrayersSettings,prayerLocation:ILocationEntity) : any
    {
        let queryString: any =
        {
            uri: url,
            qs :{
                uri:url,
                latitude:prayerLocation.latitude,
                longitude: prayerLocation.longtitude,
                month: moment(prayerSettings.startDate).month(),
                year : moment(prayerSettings.startDate).year(),
                method: prayerSettings.method,
                school: prayerSettings.school,
                midnightMode:prayerSettings.midnight,
                timezonestring: prayerLocation.timeZoneId,
                latitudeAdjustmentMethod: prayerSettings.latitudeAdjustment

            },
            method: 'GET',
            json: true,
            resolveWithFullResponse: false

        };

        return queryString;
    }


}