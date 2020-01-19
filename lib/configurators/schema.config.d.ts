import { Schema, Model, Document } from 'mongoose';
export declare const configSchema: Schema;
export interface IConfigSchemaModel extends Document {
    _id: Schema.Types.ObjectId;
    deviceID: string;
    config: {
        prayerConfig: {
            prayer: {
                timing: string;
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
export declare const configModel: Model<IConfigSchemaModel>;
