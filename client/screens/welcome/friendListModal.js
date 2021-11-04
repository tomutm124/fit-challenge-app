import React from 'react';
import { FlatList } from 'react-native';
import ListItem from '../../shared/listItem';
import ClosableModal from '../../shared/closableModal';

function FriendList({ friends, onSelectFriend }) {
    return (
        <FlatList 
        data={friends} 
        keyExtractor={friend => friend.uid}
        renderItem={({ item }) => (
            <ListItem text={item.name} onPress={() => onSelectFriend(item)}/>
        )} />
    );
}

export default function FriendListModal({ visible, friends, onSelectFriend, onCancel }) {
    return (
        <ClosableModal visible={visible} onCancel={onCancel}>
            {friends ? <FriendList friends={friends} onSelectFriend={onSelectFriend}/> 
                : <ListItem text='No friend found.'/>}
        </ClosableModal>
    );
}