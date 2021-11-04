import ChallengeSummary from "../../models/challengeSummary";

const challengeSummaryFromDb = {
    1: {
        user1: {
            isComplete: true,
            score: 12.2
        },
        user2: {
            isComplete: true,
            score: 13.6
        }
    },
    2: {
        user1: {
            isComplete: true,
            score: 14.9
        },
        user2: {
            isComplete: false,
            score: 15.9
        },
    },
    3: {
        user2: {
            isComplete: false,
            score: 16.3
        },
    }
};

test('totalScores returns 0 when database is empty', () => {
    const challengeSummary = new ChallengeSummary(null, 'user1', '2021-10-01', 3);
    const totalScores = challengeSummary.totalScores;
    expect(totalScores.self).toBe(0);
    expect(totalScores.opponent).toBe(0);
});

test('totalScores returns correct self and opponent scores', () => {
    const challengeSummary = new ChallengeSummary({...challengeSummaryFromDb}, 'user1', '2021-10-01', 3);
    const totalScores = challengeSummary.totalScores;
    expect(totalScores.self).toBeCloseTo(12.2 + 14.9);
    expect(totalScores.opponent).toBeCloseTo(13.6 + 15.9 + 16.3);
});

test('toList returns numDays many days when database is empty', () => {
    const challengeSummary = new ChallengeSummary(null, 'user1', '2021-10-01', 3);
    const summaryList = challengeSummary.toList();
    expect(summaryList.length).toBe(3);
    expect(summaryList[0].day).toBe(1);
    expect(summaryList[1].day).toBe(2);
    expect(summaryList[2].day).toBe(3);
});

test('toList returns numDays many days when database has records for all days', () => {
    const challengeSummary = new ChallengeSummary(challengeSummaryFromDb, 'user1', '2021-10-01', 3);
    const summaryList = challengeSummary.toList();
    expect(summaryList.length).toBe(3);
    expect(summaryList[0].day).toBe(1);
    expect(summaryList[1].day).toBe(2);
    expect(summaryList[2].day).toBe(3);
});

test('toList returns numDays many days when database has fewer records than numDays', () => {
    const challengeSummary = new ChallengeSummary(challengeSummaryFromDb, 'user1', '2021-10-01', 4);
    const summaryList = challengeSummary.toList();
    expect(summaryList.length).toBe(4);
    expect(summaryList[0].day).toBe(1);
    expect(summaryList[1].day).toBe(2);
    expect(summaryList[2].day).toBe(3);
    expect(summaryList[3].day).toBe(4);
});

test('toList returns correct scores for days', () => {
    const challengeSummary = new ChallengeSummary(challengeSummaryFromDb, 'user1', '2021-10-01', 4);
    const summaryList = challengeSummary.toList();
    expect(summaryList[0].user1?.score).toBeCloseTo(12.2);
    expect(summaryList[0].user2?.score).toBeCloseTo(13.6);
    expect(summaryList[1].user1?.score).toBeCloseTo(14.9);
    expect(summaryList[1].user2?.score).toBeCloseTo(15.9);
    expect(summaryList[2].user1?.score).toBeUndefined();
    expect(summaryList[2].user2?.score).toBeCloseTo(16.3);
    expect(summaryList[3].user2?.score).toBeUndefined();
});

