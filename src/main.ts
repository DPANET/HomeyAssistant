import nconf from 'nconf';
nconf.file('config/default.json');
import * as prayersLib from "./index";
var prayerConfig: prayersLib.IPrayersConfig = 
{
    method: 4,
    school: 0,
    midnight: 0,
    adjustmentMethod: 1,
    latitudeAdjustment: 3,
    startDate: new Date(),
    endDate: prayersLib.DateUtil.addMonth(1,new Date())
    ,
    adjustments: [
        { prayerName: prayersLib.PrayersName.FAJR, adjustments: 1 },
        { prayerName: prayersLib.PrayersName.DHUHR, adjustments: 2 },
        { prayerName: prayersLib.PrayersName.ASR, adjustments: 0},
        { prayerName: prayersLib.PrayersName.MAGHRIB, adjustments: 4 },
        { prayerName: prayersLib.PrayersName.ISHA, adjustments: 0 },
    ]
};

var locationConfig: prayersLib.ILocationConfig =
{
    location: {
        latitude: 21.3890824,
        longtitude: 39.8579118,
        countryCode: "SA",
        countryName: "Saudi Arabia",
        address: "Mecca Saudi Arabia",
        city: "Mecca"
    }
    ,
    timezone:
    {
        timeZoneId: "Asia/Riyadh",
        timeZoneName: "Arabian Standard Time",
        dstOffset: 0,
        rawOffset: 10800
    }

}
var countnumber = 0;
async function main() {
    //let prayerDBConnection: mongoose.Mongoose;
    try {
        // Create Prayer Manager manually
        let prayerManager: prayersLib.IPrayerManager = await prayersLib.PrayerTimeBuilder
                .createPrayerTimeBuilder()
                .setLocationByAddress("Abu Dhabi","AE")
                .setPrayerPeriod(new Date(),prayersLib.DateUtil.addMonth(1,new Date()))
                .createPrayerTimeManager() ;
        
        console.log(prayerManager.getPrayerTime(prayersLib.PrayersName.FAJR));
        console.log(prayerManager.getPrayers());
        console.log(prayerManager.getUpcomingPrayer())


        // Create Prayer from Config 
         prayerManager = await prayersLib.PrayerTimeBuilder
            .createPrayerTimeBuilder(locationConfig, prayerConfig)
            .createPrayerTimeManager() ;
           console.log(prayerManager.getPrayerTime(prayersLib.PrayersName.FAJR, new Date()));     
        
        //Validate Config File
        let validate: prayersLib.IValid<prayersLib.IPrayersConfig> = prayersLib.PrayerConfigValidator.createValidator();
        console.log(validate.validate(prayerConfig));


    }catch(err)
    {
        console.log(err)
    }
}
main()