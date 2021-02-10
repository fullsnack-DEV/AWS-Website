import React, { useRef, useState } from 'react';
import { View, FlatList } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import strings from '../../../../../Constants/String';
import EditEventItem from '../../../../../components/Schedule/EditEventItem';
import PlayInEditModal from '../PlayInEditModal';
import PlaysInEditPrivacySettings from '../PlaysInEditPrivacySettings';
import TCThinDivider from '../../../../../components/TCThinDivider';
import images from '../../../../../Constants/ImagePath';
import TeamClubLeagueView from '../../../../../components/Home/TeamClubLeagueView';

const PlaysInTeams = ({
  closePlayInModal,
  isAdmin,
  currentUserData,
  onSave,
  sportName,
  navigation,
}) => {
  const actionSheet = useRef();
  const [showEditPlaysInModal, setShowEditPlaysInModal] = useState(false);
  const [editModalType, setEditModalType] = useState('');

  const renderTeamClubLeague = ({ item }) => {
    let teamIcon = '';
    let teamImagePH = '';
    if (item.entity_type === 'team') {
      teamIcon = images.myTeams
      teamImagePH = images.team_ph;
    } else if (item.entity_type === 'club') {
      teamIcon = images.myClubs
      teamImagePH = images.club_ph;
    } else if (item.entity_type === 'league') {
      teamIcon = images.myLeagues
      teamImagePH = images.leaguePlaceholder;
    }
    return (
      <View style={{ paddingVertical: 5 }}>
        <TeamClubLeagueView
                    onProfilePress={() => {
                      closePlayInModal();
                      setTimeout(() => {
                        navigation.push('HomeScreen', {
                          uid: ['user', 'player']?.includes(item?.entity_type) ? item?.user_id : item?.group_id,
                          role: ['user', 'player']?.includes(item?.entity_type) ? 'user' : item.entity_type,
                          backButtonVisible: true,
                          menuBtnVisible: false,
                        })
                      }, 500);
                    }}
                    teamImage={item?.full_image ? { uri: item?.full_image } : teamImagePH}
                    teamTitle={item?.group_name}
                    teamIcon={teamIcon}
                    teamCityName={`${item?.city}, ${item?.country}`}
                />
      </View>
    )
  }
  return (
    <View>
      <EditEventItem
            editButtonVisible={isAdmin}
            title={strings.teamstitle}
            onEditPress={() => actionSheet.current.show()}
      >
        <FlatList
                ItemSeparatorComponent={() => <TCThinDivider />}
                data={currentUserData?.joined_teams?.filter((item) => item?.sport?.toLowerCase() === sportName?.toLowerCase()) ?? []}
                renderItem={renderTeamClubLeague}
            />
      </EditEventItem>
      <ActionSheet
                ref={actionSheet}
                options={['Privacy Setting', 'Cancel']}
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
  )
}

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
  }
  return (
    <PlayInEditModal
            visible={visible}
            onClose={onClose}
            heading={`${editModalType !== strings.privacySettings ? 'Edit ' : ''}${editModalType}`}
            onSavePress={onSavePress}
        >
      <PlaysInEditPrivacySettings title={strings.teamPrivacyTitle} />
    </PlayInEditModal>
  )
}

export default PlaysInTeams;
