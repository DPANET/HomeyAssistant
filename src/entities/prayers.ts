

//const app = express();
const dotenv = require('dotenv');
dotenv.config();
import settings = require('../configurators/settings');
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import {ILocation, ILocationEntity} from './location';
import { number } from 'joi';

export enum PrayersName {
    FAJR= "Fajr",
    SUNRISE= "Sunrise",
    DHUHR= "Dhuhr",
    ASR= "Asr",
    MAGHRIB= "Maghrib",
    SUNSET= "Sunset",
    ISHA= "Isha",
    MIDNIGHT= "Midnight"
};
export interface IPrayers {
    prayerName: PrayersName,
    time: string,
    prayersDate:Date
//    adjustment: number
}
export interface IPrayerAdjustments
{
    prayerName:PrayersName,
    adjustments:number
}
export interface IPrayerMidnight
{
    id:number,
    midnight:string
}
export interface IPrayerLatitude
{
    id:number,
    latitudeMethod:string
}
export interface IPrayersSettings
{
    adjustments : IPrayerAdjustments [],
    method: IPrayerMethods,
    school: IPrayerSchools,
    midnight:IPrayerMidnight,
    latitudeAdjustment:IPrayerLatitude
    
}
export interface IPrayerSchools
{
    id:number,
    school:string
}
export interface IPrayerMethods
{
    id:number,
    methodName: string

}
export interface IPrayersTime
{
    location: ILocationEntity,
    pareyerSettings: IPrayersSettings,
    prayers: Array<IPrayers>,
    startDate:Date,
    endDate:Date

}

export class PrayersTime implements IPrayersTime
{
    private _prayers: Array<IPrayers> ;
    private _prayersDate : Date;
    //prayer constructors, with timing,
    constructor(prayersDate: Date, prayers: Array<IPrayers>)
    {
        this._prayersDate = prayersDate;
        this._prayers = prayers;
       // this._prayersTimings = new Array();
    }

}
export class PrayersSettings implements IPrayersSettings
{
    private _adjustments: IPrayerAdjustments[];
    public get adjustments(): IPrayerAdjustments[] {
        return this._adjustments;
    }
    public set adjustments(value: IPrayerAdjustments[]) {
        this._adjustments = value;
    }
    private _method: IPrayerMethods;
    public get method(): IPrayerMethods {
        return this._method;
    }
    public set method(value: IPrayerMethods) {
        this._method = value;
    }
    private _school: IPrayerSchools;
    public get school(): IPrayerSchools {
        return this._school;
    }
    public set school(value: IPrayerSchools) {
        this._school = value;
    }
    private _midnight: IPrayerMidnight;
    public get midnight(): IPrayerMidnight {
        return this._midnight;
    }
    public set midnight(value: IPrayerMidnight) {
        this._midnight = value;
    }
    private _latitudeAdjustment: IPrayerLatitude;
    public get latitudeAdjustment(): IPrayerLatitude {
        return this._latitudeAdjustment;
    }
    public set latitudeAdjustment(value: IPrayerLatitude) {
        this._latitudeAdjustment = value;
    }
    private _prayersSettings: IPrayersSettings  ;
    constructor(prayersSettings?: IPrayersSettings)
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

