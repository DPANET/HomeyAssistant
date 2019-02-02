"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class DateUtil {
    static addDay(days, dateNow) {
        return moment(dateNow).add(1, 'd').toDate();
    }
    static getTime(date, time) {
        return new Date(date + ' ' + time);
    }
    static getNowDate() {
        return new Date();
    }
    static getYear(date) {
        return date.getUTCFullYear();
    }
    static getMonth(date) {
        // console.log('Date : '+ date);
        return date.getUTCMonth() + 1;
    }
    static addMonth(months, date) {
        return moment(date, this.format).add(1, 'month').toDate();
    }
    static dayMatch(dateLeft, dateRight) {
        return (dateLeft.getUTCFullYear() == dateRight.getUTCFullYear()) &&
            (dateLeft.getUTCMonth() === dateRight.getUTCMonth()) &&
            (dateLeft.getUTCDay() === dateRight.getUTCDay());
    }
    static formatDate(date) {
        if (!date.includes('Z'))
            return new Date(date + 'Z');
        else
            return new Date(date);
    }
    static getMonthsDifference(startDate, endDate) {
        let startMoment = moment(startDate, this.format).startOf('month');
        let endMoment = moment(endDate, this.format).startOf('day');
        return endMoment.diff(startMoment, 'M', false);
    }
}
DateUtil.format = 'YYYY-MM-DD';
exports.DateUtil = DateUtil;
