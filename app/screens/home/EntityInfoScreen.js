import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from 'react';
import {Alert, SafeAreaView} from 'react-native';
import GroupInfo from '../../components/Home/GroupInfo';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import {
  getGroupDetails,
  getGroupMembers,
  getTeamsOfClub,
  patchGroup,
} from '../../api/Groups';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import EntityInfoShimmer from '../../components/shimmer/account/EntityInfoShimmer';

import WrapperModal from '../../components/IncomingChallengeSettingsModals/WrapperModal';
import GroupInfoClubModal from './GroupInfoClubModal';
import GroupMembersModal from './GroupMembersModal';
import EditInfoModalGroup from './EditInfoModalGroup';

const EntityInfoScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);

  const {uid} = route.params;
  const [loading, setLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState();
  const [selectedVenue, setSelectedVenue] = useState([]);
  const [visibleVenueModal, setVisibleVenuModal] = useState(false);
  const [visibleClubListModal, setClubListModal] = useState(false);
  const [clubsOfTeam, setclubsOfTeam] = useState([]);
  const [entityType, setentityType] = useState();
  const [visibleEditInfo, setVisibleEditInfo] = useState(false);
  const [refreshInfo, setRefreshInfo] = useState(false);

  const bottomSheetRef = useRef(null);

  useEffect(() => {
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
          joined_clubs: groupResonse.payload?.parent_groups ?? [],
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
  }, [authContext, uid, refreshInfo]);

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
        setVisibleEditInfo(true);
        // navigation.navigate('EditGroupBasicInfoScreen', {
        //   groupDetails: currentUserData,
        //   isEditable: true,
        // });
        break;

      case strings.matchVenues:
        setTimeout(() => {
          setVisibleVenuModal(true);
        }, 500);

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

  const patchVenueDetails = (venueDeatils) => {
    setLoading(true);
    const bodyParams = {
      ...currentUserData,
      setting: {
        ...currentUserData.setting,
        venue: venueDeatils.venue,
      },
    };

    patchGroup(currentUserData.group_id, bodyParams, authContext)
      .then(() => {
        setLoading(false);
        setVisibleVenuModal(false);
        setCurrentUserData({
          ...currentUserData,
          setting: {
            ...currentUserData.setting,
            venue: venueDeatils.venue,
          },
        });
      })
      .catch((e) => {
        console.log(e.message);
      });
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
          authContext={authContext}
          onSeeAll={(option = '', clubsofteam = []) => {
            switch (option) {
              case strings.membersTitle:
                bottomSheetRef.current?.present();

                break;

              case strings.clubsTitleText:
                setclubsOfTeam(clubsofteam);
                setClubListModal(true);
                setentityType(Verbs.entityTypeClub);

                break;

              case strings.teamsTiteInfo:
                setclubsOfTeam(currentUserData.joined_teams);
                setentityType(Verbs.entityTypeTeam);
                setClubListModal(true);

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
      <WrapperModal
        isVisible={visibleVenueModal}
        closeModal={() => setVisibleVenuModal(false)}
        title={strings.venue}
        settingsObj={currentUserData?.setting}
        onSave={(settings) => {
          patchVenueDetails(settings);

          setSelectedVenue({...settings});
        }}
      />
      <GroupInfoClubModal
        isVisible={visibleClubListModal}
        oncloseModal={() => setClubListModal(false)}
        groups={clubsOfTeam}
        entity_type={entityType}
        refreshInfo={() => setRefreshInfo(true)}
      />

      <GroupMembersModal
        bottomSheetRef={bottomSheetRef}
        groupID={uid}
        showMember={currentUserData?.show_members}
      />

      <EditInfoModalGroup
        visible={visibleEditInfo}
        onClose={() => setVisibleEditInfo(false)}
        groupDetails={currentUserData}
        isEditable={true}
        authContext={authContext}
      />
    </SafeAreaView>
  );
};

export default EntityInfoScreen;
