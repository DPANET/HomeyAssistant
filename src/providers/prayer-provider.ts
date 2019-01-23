const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import config = require('config');
import { isNullOrUndefined, promisify } from 'util';
import { IPrayerAdjustments , IPrayerLatitude, IPrayerMethods, IPrayerSchools, IPrayersSettings, IPrayersTime, IPrayers } from '../entities/prayers';

export enum PrayerProviderName {
    PRAYER_TIME = "Prayer Time",
    APPLE = "Apple"

}
const prayerTimePaths = 
{
    latitude: 'apis.prayersAPI.latitude',
    apiurl: 'apis.urls',
    adjustment: 'settings.adjustments',
    calculations: 'settings.calcuations',


}
const LocationErrorMessages =
{
    BAD_INPUT: 'Location input provided are not valid',
    LATITUDE_NOT_FOUND: 'Latitude record is not found, please try again',
    BAD_RESULT: 'Location provided results have caused unexpected error, please try different input',
    TIME_OUT: 'Connection cannot be made to location provider, please try again after a while'
}
export interface IPrayerProvider
{
    getProviderName(): PrayerProviderName;
    getPrayerLatitude(): Promise<Array<IPrayerLatitude>>;
    getPrayerLatitudeById(index:number): Promise<IPrayerLatitude>;
    getPrayerMethods():Promise<Array<IPrayerMethods>>;
    getPrayerMethodsById(index:number):Promise<IPrayerMethods>;
    getPrayerSchools():Promise<Array<IPrayerSchools>>;
    getPrayerSchoolsById(index:number):Promise<IPrayerSchools>;
    getPrayerSettings(): Promise<IPrayersSettings>;
    getPrayerTime(prayerSettings:IPrayersSettings):Promise<Array<IPrayers>>;
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
    abstract getPrayerLatitudeById(index:number): Promise<IPrayerLatitude>;
    abstract getPrayerMethods(): Promise<IPrayerMethods[]> ;
    abstract getPrayerMethodsById(index:number):Promise<IPrayerMethods>;
    abstract getPrayerSchools():Promise<Array<IPrayerSchools>>;
    abstract getPrayerSchoolsById(index:number):Promise<IPrayerSchools>;
    abstract getPrayerSettings(): Promise<IPrayersSettings>;
    abstract getPrayerTime(prayerSettings:IPrayersSettings):Promise<Array<IPrayers>>;
}

export class PrayerTimeProvider extends PrayerProvider
{
    private _prayerLatitude:IPrayerLatitude;
    private _prayerMethod:IPrayerMethods;
    private _prayerSchools:IPrayerSchools;
    private _prayerSettings:IPrayersSettings;
    private _prayerTime:IPrayersTime;
    private _prayers:IPrayers;

    constructor() {
        super(PrayerProviderName.PRAYER_TIME);
    }
   async getPrayerLatitude(): Promise<Array<IPrayerLatitude>> {
       return await config.get<Array<IPrayerLatitude>>(prayerTimePaths.latitude);
    }   
   async getPrayerLatitudeById(index:number): Promise<IPrayerLatitude>
    { let err, prayerLatitudeList:Array<IPrayerLatitude>, prayerLatitude: IPrayerLatitude;
        let filterById = ramda.where({id: ramda.equals(index)});
        [err,prayerLatitudeList] = await to(this.getPrayerLatitude());
        if(err)
        return Promise.reject(err);
        prayerLatitude=ramda.filter<IPrayerLatitude>(filterById,prayerLatitudeList).pop();
        if(!isNullOrUndefined(prayerLatitude))
        return prayerLatitude;
        else
        return Promise.reject(LocationErrorMessages.LATITUDE_NOT_FOUND);
              
    }
    getPrayerMethods(): Promise<IPrayerMethods[]> {
        throw new Error("Method not implemented.");
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