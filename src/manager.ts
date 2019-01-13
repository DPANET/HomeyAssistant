const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import {ILocation,Location} from './location';
import prayerEntity = require('./prayers');

class PrayerManager 
{
    
}

class PrayerManagerFactory
{
    public static async createPrayerManagerFactory(location?: ILocation): Promise<PrayerManager> {
    
        let locationEntity: Location;
        return;
    
    }

}