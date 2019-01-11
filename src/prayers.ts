
//const config = require('config');
//const app = express();
const joi = require('joi');
import locationEntity = require('./location');

export interface IPrayerTime {
    prayerName: string;
    time: number;
//    adjustment: number
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
    //prayer constructors, with timing, with timing & adjustments,
    PrayersTime(prayersDate: Date)
    {
        this._prayersDate = prayersDate;
       // this._prayersTimings = new Array();
    }
    
}

