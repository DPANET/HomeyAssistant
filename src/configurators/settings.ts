import config = require('config');
interface IApiSettings
{
    timing:string,
    location: string
}
const paths = 
{
    apisettings: 'settings.apiSettings',
    apiurl: 'apis.urls',
    adjustmentSettings: 'settings.adjustments',
    calculationsSettings: 'settings.calcuations'

}
export class PrayerSettings {
    public static async getApiSettings(): Promise<IApiSettings> {
        return await config.get(paths.apisettings);

    }
    public static async getPrayersApiURL(urlType?:string , urlTiming?:string): Promise<string> {
      let urlSettings: IApiSettings;
      let _urlType:string, _urlTiming :string;
        if(urlType ===null)
        {
           urlSettings = await this.getApiSettings();
           _urlTiming= urlSettings.timing;
           _urlType= urlSettings.location;
        }
        else{
            _urlTiming= urlTiming;
            _urlType= urlType;
        }
        
        return await config.get(paths.apiurl+'.'+_urlType+'.'+_urlTiming);
    }

    public static async getPrayersSettings (): Promise<any>
    {
       

        return  await config.get(paths.adjustmentSettings);
    }


}