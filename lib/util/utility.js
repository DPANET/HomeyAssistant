"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class DateUtil {
    static getTime(date, time) {
        return new Date(date + ' ' + time + 'Z');
    }
    static getYear(date) {
        return date.getFullYear();
    }
    static getMonth(date) {
        // console.log('Date : '+ date);
        return date.getMonth() + 1;
    }
    static addMonth(months, date) {
        return moment(date, this.format).add(1, 'month').toDate();
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
