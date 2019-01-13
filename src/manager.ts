const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import {ILocation,Location,LocationFactory} from './location';
import prayerEntity = require('./prayers');

class PrayerManager 
{
    
}

class PrayerManagerFactory
{
    public static async createPrayerManagerFactory(location?: ILocation): Promise<PrayerManager> {
    
        let locationEntity: Location;
    
        let err;
        //get Location
        [err,locationEntity] = to(await LocationFactory.createLocationFactory(location));
        return;
    
    }

}