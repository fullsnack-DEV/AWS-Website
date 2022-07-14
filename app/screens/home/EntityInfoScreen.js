import React, {useContext, useEffect, useState, useCallback} from 'react';
import {Alert, SafeAreaView, ScrollView} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import GroupInfo from '../../components/Home/GroupInfo';
import strings from '../../Constants/String';
import AuthContext from '../../auth/context';
import {getGroupDetails, getGroupMembers} from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';

// import { useIsFocused } from '@react-navigation/native';

// const entity = {};
export default function EntityInfoScreen({navigation, route}) {
  const isFocused = useIsFocused();
  const [uid] = useState(route?.params?.uid);
  const [isAdmin] = useState(route?.params?.isAdmin);
  // const [onGroupListPress] = useState(route?.params?.onGroupListPress);
  // const [onTeamPress] = useState(route?.params?.onTeamPress);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState();
  const [membersData, setMembersData] = useState();
  const [selectedVenue, setSelectedVenue] = useState([]);
  useEffect(() => {
    if (isFocused) {
      getGroupDetails(uid, authContext)
        .then((response) => {
          console.log('response group:=>', response);
          getGroupMembers(response.payload.group_id, authContext)
            .then((members) => {
              console.log('members:=>', members);
              setLoading(false);
              setMembersData(members.payload);
            })
            .catch((e) => {
              setLoading(false);
              setTimeout(() => {
                Alert.alert(strings.alertmessagetitle, e.message);
              }, 10);
            });
          setLoading(false);
          setCurrentUserData(response.payload);
        })
        .catch((e) => {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused, uid]);

  useEffect(() => {
    const obj = [];
    if (route?.params?.selectedVenueObj) {
      console.log(
        'route?.params?.selectedVenueObj',
        route?.params?.selectedVenueObj,
      );
      obj.push(route?.params?.selectedVenueObj);
    } else {
      obj.push(currentUserData?.setting?.venue?.[0]);
    }
    setSelectedVenue(obj);
  }, [currentUserData?.setting?.venue, route?.params?.selectedVenueObj]);

  const onTeamPress = useCallback(
    (groupObject) => {
      navigation.push('HomeScreen', {
        uid: groupObject?.group_id,
        backButtonVisible: true,
        role: groupObject?.entity_type,
      });
    },
    [navigation],
  );

  const onGroupListPress = (groupList, entityType) => {
    navigation.push('GroupListScreen', {
      groups: groupList,
      entity_type: entityType,
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <GroupInfo
          navigation={navigation}
          groupDetails={currentUserData}
          isAdmin={isAdmin}
          onGroupListPress={onGroupListPress}
          onGroupPress={onTeamPress}
          onMemberPress={route?.params?.onMemberPress}
          membersList={membersData}
          selectedVenue={selectedVenue}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
