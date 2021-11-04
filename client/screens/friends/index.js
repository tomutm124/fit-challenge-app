import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';
import PressableCard from '../../shared/pressableCard';
import { FriendsContext } from '../../global';
import { globalStyles } from '../../styles/global';
import FlatButton from '../../shared/button';
import AddFriendModal from './addFriendModal';
import * as friendService from '../../services/friend';
import EditFriendModal from './editFriendModal';

export default function Friends() {
    const friends = useContext(FriendsContext);
    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
    const [editFriendModalVisible, setEditFriendModalVisible] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const addFriend = (friend) => {
        setAddFriendModalVisible(false);
        const loadingToast = Toast.show('Adding friend...');
        friendService.addFriendAsync(friend).then(() => {
            Toast.hide(loadingToast);
            Toast.show(`Added new friend ${friend.name}`);
        }).catch((err) => {
            var errorMessage = 'Unknown error occurred. Please try again';
            if (typeof err === 'string') {
                errorMessage = err;
            } else {
                console.log(`Error adding friend: ${err}`);
            }
            Toast.hide(loadingToast);
            Toast.show(errorMessage, {duration: Toast.durations.LONG});
        });
    };

    return (
        <View style={globalStyles.container}>
            <AddFriendModal 
                visible={addFriendModalVisible} 
                onCancel={() => setAddFriendModalVisible(false)}
                onAdd={addFriend}
            />
            <EditFriendModal
                visible={editFriendModalVisible}
                onCancel={() => setEditFriendModalVisible(false)}
                friend={selectedFriend}
                onEdit={(friend) => {
                    friendService.updateFriendAsync(friend);
                    setEditFriendModalVisible(false);
                }}
                onDelete={(friend) => {
                    friendService.deleteFriend(friend.uid);
                    setEditFriendModalVisible(false);
                }}
            />
            <FlatButton title='Add A New Friend' onPress={() => setAddFriendModalVisible(true)} />
            <View style={{height: 20}} />
            <FlatList
                data={friends.toList()}
                keyExtractor={(friend) => friend.uid}
                renderItem={({ item }) => (
                    <PressableCard onPress={() => {
                        setSelectedFriend(item);
                        setEditFriendModalVisible(true);
                    }}>
                        <Text style={styles.friendName}>{item.name}</Text>
                    </PressableCard>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    friendName: {
        fontSize: 16
    }
})