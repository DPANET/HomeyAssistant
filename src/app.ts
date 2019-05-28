
import prayer = require("./entities/prayer");
import cg = require("./configurators/inteface.configuration");
import configurator from "./configurators/configuration";
import * as managerInterface from './managers/interface.manager';
import * as manager from "./managers/manager";
import ramda from "ramda";
import moment from "moment";
import val =require("./validators/validator");
import validators= val.validators;
import { valid } from "@hapi/joi";
import util from "util"

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
interface IPrayersView {
    prayerDate: string,
    fajr: string,
    sunrise: string,
    dhuhr: string,
    asr: string,
    sunset: string,
    maghrib: string,
    isha: string,
    midnight: string
}
interface IPrayersViewRow {
    prayerDate: string,
    prayerTime: string,
    prayerName: prayer.PrayersName
}
function getPrayerView(prayers: prayer.IPrayers[]): IPrayersView[] {
    let prayerView: Array<IPrayersView> = new Array<IPrayersView>();
    let prayerViewObject: IPrayersView;
    let prayerTimings: Date[] = new Array<Date>();
    prayers.forEach((curr, index, arr) => {
        curr.prayerTime.forEach((prayerTiming, i) => {
            prayerTimings.push(prayerTiming.prayerTime);
        });
        prayerViewObject =
            {
                prayerDate: moment(curr.prayersDate).format('L'),
                fajr: moment(prayerTimings[0]).format('LT'),
                sunrise: moment(prayerTimings[1]).format('LT'),
                dhuhr: moment(prayerTimings[2]).format('LT'),
                asr: moment(prayerTimings[3]).format('LT'),
                sunset: moment(prayerTimings[4]).format('LT'),
                maghrib: moment(prayerTimings[5]).format('LT'),
                isha: moment(prayerTimings[6]).format('LT'),
                midnight: moment(prayerTimings[7]).format('LT')
            };
        prayerView.push(prayerViewObject);
    }
    );
    return prayerView;
}
function getPrayerViewRow(prayersView: IPrayersView[]): IPrayersViewRow[] {
    let prayerViewRow: Array<IPrayersViewRow> = new Array<IPrayersViewRow>();
    prayersView.forEach((prayerViewObject, index, arr) => {
        prayerViewRow.push(
            { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.FAJR, prayerTime: prayerViewObject.fajr },
            { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.SUNRISE, prayerTime: prayerViewObject.sunrise },
            { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.DHUHR, prayerTime: prayerViewObject.dhuhr },
            { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.ASR, prayerTime: prayerViewObject.asr },
            { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.SUNSET, prayerTime: prayerViewObject.sunset },
            { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.MAGHRIB, prayerTime: prayerViewObject.maghrib },
            { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.ISHA, prayerTime: prayerViewObject.isha },
            { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.MIDNIGHT, prayerTime: prayerViewObject.midnight },
        );
    });

    return prayerViewRow;

}

var prayerConfigFE:cg.IPrayersConfig= {
    method: 4,
    school: 0,
    midnight: 0,
    adjustmentMethod:2,
    latitudeAdjustment: 3,
    startDate: new Date(),
    endDate:new Date("06-06-2019"),
    adjustments: [
      {
        prayerName: prayer.PrayersName.IMSAK,
        adjustments: 5
      }
    ]
  };

async function buildLocationObject() {
    try {
        console.time('Prayer_Manager');
         let prayerConfig: cg.IPrayersConfig = await new configurator().getPrayerConfig();
        let locationConfig: cg.ILocationConfig = await new configurator().getLocationConfig();

        // console.log(locationConfig);
        let prayerManager: managerInterface.IPrayerManager = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(locationConfig, prayerConfig)
            .createPrayerTimeManager();
        // let prayerManager: manager.IPrayerManager = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(null, prayerConfig)
        //     .setLocationByAddress("Abu Dhabi","AE")
        //     .createPrayerTimeManager();
        //    console.timeEnd('Prayer_Manager');
      //   let result:boolean = await prayerManager.savePrayerConfig(prayerConfigFE);
        // console.log(result)
        //   let validate: validators.IValid<validators.ValidtionTypes> = validators.ConfigValidator.createValidator();
         //   console.log(ramda.values(prayer.AdjsutmentMethod));
            //console.log(prayer.AdjsutmentMethod.Server);
         //  console.log("the object is valid : " +  validate.validate(prayerConfigFE));
            //let err:validators.IValidationError = validate.getValidationError();
            //let message:string[] = err.details.map((detail:any)=>`${detail.value.label} with value ${detail.value.value}: ${detail.message}`);

           // let messageShort = message.reduce((prvs,curr,index,array)=> prvs.concat('\r\n',curr));
         //  console.log("Validation Error: "+ validate.getValidationError())
            //console.log(messageShort);

             console.log(prayerManager.getPrayerAdjsutments());
   
           // console.log(prayerManager.getPrayersByDate(new Date('2019-05-23')));

    }
    catch (err) {
      let message:string;
            if(err.name==="ValidationError")
            {
            message = err.details.map((detail:any)=>`${detail.value.label} with value ${detail.value.value}: ${detail.message}`);
            console.log(message);
            }
            else
            console.log(err);
        }

}

