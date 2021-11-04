import Challenge from "../../models/challenge";

const challengeFromDb = {
    host: 'user1',
    guest: 'user2',
    breakfastMaxScore: 5,
    hostScale: 1,
    guestScale: 1.1,
    finalScores: {
        user1: 15.4,
        user2: 16
    }
};

test('DB field breakfastMaxScore returns unchanged value', () => {
    let challenge = new Challenge({...challengeFromDb}, 'user1');
    expect(challenge.breakfastMaxScore).toBe(5);
});

test('selfScale returns host scale when self is host', () => {
    let challenge = new Challenge({...challengeFromDb}, 'user1');
    expect(challenge.selfScale).toBe(1);
});

test('selfScale returns guest scale when self is guest', () => {
    let challenge = new Challenge({...challengeFromDb}, 'user2');
    expect(challenge.selfScale).toBeCloseTo(1.1);
});

test('opponentScale returns guest scale when self is host', () => {
    let challenge = new Challenge({...challengeFromDb}, 'user1');
    expect(challenge.opponentScale).toBeCloseTo(1.1);
});

test('opponentScale returns host scale when self is guest', () => {
    let challenge = new Challenge({...challengeFromDb}, 'user2');
    expect(challenge.opponentScale).toBe(1);
});

test('selfFinalScore returns host score when self is host', () => {
    let challenge = new Challenge({...challengeFromDb}, 'user1');
    expect(challenge.selfFinalScore).toBeCloseTo(15.4);
});

test('selfFinalScore returns guest score when self is guest', () => {
    let challenge = new Challenge({...challengeFromDb}, 'user2');
    expect(challenge.selfFinalScore).toBe(16);
});

test('opponentFinalScore returns guest score when self is host', () => {
    let challenge = new Challenge({...challengeFromDb}, 'user1');
    expect(challenge.opponentFinalScore).toBe(16);
});

test('opponentFinalScore returns host score when self is guest', () => {
    let challenge = new Challenge({...challengeFromDb}, 'user2');
    expect(challenge.opponentFinalScore).toBeCloseTo(15.4);
});