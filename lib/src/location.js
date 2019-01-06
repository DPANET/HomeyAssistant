"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
exports.googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_API_KEY
});
