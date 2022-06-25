import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import _ from 'lodash';
import strings from '../../../../../Constants/String';
import EditEventItem from '../../../../../components/Schedule/EditEventItem';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import PlayInEditModal from '../PlayInEditModal';
import PlaysInEditPrivacySettings from '../PlaysInEditPrivacySettings';
import EventTextInput from '../../../../../components/Schedule/EventTextInput';

const PlaysInBio = ({isAdmin, currentUserData, sportName, onSave}) => {
  const actionSheet = useRef();
  const [showEditPlaysInModal, setShowEditPlaysInModal] = useState(false);
  const [editModalType, setEditModalType] = useState('');
  const [registerSport, setRegisterSport] = useState();
  useEffect(() => {
    if (currentUserData) {
      const sportData = currentUserData?.registered_sports?.find(
        (item) => item?.sport === sportName,
      );
      setRegisterSport(sportData ? {...sportData} : null);
    }
  }, [currentUserData]);

  return (
    <View>
      <EditEventItem
        editButtonVisible={isAdmin}
        title={strings.bio}
        onEditPress={() => actionSheet.current.show()}
        containerStyle={{marginVertical: 10}}>
        <Text style={styles.bioTextStyle}>
          {registerSport?.descriptions ?? ''}
        </Text>
        <Text style={styles.signUpTimeStyle}>{strings.signedUpTime}</Text>
      </EditEventItem>
      <ActionSheet
        ref={actionSheet}
        options={['Edit Bio', 'Privacy Setting', 'Cancel']}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) setEditModalType(strings.bio);
          else if (index === 1) setEditModalType(strings.privacySettings);
          if (index === 0 || index === 1) setShowEditPlaysInModal(true);
        }}
      />

      {/* Edit Modal */}
      <EditPlaysInModal
        visible={showEditPlaysInModal}
        closeEditPlayInModal={() => setShowEditPlaysInModal(false)}
        editModalType={editModalType}
        registerSport={registerSport}
        onSave={onSave}
        currentUserData={currentUserData}
      />
    </View>
  );
};

const EditPlaysInModal = ({
  currentUserData,
  visible,
  closeEditPlayInModal,
  editModalType,
  registerSport,
  onSave,
}) => {
  const [bio, setBio] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setBio(registerSport?.descriptions);
  }, [registerSport]);
  const onSavePress = () => {
    if (editModalType === strings.bio) {
      const registered_sports = _.cloneDeep(currentUserData?.registered_sports);
      const editSportIndex = registered_sports?.findIndex(
        (item) =>
          item?.sport === registerSport?.sport &&
          item?.sport_type === registerSport?.sport_type,
      );
      if (editSportIndex !== -1) {
        setLoading(true);
        registered_sports[editSportIndex].descriptions = bio;
        onSave({registered_sports})
          .then(() => closeEditPlayInModal())
          .finally(() => setLoading(false));
      }
    }
  };
  return (
    <PlayInEditModal
      loading={loading}
      visible={visible}
      onClose={closeEditPlayInModal}
      heading={`${
        editModalType !== strings.privacySettings ? 'Edit ' : ''
      }${editModalType}`}
      onSavePress={onSavePress}>
      {editModalType === strings.bio ? (
        <EventTextInput value={bio} multiline={true} onChangeText={setBio} />
      ) : (
        <PlaysInEditPrivacySettings title={strings.bioPrivacyTitle} />
      )}
    </PlayInEditModal>
  );
};
const styles = StyleSheet.create({
  bioTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  signUpTimeStyle: {
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    marginVertical: 4,
  },
});

export default PlaysInBio;
