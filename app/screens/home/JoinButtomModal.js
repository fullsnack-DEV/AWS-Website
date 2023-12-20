import React, {useState, useContext, useEffect} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import GroupInfo from '../../components/Home/GroupInfo';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';

export default function JoinButtonModal({
  isVisible,
  closeModal = () => {},
  currentUserData,
  onJoinPress = () => {},
  onAcceptPress,
  isInvited = false,
  hideMessageBox = false,
  title = '',
  forUserRespond = false,
  onDecline = () => {},
}) {
  const [selectedVenue] = useState([]);
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  const [teamOptions, setTeamOptions] = useState([]);
  const [teamOptiosnForJoin, setTeamOptiosnForJoin] = useState([]);
  const [clubOptiosnForJoin, setClubOptiosnForJoin] = useState([]);
  const [clubOptions, setClubOptions] = useState([]);

  useEffect(() => {
    setTeamOptions([
      strings.bio,
      strings.basicinfotitle,
      // strings.homeFacility,
      strings.membersTitle,
      strings.tcLevelPointsText,
      strings.tcranking,
      strings.matchVenues,
      strings.clubsTitleText,
      strings.membershipFee,
      strings.bylaw,
    ]);

    setTeamOptiosnForJoin([
      strings.bio,
      strings.basicInfoText,
      // strings.homeFacility,
      strings.matchVenues,
      strings.membershipFeesTitle,
      strings.bylaw,
    ]);

    setClubOptiosnForJoin([
      strings.bio,
      strings.basicInfoText,
      // strings.homeFacility,
      strings.matchVenues,
      strings.membershipFeesTitle,
      strings.bylaw,
    ]);

    setClubOptions([
      strings.bio,
      strings.basicInfoText,
      strings.membersTitle,
      strings.teamsTiteInfo,
      strings.membershipFee,
      strings.bylaw,
      strings.history,
    ]);
  }, [isVisible]);

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={ModalTypes.default}
      title={
        title === ''
          ? format(strings.joinModaltitle, currentUserData?.entity_type)
          : title
      }
      containerStyle={{flex: 1, paddingTop: 0, paddingHorizontal: 0}}>
      <View style={{flex: 1}}>
        {/* Team Ifo */}

        <GroupInfo
          navigation={navigation}
          groupDetails={currentUserData}
          teamOptions={teamOptions}
          clubOptions={clubOptions}
          teamOptiosnForJoin={teamOptiosnForJoin}
          clubOptiosnForJoin={clubOptiosnForJoin}
          isAdmin={currentUserData?.am_i_admin}
          authContext={authContext}
          onSeeAll={(option = '', clubsofteam = []) => {
            switch (option) {
              case strings.membersTitle:
                navigation.navigate('App', {
                  screen: 'Members',
                  params: {
                    groupObj: currentUserData,
                    groupID: currentUserData.group_id,
                    fromProfile: true,
                    showBackArrow: true,
                  },
                });
                break;

              case strings.clubsTitleText:
                navigation.push('GroupListScreen', {
                  groups: clubsofteam,
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
          forJoinButton={true}
          onJoinPress={(message) => onJoinPress(message)}
          onAcceptPress={() => onAcceptPress()}
          isInvited={isInvited}
          isAccept={isInvited}
          forUserRespond={forUserRespond}
          hideMessageBox={hideMessageBox}
          onDecline={onDecline}
        />
      </View>
    </CustomModalWrapper>
  );
}
