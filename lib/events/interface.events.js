"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerEventProvider = exports.EventProvider = exports.EventsType = void 0;
var EventsType;
(function (EventsType) {
    EventsType[EventsType["OnError"] = 0] = "OnError";
    EventsType[EventsType["OnCompleted"] = 1] = "OnCompleted";
    EventsType[EventsType["OnNext"] = 2] = "OnNext";
})(EventsType = exports.EventsType || (exports.EventsType = {}));
class EventProvider {
    constructor() {
        this._observers = new Array();
    }
    registerListener(observer) {
        this._observers.push(observer);
    }
    removeListener(observer) {
        this._observers.splice(this._observers.indexOf(observer, 1));
    }
    notifyObservers(eventsType, value, error) {
        for (let i of this._observers) {
            switch (eventsType) {
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
exports.EventProvider = EventProvider;
class TimerEventProvider extends EventProvider {
    registerListener(observer) {
        super.registerListener(observer);
    }
    removeListener(observer) {
        super.removeListener(observer);
    }
    notifyObservers(eventsType, value, error) {
        super.notifyObservers(eventsType, value, error);
    }
}
exports.TimerEventProvider = TimerEventProvider;
