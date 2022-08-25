import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import _ from 'lodash';
import strings from '../../../../../Constants/String';
import EditEventItem from '../../../../../components/Schedule/EditEventItem';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import PlayInEditModal from '../PlayInEditModal';
import PlaysInEditPrivacySettings from '../PlaysInEditPrivacySettings';
import EventMapView from '../../../../../components/Schedule/EventMapView';
import ModalLocationSearch from '../../../../../components/Home/ModalLocationSearch';

const PlaysInHomePlace = ({
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
  }, [currentUserData]);
  return (
    <View>
      <EditEventItem
        editButtonVisible={isAdmin}
        title={strings.homePlaceTitle}
        onEditPress={() => actionSheet.current.show()}>
        <Text style={styles.bioTextStyle}>
          {registerSport?.homePlace ?? '-'}
        </Text>
        {registerSport?.homePlace ? (
          <EventMapView
            region={{
              latitude: registerSport?.latitude
                ? Number(registerSport?.latitude)
                : 0.0,
              longitude: registerSport?.longitude
                ? Number(registerSport?.longitude)
                : 0.0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            coordinate={{
              latitude: registerSport?.latitude
                ? Number(registerSport?.latitude)
                : 0.0,
              longitude: registerSport?.longitude
                ? Number(registerSport?.longitude)
                : 0.0,
            }}
            style={{marginVertical: 15}}
          />
        ) : null}
      </EditEventItem>
      <ActionSheet
        ref={actionSheet}
        options={['Edit Home Place', 'Privacy Setting', 'Cancel']}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) setEditModalType(strings.homePlaceTitle);
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
  const [homePlace, setHomePlace] = useState();
  const [locationData, setLocationData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchLocationModal, setSearchLocationModal] = useState(false);

  useEffect(() => {
    setHomePlace(registerSport?.homePlace);
    setLocationData({
      latitude: registerSport?.latitude,
      longitude: registerSport?.longitude,
    });
  }, [registerSport]);
  const onSavePress = () => {
    if (editModalType === strings.homePlaceTitle) {
      const registered_sports = _.cloneDeep(currentUserData?.registered_sports);
      const editSportIndex = registered_sports?.findIndex(
        (item) =>
          item?.sport === registerSport?.sport &&
          item?.sport_type === registerSport?.sport_type,
      );
      if (editSportIndex !== -1) {
        setLoading(true);
        registered_sports[editSportIndex].homePlace = homePlace ?? '';
        registered_sports[editSportIndex].longitude =
          locationData?.longitude ?? 0.0;
        registered_sports[editSportIndex].latitude =
          locationData?.latitude ?? 0.0;
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
      <ModalLocationSearch
        visible={searchLocationModal}
        onClose={() => setSearchLocationModal(false)}
        onSelect={(location) => {
          const city = location?.terms?.[0]?.value;
          setHomePlace(city);
          setLocationData({
            latitude: location?.latitude ?? 0.0,
            longitude: location?.longitude ?? 0.0,
          });
        }}
      />
      {editModalType === strings.homePlaceTitle ? (
        <TouchableOpacity
          onPress={() => setSearchLocationModal(true)}
          style={styles.containerStyle}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{...styles.textInputStyle}}>{homePlace}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <PlaysInEditPrivacySettings title={strings.homePlacePrivacyTitle} />
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
  containerStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 10,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: '92%',
    marginTop: 8,
    flexDirection: 'row',
  },
  textInputStyle: {
    backgroundColor: colors.offwhite,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
});

export default PlaysInHomePlace;
