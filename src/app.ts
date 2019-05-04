
import prayer = require("./entities/prayer");
import cg = require("./configurators/configuration");
import * as manager from './managers/manager';
import ramda from "ramda";
let prayers: Array<object> =
    [{ prayerName: 'Fajr', prayerTime: "2019-01-31T05:46:00.000Z" },
    { prayerName: 'Sunrise', prayerTime: "2019-01-31T07:02:00.000Z" },
    { prayerName: 'Isha', prayerTime: "2019-01-31T19:27:00.000Z" },
    { prayerName: 'Dhuhr', prayerTime: "2019-01-31T12:38:00.000Z" },
    { prayerName: 'Asr', prayerTime: "2019-01-31T15:47:00.000Z" },
    { prayerName: 'Sunset', prayerTime: "2019-01-31T18:07:00.000Z" },
    { prayerName: 'Maghrib', prayerTime: "2019-01-31T18:09:00.000Z" },
    { prayerName: 'Imsak', prayerTime: "2019-01-31T05:34:00.000Z" },
    { prayerName: 'Midnight', prayerTime: "2019-01-31T00:36:00.000Z" }];
buildLocationObject().catch((err) => console.log(err));
interface IPrayersView
{
    prayerDate:Date,
    fajr:Date,
    sunrise:Date,
    dhuhr:Date,
    asr:Date,
    sunset:Date,
    maghrib:Date,
    isha:Date,
    midnight:Date
}
function getPrayerView(prayers:prayer.IPrayers []):IPrayersView[]
{
    let prayersView:IPrayersView;
    
    console.log(ramda.pick(['prayersDate']));
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
        let prayerManager: manager.IPrayerManager = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(null, null)
            .setLocationByAddress("Abu Dhabi","AE")
            .createPrayerTimeManager();
            // console.log(prayerManager.getPrayerLocation());
            // console.log(prayerManager.getPrayerAdjustmentsByPrayer(prayer.PrayersName.FAJR));

            // console.log((prayerManager.getPrayerSettings()as prayer.PrayersSettings).toJSON());
            // console.log(prayerManager.getPrayerSettings());
            let prayerView:Array<IPrayersView> = new Array<IPrayersView>();
            let prayerViewObject:IPrayersView;
            let prayerTimings: Date[]= new Array<Date>();
           // const func = (val:prayer.IPrayersTiming)=>{ }
            //console.log(ramda.project(['prayersDate','prayerTime'],prayerManager.getPrayers()));
            prayerManager.getPrayers().forEach((curr,index,arr)=>{
                
                 curr.prayerTime.forEach((prayerTiming,i)=>{
                prayerTimings.push(prayerTiming.prayerTime);
               });
               prayerView.push(
                   {
                       prayerDate: curr.prayersDate,
                       fajr: prayerTimings[0],
                       sunrise:prayerTimings[1],
                       dhuhr:prayerTimings[2],
                       asr:prayerTimings[3],
                       sunset:prayerTimings[4],
                       maghrib:prayerTimings[5],
                       isha:prayerTimings[6],
                       midnight:prayerTimings[7]
                   }
               )
            }
            );
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

