const NUM_CHARS_TO_SHOW_FOR_NON_FRIEND = 6;

export default class Friends {
    #friendMap;
    constructor(friendMap) {
        this.#friendMap = friendMap ? friendMap : {};
    }

    getNameByUid(uid, defaultName) {
        if (defaultName === undefined) {
            defaultName = `User ${uid.substring(0, NUM_CHARS_TO_SHOW_FOR_NON_FRIEND)}...`;
        }
        return this.#friendMap[uid] ? this.#friendMap[uid] : defaultName;
    }

    toList() {
        return Object.entries(this.#friendMap).map(entry => ({
            uid: entry[0],
            name: entry[1]
        }));
    }
}
