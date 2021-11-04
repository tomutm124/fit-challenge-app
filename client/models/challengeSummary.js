import { roundFloat, getDateTitle } from '../services/utils';
import dayjs from 'dayjs';

export default class ChallengeSummary {
    #summaryData;
    #selfUid;
    #startDate;
    #numDays;

    constructor(challengeSummaryFromDb, selfUid, startDate, numDays) {
        roundAllScores(challengeSummaryFromDb);
        this.#summaryData = challengeSummaryFromDb;
        this.#selfUid = selfUid;
        this.#startDate = startDate;
        this.#numDays = numDays;
    }

    get totalScores() {
        const usersTotalScore = {
            self: 0,
            opponent: 0
        };
        if (this.#summaryData) {
            for (const dailySummary of Object.values(this.#summaryData)) {
                for (const [uid, dailyUserSummary] of Object.entries(dailySummary)) {
                    if (uid == this.#selfUid) {
                        usersTotalScore.self += dailyUserSummary.score;
                    } else {
                        usersTotalScore.opponent += dailyUserSummary.score;
                    }
                }
            }
        }
        usersTotalScore.self = roundFloat(usersTotalScore.self);
        usersTotalScore.opponent = roundFloat(usersTotalScore.opponent);
        return usersTotalScore;
    }

    toList() {
        const dailySummaryList = []
        const startDateDayjs = dayjs(this.#startDate);
        for (let i=1; i<=this.#numDays; i++) {
            const dailySummary = this.#summaryData?.[i] ? {...this.#summaryData[i]} : {};
            dailySummary.day = i;
            const date = startDateDayjs.add(i - 1, 'day').toDate();
            dailySummary.title = getDateTitle(date, i, this.#numDays);
            dailySummaryList.push(dailySummary);
        }
        return dailySummaryList;
    }
}

function roundAllScores(summaryData) {
    if (summaryData) {
        for (const dailySummary of Object.values(summaryData)) {
            for (const dailyUserSummary of Object.values(dailySummary)) {
                dailyUserSummary.score = roundFloat(dailyUserSummary.score);
            }
        }
    }
}
