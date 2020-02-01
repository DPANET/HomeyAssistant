import { IConfig } from './inteface.configuration';
import { IPrayersTime } from '../entities/prayer';
export interface IPrayersTimeCache {
    createPrayerTimeCache(config: IConfig, prayerTime: IPrayersTime): Promise<boolean>;
    getPrayerTimeCache(config: IConfig): Promise<IPrayersTime>;
    updatePrayerTimeCache(config: IConfig, prayerTime: IPrayersTime): Promise<boolean>;
    deletePrayerTimeCache(config: IConfig): Promise<boolean>;
}
