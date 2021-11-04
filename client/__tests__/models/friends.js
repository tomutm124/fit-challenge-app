import Friends from "../../models/friends"

const friendMap = {
    'u123456': 'Peter',
    'u234567': 'Paul',
    'u345678': 'Mary'
};

test('getNameByUid returns "User" followed by at least first 4 chars of UID for non friend when no ' +
    'default value is provided', () => {
    const friends = new Friends(friendMap);
    expect(friends.getNameByUid('u987654').substring(0, 9)).toBe('User u987');
});

test('getNameByUid returns default name for non friend', () => {
    const friends = new Friends(friendMap);
    expect(friends.getNameByUid('u987654', 'MyFriend')).toBe('MyFriend');
});

test('getNameByUid returns default name for non friend when friendMap is empty in DB', () => {
    const friends = new Friends(null);
    expect(friends.getNameByUid('u987654', 'MyFriend')).toBe('MyFriend');
});

test('getNameByUid returns correct friend name', () => {
    const friends = new Friends(friendMap);
    expect(friends.getNameByUid('u234567')).toBe('Paul');
});

