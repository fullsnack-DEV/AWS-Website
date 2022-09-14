import React, {useRef, useState} from 'react';
import {View, FlatList} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {strings} from '../../../../../../Localization/translation';
import EditEventItem from '../../../../../components/Schedule/EditEventItem';
import PlayInEditModal from '../PlayInEditModal';
import PlaysInEditPrivacySettings from '../PlaysInEditPrivacySettings';
import TCThinDivider from '../../../../../components/TCThinDivider';
import images from '../../../../../Constants/ImagePath';
import TeamClubLeagueView from '../../../../../components/Home/TeamClubLeagueView';
import Verbs from '../../../../../Constants/Verbs';

const PlaysInClubs = ({
  closePlayInModal,
  isAdmin,
  currentUserData,
  onSave,
  navigation,
  sportName,
  openPlayInModal = () => {},
}) => {
  const actionSheet = useRef();
  const [showEditPlaysInModal, setShowEditPlaysInModal] = useState(false);
  const [editModalType, setEditModalType] = useState('');

  const renderTeamClubLeague = ({item}) => {
    let teamIcon = '';
    let teamImagePH = '';
    if (item.entity_type === Verbs.entityTypeTeam) {
      teamIcon = images.myTeams;
      teamImagePH = images.team_ph;
    } else if (item.entity_type === Verbs.entityTypeClub) {
      teamIcon = images.myClubs;
      teamImagePH = images.club_ph;
    } else if (item.entity_type === Verbs.entityTypeLeague) {
      teamIcon = images.myLeagues;
      teamImagePH = images.leaguePlaceholder;
    }
    return (
      <View style={{paddingVertical: 5}}>
        <TeamClubLeagueView
          onProfilePress={() => {
            closePlayInModal();
            setTimeout(() => {
              navigation.push('HomeScreen', {
                onBackPress: () => openPlayInModal(),
                uid: [Verbs.entityTypeUser, Verbs.entityTypePlayer]?.includes(
                  item?.entity_type,
                )
                  ? item?.user_id
                  : item?.group_id,
                role: [Verbs.entityTypeUser, Verbs.entityTypePlayer]?.includes(
                  item?.entity_type,
                )
                  ? Verbs.entityTypeUser
                  : item.entity_type,
                backButtonVisible: true,
                menuBtnVisible: false,
              });
            }, 500);
          }}
          teamImage={item?.full_image ? {uri: item?.full_image} : teamImagePH}
          teamTitle={item?.group_name}
          teamIcon={teamIcon}
          teamCityName={`${item?.city}, ${item?.country}`}
        />
      </View>
    );
  };
  return (
    <View>
      <EditEventItem
        editButtonVisible={isAdmin}
        title={strings.clubstitle}
        onEditPress={() => actionSheet.current.show()}>
        <FlatList
          ItemSeparatorComponent={() => <TCThinDivider />}
          data={
            currentUserData?.joined_clubs?.filter(
              (item) => item?.sport?.toLowerCase() === sportName?.toLowerCase(),
            ) ?? []
          }
          renderItem={renderTeamClubLeague}
        />
      </EditEventItem>
      <ActionSheet
        ref={actionSheet}
        options={[strings.privacySettingText, strings.cancel]}
        cancelButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            setEditModalType(strings.privacySettings);
            setShowEditPlaysInModal(true);
          }
        }}
      />

      {/* Edit Modal */}
      <EditPlaysInModal
        visible={showEditPlaysInModal}
        onClose={() => setShowEditPlaysInModal(false)}
        editModalType={editModalType}
        onSave={onSave}
      />
    </View>
  );
};

const EditPlaysInModal = ({
  visible,
  onClose,
  editModalType,
  // onSave,
}) => {
  const onSavePress = () => {
    if (editModalType === strings.privacySettings) {
      // onSave();
    }
  };
  return (
    <PlayInEditModal
      visible={visible}
      onClose={onClose}
      heading={`${
        editModalType !== strings.privacySettings
          ? `${strings.editTitleText} `
          : ''
      }${editModalType}`}
      onSavePress={onSavePress}>
      <PlaysInEditPrivacySettings title={strings.clubPrivacyTitle} />
    </PlayInEditModal>
  );
};
export default PlaysInClubs;
