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
import { removeAllListeners } from 'cluster';
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
    adjustment: 'settings.adjustments',
    calculations: 'settings.calcuations',


}
const PrayerErrorMessages =
{
    BAD_INPUT: 'Location input provided are not valid',
    LATITUDE_NOT_FOUND: 'Latitude record is not found, please try again',
    BAD_RESULT: 'Location provided results have caused unexpected error, please try different input',
    TIME_OUT: 'Connection cannot be made to prayer provider, please try again after a while',
    FILE_NOT_FOUND: 'Connection cannot be made to prayer provider, try to reinstall the app'
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
    getPrayerTime(prayerSettings: IPrayersSettings): Promise<Array<IPrayers>>;
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
    abstract getPrayerTime(prayerSettings: IPrayersSettings): Promise<Array<IPrayers>>;
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
    private  parsePrayerMethods(prayerMethodsJson:any) : Array<IPrayerMethods>
    {
        const result = n=> console.log(n);
        //console.log(ramda.flatten(prayerMethodsJson));
        ramda.forEach(result,prayerMethodsJson);
        console.log(prayerMethodsJson);
        return;

    }
    public async getPrayerMethods(): Promise<IPrayerMethods[]> {
        let err, result:any, url: any;
        [err, url] = await to(this.getPrayerMethodUrl());
        if (err)
            return Promise.reject(PrayerErrorMessages.FILE_NOT_FOUND);
        let queryString:any = 
            {
                uri:url.methods,
                method: 'GET',
                json: true,
                resolveWithFullResponse: false

            };
        [err, result] = await to(request.get(queryString));
        if (err)
        return Promise.reject(PrayerErrorMessages.TIME_OUT);
        return this.parsePrayerMethods(result['data']);
    }
    getPrayerMethodsById(id: number): Promise<IPrayerMethods> {
        throw new Error("Method not implemented.");
    }
    getPrayerSchools(): Promise<IPrayerSchools[]> {
        throw new Error("Method not implemented.");
    }
    getPrayerSchoolsById(id: number): Promise<IPrayerSchools> {
        throw new Error("Method not implemented.");
    }
    getPrayerSettings(): Promise<IPrayersSettings> {
        throw new Error("Method not implemented.");
    }
    getPrayerTime(prayerSettings: IPrayersSettings): Promise<IPrayers[]> {
        throw new Error("Method not implemented.");
    }


}