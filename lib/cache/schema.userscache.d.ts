import { Schema, Model, Document } from 'mongoose';
import { IPrayersTime } from '../entities/prayer';
export declare const prayerTimeSchema: Schema;
export interface IPrayerTimeSchemaModel extends Document {
    _id: Schema.Types.ObjectId;
    deviceID: string;
    prayersTime: IPrayersTime;
    expireAt: Date;
    createdAt: Date;
}
export declare const prayerTimeModel: Model<IPrayerTimeSchemaModel>;
