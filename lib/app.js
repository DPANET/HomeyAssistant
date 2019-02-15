"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug("app:startup");
const prayer = require("./entities/prayer");
const cg = require("./configurators/configuration");
const manager = __importStar(require("./managers/manager"));
const utility_1 = require("./util/utility");
let prayers = [{ prayerName: 'Fajr', prayerTime: "2019-01-31T05:46:00.000Z" },
    { prayerName: 'Sunrise', prayerTime: "2019-01-31T07:02:00.000Z" },
    { prayerName: 'Isha', prayerTime: "2019-01-31T19:27:00.000Z" },
    { prayerName: 'Dhuhr', prayerTime: "2019-01-31T12:38:00.000Z" },
    { prayerName: 'Asr', prayerTime: "2019-01-31T15:47:00.000Z" },
    { prayerName: 'Sunset', prayerTime: "2019-01-31T18:07:00.000Z" },
    { prayerName: 'Maghrib', prayerTime: "2019-01-31T18:09:00.000Z" },
    { prayerName: 'Imsak', prayerTime: "2019-01-31T05:34:00.000Z" },
    { prayerName: 'Midnight', prayerTime: "2019-01-31T00:36:00.000Z" }];
buildLocationObject().catch((err) => console.log(err));
async function buildLocationObject() {
    try {
        let prayerConfig = await new cg.Configurator().getPrayerConfig();
        let prayerManager = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(null, prayerConfig)
            .setPrayerMethod(prayer.Methods.Mecca)
            .setLocationByCoordinates(24.4942437, 54.4068603)
            .createPrayerTimeManager();
        console.log(prayerManager.getUpcomingPrayer());
        console.log(utility_1.DateUtil.getDateByTimeZone(new Date(), 'Asia/Dubai'));
        //     console.log(prayerManager.getPrayersByDate(DateUtil.getNowDate()));
        //    console.log(prayerManager.getPrayersByDate(new Date()));
        // console.log(prayerManager.getPrayerEndPeriond());
        // let prayerEventManager: event.PrayersEventProvider = new event.PrayersEventProvider(prayerManager);
        // prayerEventManager.registerListener(new event.PrayersEventListener());
        // prayerEventManager.startPrayerSchedule();
        // console.log(DateUtil.addMonth(1, prayerManager.getPrayerEndPeriond()));
        // prayerManager = await prayerManager.updatePrayersDate(new Date('2019-03-01'), new Date('2019-03-31'));
        // //setTimeout(()=>{  prayerEventManager.stopPrayerSchedule();console.log('stop')},60000);
    }
    catch (err) {
        console.log(err);
    }
}
