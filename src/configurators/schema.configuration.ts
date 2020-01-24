import {Schema,Model,Document,model}  from 'mongoose';
import {IPrayersConfig,ILocationConfig} from './inteface.configuration'

export const configSchema: Schema = new Schema(
  {
    _id:{
      type: Schema.Types.ObjectId,
      createIndexes:true,
      required: true,
      auto: true,
    },
    deviceID:{type:String,
      unique:true}
    ,
    config: {
      prayerConfig: 
      {
        prayer: {
          timing: String
        },
        calculations: {
          method: Number,
          school: Number,
          midnight: Number,
          latitudeAdjustment: Number,
          adjustmentMethod: Number,
          adjustments: [
            {
              _id:false,
              prayerName: String,
              adjustments: Number
            }
          ]
        }
      }
      ,
      locationConfig: {
        location: {
          latitude: Number,
          longtitude: Number,
          city: String,
          countryCode: String,
          countryName: String,
          address: String
        },
        timezone: {
          timeZoneId: String,
          timeZoneName: String,
          dstOffset: Number,
          rawOffset: Number
        }
      }
    }
  }
);

export interface IConfigSchemaModel extends Document {
  _id: Schema.Types.ObjectId,
  deviceID: string,
  config:
  {
    prayerConfig:
    {
      prayer: {
        timing: string
      }
      ,
      calculations:IPrayersConfig
      // {
      //   method: number,
      //   school: number,
      //   midnight: number,
      //   latitudeAdjustment: number,
      //   adjustmentMethod: number,
      //   adjustments: [{ prayerName: string, adjustments: number }]
      // }
    },
      locationConfig:ILocationConfig
      // {
      //   location: {
      //     latitude: number,
      //     longtitude: number
      //     city: string,
      //     countryCode: string,
      //     countryName: string,
      //     address: string
      //   },
      //   timezone: {
      //     timeZoneName: string,
      //     dstOffset: number,
      //     rawOffset: number

      //   }
      // }

    }
  };

  export const configModel:Model<IConfigSchemaModel> = model('UsersPrayersConfig', configSchema, 'UsersPrayersConfig');
