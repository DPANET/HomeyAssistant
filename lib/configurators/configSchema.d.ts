import * as mongoose from 'mongoose';
export declare const configSchema: mongoose.Schema;
export interface IConfigSchemaModel extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    config: {
        prayerConfig: {
            prayer: {
                timing: string;
            };
        };
        calculations: {
            method: number;
            school: number;
            midnight: number;
            latitudeAdjustment: number;
            adjustmentMethod: number;
            adjustments: [{
                prayerName: string;
                adjustments: number;
            }];
        };
        locationConfig: {
            location: {
                latitude: number;
                longtitude: number;
                city: string;
                countryCode: string;
                countryName: string;
                address: string;
            };
            timezone: {
                timeZoneName: string;
                dstOffset: number;
                rawOffset: number;
            };
        };
    };
}
export declare const test = 2;
