import * as prayer from '../entities/prayer';
import * as manager from './manager';
export interface IObserver<T> {
    onCompleted(): void;
    onError(error: Error): void;
    onNext(value: T): void;
}
export interface IObservable<T> {
    registerListener(observer: IObserver<T>): void;
    removeListener(observer: IObserver<T>): void;
    notifyObservers(value: T, error?: Error): void;
}
export declare abstract class EventProvider<T> implements IObservable<T> {
    protected _observers: Array<IObserver<T>>;
    constructor();
    registerListener(observer: IObserver<T>): void;
    removeListener(observer: IObserver<T>): void;
    notifyObservers(value: T, error?: Error): void;
}
export declare class PrayersEventProvider extends EventProvider<prayer.IPrayersTiming> {
    private _prayerManager;
    private _upcomingPrayerEvent;
    constructor(prayerManager: manager.IPrayerManager);
    registerListener(observer: IObserver<prayer.IPrayersTiming>): void;
    removeListener(observer: IObserver<prayer.IPrayersTiming>): void;
    notifyObservers(prayersTime: prayer.IPrayersTiming, error?: Error): void;
    startPrayerSchedule(): void;
    stopPrayerSchedule(): void;
    private runNextPrayerSchedule;
}
export declare class PrayersEventListener implements IObserver<prayer.IPrayersTiming> {
    constructor();
    onCompleted(): void;
    onError(error: Error): void;
    onNext(value: prayer.IPrayersTiming): void;
}
