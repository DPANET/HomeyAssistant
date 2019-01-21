const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import { isNullOrUndefined } from 'util';

export enum PrayerProviderName {
    PRAYER_TIME = "Prayer Time",
    APPLE = "Apple",
    PRAYERTIME = "Prayer Time"

}
const LocationErrorMessages =
{
    BAD_INPUT: 'Location input provided are not valid',
    NOT_FOUND: 'Location provided cannot be found, try again with different input',
    BAD_RESULT: 'Location provided results have caused unexpected error, please try different input',
    TIME_OUT: 'Connection cannot be made to location provider, please try again after a while'
}
// export interface IPrayersProvider {
//     getProviderName(): LocationProviderName
//     getLocationByCoordinates(lng: number, lat: number): Promise<ILocation>
//     getTimeZoneByCoordinates(lng: number, lat: number): Promise<ITimeZone>
//     getLocationByAddress(address: string, countryCode?: string): Promise<ILocation>

// }