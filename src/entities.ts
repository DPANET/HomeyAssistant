
//const config = require('config');
//const app = express();
//const debug = require('debug')('app:startup');
export interface PrayerTiming {
    prayerName: string;
    time: number;
    adjustment: number
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
    
    //prayer constructors, with timing, with timing & adjustments,
    PrayersTime()
    {
        
    }
 
}

