import { Schema, Model, Document } from 'mongoose';
import { IPrayersConfig, ILocationConfig } from '../configurators/inteface.configuration';
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
export declare const configModel: Model<IConfigSchemaModel>;
