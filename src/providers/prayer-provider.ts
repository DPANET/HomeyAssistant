const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import { isNullOrUndefined } from 'util';
import { IPrayerAdjustments, IPrayerLatitude, IPrayerMethods, IPrayerSchools, IPrayersSettings, IPrayersTime, IPrayers } from '../entities/prayers';

export enum PrayerProviderName {
    PRAYER_TIME = "Prayer Time",
    APPLE = "Apple"

}
const LocationErrorMessages =
{
    BAD_INPUT: 'Location input provided are not valid',
    NOT_FOUND: 'Location provided cannot be found, try again with different input',
    BAD_RESULT: 'Location provided results have caused unexpected error, please try different input',
    TIME_OUT: 'Connection cannot be made to location provider, please try again after a while'
}
export interface IPrayerProvider
{
    getProviderName(): PrayerProviderName;
    getPrayerLatitude(): Promise<IPrayerAdjustments>;
    getPrayerLatitudeById(id:number): Promise<Array<IPrayerLatitude>>;
    getPrayerMethods():Promise<Array<IPrayerMethods>>;
    getPrayerMethodsById(id:number):Promise<IPrayerMethods>;
    getPrayerSchools():Promise<Array<IPrayerSchools>>;
    getPrayerSchoolsById(id:number):Promise<IPrayerSchools>;
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
    abstract getPrayerLatitude(): Promise<IPrayerAdjustments>;
    abstract getPrayerLatitudeById(id: number): Promise<IPrayerLatitude[]>;
    abstract getPrayerMethods(): Promise<IPrayerMethods[]> ;
    abstract getPrayerMethodsById(id:number):Promise<IPrayerMethods>;
    abstract getPrayerSchools():Promise<Array<IPrayerSchools>>;
    abstract getPrayerSchoolsById(id:number):Promise<IPrayerSchools>;
    abstract getPrayerSettings(): Promise<IPrayersSettings>;
    abstract getPrayerTime(prayerSettings:IPrayersSettings):Promise<Array<IPrayers>>;
}

class PrayerTimeProvider extends PrayerProvider
{
    constructor() {
        super(PrayerProviderName.PRAYER_TIME);

    }
    getPrayerLatitude(): Promise<IPrayerAdjustments> {
        throw new Error("Method not implemented.");
    }   
    getPrayerLatitudeById(id: number): Promise<IPrayerLatitude[]> {
        throw new Error("Method not implemented.");
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