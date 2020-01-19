import {Schema,Model,Document,model}  from 'mongoose';

export const configSchema: Schema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    deviceID:String,
    config: {
      prayerConfig: {
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
              prayerName: String,
              adjustments: Number
            }
          ]
        }
      },
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
      calculations:
      {
        method: number,
        school: number,
        midnight: number,
        latitudeAdjustment: number,
        adjustmentMethod: number,
        adjustments: [{ prayerName: string, adjustments: number }]
      }
    },
      locationConfig:
      {
        location: {
          latitude: number,
          longtitude: number
          city: string,
          countryCode: string,
          countryName: string,
          address: string
        },
        timezone: {
          timeZoneName: string,
          dstOffset: number,
          rawOffset: number

        }
      }

    }
  };

  export const configModel:Model<IConfigSchemaModel> = model('UsersPrayersConfig', configSchema, 'UsersPrayersConfig');
