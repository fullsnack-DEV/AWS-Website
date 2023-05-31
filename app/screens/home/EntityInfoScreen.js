import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {Alert, SafeAreaView} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import GroupInfo from '../../components/Home/GroupInfo';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import {
  getGroupDetails,
  getGroupMembers,
  getJoinedGroups,
  getTeamsOfClub,
} from '../../api/Groups';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import EntityInfoShimmer from '../../components/shimmer/account/EntityInfoShimmer';

const EntityInfoScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const {uid} = route.params;
  const [loading, setLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState();
  const [selectedVenue, setSelectedVenue] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      Promise.all([
        getGroupDetails(uid, authContext),
        getGroupMembers(uid, authContext),
        getTeamsOfClub(uid, authContext),
        getJoinedGroups(Verbs.entityTypeClub, authContext),
      ])
        .then(([groupResonse, memberResponse, teamsResponse, clubList]) => {
          const obj = {
            ...groupResonse.payload,
            joined_members: memberResponse.payload ?? [],
            joined_teams: teamsResponse.payload ?? [],
            joined_clubs: clubList.payload ?? [],
          };
          setCurrentUserData(obj);
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

  const handleEditOptions = (option) => {
    switch (option) {
      case strings.bio:
        navigation.navigate('GroupLongTextScreen', {
          groupDetails: currentUserData,
        });
        break;

      case strings.basicInfoText:
        navigation.navigate('EditGroupBasicInfoScreen', {
          groupDetails: currentUserData,
          isEditable: true,
        });
        break;

      case strings.matchVenues:
        navigation.navigate('Venue', {
          settingObj: authContext.entity.obj.setting ?? {},
          comeFrom: 'EntityInfoScreen',
          sportName: currentUserData.sport,
          sportType: currentUserData.sport_type,
        });
        break;

      case strings.membershipFee:
        navigation.navigate('MembershipFeeScreen', {
          groupDetails: currentUserData,
        });
        break;

      case strings.bylaw:
        navigation.navigate('GroupLongTextScreen', {
          groupDetails: currentUserData,
          isBylaw: true,
        });
        break;

      case strings.history:
        break;

      default:
        break;
    }
  };

  const handlePrivacyOptions = (option) => {
    switch (option) {
      case strings.bio:
        break;

      case strings.basicInfoText:
        break;

      case strings.homeFacility:
        break;

      case strings.membersTitle:
        break;

      case strings.matchVenues:
        break;

      case strings.clubsTitleText:
        break;

      case strings.membershipFee:
        break;

      case strings.teams:
        break;

      case strings.bylaw:
        break;

      case strings.history:
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.infoTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        rightIcon2={images.chat3Dot}
      />
      {loading ? (
        <EntityInfoShimmer />
      ) : (
        <GroupInfo
          navigation={navigation}
          groupDetails={currentUserData}
          isAdmin={currentUserData?.am_i_admin}
          onSeeAll={(option = '') => {
            switch (option) {
              case strings.membersTitle:
                navigation.navigate('GroupMembersScreen', {
                  groupObj: currentUserData,
                  groupID: currentUserData.group_id,
                  fromProfile: true,
                });
                break;

              case strings.clubsTitleText:
                navigation.push('GroupListScreen', {
                  groups: currentUserData.joined_clubs,
                  entity_type: Verbs.entityTypeClub,
                });
                break;

              case strings.teams:
                navigation.push('GroupListScreen', {
                  groups: currentUserData.joined_teams,
                  entity_type: Verbs.entityTypeTeam,
                });
                break;

              default:
                break;
            }
          }}
          onPressMember={(groupObject) => {
            navigation.push('HomeScreen', {
              uid: groupObject?.user_id,
              role: Verbs.entityTypeUser,
            });
          }}
          onPressGroup={(groupObject) => {
            navigation.push('HomeScreen', {
              uid: groupObject?.group_id,
              backButtonVisible: true,
              role: groupObject?.entity_type,
            });
          }}
          selectedVenue={selectedVenue}
          onEdit={handleEditOptions}
          onClickPrivacy={handlePrivacyOptions}
          onAddMember={() => {}}
        />
      )}
    </SafeAreaView>
  );
};

export default EntityInfoScreen;
