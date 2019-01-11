import dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
import request = require('request-promise-native');
const to =require( 'await-to-js').default;
const { googleMapsClient } = require("./location");
import prayerEntity = require("./prayers");
import locationEntity = require('./location');
import util = require('util');
import JasmineExpect = require('jasmine-expect');


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
createLocationEntity()
.then((result) => {
    console.log(result.getLocation());
})
.catch((err)=>{
    console.log(err.message);
})




async function createLocationEntity() :Promise<locationEntity.Location> {

let location: locationEntity.ILocation;

location = {
    address: "ruwais camp",
   countryCode: "AEee",
    longtitude:45.4479073,
    latitude:25.6868961
}

return await locationEntity.LocationFactory.createLocationFactory(location);


}

constructPrayerTimeObject(queryString)
    .then((result) => {
        console.log('SUCEEED');
        console.log(result);
    })
    .catch((err) => {
        console.log('FAILED');
        console.log(err.message);

    }
    );
async function constructPrayerTimeObject(query, callback?) {
    let err, body, result, prayerObject, notification;

        [err,result] = await  to(request.get(query));
        if(!err)
        return result;
        else
        throw new Error('why');
        

        //return await(request.get(query));
    // let PrayersTimings: Array<entity.IPrayerTime> = new Array();
    // PrayersTimings.push({ prayerName: entity.Prayers.ASR, time: Date.now(), adjustment: 2 });
    // debug(PrayersTimings + 'hi');
}


