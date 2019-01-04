
// const express = require('express');
// const router = express.Router();
// const Joi= require('joi');
//import dotenviroment= require('dotenv');
//import debug = require('debug');
import entity = require("./entities");
import { string } from "joi";
const dotenv = require('dotenv');
dotenv.config();
const Debug =require('debug');
const debug = Debug("app:startup"); 
const request = require ('request-promise-native');
const joi = require('joi');

var queryString=
{
    url :"http://api.aladhan.com/v1/calendarByCity" ,
    qs: 
    {
        city: "Abu Dhabi",
        country: "AE",
        method: "04",
        year: "2018"
    }

}

printPrayers (queryString);

async function printPrayers(query) {

    let x = await request.get(query, function(err, response, body) {
        return 3;
    });
    console.log(x);
    let PrayersTimings: Array<entity.PrayerTiming> = new Array();
    PrayersTimings.push({ prayerName: entity.Prayers.ASR, time: Date.now(), adjustment: 2 });
    debug(PrayersTimings + 'hi');
}

