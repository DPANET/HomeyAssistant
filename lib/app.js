"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manager = __importStar(require("./managers/manager"));
const ramda_1 = __importDefault(require("ramda"));
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
function getPrayerView(prayers) {
    let prayersView;
    console.log(ramda_1.default.pick(['prayersDate']));
    return;
}
async function buildLocationObject() {
    try {
        // let prayerConfig: cg.IPrayersConfig = await new cg.Configurator().getPrayerConfig();
        // let locationConfig: cg.ILocationConfig = await new cg.Configurator().getLocationConfig();
        // console.log(locationConfig);
        // let prayerManager: manager.IPrayerManager = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(locationConfig, prayerConfig)
        //     .createPrayerTimeManager();
        // console.log(prayerManager.getPrayerAdjustmentsByPrayer(prayer.PrayersName.FAJR));
        let prayerManager = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(null, null)
            .setLocationByAddress("Abu Dhabi", "AE")
            .createPrayerTimeManager();
        // console.log(prayerManager.getPrayerLocation());
        // console.log(prayerManager.getPrayerAdjustmentsByPrayer(prayer.PrayersName.FAJR));
        // console.log((prayerManager.getPrayerSettings()as prayer.PrayersSettings).toJSON());
        // console.log(prayerManager.getPrayerSettings());
        let prayerView = new Array();
        let prayerViewObject;
        let prayerTimings = new Array();
        // const func = (val:prayer.IPrayersTiming)=>{ }
        //console.log(ramda.project(['prayersDate','prayerTime'],prayerManager.getPrayers()));
        prayerManager.getPrayers().forEach((curr, index, arr) => {
            curr.prayerTime.forEach((prayerTiming, i) => {
                prayerTimings.push(prayerTiming.prayerTime);
            });
            prayerView.push({
                prayerDate: curr.prayersDate,
                fajr: prayerTimings[0],
                sunrise: prayerTimings[1],
                dhuhr: prayerTimings[2],
                asr: prayerTimings[3],
                sunset: prayerTimings[4],
                maghrib: prayerTimings[5],
                isha: prayerTimings[6],
                midnight: prayerTimings[7]
            });
        });
        // console.log(prayerView);
        //   console.log(DateUtil.getDateByTimeZone(new Date(),'Asia/Dubai'));
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
