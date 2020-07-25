import * as mongoose from 'mongoose';
import { IPrayersTime } from '../entities/prayer';
export declare const prayerTimeSchema: mongoose.Schema;
export interface IPrayerTimeSchemaModel extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    deviceID: string;
    prayersTime: IPrayersTime;
    expireAt: Date;
    createdAt: Date;
}
export declare const prayerTimeModel: mongoose.Model<IPrayerTimeSchemaModel>;
