/* eslint-disable no-unsafe-optional-chaining */
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment';
import strings from '../../../../../Constants/String';
import EditEventItem from '../../../../../components/Schedule/EditEventItem';
import PlayInEditModal from '../PlayInEditModal';
import EventTextInput from '../../../../../components/Schedule/EventTextInput';
import BasicInfoItem from '../../../../../components/Home/BasicInfoItem';
import EventItemRender from '../../../../../components/Schedule/EventItemRender';
import TCPicker from '../../../../../components/TCPicker';
import BirthSelectItem from '../../../../../components/Home/BirthSelectItem';
import DateTimePickerView from '../../../../../components/Schedule/DateTimePickerModal';
import ModalLocationSearch from '../../../../../components/Home/ModalLocationSearch';
import PlaysInEditBasicInfoPrivacySettings from '../PlaysInEditBasicInfoPrivacySettings';
import DataSource from '../../../../../Constants/DataSource';
// import AuthContext from '../../../../../auth/context';
// import * as Utility from '../../../../../utils';

const PlaysInBasicInfo = ({isAdmin, currentUserData, onSave}) => {
  const actionSheet = useRef();
  const [showEditPlaysInModal, setShowEditPlaysInModal] = useState(false);
  const [editModalType, setEditModalType] = useState('');

  console.log('showEditPlaysInModal', showEditPlaysInModal);
  return (
    <View>
      <EditEventItem
        editButtonVisible={isAdmin}
        title={strings.basicinfotitle}
        onEditPress={() => actionSheet.current.show()}>
        <BasicInfoItem title={strings.gender} value={currentUserData?.gender} />

        <BasicInfoItem
          title={strings.yearOfBirth}
          value={
            currentUserData?.birthday
              ? moment(currentUserData.birthday * 1000).format('YYYY')
              : '-'
          }
        />

        <BasicInfoItem
          title={strings.height}
          value={
            currentUserData?.height ? `${currentUserData?.height} cm` : '-'
          }
        />

        <BasicInfoItem
          title={strings.weight}
          value={
            currentUserData?.weight ? `${currentUserData?.weight} kg` : '-'
          }
        />

        <BasicInfoItem
          title={strings.mostUsedFoot}
          value={
            currentUserData?.most_used_foot
              ? currentUserData?.most_used_foot
              : '-'
          }
        />
        <BasicInfoItem
          title={strings.currrentCityTitle}
          value={currentUserData?.city}
          fieldView={{marginBottom: 10}}
        />
      </EditEventItem>
      <ActionSheet
        ref={actionSheet}
        options={['Edit Basic Info', 'Privacy Setting', 'Cancel']}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) setEditModalType(strings.basicinfotitle);
          else if (index === 1) setEditModalType(strings.privacySettings);
          if (index === 0 || index === 1) setShowEditPlaysInModal(true);
        }}
      />

      {/* Edit Modal */}
      <EditPlaysInModal
        visible={showEditPlaysInModal}
        closeEditPlayInModal={() => setShowEditPlaysInModal(false)}
        editModalType={editModalType}
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
  onSave,
}) => {
  // const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [birthdayText, setBirthdayText] = useState();
  const [searchLocationModal, setSearchLocationModal] = useState(false);

  useEffect(() => {
    if (currentUserData) {
      setUserData(currentUserData);
      setBirthdayText(currentUserData?.birthday);
    }
  }, [currentUserData]);
  const onSavePress = () => {
    if (editModalType === strings.basicinfotitle) {
      setLoading(true);
      const params = {
        city: userData?.city ?? '',
        gender: userData?.gender,
        birthday:
          userData.birthday === birthdayText ? userData.birthday : birthdayText,
        height: userData?.height ?? '',
        weight: userData.weight ?? '',
        most_used_foot: userData?.most_used_foot,
      };
      onSave(params)
        .then((res) => {
          console.log('respppppp:', res);
          closeEditPlayInModal();
          // setTimeout(async() => {
          //   const entity = authContext.entity;
          // authContext.setEntity({...entity});
          // await Utility.setStorage('authContextUser', res.payload);
          // authContext.setUser(res.payload);
          // }, 10);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleDatePress = (date) => {
    setBirthdayText(date?.getTime() / 1000);
    setDateModalVisible(!dateModalVisible);
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
          setUserData({...userData, city});
        }}
      />
      {editModalType === strings.basicinfotitle ? (
        <>
          {/*   Gender */}
          <EventItemRender
            title={strings.gender}
            containerStyle={{marginTop: 15}}>
            <View style={{marginTop: 8}}>
              <TCPicker
                dataSource={DataSource.Gender}
                placeholder={'Select Gender'}
                value={userData?.gender}
                onValueChange={(value) => {
                  setUserData({...userData, gender: value});
                }}
              />
            </View>
          </EventItemRender>

          {/*  Birthday */}
          <EventItemRender
            title={strings.yearOfBirth}
            containerStyle={{marginTop: 15}}>
            <BirthSelectItem
              title={moment(birthdayText * 1000).format('YYYY')}
              onItemPress={() => setDateModalVisible(!dateModalVisible)}
            />
            <DateTimePickerView
              visible={dateModalVisible}
              onDone={handleDatePress}
              onCancel={() => setDateModalVisible(false)}
              onHide={() => setDateModalVisible(false)}
              mode={'date'}
              date={birthdayText ? new Date(birthdayText * 1000) : new Date()}
              maximumDate={new Date()}
            />
          </EventItemRender>

          {/*  Height */}
          <EventItemRender
            title={strings.height}
            containerStyle={{marginTop: 15}}>
            <EventTextInput
              value={userData?.height}
              placeholder={'Enter Height'}
              onChangeText={(text) => {
                setUserData({...userData, height: text});
              }}
              displayLastTitle={true}
              keyboardType={'numeric'}
              valueEndTitle={userData?.height?.trim().length > 0 ? ' cm' : ''}
            />
          </EventItemRender>

          {/*  Weight */}
          <EventItemRender
            title={strings.weight}
            containerStyle={{marginTop: 15}}>
            <EventTextInput
              value={userData?.weight}
              placeholder={'Enter Weight'}
              onChangeText={(text) => {
                setUserData({...userData, weight: text});
              }}
              displayLastTitle={true}
              keyboardType={'numeric'}
              valueEndTitle={userData?.weight?.trim().length > 0 ? ' kg' : ''}
            />
          </EventItemRender>

          {/*  Most Used Foot */}
          <EventItemRender
            title={strings.mostUsedFoot}
            containerStyle={{marginTop: 15}}>
            <View style={{marginTop: 8}}>
              <TCPicker
                dataSource={[
                  {label: 'Right', value: 'Right'},
                  {label: 'Left', value: 'Left'},
                  {label: 'Pose', value: 'Pose'},
                ]}
                placeholder={'Select Most Used Foot'}
                value={userData?.most_used_foot}
                onValueChange={(value) => {
                  setUserData({...userData, most_used_foot: value});
                }}
              />
            </View>
          </EventItemRender>

          {/* City */}
          <EventItemRender
            title={strings.currrentCityTitle}
            containerStyle={{marginTop: 15}}>
            <BirthSelectItem
              title={userData?.city}
              onItemPress={() => {
                setSearchLocationModal(!searchLocationModal);
              }}
            />
          </EventItemRender>
        </>
      ) : (
        <PlaysInEditBasicInfoPrivacySettings />
      )}
    </PlayInEditModal>
  );
};
export default PlaysInBasicInfo;
