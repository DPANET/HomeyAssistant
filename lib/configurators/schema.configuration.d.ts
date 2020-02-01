import { Schema, Model, Document } from 'mongoose';
import { IPrayersConfig, ILocationConfig } from './inteface.configuration';
import { IPrayersTime } from '../entities/prayer';
export declare const configSchema: Schema;
export interface IConfigSchemaModel extends Document {
    _id: Schema.Types.ObjectId;
    deviceID: string;
    config: {
        prayerConfig: {
            prayer: {
                timing: string;
            };
            calculations: IPrayersConfig;
        };
        locationConfig: ILocationConfig;
    };
}
export declare const prayerTimeSchema: Schema;
export interface IPrayerTimeSchemaModel extends Document {
    _id: Schema.Types.ObjectId;
    deviceID: string;
    prayersTime: IPrayersTime;
}
export declare const configModel: Model<IConfigSchemaModel>;
export declare const prayerTimeModel: Model<IPrayerTimeSchemaModel>;
