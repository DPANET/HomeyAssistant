//process.env.NODE_CONFIG_DIR = "config";
import nconf = require('nconf');
nconf.file('config/default.json');


import dotenv = require('dotenv');
dotenv.config();
import prayer = require("./entities/prayer");
import cg = require("./configurators/inteface.configuration");
import {Configurator} from "./configurators/configuration";
import * as managerInterface from './managers/interface.manager';
import * as manager from "./managers/manager";
import R from "ramda";
import moment from "moment";
import validators =require("./validators/interface.validators");
//import validators= val.validators;
import { valid } from "@hapi/joi";
import { PrayerConfigValidator,LocationConfigValidator } from "./validators/validator";
import { DateUtil } from "./util/utility";
import util from "util";
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
    adjustmentMethod:1,
    latitudeAdjustment: 3,
    startDate: new Date(),
    endDate:new Date("06-07-2019"),
    adjustments: [
     { prayerName: prayer.PrayersName.FAJR, adjustments: 350 },
     { prayerName: prayer.PrayersName.DHUHR, adjustments: 450 },
     { prayerName: prayer.PrayersName.ASR, adjustments: 600 },
     { prayerName: prayer.PrayersName.MAGHRIB, adjustments: 750 },
     { prayerName: prayer.PrayersName.ISHA, adjustments: 800 },
    ]
  };

  var locationConfigPE:cg.ILocationConfig=
  {
      location:{
          latitude:24.444103,
          longtitude:54.370867,
          countryCode:"AE",
          countryName:"ffs",
          address:"f",
          city:"Abu Dhabi"
      },
      timezone:
      {
          timeZoneId:"asia/duba",
          timeZoneName:"ffs",
          dstOffset:444,
          rawOffset:505
      }
      
  }
var countnumber = 0;
async function buildLocationObject() {
    try {

      //  console.log(nconf.get('GOOGLE_API_KEY'));

    //     let prayers= [ { prayerTime:
    //         [ { prayerName: 'Fajr', prayerTime: "2019-06-16T00:03:00.000Z" },
    //           { prayerName: 'Sunrise', prayerTime: "2019-06-16T01:37:00.000Z" },
    //           { prayerName: 'Dhuhr', prayerTime: "2019-06-16T08:25:00.000Z" },
    //           { prayerName: 'Asr', prayerTime: "2019-06-16T11:46:00.000Z"},
    //           { prayerName: 'Sunset', prayerTime: "2019-06-16T15:13:00.000Z" },
    //           { prayerName: 'Maghrib', prayerTime: "2019-06-16T15:16:00.000Z" },
    //           { prayerName: 'Isha', prayerTime: "2019-06-16T16:13:00.000Z" },
    //           { prayerName: 'Imsak', prayerTime: "2019-06-15T23:54:00.000Z "},
    //           { prayerName: 'Midnight', prayerTime: "2019-06-15T20:23:00.000Z" } ],
    //        prayersDate: "2019-06-16T00:00:00.000Z" },
    //      { prayerTime:
    //         [ { prayerName: 'Fajr', prayerTime: "2019-06-17T00:04:00.000Z" },
    //           { prayerName: 'Sunrise', prayerTime: "2019-06-17T01:37:00.000Z" },
    //           { prayerName: 'Dhuhr', prayerTime: "2019-06-17T08:25:00.000Z" },
    //           { prayerName: 'Asr', prayerTime: "2019-06-17T11:47:00.000Z" },
    //           { prayerName: 'Sunset', prayerTime: "2019-06-17T15:13:00.000Z" },
    //           { prayerName: 'Maghrib', prayerTime: "2019-06-17T15:16:00.000Z" },
    //           { prayerName: 'Isha', prayerTime: "2019-06-17T16:13:00.000Z" },
    //           { prayerName: 'Imsak', prayerTime: "2019-06-16T23:55:00.000Z" },
    //           { prayerName: 'Midnight', prayerTime: "2019-06-16T20:23:00.000Z" } ],
    //        prayersDate: "2019-06-17T00:00:00.000Z" },
    //      ];
       

    //  let sortObject=(obj:any) =>{
    //        return  {
    //            prayersDate: moment(obj.prayersDate).toDate().toDateString() ,
    //            Imsak: moment(obj.Imsak).format('LT'),
    //            Fajr: moment(obj.Fajr).format('LT'),
    //            Sunrise: moment(obj.Sunrise).format('LT'),
    //            Dhuhr: moment(obj.Dhuhr).format('LT'),
    //            Asr: moment(obj.Asr).format('LT'),
    //            Sunset: moment(obj.Sunset).format('LT'),
    //            Maghrib:moment(obj.Maghrib).format('LT'),
    //            Isha: moment(obj.Isha).format('LT'),
    //            Midnight:moment(obj.Midnight).format('LT'),   
    //        }
    //    }      
    //    let swapPrayers= (x:any)=> R.assoc(x.prayerName,x.prayerTime,x)
    //    let removePrayers= (x:any)=> R.omit(['prayerName','prayerTime','undefined'],x)
    //    let prayerTime= R.pipe(swapPrayers,removePrayers)
    //    let prayerTimes =(x:any)=>R.map(prayerTime,x)
    //    let prayersList =(x:any)=> R.append({prayersDate:x.prayersDate},x.prayerTime)
    //    let projectPrayers= R.curry(sortObject)
    //    let pump =R.pipe(prayersList,prayerTimes,R.mergeAll,projectPrayers)
    //  //  console.time('Prayer_Manager');
         let prayerConfig: cg.IPrayersConfig = await new Configurator().getPrayerConfig();
        let locationConfig: cg.ILocationConfig = await new Configurator().getLocationConfig();
    //     // console.log(DateUtil.getDateByTimeZone(new Date(),"Asia/Dubai"));
    //     //  console.log(locationConfig);
        let prayerManager: managerInterface.IPrayerManager = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(locationConfig, prayerConfig)
            .createPrayerTimeManager();
       let prayer=prayerManager.getPrayers()
    //         console.log( R.map(pump,prayer))


       // console.log(prayerManager.getPrayerLocation().address);
        // let prayerManager: manager.IPrayerManager = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(null, prayerConfig)
        //     .setLocationByAddress("Abu Dhabi","AE")
        //     .createPrayerTimeManager();
        //    console.timeEnd('Prayer_Manager');
        //  let result:boolean = await prayerManager.savePrayerConfig(prayerConfigFE);
        //  console.log(`save result :${result}`)
         //console.log(result)
        //  await prayerManager.saveLocationConfig(locationConfigPE);
        //  let validate: validators.IValid<cg.ILocationConfig> = LocationConfigValidator.createValidator();
        //  //console.log(validate.validate(locationConfigPE));

        //  //  console.log(ramda.values(prayer.AdjsutmentMethod));
        //     //console.log(prayer.AdjsutmentMethod.Server);
        // //console.log(Object.values(prayer.AdjsutmentMethod));;
        // // console.log(prayerConfigFE);
        // console.log("the object is valid : " +  validate.validate(locationConfigPE));
        // let err:validators.IValidationError = validate.getValidationError();
        // let message:string[] = err.details.map((detail:any)=>`${detail.value.label} with value ${detail.value.value}: ${detail.message}`);

        // let messageShort = message.reduce((prvs,curr,index,array)=> prvs.concat('\r\n',curr));
        //    console.log("Validation Error: "+ validate.getValidationError())
        //     console.log(messageShort);
        //      //console.log(prayerManager.getPrayersByDate(new Date('2019-06-23')));
        //console.log(util.inspect(prayerManager.getPrayers(), {showHidden: false, depth: null}))

      console.log(prayerManager.getPrayers());

    }
    catch (err) {
        console.log(err);
        if(countnumber <4)
      // await buildLocationObject();
        countnumber+=1;
       
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
buildLocationObject().catch((err) => console.log(err));


