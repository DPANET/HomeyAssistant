import { IPrayersTimeCache } from "../configurators/interface.userscache";
import { IConfig } from "../configurators/inteface.configuration";
import { IPrayersTime } from "../entities/prayer";
export declare class PrayerTimeCache implements IPrayersTimeCache {
    private _userCacheModel;
    constructor();
    createPrayerTimeCache(config: IConfig, prayersTime: IPrayersTime): Promise<boolean>;
    getPrayerTimeCache(config: IConfig): Promise<IPrayersTime>;
    updatePrayerTimeCache(config: IConfig, prayerTime: IPrayersTime): Promise<boolean>;
    deletePrayerTimeCache(config: IConfig): Promise<boolean>;
}
