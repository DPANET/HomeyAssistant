import dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
import prayer = require("./entities/prayer");
import cg = require("./configurators/configuration");
import * as manager from './managers/manager';
import util = require('util')
import * as cron from 'cron';
import {DateUtil} from './util/utility';
buildLocationObject().catch((err) => console.log(err));
async function buildLocationObject() {
    try {
        let prayerConfig: cg.IPrayersConfig = await new cg.default().getPrayerConfig();
        let prayerTime: prayer.IPrayersTime = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(null, prayerConfig)
            .setPrayerMethod(prayer.Methods.Mecca)
            .setPrayerPeriod(new Date('2019-12-01'), new Date('2019-12-28'))
            .setLocationAddress('reem island marina square', 'AE')
            .createPrayerTime();
        console.log(util.inspect(prayerTime, false, null, true /* enable colors */));       // console.log(prayerSettings);   
    }
    catch (err) {
        console.log(err);
    }
}