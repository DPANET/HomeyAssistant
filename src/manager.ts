const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import * as location from './location';
import prayerEntity = require('./prayers');
export enum BuilderType {
    LocationBuilder = "Location Builder",
    APPLE = "Apple",
    PRAYERTIME = "Prayer Time"

}
class PrayerManager 
{
    
}

class PrayerManagerFactory
{
    public static async createPrayerManagerFactory(location?: location.ILocation): Promise<PrayerManager> {
    
        let locationEntity: Location;
        return;
    
    }

}

