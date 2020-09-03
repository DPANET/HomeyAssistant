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
export interface ITimerObservable<T> extends IObservable<T>{
    startProvider(value?:any):Promise<void>;
    stopProvider():Promise<void>;
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
export abstract class TimerEventProvider<T> extends EventProvider<T> implements ITimerObservable<T>
{
    public abstract async startProvider(value?: any): Promise<void>;
    public abstract async stopProvider(): Promise<void>; 

}


