import { roundFloat } from "../services/utils";

export default class Challenge {
    constructor(challengeFromDb, selfUid) {
        Object.assign(this, challengeFromDb);
        this.selfUid = selfUid;
        this.opponentUid = selfUid == this.host ? this.guest : this.host;
    }

    get selfScale() {
        return this.selfUid == this.host ? this.hostScale : this.guestScale;
    }

    get opponentScale() {
        return this.selfUid == this.host ? this.guestScale : this.hostScale; 
    }

    get selfFinalScore() {
        return roundFloat(this.finalScores?.[this.selfUid]);
    }

    get opponentFinalScore() {
        return roundFloat(this.finalScores?.[this.opponentUid]);
    }
}
