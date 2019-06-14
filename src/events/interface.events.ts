export interface IObserver<T> {
    onCompleted(): void;
    onError(error: Error): void;
    onNext(value: T): void;
}
export interface IObservable<T> {
    registerListener(observer: IObserver<T>): void;
    removeListener(observer: IObserver<T>): void;
    notifyObservers(eventType:EventsType,value: T,error?:Error): void;
}
export enum EventsType 
{
    OnError =0,
    OnCompleted,
    OnNext

} 
export abstract class EventProvider<T> implements IObservable<T>
{
    protected _observers: Array<IObserver<T>>;
    constructor()
    {
        this._observers =  new Array<IObserver<T>>();
    }
    public registerListener(observer: IObserver<T>): void {
      this._observers.push(observer);
    }   
    public removeListener(observer: IObserver<T>): void {
        this._observers.splice(this._observers.indexOf(observer, 1));
    }
    public notifyObservers(eventsType:EventsType,value: T,error?:Error): void {       
        for (let i of this._observers)
        {
            switch(eventsType)
            {
                case EventsType.OnNext:
                i.onNext(value);
                break;
                case EventsType.OnError:
                i.onError(error);
                break;
                case EventsType.OnCompleted:
                i.onCompleted();
                break;

            }
        }    
    }
}
// export class PrayersEventProvider extends EventProvider<prayer.IPrayersTiming>
// {
//     private _prayerManager: manager.IPrayerManager;
//     private _upcomingPrayerEvent: cron.CronJob;
//     constructor(prayerManager: manager.IPrayerManager) {
//         super();
//         this._prayerManager = prayerManager; 
//     }
//     public registerListener(observer: IObserver<prayer.IPrayersTiming>): void {
//         super.registerListener(observer);
//     }
//     public removeListener(observer: IObserver<prayer.IPrayersTiming>): void {
//         super.removeListener(observer);
//     }
//     public notifyObservers(prayersTime: prayer.IPrayersTiming,error?:Error): void {
//         super.notifyObservers(prayersTime,error);
//     }
//     public startPrayerSchedule(): void 
//     {
//         if (isNullOrUndefined(this._upcomingPrayerEvent) || !this._upcomingPrayerEvent.running) {
//             this.runNextPrayerSchedule();
//         }
//     }
//     public stopPrayerSchedule(): void {
//         if (this._upcomingPrayerEvent.running)
//             this._upcomingPrayerEvent.stop();
//     }
//     private runNextPrayerSchedule(): void {
//         let prayerTiming: prayer.IPrayersTiming = this._prayerManager.getUpcomingPrayer();
//         this._upcomingPrayerEvent = new cron.CronJob(prayerTiming.prayerTime, () => { 
//             this.notifyObservers(prayerTiming,null) },
//             null, true);
//         this._upcomingPrayerEvent.addCallback(() => { setTimeout(() => this.runNextPrayerSchedule(), 60000); });
//     }
// }
// export class PrayersEventListener implements IObserver<prayer.IPrayersTiming>
// {
//     constructor()
//     {
//     }
//     onCompleted(): void {
//         throw new Error("Method not implemented.");
//     }
//     onError(error: Error): void {
//         throw new Error("Method not implemented.");
//     }
//     onNext(value: prayer.IPrayersTiming): void {
//         console.log(value);
//     }
// }

// export class PrayersRefreshEventProvider extends EventProvider<manager.IPrayerManager>
// {
//     private _prayerManager: manager.IPrayerManager;
//     private _refreshPrayersEvent: cron.CronJob;
//     constructor(prayerManager: manager.IPrayerManager) {
//         super();
//         this._prayerManager = prayerManager;
//     }
//     public registerListener(observer: IObserver<manager.IPrayerManager>): void {
//         super.registerListener(observer);
//     }
//     public removeListener(observer: IObserver<manager.IPrayerManager>): void {
//         super.removeListener(observer);
//     }
//     public notifyObservers(prayersTime: manager.IPrayerManager,error?:Error): void {
//         super.notifyObservers(prayersTime,error);
//     }
//     public startPrayerSchedule(): void 
//     {
//         if (isNullOrUndefined(this._refreshPrayersEvent) || !this._refreshPrayersEvent.start) {
//             this.runNextPrayerSchedule();
//         }
//     }
//     public stopPrayerSchedule(): void {
//         if (this._refreshPrayersEvent.running)
//             this._refreshPrayersEvent.stop();
//     }
//     private  runNextPrayerSchedule(): void {
//         this._refreshPrayersEvent = new cron.CronJob(this._prayerManager.getPrayerEndPeriond(), async () => { 
//            await this.scheduleRefresh() },
//             null, true);
//         this._refreshPrayersEvent.addCallback(() => { setTimeout(() => this.runNextPrayerSchedule(), 3000); });
//     }
//     private async scheduleRefresh():Promise<void>
//     {
//         let startDate:Date = this._prayerManager.getPrayerStartPeriod();
//         let endDate:Date = this._prayerManager.getPrayerEndPeriond();
//         startDate = DateUtil.addDay(1,startDate);
//         endDate = DateUtil.addMonth(1,endDate);
//         try{
//            this._prayerManager =  await this._prayerManager.updatePrayersDate(startDate,endDate);
//            this.notifyObservers(this._prayerManager);
//         }
//         catch(err)
//         {
//             this.notifyObservers(null,err);
//         }
//     }
// }

// export class PrayerRefreshEventListener implements IObserver<manager.IPrayerManager>
// {
//     constructor()
//     {
//     }
//     onCompleted(): void {
//     }
//     onError(error: Error): void {
//         debug(error);
//     }
//     onNext(value: manager.IPrayerManager): void {
//         debug(value);
//     }
// }