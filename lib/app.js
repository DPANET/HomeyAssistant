"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//process.env.NODE_CONFIG_DIR = "config";
const nconf_1 = __importDefault(require("nconf"));
nconf_1.default.file('config/default.json');
// import mongoose, { Schema, SchemaType, SchemaTypes, Types } from "mongoose";
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
const prayer = __importStar(require("./entities/prayer"));
//import * as cfgSchema from "./cache/schema.userscache";
const configuration_1 = require("./configurators/configuration");
const manager = __importStar(require("./managers/manager"));
//import {PrayerTimeCache} from "./cache/userscache";
const moment_1 = __importDefault(require("moment"));
const ramda_1 = __importDefault(require("ramda"));
const validator_1 = require("./validators/validator");
const utility_1 = require("./util/utility");
const Rx = __importStar(require("rxjs"));
const RxAjax = __importStar(require("rxjs/ajax"));
const RxOp = __importStar(require("rxjs/operators"));
const qs = __importStar(require("querystring"));
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// import {PrayersMethods} from "./entities/prayer"
const readline = __importStar(require("readline"));
let prayers = [{ prayerName: 'Fajr', prayerTime: "2019-01-31T05:46:00.000Z" },
    { prayerName: 'Sunrise', prayerTime: "2019-01-31T07:02:00.000Z" },
    { prayerName: 'Isha', prayerTime: "2019-01-31T19:27:00.000Z" },
    { prayerName: 'Dhuhr', prayerTime: "2019-01-31T12:38:00.000Z" },
    { prayerName: 'Asr', prayerTime: "2019-01-31T15:47:00.000Z" },
    { prayerName: 'Sunset', prayerTime: "2019-01-31T18:07:00.000Z" },
    { prayerName: 'Maghrib', prayerTime: "2019-01-31T18:09:00.000Z" },
    { prayerName: 'Imsak', prayerTime: "2019-01-31T05:34:00.000Z" },
    { prayerName: 'Midnight', prayerTime: "2019-01-31T00:36:00.000Z" }];
function getPrayerView(prayers) {
    let prayerView = new Array();
    let prayerViewObject;
    let prayerTimings = new Array();
    prayers.forEach((curr, index, arr) => {
        curr.prayerTime.forEach((prayerTiming, i) => {
            prayerTimings.push(prayerTiming.prayerTime);
        });
        prayerViewObject =
            {
                prayerDate: (0, moment_1.default)(curr.prayersDate).format('L'),
                fajr: (0, moment_1.default)(prayerTimings[0]).format('LT'),
                sunrise: (0, moment_1.default)(prayerTimings[1]).format('LT'),
                dhuhr: (0, moment_1.default)(prayerTimings[2]).format('LT'),
                asr: (0, moment_1.default)(prayerTimings[3]).format('LT'),
                sunset: (0, moment_1.default)(prayerTimings[4]).format('LT'),
                maghrib: (0, moment_1.default)(prayerTimings[5]).format('LT'),
                isha: (0, moment_1.default)(prayerTimings[6]).format('LT'),
                midnight: (0, moment_1.default)(prayerTimings[7]).format('LT')
            };
        prayerView.push(prayerViewObject);
    });
    return prayerView;
}
function getPrayerViewRow(prayersView) {
    let prayerViewRow = new Array();
    prayersView.forEach((prayerViewObject, index, arr) => {
        prayerViewRow.push({ prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.FAJR, prayerTime: prayerViewObject.fajr }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.SUNRISE, prayerTime: prayerViewObject.sunrise }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.DHUHR, prayerTime: prayerViewObject.dhuhr }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.ASR, prayerTime: prayerViewObject.asr }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.SUNSET, prayerTime: prayerViewObject.sunset }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.MAGHRIB, prayerTime: prayerViewObject.maghrib }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.ISHA, prayerTime: prayerViewObject.isha }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.MIDNIGHT, prayerTime: prayerViewObject.midnight });
    });
    return prayerViewRow;
}
var prayerConfigFE = {
    method: 4,
    school: 0,
    midnight: 0,
    adjustmentMethod: 2,
    latitudeAdjustment: 3,
    adjustments: [
        {
            prayerName: "Imsak",
            adjustments: 0
        },
        {
            prayerName: "Fajr",
            adjustments: 0
        },
        {
            prayerName: "Sunrise",
            adjustments: 0
        },
        {
            prayerName: "Dhuhr",
            adjustments: 0
        },
        {
            prayerName: "Asr",
            adjustments: 0
        },
        {
            prayerName: "Sunset",
            adjustments: 0
        },
        {
            prayerName: "Maghrib",
            adjustments: 0
        },
        {
            prayerName: "Isha",
            adjustments: 0
        },
        {
            prayerName: "Midnight",
            adjustments: 0
        }
    ]
};
var locationConfigPE = {
    location: {
        latitude: 21.3890824,
        longtitude: 39.8579118,
        city: "Mecca",
        countryCode: "SA",
        countryName: "Saudi Arabia",
        address: "Mecca Saudi Arabia"
    },
    timezone: {
        timeZoneId: "Asia/Riyadh",
        timeZoneName: "Arabian Standard Time",
        dstOffset: 0,
        rawOffset: 10800
    }
};
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
        let configProvider = configuration_1.ConfigProviderFactory.createConfigProviderFactory(configuration_1.ClientConfigurator);
        let prayerConfig = await configProvider.getPrayerConfig();
        let locationConfig = await configProvider.getLocationConfig();
        //let config: cg.IConfig = await configProvider.getConfigId();
        //let prayerUserCache: PrayerTimeCache = new PrayerTimeCache();
        //     console.log(locationConfig.location.address);
        //     locationConfig.location.address ="Mecca Saudi Arabia";
        //   let resut:cg.IConfig= await configProvider.createConfig("45effedd");
        //     console.log(locationConfig.location.address);
        // console.log(resut);
        //    console.log(await configProvider.createConfig("fuck yeah"));
        await ajax();
        // //     // console.log(DateUtil.getDateByTimeZone(new Date(),"Asia/Dubai"));
        // //     //  console.log(locationConfig);
        let startDate = new Date();
        let endDate = utility_1.DateUtil.addMonth(20, startDate);
        console.log(startDate);
        console.log(endDate);
        let prayerManager = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(locationConfigPE, prayerConfigFE)
            //  .setPrayerPeriod(startDate, endDate)
            .createPrayerTimeManager();
        //  let value:boolean= await prayerUserCache.createPrayerTimeCache(config,prayerManager.prayerTime);
        // console.log(util.inspect(value, {showHidden: false, depth: null}))
        //  prayerManager=  new manager.PrayerManager(prayerManager.prayerTime);
        console.log(prayerManager.getPrayerTime(prayer.PrayersName.FAJR, endDate));
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
        let validate = validator_1.PrayerConfigValidator.createValidator();
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
async function task() {
    console.log("I'm executing");
}
//buildLocationObject();
//pipe();
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}
function createXHR() {
    return new XMLHttpRequest();
}
async function ajax() {
    try {
        console.log("running ajax");
        let i = 0;
        let observer = {
            next: (value) => {
                console.log("I'm running inside a subscribtion");
                console.log(ramda_1.default.map(ramda_1.default.path(['date', 'readable']), value));
                //   i+=1;
                //     console.log("value of i ",i,value.length)
                //     //console.log(util.inspect(value, {showHidden: false, depth: 3}))
                //     console.log(R.project(['date'],value))
            },
            error: (value) => console.log("Error Thrown" + value),
            complete: () => console.log("completed")
        };
        let date = new Date();
        let date2 = utility_1.DateUtil.addMonth(1, date);
        let uri = "http://api.aladhan.com/v1/calendar";
        let params = qs.stringify({
            //        uri: uri,
            headers: {
                'User-Agent': 'Homey-Assistant-v2'
            },
            latitude: 21.3890824,
            longitude: 39.8579118,
            month: utility_1.DateUtil.getMonth(date),
            year: utility_1.DateUtil.getYear(date),
            method: 4,
            school: 0,
            midnightMode: 0,
            timezonestring: "Asia/Riyadh",
            latitudeAdjustmentMethod: 3,
            tune: "0,0,0,0,0,0,0,0,0"
        });
        let params2 = qs.stringify({
            //        uri: uri,
            headers: {
                'User-Agent': 'Homey-Assistant-v2'
            },
            latitude: 21.3890824,
            longitude: 39.8579118,
            month: utility_1.DateUtil.getMonth(date2),
            year: utility_1.DateUtil.getYear(date2),
            method: 4,
            school: 0,
            midnightMode: 0,
            timezonestring: "Asia/Riyadh",
            latitudeAdjustmentMethod: 3,
            tune: "0,0,0,0,0,0,0,0,0"
        });
        //uri = `${uri}?${params}`;
        //console.log(uri);
        let queryString = {
            url: `${uri}?${params}`,
            async: true,
            method: 'GET',
            responseType: "json",
            crossDomain: true,
            timeout: 1200,
            createXHR: () => new XMLHttpRequest()
        };
        let queryString2 = {
            url: `${uri}?${params2}`,
            async: true,
            timeout: 1200,
            method: 'GET',
            responseType: "json",
            crossDomain: true,
            createXHR: () => new XMLHttpRequest()
        };
        let queries = new Array(queryString, queryString2);
        let request = Rx.from(queries).pipe(
        // RxOp.mergeMap((query:RxAjax.AjaxRequest)=>RxAjax.ajax(query).pipe(
        //     RxOp.map((result:any)=>result.response.data),
        // )),
        // RxOp.reduce((all:any,_:any)=>[...all,..._],[])
        RxOp.mergeMap((query) => RxAjax.ajax(query).pipe(RxOp.catchError(error => {
            console.log('error: ', error);
            return error;
        })))); //.pipe(RxOp.zipAll())
        //  request.toPromise()
        console.log("will run request");
        //let response= await RxAjax.ajax(queryString).subscribe(observer)
        let response = await request.subscribe(observer);
        console.log("request ran");
        //request.subscribe(observer)
        //console.log(response);
        // console.log(console.log(R.map(R.path(['date', 'readable']), response)))
    }
    catch (err) {
        console.log("big error");
    }
    //askQuestion("Enter keyboard action");
}
buildLocationObject();
