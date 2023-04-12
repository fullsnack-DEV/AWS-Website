import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {Alert, SafeAreaView, ScrollView} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import GroupInfo from '../../components/Home/GroupInfo';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import {
  getGroupDetails,
  getGroupMembers,
  getTeamsOfClub,
} from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';

const EntityInfoScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const {uid} = route.params;

  const [loading, setLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState();
  const [membersData, setMembersData] = useState();
  const [selectedVenue, setSelectedVenue] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      Promise.all([
        getGroupDetails(uid, authContext),
        getGroupMembers(uid, authContext),
        getTeamsOfClub(uid, authContext),
      ])
        .then(([groupResonse, memberResponse, teamsResponse]) => {
          const obj = {
            ...groupResonse.payload,
            joined_members: memberResponse.payload ?? [],
            joined_teams: teamsResponse.payload ?? [],
          };
          setCurrentUserData(obj);
          setMembersData(memberResponse.payload ?? []);
          setLoading(false);
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
    if (route.params?.selectedVenueObj) {
      obj.push(route?.params?.selectedVenueObj);
    } else {
      obj.push(currentUserData?.setting?.venue?.[0]);
    }
    setSelectedVenue(obj);
  }, [currentUserData, route.params]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.infoTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        rightIcon2={images.chat3Dot}
        containerStyle={{
          paddingHorizontal: 10,
          paddingTop: 6,
          paddingBottom: 14,
        }}
      />
      <ActivityLoader visible={loading} />

      <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <GroupInfo
          navigation={navigation}
          groupDetails={currentUserData}
          isAdmin={currentUserData?.am_i_admin}
          onGroupListPress={(groupList, type) => {
            navigation.push('GroupListScreen', {
              groups: groupList,
              entity_type: type,
            });
          }}
          onGroupPress={(groupObject) => {
            navigation.push('HomeScreen', {
              uid: groupObject?.group_id,
              backButtonVisible: true,
              role: groupObject?.entity_type,
            });
          }}
          onMemberPress={(memberObject) => {
            console.log('memberObject', memberObject);
          }}
          membersList={membersData}
          selectedVenue={selectedVenue}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EntityInfoScreen;
