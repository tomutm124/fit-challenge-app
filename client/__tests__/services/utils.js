import * as utils from '../../services/utils';

test('formatDateForDisplay returns D MMM YYYY format', () => {
    expect(utils.formatDateForDisplay(new Date('2021-10-02T12:00:00'))).toBe('2 Oct 2021');
});

test('formatDateForDb returns YYYY-MM-DD format', () => {
    expect(utils.formatDateForDb(new Date('2021-10-02T12:00:00'))).toBe('2021-10-02');
});

test('dateDiffInDays returns diff in days even when acutal time diff is less than a whole day', () => {
    let d1 = new Date('2021-10-02T23:59:00');
    let d2 = new Date('2021-10-03T00:00:00');
    expect(utils.dateDiffInDays(d2, d1)).toBe(1);
});

test('dateDiffInDays returns diff in days even when acutal time diff is more than a day', () => {
    let d1 = new Date('2021-10-02T00:00:00');
    let d2 = new Date('2021-10-05T23:59:00');
    expect(utils.dateDiffInDays(d2, d1)).toBe(3);
});

test('getDateTitle returns Day X description when specified day is before challenge end', () => {
    let date = new Date('2021-10-02T23:59:00');
    expect(utils.getDateTitle(date, 3, 7)).toBe('Day 3 of 7 - 2 Oct');
});

test('getDateTitle returns Day X description when specified day is at challenge end', () => {
    let date = new Date('2021-10-02T23:59:00');
    expect(utils.getDateTitle(date, 7, 7)).toBe('Day 7 of 7 - 2 Oct');
});

test('getDateTitle returns challenge ended message when specified day is after challenge end', () => {
    let date = new Date('2021-10-02T23:59:00');
    expect(utils.getDateTitle(date, 8, 7)).toBe('Challenge ended on 1 Oct');
});

test('falsyToZero returns original num when not falsy', () => {
    expect(utils.falsyToZero(1)).toBe(1);
});

test('falsyToZero returns 0 when null', () => {
    expect(utils.falsyToZero(null)).toBe(0);
});

test('falsyToZero returns 0 when undefined', () => {
    expect(utils.falsyToZero(undefined)).toBe(0);
});

test('isNumericString returns true for floating point num', () => {
    expect(utils.isNumericString('12.34')).toBe(true);
});

test('isNumericString returns false for string with letters', () => {
    expect(utils.isNumericString('12.34ab')).toBe(false);
});

test('isNumericString returns false for empty string', () => {
    expect(utils.isNumericString('')).toBe(false);
});

test('isNumericString returns false for null and undefined', () => {
    expect(utils.isNumericString(null)).toBe(false);
    expect(utils.isNumericString(undefined)).toBe(false);
});

test('roundFloat rounds floating point num to 2dp', () => {
    expect(utils.roundFloat(12.345)).toBeCloseTo(12.35);
});

test('getDoubleScore returns 0 when selfScore is undefined', () => {
    expect(utils.getDoubleScore(undefined, 5)).toBe(0);
});

test('getDoubleScore returns selfScore when opponentScore is undefined', () => {
    expect(utils.getDoubleScore(3, undefined)).toBe(3);
});

test('getDoubleScore returns average of selfScore and opponentScore when both are defined', () => {
    expect(utils.getDoubleScore(4.2, 7.3)).toBeCloseTo((4.2 + 7.3) / 2);
});

test('getStepScore returns 0 when steps is undefined', () => {
    expect(utils.getStepScore(undefined, 500, 1)).toBe(0);
});

test('getStepScore rounds down when steps is not multiple of stepUnit', () => {
    expect(utils.getStepScore(1400, 500, 0.5)).toBeCloseTo(0.5 * 2);
});

test('getResultDescription returns winning message when selfScore is larger than opponentScore', () => {
    expect(utils.getResultDescription(10.1, 10)).toBe('you won');
});

test('getResultDescription returns losing message when selfScore is smaller than opponentScore', () => {
    expect(utils.getResultDescription(10, 10.1)).toBe('you lost');
});

test('getResultDescription returns tied message when selfScore is close to opponentScore', () => {
    expect(utils.getResultDescription(10.1, 10.1)).toBe('tie by');
});
