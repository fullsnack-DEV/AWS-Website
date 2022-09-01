import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';

import AuthContext from '../../../auth/context';
import {followUser, unfollowUser} from '../../../api/Users';
import TCUserList from '../connections/TCUserList';
import {getUserIndex} from '../../../api/elasticSearch';
import {strings} from '../../../../Localization/translation';
import TCRemoveUser from '../connections/TCRemoveUser';
import {removeAttendeeFromEvent} from '../../../api/Schedule';
import ActivityLoader from '../../../components/loader/ActivityLoader';

export default function GoingListScreen({navigation, route}) {
  const [going, setGoing] = useState([]);
  const [loading, setloading] = useState(false);
  const [eventData] = useState(route?.params?.eventData);
  const [showRemove] = useState(route?.params?.showRemove);
  const authContext = useContext(AuthContext);
  const userRole = authContext?.entity?.role;

  useEffect(() => {
    const getUserDetailQuery = {
      size: 1000,
      from: 0,
      query: {
        terms: {
          'user_id.keyword': route?.params?.going_ids,
        },
      },
    };

    getUserIndex(getUserDetailQuery)
      .then((res) => {
        setGoing(res);
        console.log('dsfdsfasd', res);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  }, [route?.params?.going_ids]);

  const removeAttendee = (userData) => {
    setloading(true);
    removeAttendeeFromEvent(eventData.cal_id, [userData.user_id], authContext)
      .then((response) => {
        setloading(false);
        navigation.pop(2);
        console.log('response-->', response);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <View style={{flex: 1}}>
        <FlatList
          data={going}
          keyExtractor={(index) => index.toString()}
          renderItem={({item}) => {
            const showFollowUnfollowButton = userRole === 'user';
            if (showRemove) {
              return (
                <TCRemoveUser
                  onProfilePress={() => {
                    navigation.push('HomeScreen', {
                      role: ['player', 'user']?.includes(item?.entity_type)
                        ? 'user'
                        : item?.entity_type,
                      uid: ['player', 'user']?.includes(item?.entity_type)
                        ? item?.user_id
                        : item?.group_id,
                      backButtonVisible: true,
                      menuBtnVisible: false,
                    });
                  }}
                  profileImage={item?.full_image}
                  entityType={item?.entity_type}
                  title={
                    item?.entity_type === 'player'
                      ? item?.full_name
                      : item?.group_name
                  }
                  subTitle={`${item?.city} , ${item?.country}`}
                  is_following={item?.is_following}
                  onRemovePress={() => {
                    Alert.alert(
                      'Are you sure you want to remove?',
                      '',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            removeAttendee(item);
                          },
                        },
                      ],
                      {cancelable: true},
                    );
                  }}
                />
              );
            }
            return (
              <TCUserList
                onProfilePress={() => {
                  navigation.push('HomeScreen', {
                    role: ['player', 'user']?.includes(item?.entity_type)
                      ? 'user'
                      : item?.entity_type,
                    uid: ['player', 'user']?.includes(item?.entity_type)
                      ? item?.user_id
                      : item?.group_id,
                    backButtonVisible: true,
                    menuBtnVisible: false,
                  });
                }}
                showFollowUnfollowButton={showFollowUnfollowButton}
                profileImage={item?.full_image}
                entityType={item?.entity_type}
                title={
                  item?.entity_type === 'player'
                    ? item?.full_name
                    : item?.group_name
                }
                subTitle={`${item?.city} , ${item?.country}`}
                is_following={item?.is_following}
                followUnfollowPress={(wantToFollow) => {
                  const entity_type = item?.entity_type;
                  const uid =
                    item?.entity_type === 'player'
                      ? item?.user_id
                      : item?.group_id;
                  if (wantToFollow) {
                    followUser({entity_type}, uid, authContext);
                  } else {
                    unfollowUser({entity_type}, uid, authContext);
                  }
                }}
              />
            );
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
