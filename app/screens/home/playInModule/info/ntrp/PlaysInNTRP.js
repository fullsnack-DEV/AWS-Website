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
import TCPicker from '../../../../../components/TCPicker';

const PlaysInNTRP = ({
  isAdmin,
  currentUserData,
  sportName,
  sportType,
  onSave,
}) => {
  const actionSheet = useRef();
  const [showEditPlaysInModal, setShowEditPlaysInModal] = useState(false);
  const [editModalType, setEditModalType] = useState('');
  const [registerSport, setRegisterSport] = useState();
  useEffect(() => {
    if (currentUserData) {
      const sportData = currentUserData?.registered_sports?.find(
        (item) => item?.sport === sportName && item?.sport_type === sportType,
      );
      setRegisterSport(sportData ? {...sportData} : null);
    }
  }, [currentUserData, sportName, sportType]);
  return (
    <View>
      <EditEventItem
        editButtonVisible={isAdmin}
        title={strings.ntrpTitle}
        onEditPress={() => actionSheet.current.show()}
        containerStyle={{marginVertical: 10}}>
        <Text style={styles.bioTextStyle}>{registerSport?.ntrp ?? '-'}</Text>
      </EditEventItem>
      <ActionSheet
        ref={actionSheet}
        options={['Edit NTRP', 'Privacy Setting', 'Cancel']}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) setEditModalType(strings.ntrpTitle);
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
  const [ntrp, setNTRP] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setNTRP(registerSport?.ntrp);
  }, [registerSport]);
  const onSavePress = () => {
    if (editModalType === strings.ntrpTitle) {
      const registered_sports = _.cloneDeep(currentUserData?.registered_sports);
      const editSportIndex = registered_sports?.findIndex(
        (item) =>
          item?.sport === registerSport?.sport &&
          item?.sport_type === registerSport?.sport_type,
      );
      if (editSportIndex !== -1) {
        setLoading(true);
        registered_sports[editSportIndex].ntrp = ntrp;
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
      {editModalType === strings.ntrpTitle ? (
        <View style={{marginTop: 20}}>
          <TCPicker
            dataSource={[
              {label: '1.0', value: '1.0'},
              {label: '1.5', value: '1.5'},
              {label: '2.0', value: '2.0'},
              {label: '2.5', value: '2.5'},
              {label: '3.0', value: '3.0'},
              {label: '3.5', value: '3.5'},
              {label: '4.0', value: '4.0'},
              {label: '4.5', value: '4.5'},
              {label: '5.0', value: '5.0'},
              {label: '5.5', value: '5.5'},
              {label: '6.0', value: '6.0'},
              {label: '6.5', value: '6.5'},
              {label: '7.0', value: '7.0'},
            ]}
            placeholder={'Select NTRP'}
            value={ntrp}
            onValueChange={setNTRP}
          />
        </View>
      ) : (
        <PlaysInEditPrivacySettings title={strings.ntrpPrivacyTitle} />
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
});

export default PlaysInNTRP;
