

//const app = express();
const dotenv = require('dotenv');
dotenv.config();
import settings = require('./settings');
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import {ILocation} from './location';
import { number } from 'joi';


export interface IPrayerTime {
    prayerName: string;
    time: string;
//    adjustment: number
}
export interface IPrayersSettings
{
    adjustments : {payerName:string, adjustment:number} [];
    method: number;
    school: number;
    midnight:number;
    latitudeAdjustmentMethod:string;
    
}

export const Prayers = {
    FAJR: "Fajr",
    SUNRISE: "Sunrise",
    DHUHR: "Dhuhr",
    ASR: "Asr",
    MAGHRIB: "Maghrib",
    SUNSET: "Sunset",
    ISHA: "Isha",
    MIDNIGHT: "Midnight"
};
export class PrayersTime
{
    private _prayers: Array<IPrayerTime> ;
    private _prayersDate : Date;
    //prayer constructors, with timing,
    constructor(prayersDate: Date, prayers: Array<IPrayerTime>)
    {
        this._prayersDate = prayersDate;
        this._prayers = prayers;
       // this._prayersTimings = new Array();
    }

}
export class PrayersSettings
{
    private _prayersSettings: IPrayersSettings  ;
    constructor(prayersSettings: IPrayersSettings)
    {
        this._prayersSettings=  prayersSettings;
    }


}

export class PrayersTimeFactory
{

    public static async createPrayersTimeFactory(location?: ILocation, prayerSettings?:IPrayersSettings): Promise<Array<PrayersTime>> 
    {
   
         return;
    }
    public static async createPrayersSettingFactory (prayerSettings?: IPrayersSettings): Promise<PrayersSettings>
    {
        //ifPrayersSettings are not passed, read it from config
return;
    }

}

