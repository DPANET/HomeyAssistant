const dotenv = require('dotenv');
dotenv.config();
const Debug =require('debug');
const debug = Debug("app:startup"); 
const request = require ('request-promise-native');
import to from 'await-to-js';
const {googleMapsClient} = require("./location"); 
import entity = require("./entities");
const util = require('util')


//console.log(process.env.GOOGLE_API_KEY);
//googleMap();
var queryString=
{
    url :'http://api.aladhan.com/v1/timingsByCity/'+  '01-01-2019',
    qs: 
    {
        city: "Abu Dhabi",
        country: "AE",
        method: "04",
    }

}
googleMap();


async function googleMap() {
    let err, result, locationObject;
    try {
        [err, result] = await to(googleMapsClient.geocode({ address:"marina square", language:"en",  components: {country:"AE"}}).asPromise());
        if(!err &&  typeof result.json.results !== "undefined" && result.json.results.length > 0)
        console.log(util.inspect(result.json.results[0].geometry.location, {showHidden: false, depth: null}));
        else
        console.log('error');
    }
    catch (err) {
        console.log(err.message);
        }
    }

// constructPrayerTimeObject (queryString)
// .then((result)=>{
//     console.log('SUCEEED');
//     console.log(result);
// })
// .catch((err)=>
// {
//     console.log('FAILED');
//     console.log(err.message);

// }   
// );
async function constructPrayerTimeObject(query,callback?) {
    let err, result, prayerObject, notification;

     [err,result] = await to(request.get(query));
     if(!err)
     [err,prayerObject] = await to(JSON.parse(result));
     else return Promise.reject(err);



    console.log('finished');
    // let PrayersTimings: Array<entity.IPrayerTime> = new Array();
    // PrayersTimings.push({ prayerName: entity.Prayers.ASR, time: Date.now(), adjustment: 2 });
    // debug(PrayersTimings + 'hi');
}


