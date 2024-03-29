"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
const moment_1 = __importDefault(require("moment"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class DateUtil {
    static getEndofDate(endDate) {
        return moment_1.default.utc(endDate).endOf('D').toDate();
    }
    static addDay(days, dateNow) {
        return moment_1.default.utc(dateNow).add(1, 'd').toDate();
    }
    static addMinutes(date, minutes) {
        return moment_1.default.utc(date).add(minutes, 'minute').toDate();
    }
    static getTime(date, time) {
        // console.log(`${date}, ${time}`);
        let timeFormat = 'DD MMM YYYY, hh:mm';
        // return moment.utc(`${date}, ${time}`,timeFormat).toDate();
        return (0, moment_1.default)(`${date}, ${time}`, timeFormat).toDate();
        //return new Date(date + ' '+time);
    }
    static getNowDate() {
        return moment_1.default.utc(new Date(), this.format).startOf('day').toDate();
    }
    static getNowTime() {
        return new Date();
    }
    static getYear(date) {
        return date.getUTCFullYear();
    }
    static getMonth(date) {
        return date.getUTCMonth() + 1;
    }
    static addMonth(months, date) {
        return (0, moment_1.default)(date, this.format).add(months, 'month').toDate();
    }
    static dayMatch(dateLeft, dateRight) {
        let value = (dateLeft.getUTCFullYear() === dateRight.getUTCFullYear()) &&
            (dateLeft.getUTCMonth() === dateRight.getUTCMonth()) &&
            (dateLeft.getUTCDate() === dateRight.getUTCDate());
        return value;
    }
    static formatDate(date) {
        return moment_1.default.utc(date, 'DD MMM YYYY').toDate();
    }
    static getDateByTimeZone(date, timeZone) {
        return (0, moment_timezone_1.default)(date).tz(timeZone).format();
    }
    static getDateByTimeZoneFromString(date, time, timeZone) {
        let timeFormat = 'DD MMM YYYY, hh:mm';
        //console.log(timeZone);
        //timeZone="Asia/Dubai"
        return moment_1.default.tz(`${date}, ${time}`, timeFormat, timeZone).toDate();
    }
    static getStartOfDay(date) {
        return moment_1.default.utc(date, this.format).startOf('day').toDate();
    }
    static getMonthsDifference(startDate, endDate) {
        let startMoment = moment_1.default.utc(startDate, this.format).startOf('month');
        let endMoment = moment_1.default.utc(endDate, this.format).startOf('day');
        return endMoment.diff(startMoment, 'M', false);
    }
}
exports.DateUtil = DateUtil;
DateUtil.format = 'YYYY-MM-DD';
