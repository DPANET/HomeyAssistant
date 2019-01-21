const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import * as location from './location';
import * as provider from './location-provider';
import * as validator from './validator';
import prayerEntity = require('./prayers');

export type BuilderTypes = location.ILocationBuilder;
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


