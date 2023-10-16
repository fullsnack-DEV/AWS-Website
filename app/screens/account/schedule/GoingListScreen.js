import React, {useEffect, useState, useContext, useCallback} from 'react';
import {View, FlatList, Alert, SafeAreaView} from 'react-native';
import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import {getUserIndex} from '../../../api/elasticSearch';
import {strings} from '../../../../Localization/translation';
import TCRemoveUser from '../connections/TCRemoveUser';
import {removeAttendeeFromEvent} from '../../../api/Schedule';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import ScreenHeader from '../../../components/ScreenHeader';

export default function GoingListScreen({navigation, route}) {
  const [going, setGoing] = useState([]);
  const [loading, setloading] = useState(false);
  const [eventData] = useState(route.params.eventData ?? {});
  const authContext = useContext(AuthContext);

  const fetchGoingList = useCallback((groupIds = []) => {
    const getUserDetailQuery = {
      size: 1000,
      from: 0,
      query: {
        terms: {
          'user_id.keyword': groupIds,
        },
      },
    };

    getUserIndex(getUserDetailQuery)
      .then((res) => {
        setGoing(res);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, []);

  useEffect(() => {
    if (route.params.going_ids?.length > 0) {
      fetchGoingList(route.params.going_ids);
    }
  }, [route.params.going_ids, fetchGoingList]);

  const removeAttendee = (userData = {}) => {
    setloading(true);
    removeAttendeeFromEvent(eventData.cal_id, [userData.user_id], authContext)
      .then(() => {
        setloading(false);
        navigation.navigate('App', {
          screen: 'Schedule',
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.going}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
      />
      <ActivityLoader visible={loading} />

      <View style={{flex: 1, paddingTop: 20}}>
        <FlatList
          data={going}
          keyExtractor={(index) => index.toString()}
          renderItem={({item}) => (
            <TCRemoveUser
              item={item}
              isOwner={eventData.owner_id === authContext.entity.uid}
              onProfilePress={() => {
                navigation.push('HomeScreen', {
                  role: item.entity_type,
                  uid: item.user_id ?? item.group_id,
                  backButtonVisible: true,
                  menuBtnVisible: false,
                });
              }}
              onRemovePress={() => {
                Alert.alert(
                  format(
                    strings.areYouSureToRemove,
                    item.full_name ?? item.group_name,
                  ),
                  strings.removeGoingModalText,
                  [
                    {
                      text: strings.cancel,
                      style: 'cancel',
                    },
                    {
                      text: strings.okTitleText,
                      onPress: () => {
                        removeAttendee(item);
                      },
                    },
                  ],
                  {cancelable: true},
                );
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
