import dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
import request = require('request-promise-native');
const to =require( 'await-to-js').default;
//const { googleMapsClient } = require("./location");
import prayerEntity = require("./prayers");
import util = require('util');
import JasmineExpect = require('jasmine-expect');
import {Settings} from './settings';
import {ILocation,ITimeZone, Location,LocationBuilder,}  from './location';
import {LocationProvider,LocationProviderFactory,LocationProviderName} from './providers';
import * as Joi from 'joi';
//console.log(process.env.GOOGLE_API_KEY);
//googleMap();
var queryString: object =[
{
    url: 'http://api.aladhan.com/v1/timingsByCity/' + '01-01-2019',
    qs:
    {
        city: "Abu Dhabi",
        country: "AE",
        method: "04"
    },
    method: 'GET',
    json: true,
    resolveWithFullResponse: false

}];
let locationInput: ILocation;

let LocationEnity: Location;
locationInput = {
    address: "Westminster",
    countryCode: "GB",
    latitude:51.5073509,
    longtitude:-0.1277583
}
let locationUpdated = 
{
    address: 'Dubai',
    countryCode: 'AE',
    latitude: 25.1972858,
    longtitude: 55.2792565
}

let locationProvider: LocationProvider = LocationProviderFactory.createLocationProviderFactory(LocationProviderName.GOOGLE);
//buildLocationObject(locationProvider);
//console.log(locationProvider.getProviderName());
async function buildLocationObject(locationProvider:LocationProvider)
{
    let locationResult:ILocation;
    let timeZoneResult: ITimeZone;
    let location:Location;
    locationResult = await locationProvider.getLocationByCoordinates(locationInput.latitude,locationInput.longtitude);
    timeZoneResult = await locationProvider.getTimeZoneByCoordinates(locationInput.latitude,locationInput.longtitude);

    location = new Location(locationResult,timeZoneResult);
    console.log(location.timeZoneName);
    console.log(location.timeZoneName);

}
async function createLocation()
{
    let locationBuilder: LocationBuilder= new LocationBuilder(locationProvider);
    let locationEntity : Location;
     locationBuilder.setLocationCoordinates(locationInput.latitude,locationInput.longtitude)
    .then(()=>locationBuilder.setLocationAddress(locationInput.address,locationInput.countryCode))
    .then(()=>locationBuilder.setLocationTimeZone(locationInput.latitude,locationInput.longtitude))
    .then(()=>{ locationBuilder.createLocation();})
    .catch((err)=> console.log(err.message));
}


async function validate()
{
    const joiSchema = Joi.object().keys({
        countryCode:Joi.string()
    });
    let location : ILocation;
    let result,err;
    location.countryCode = "AE";
    [err,result] = await to(Joi.validate<ILocation>(location,joiSchema));
    if(err)
    console.log(err.message);
    else
    console.log(result);
}


validate().catch((err)=>
{
    console.log(err.message);
});
// createLocationEntity(locationInput)
// .then((result) => {
//     LocationEnity=  result;
//     console.log(result.getLocation());
//     console.log(result.getTimeZone());
// })
// .catch((err)=>{
//     console.log(err.message);
// })

// Settings.getPrayersSettings().then((results)=>
// {
// console.log(results);

// })
// .catch((err)=> console.log(err.message));

// async function createLocationEntity(location: ILocation) :Promise<Location> {
// return await LocationFactory.createLocationFactory(location);
// }

// constructPrayerTimeObject(queryString)
//     .then((result) => {
//         console.log('SUCEEED');
//         console.log(result);
//     })
//     .catch((err) => {
//         console.log('FAILED');
//         console.log(err.message);
//     }
//     );
// async function constructPrayerTimeObject(query, callback?) {
//     let err, body, result, prayerObject, notification;

//         [err,result] = await  to(request.get(query));
//         if(!err)
//         return result;
//         else
//         throw new Error('why');
//              //return await(request.get(query));
//     // let PrayersTimings: Array<entity.IPrayerTime> = new Array();
//     // PrayersTimings.push({ prayerName: entity.Prayers.ASR, time: Date.now(), adjustment: 2 });
//     // debug(PrayersTimings + 'hi');
// }


