import dayjs from "dayjs";

const eps = 0.000001;

export function formatDateForDisplay(date) {
    return date.toLocaleString('en-GB', {month: 'short', year: 'numeric', day: 'numeric'});
}

export function formatDateForDb(date) {
    // yyyy-mm-dd
    return date.toISOString().split('T')[0];
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;
export function dateDiffInDays(date1, date2) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
}

export function getDateTitle(date, dayNum, totalDays) {
    const isToday = dateDiffInDays(new Date(), date) == 0;
    const dayjsObj = dayjs(date);
    if (dayNum <= totalDays) {
        return `Day ${dayNum} of ${totalDays} - ${isToday ? 'Today' : dayjsObj.format('D MMM')}`;
    } else {
        return `Challenge ended on ${dayjsObj.add(totalDays - dayNum, 'day').format('D MMM')}`;
    }
}

export function falsyToZero(num) {
    return num ? num : 0;
}

export function isNumericString(str) {
    if (typeof str != "string") return false; // we only process strings
    return !isNaN(str) && // parseFloat(1.2ab) returns 1.2
           !isNaN(parseFloat(str)); // ensure strings of whitespace fail
}

export function roundFloat(num) {
    // round to 2 dp
    return Math.round(num * 100) / 100;
}

export function getDoubleScore(selfScore, opponentScore) {
    if (selfScore === undefined) {
        return 0;
    } else if (opponentScore === undefined) {
        return selfScore;
    } else {
        return roundFloat((selfScore + opponentScore) / 2);
    }
}

export function getStepScore(steps, stepUnit, stepScorePerUnit) {
    return steps !== undefined ? roundFloat(parseInt(steps / stepUnit) * stepScorePerUnit) : 0;
}

export function getResultDescription(selfScore, opponentScore) {
    if (Math.abs(selfScore - opponentScore) < eps) {
        return 'tie by';
    } else if (selfScore > opponentScore) {
        return 'you won';
    } else {
        return 'you lost';
    }
}