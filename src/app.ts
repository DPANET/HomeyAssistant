//process.env.NODE_CONFIG_DIR = "config";
import nconf from 'nconf';
nconf.file('config/default.json');
// import mongoose, { Schema, SchemaType, SchemaTypes, Types } from "mongoose";
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
import * as prayer from "./entities/prayer";
import * as cg from "./configurators/inteface.configuration";
//import * as cfgSchema from "./cache/schema.userscache";
import { ConfigProviderFactory, ConfigProviderName, ClientConfigurator, ConfigProvider } from "./configurators/configuration";
import * as managerInterface from './managers/interface.manager';
import * as manager from "./managers/manager";
//import {PrayerTimeCache} from "./cache/userscache";
import moment from "moment";
import * as validators from "./validators/interface.validators";
import R, { composeP, map } from "ramda";
//import validators= val.validators;
import { valid, string, StringRegexOptions } from "@hapi/joi";
import { PrayerConfigValidator, LocationConfigValidator } from "./validators/validator";
import { DateUtil } from "./util/utility";
import util from "util";
import momentTZ from "moment-timezone";
import { profile } from 'console';
import { values } from 'ramda';
import * as Rx from "rxjs";
import * as RxAjax from "rxjs/ajax"; 
import * as RxOp from "rxjs/operators";
import * as qs from "querystring";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// import {PrayersMethods} from "./entities/prayer"
import * as readline from "readline";
import { start } from 'repl';

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

var prayerConfigFE: any = 
{
    method: 4,
    school: 0,
    midnight: 0,
   adjustmentMethod: 1,
    latitudeAdjustment: 3,
    startDate: new Date(),
    endDate: DateUtil.addMonth(1,new Date())
    ,
    adjustments: [
        { prayerName: prayer.PrayersName.FAJR, adjustments: 350 },
        { prayerName: prayer.PrayersName.DHUHR, adjustments: 450 },
        { prayerName: prayer.PrayersName.ASR, adjustments: 600 },
        { prayerName: prayer.PrayersName.MAGHRIB, adjustments: 750 },
        { prayerName: prayer.PrayersName.ISHA, adjustments: 800 },
    ]
};

var locationConfigPE: any =
{
    location: {
        latitude: 24.444103,
        longtitude: 54.370867,
        countryCode: "AE",
        countryName: "ffs",
        address: "f",
        city: "Abu Dhabi"
    }
    ,
    timezone:
    {
        timeZoneId: "asia/duba",
        timeZoneName: "ffs",
        dstOffset: 444,
        rawOffset: 505
    }

}
var countnumber = 0;
async function buildLocationObject() {
    //let prayerDBConnection: mongoose.Mongoose;
    try {

        // let prayerMethod:PrayersMethods = new PrayersMethods()
        // prayerMethod.id = prayer.Methods.America;
        // prayerMethod.methodName = "America";
        // let serializedValue:PrayersMethods = serialize(prayerMethod);
        // console.log(util.inspect(serializedValue, {showHidden: false, depth: null}))
        // console.log(prayerMethod)
        // prayerMethod=deserialize(PrayersMethods,serializedValue);
        // console.log(prayerMethod);
        // console.log(prayerMethod.id);
       // console.log(util.inspect(prayerMethod, {showHidden: false, depth: null}))

     //   console.log(deserialize(User,json));
    //    let prayerDBURI: string = nconf.get('MONGO_DB');
    //    prayerDBConnection = await mongoose.connect(prayerDBURI, { useNewUrlParser: true, useUnifiedTopology: true });
    //    mongoose.set('useCreateIndex', true);
    //     let prayerConfigModel: mongoose.Model<cfgSchema.IPrayerTimeSchemaModel> = cfgSchema.prayerTimeModel;
    //     let result: cfgSchema.IPrayerTimeSchemaModel = await prayerConfigModel.findOne();
    //     console.log(util.inspect(result.prayersTime.prayers, { showHidden: true, depth: null }))
    //     console.log(await prayerConfigModel.estimatedDocumentCount());
       //   await prayerDBConnection.disconnect();
         


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
      //  let profileID: Schema.Types.ObjectId =  new mongoose.Types.ObjectId("5f20ebac9627ac26ccc551e0") as any;
        let configProvider: cg.IConfigProvider = ConfigProviderFactory.createConfigProviderFactory(ClientConfigurator);
        let prayerConfig: cg.IPrayersConfig = await configProvider.getPrayerConfig();
        let locationConfig: cg.ILocationConfig = await configProvider.getLocationConfig();
        //let config: cg.IConfig = await configProvider.getConfigId();
        //let prayerUserCache: PrayerTimeCache = new PrayerTimeCache();
    //     console.log(locationConfig.location.address);
    //     locationConfig.location.address ="Mecca Saudi Arabia";
      //   let resut:cg.IConfig= await configProvider.createConfig("45effedd");
    //     console.log(locationConfig.location.address);

       // console.log(resut);

    //    console.log(await configProvider.createConfig("fuck yeah"));
        
        // //     // console.log(DateUtil.getDateByTimeZone(new Date(),"Asia/Dubai"));
        // //     //  console.log(locationConfig);
        let startDate:Date = new Date()
        let endDate:Date = DateUtil.addMonth(20,startDate)
        console.log(startDate)
        console.log(endDate)
        let prayerManager: managerInterface.IPrayerManager = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(locationConfig, prayerConfig)
            .setPrayerPeriod(startDate, endDate)
            .createPrayerTimeManager() ;
          //  let value:boolean= await prayerUserCache.createPrayerTimeCache(config,prayerManager.prayerTime);
         // console.log(util.inspect(value, {showHidden: false, depth: null}))
          prayerManager=  new manager.PrayerManager(prayerManager.prayerTime);
           console.log(prayerManager.getPrayerTime(prayer.PrayersName.FAJR,endDate));
           console.log(prayerManager.getUpcomingPrayer());
        //    let date:string = "24 Apr 2014, 04:37"
        //    momentTZ(date,'ff',)
        //    console.log(moment.tz(`${date}`,"DD MMM YYYY, hh:mm","Asia/Riyadh").toDate());
        //    console.log(moment.tz(`${date}`,"DD MMM YYYY, hh:mm","Asia/Dubai").toDate());
    //     let result:boolean = await prayerUserCache.createPrayerTimeCache(config,value);
    //     console.log(result);
       //value.method
     //  console.log(JSON.stringify(value));
   //    console.dir(util.inspect(value, {showHidden: false, depth: null}))
      // console.log(value);
      //   let serializedValue:any = serialize(prayer.PrayersTime,value );
       //console.log(serializedValue)
       
      //   let valueDesrialized:prayer.PrayersTime = deserialize(prayer.PrayersTime,serializedValue);
       //   console.log(util.inspect(valueDesrialized.prayers, {showHidden: false, depth: null}))
       
//let prayerManagerSerialized:managerInterface.IPrayerManager = new manager.PrayerManager(valueDesrialized);
      // console.log(prayerManagerSerialized.getUpcomingPrayer(new Date()));

          // let prayers= JSON.stringify(prayerManager);
        // console.log(util.inspect(prayers, {showHidden: false, depth: null}))

        //    let prayer=prayerManager.getPrayers()
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
         let validate: validators.IValid<cg.IPrayersConfig> = PrayerConfigValidator.createValidator();
         console.log(validate.validate(prayerConfigFE));
      //  console.log(validate.getValidationError().details.map((detail: any) => `${detail.value.label} with value ${detail.value.value}: ${detail.message}`));
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
        //  console.log(util.inspect(prayerManager.getPrayers(), {showHidden: false, depth: null}))

        // console.log(prayerManager.getPrayers());

    }
    catch (err) {

        // if (countnumber < 4)
        //     // await buildLocationObject();
        //     countnumber += 1;

        // let message: string;
        // if (err.name === "ValidationError") {
        //     message = err.details.map((detail: any) => `${detail.value.label} with value ${detail.value.value}: ${detail.message}`);
        //     console.log(message);
        // }
        // else
            console.log(err);
    }
    finally {
        //await prayerDBConnection.disconnect();
    }

}
interface IPrayerController
{
    prayerAdjust:any;
    prayerFunc:any;


}
// async function pipe()
// {
    
//     try{

//     let x = (z:number,y:number)=> {
//      throw new Error("new Error");
//       return  z+y

//     }
    
//     let middleWare  = async (word:string):Promise<string>=>
//     {
//        // throw new Error("WTF");
//         return  word + " Space";
//     }
//     let y = async (word:string):Promise<string>=>
//     {
//         return word + " Augmented";
//     }
//     let validation  = async (word:any):Promise<string>=>
//     {
        
//         return word+ " Funck";
//        // return (word=== "Hi Space") ? true: false;
//     }
//     let validations= arrow.railAsync(validation,y);
//     let router:IPrayerController={
//         prayerAdjust: validations,
//         prayerFunc: arrow.railAsync(validations,middleWare)
//     }
//     let z = (middleWare:any,next:any,args:any)=>
//     {

//         let piper=arrow.pipe(middleWare,next);
//         return piper(args);
//     }
//     let subtract= (z:number)=>{
//         z * 3
//         // throw new Error("Shit")
//     }
//     let curry = arrow.curry(x);
//     let math = curry(3)
 
//     let number = arrow.pipe(math,subtract);
//     console.log(number(2));
//     let list = (fn:Function, input:string)=>
//     {
//         console.log(input)
//      return fn(input);
//     }


//    let chainList = arrow.chain(list);
//   // let validations= arrow.railAsync(validation,y);
//     let pip = router.prayerFunc;
//     let value =  await pip("Hi");
//     console.log("my error : "+ value)
// }
// //   let curryFunc = arrow.curry(z);
// //   let middleWare2 =curryFunc(validation);
// //   console.log(middleWare2(y,"hi"));
// ///  let middleWare2 = router(validation);
//  // let welcome = validate("Welcome ");
//  //let calculate =  arrow.compose(validate(next aomr),y);
//   //let execute = validate(calculate);
//  //  console.log(welcome());
// catch(err)
// {
//     console.log(err.message)
// }

// }
async function task()
{
    console.log("I'm executing");

}

buildLocationObject();
//pipe();




function askQuestion(query:string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}
function createXHR() {
    return new XMLHttpRequest();
  }
async function ajax()
{try{
    let  i:number=0;
    let observer:Rx.Observer<any>={
        next:(value:Array<any>)=> {
           console.log(R.map(R.path(['date','readable']),value))
        //   i+=1;

        //     console.log("value of i ",i,value.length)
        //     //console.log(util.inspect(value, {showHidden: false, depth: 3}))
        //     console.log(R.project(['date'],value))
        },//console.log(util.inspect(value, {showHidden: false, depth: null})),
        error: (value:string)=>console.log(value),//console.log(util.inspect(value, {showHidden: false, depth: null})),
        complete:()=>console.log("completed")
        
    };
    let date:Date = new Date();
    let date2:Date = DateUtil.addMonth(1,date);
    let uri:string = "http://api.aladhan.com/v1/calendar"
    let params:string = qs.stringify( {
//        uri: uri,
        headers:{
            'User-Agent':'Homey-Assistant'
        },
        latitude: 21.3890824,
        longitude: 39.8579118,
        month: DateUtil.getMonth(date),
        year: DateUtil.getYear(date),
        method: 4,
        school: 0,
        midnightMode: 0,
        timezonestring: "Asia/Riyadh",
        latitudeAdjustmentMethod: 3,
        tune: "0,0,0,0,0,0,0,0,0"
    }); 
    let params2:string = qs.stringify( {
        //        uri: uri,
                headers:{
                    'User-Agent':'Homey-Assistant'
                },
                latitude: 21.3890824,
                longitude: 39.8579118,
                month: DateUtil.getMonth(date2),
                year: DateUtil.getYear(date2),
                method: 4,
                school: 0,
                midnightMode: 0,
                timezonestring: "Asia/Riyadh",
                latitudeAdjustmentMethod: 3,
                tune: "0,0,0,0,0,0,0,0,0"
            }); 
    //uri = `${uri}?${params}`;
    //console.log(uri);
    let queryString:RxAjax.AjaxRequest =
    {
        url: `${uri}?${params}`,
        async:true,
        method: 'GET',
        responseType: "json",
        crossDomain:true,
        createXHR
    }; 
    let queryString2:RxAjax.AjaxRequest =
    {
        url: `${uri}?${params2}`,
        async:true,
        headers:{
            'User-Agent':'Homey-Assistant'
        },
        method: 'GET',
        responseType: "json",
        crossDomain:true,
        hasContent:true,
        createXHR
    }; 
    let queries:Array<RxAjax.AjaxRequest>= new Array(queryString,queryString2) 
    let request:Rx.Observable<any> = Rx.from(queries).pipe(
        
        RxOp.mergeMap((query:RxAjax.AjaxRequest)=>RxAjax.ajax(query).pipe(
            RxOp.map((result:any)=>result.response.data),
        )),
        RxOp.reduce((all:any,_:any)=>[...all,..._],[]),
    )//.pipe(RxOp.zipAll())
  //  request.toPromise()
    let response = await request.toPromise();
    //request.subscribe(observer)
    console.log( console.log(R.map(R.path(['date','readable']),response)))
        }
        catch(err)
        {
            console.log("big error")
        }
    askQuestion("Enter keyboard action");
}
//ajax();