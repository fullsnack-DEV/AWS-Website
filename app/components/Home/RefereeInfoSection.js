import React, { useContext, useRef, useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, FlatList, SafeAreaView, TouchableOpacity, Image, Alert,
} from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import EditEventItem from '../Schedule/EditEventItem';
import BasicInfoItem from './BasicInfoItem';
import Header from './Header';
import EventItemRender from '../Schedule/EventItemRender';
import RadioBtnItem from '../Schedule/RadioBtnItem';
import EventTextInput from '../Schedule/EventTextInput';
import TCPicker from '../TCPicker';
import BirthSelectItem from './BirthSelectItem';
import DateTimePickerView from '../Schedule/DateTimePickerModal';
import CertificatesItemView from './CertificatesItemView';
import AddTimeItem from '../Schedule/AddTimeItem';
import AddCertiPhotoTitleView from './AddCertiPhotoTitleView';
import uploadImages from '../../utils/imageAction';
import AuthContext from '../../auth/context';

const privacy_Data = [
  {
    id: 0,
    title: 'Everyone',
    isSelected: true,
  },
  {
    id: 1,
    title: 'Followers',
    isSelected: false,
  },
  {
    id: 2,
    title: 'Members in groups',
    isSelected: false,
  },
  {
    id: 3,
    title: 'Only me',
    isSelected: false,
  },
];

const gender_privacy = [
  {
    id: 0,
    title: 'Everyone',
    isSelected: true,
  },
  {
    id: 1,
    title: 'Followers',
    isSelected: false,
  },
  {
    id: 2,
    title: 'Members in groups',
    isSelected: false,
  },
  {
    id: 3,
    title: 'Only me',
    isSelected: false,
  },
];

const yearOfBirth_privacy = [
  {
    id: 0,
    title: 'Everyone',
    isSelected: true,
  },
  {
    id: 1,
    title: 'Followers',
    isSelected: false,
  },
  {
    id: 2,
    title: 'Members in groups',
    isSelected: false,
  },
  {
    id: 3,
    title: 'Only me',
    isSelected: false,
  },
];

const language_privacy = [
  {
    id: 0,
    title: 'Everyone',
    isSelected: true,
  },
  {
    id: 1,
    title: 'Followers',
    isSelected: false,
  },
  {
    id: 2,
    title: 'Members in groups',
    isSelected: false,
  },
  {
    id: 3,
    title: 'Only me',
    isSelected: false,
  },
];

const currentCity_privacy = [
  {
    id: 0,
    title: 'Everyone',
    isSelected: true,
  },
  {
    id: 1,
    title: 'Followers',
    isSelected: false,
  },
  {
    id: 2,
    title: 'Members in groups',
    isSelected: false,
  },
  {
    id: 3,
    title: 'Only me',
    isSelected: false,
  },
];

const certificate_data = [
  {
    id: 0,
    image: images.certificateImage,
    title: 'FIFA Field Certificate',
  },
  {
    id: 1,
    image: images.certificateImage,
    title: 'joinKFA Certificate',
  },
];

function RefereeInfoSection({
  data,
  searchLocation,
}) {
  let bioDefault = strings.aboutValue;
  let homePlaceDefault = strings.homePlaceValue;
  if (data) {
    if (data && data.registered_sports && data.registered_sports.length > 0) {
      bioDefault = data.registered_sports[0].descriptions;
      if (searchLocation) {
        homePlaceDefault = searchLocation;
      } else {
        homePlaceDefault = data.registered_sports[0].homePlace;
      }
    }
  }

  const authContext = useContext(AuthContext)
  const [editPressTitle, setEditPressTitle] = useState(null);
  const [info, setInfo] = useState({
    genderText: data.gender || 'Male',
    birthdayText: data.birthday ? new Date(data.birthday * 1000) : '',
    heightText: data.height.substring(0, data.height.indexOf(' ')) || '',
    weightText: data.weight.substring(0, data.weight.indexOf(' ')) || '',
    currentCity: `${data.city || ''}`,
    homePlaceText: homePlaceDefault,
  });
  const [bioText, setBioText] = useState(bioDefault);
  const [certificatesData] = useState(certificate_data);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [privacyData, setPrivacyData] = useState(privacy_Data);
  const [genderPrivacy, setGenderPrivacy] = useState(gender_privacy);
  const [yearOfBirthPrivacy, setYearOfBirthPrivacy] = useState(yearOfBirth_privacy);
  const [languagePrivacy, setLanguagePrivacy] = useState(language_privacy);
  const [currentCityPrivacy, setCurrentCityPrivacy] = useState(currentCity_privacy);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [addCertificateData, setAddCertificateData] = useState([]);
  const [selectedCerti, setSelectedCerti] = useState([]);
  const [addCertiTitle, setAddCertiTitle] = useState('');

  const actionSheet = useRef();

  const privacySettingModal = () => {
    setPrivacyModal(!privacyModal);
  };

  const editInfoModal = () => {
    setEditModal(!editModal);
  };

  const handleDatePress = (date) => {
    setInfo({ ...info, birthdayText: date });
    setDateModalVisible(!dateModalVisible)
  }
  const handleCancelPress = () => {
    setDateModalVisible(false)
  }

  const deleteItemById = (id) => {
    const filteredData = addCertificateData.filter((item) => item.id !== id);
    setAddCertificateData(filteredData);
  };

  return (
    <ScrollView style={styles.containerStyle}>
      <EditEventItem
        title={strings.bio}
        onEditPress={() => {
          setEditPressTitle(strings.bio);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
        containerStyle={{ marginTop: 10, marginBottom: 12 }}
      >
        <Text style={styles.bioTextStyle}>{bioText}</Text>
        <Text style={styles.signUpTimeStyle}>{strings.signedUpTime}</Text>
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.basicinfotitle}
        onEditPress={() => {
          setEditPressTitle(strings.basicinfotitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
      >
        <BasicInfoItem
          title={strings.gender}
          value={info.genderText}
        />
        <BasicInfoItem
          title={strings.yearOfBirth}
          value={moment(info.birthdayText).format('YYYY')}
        />
        <BasicInfoItem
          title={strings.language}
          value={strings.languagesName}
        />
        <BasicInfoItem
          title={strings.currrentCityTitle}
          value={info.currentCity}
          fieldView={{ marginBottom: 10 }}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.certificateTitle}
        onEditPress={() => {
          setEditPressTitle(strings.certificateTitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
          setSelectedCerti([]);
        }}
      >
        <FlatList
          data={certificatesData}
          bounces={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{
            marginHorizontal: 5,
          }} />}
          style={{ marginTop: 5, marginBottom: 15 }}
          renderItem={({ item: certItem }) => <CertificatesItemView
              certificateImage={certItem.image}
              certificateName={certItem.title}
              teamTitleTextStyle={{ color: colors.lightBlackColor, fontFamily: fonts.RBold }}
              profileImage={{ borderWidth: 0.5, borderColor: colors.linesepratorColor, borderRadius: 8 }}
          />}
          keyExtractor={(item, index) => index.toString()}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.refereeFee}
        subTitle={strings.perHour}
        onEditPress={() => {
          setEditPressTitle(strings.refereeFee);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
      >
        <Text style={styles.ntrpValueStyle}>{'$20 CAD/match'}</Text>
      </EditEventItem>

      <Modal
        isVisible={privacyModal}
        backdropColor="black"
        style={{
          margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0)',
        }}
        hasBackdrop
        onBackdropPress={() => setPrivacyModal(false)}
        backdropOpacity={0}
      >
        <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
          <LinearGradient
            colors={[colors.orangeColor, colors.yellowColor]}
            end={{ x: 0.0, y: 0.25 }}
            start={{ x: 1, y: 0.5 }}
            style={styles.gradiantHeaderViewStyle}>
          </LinearGradient>
          <Header
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity onPress={() => setPrivacyModal(false)}>
                <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={styles.headerCenterViewStyle}>
                <Image source={images.refereesInImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                <Text style={styles.playInTextStyle}>{'Privacy Setting'}</Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity onPress={() => setPrivacyModal(false)}>
                <Text style={{ fontSize: 16, fontFamily: fonts.RLight, color: colors.whiteColor }}>{'Save'}</Text>
              </TouchableOpacity>
            }
          />
          {(editPressTitle === strings.bio
          || editPressTitle === strings.certificateTitle
          || editPressTitle === strings.refereeFeesTitle) && <EventItemRender
            title={((editPressTitle === strings.bio && strings.bioPrivacyTitle)
              || (editPressTitle === strings.certificateTitle && strings.certiPrivacyTitle)
              || (editPressTitle === strings.refereeFeesTitle && strings.refereeFeePrivacyTitle))}
            containerStyle={{ marginTop: 10 }}
          >
            <FlatList
              data={privacyData}
              style={{ marginTop: 10 }}
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              renderItem={ ({ item }) => <RadioBtnItem
                titleName={item.title}
                selected={item.isSelected}
                touchRadioBtnStyle={{ marginRight: 5 }}
                onRadioBtnPress={() => {
                  privacyData.map((scheduleItem) => {
                    const schedule = scheduleItem;
                    if (schedule.id === item.id) {
                      schedule.isSelected = true;
                    } else {
                      schedule.isSelected = false;
                    }
                    return null;
                  })
                  setPrivacyData([...privacyData])
                }}
              />
              }
              keyExtractor={ (item, index) => index.toString() }
            />
          </EventItemRender>}
          {editPressTitle === strings.basicinfotitle && <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <EventItemRender
              title={editPressTitle === strings.basicinfotitle && strings.basicInfoPrivacyTitle}
              containerStyle={{ marginTop: 10 }}
            >
              <FlatList
                data={genderPrivacy}
                bounces={false}
                style={{ marginTop: 10 }}
                ListHeaderComponent={() => <Text style={styles.privacySubTitleStyle}>{strings.gender}</Text>}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                renderItem={ ({ item }) => <RadioBtnItem
                  titleName={item.title}
                  selected={item.isSelected}
                  touchRadioBtnStyle={{ marginRight: 5 }}
                  onRadioBtnPress={() => {
                    genderPrivacy.map((scheduleItem) => {
                      const schedule = scheduleItem;
                      if (schedule.id === item.id) {
                        schedule.isSelected = true;
                      } else {
                        schedule.isSelected = false;
                      }
                      return null;
                    })
                    setGenderPrivacy([...genderPrivacy])
                  }}
                />
                }
                keyExtractor={ (item, index) => index.toString() }
              />
              <View style={styles.privacySepratorStyle} />
              <FlatList
                data={yearOfBirthPrivacy}
                bounces={false}
                style={{ marginTop: 10 }}
                ListHeaderComponent={() => <Text style={styles.privacySubTitleStyle}>{strings.yearOfBirth}</Text>}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                renderItem={ ({ item }) => <RadioBtnItem
                  titleName={item.title}
                  selected={item.isSelected}
                  touchRadioBtnStyle={{ marginRight: 5 }}
                  onRadioBtnPress={() => {
                    yearOfBirthPrivacy.map((scheduleItem) => {
                      const schedule = scheduleItem;
                      if (schedule.id === item.id) {
                        schedule.isSelected = true;
                      } else {
                        schedule.isSelected = false;
                      }
                      return null;
                    })
                    setYearOfBirthPrivacy([...yearOfBirthPrivacy])
                  }}
                />
                }
                keyExtractor={ (item, index) => index.toString() }
              />
              <View style={styles.privacySepratorStyle} />
              <FlatList
                data={languagePrivacy}
                bounces={false}
                style={{ marginTop: 10 }}
                ListHeaderComponent={() => <Text style={styles.privacySubTitleStyle}>{strings.language}</Text>}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                renderItem={ ({ item }) => <RadioBtnItem
                  titleName={item.title}
                  selected={item.isSelected}
                  touchRadioBtnStyle={{ marginRight: 5 }}
                  onRadioBtnPress={() => {
                    languagePrivacy.map((scheduleItem) => {
                      const schedule = scheduleItem;
                      if (schedule.id === item.id) {
                        schedule.isSelected = true;
                      } else {
                        schedule.isSelected = false;
                      }
                      return null;
                    })
                    setLanguagePrivacy([...languagePrivacy])
                  }}
                />
                }
                keyExtractor={ (item, index) => index.toString() }
              />
              <View style={styles.privacySepratorStyle} />
              <FlatList
                data={currentCityPrivacy}
                bounces={false}
                style={{ marginTop: 10 }}
                ListHeaderComponent={() => <Text style={styles.privacySubTitleStyle}>{strings.currrentCityTitle}</Text>}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                renderItem={ ({ item }) => <RadioBtnItem
                  titleName={item.title}
                  selected={item.isSelected}
                  touchRadioBtnStyle={{ marginRight: 5 }}
                  onRadioBtnPress={() => {
                    currentCityPrivacy.map((scheduleItem) => {
                      const schedule = scheduleItem;
                      if (schedule.id === item.id) {
                        schedule.isSelected = true;
                      } else {
                        schedule.isSelected = false;
                      }
                      return null;
                    })
                    setCurrentCityPrivacy([...currentCityPrivacy])
                  }}
                />
                }
                keyExtractor={ (item, index) => index.toString() }
              />
            </EventItemRender>
          </KeyboardAwareScrollView>}
        </SafeAreaView>
      </Modal>

      <Modal
        isVisible={editModal}
        backdropColor="black"
        style={{
          margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0)',
        }}
        hasBackdrop
        onBackdropPress={() => setEditModal(false)}
        backdropOpacity={0}
      >
        <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
          <LinearGradient
            colors={[colors.orangeColor, colors.yellowColor]}
            end={{ x: 0.0, y: 0.25 }}
            start={{ x: 1, y: 0.5 }}
            style={styles.gradiantHeaderViewStyle}>
          </LinearGradient>
          <Header
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={styles.headerCenterViewStyle}>
                <Image source={images.refereesInImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                <Text style={styles.playInTextStyle}>{'Edit'} {
                  (editPressTitle === strings.bio && strings.bio)
                  || (editPressTitle === strings.basicinfotitle && strings.basicinfotitle)
                  || (editPressTitle === strings.certificateTitle && strings.certificateTitle)
                  || (editPressTitle === strings.refereeFeesTitle && 'Fee')
                }</Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {
                setEditModal(false)
              }}>
                <Text style={{ fontSize: 16, fontFamily: fonts.RLight, color: colors.whiteColor }}>{'Save'}</Text>
              </TouchableOpacity>
            }
          />
          {editPressTitle === strings.bio && <EventTextInput
            value={bioText}
            multiline={true}
            onChangeText={(text) => {
              setBioText(text);
            }}
          />}

          {editPressTitle === strings.basicinfotitle && <View>
            <EventItemRender
              title={strings.gender}
              containerStyle={{ marginTop: 15 }}
            >
              <View style={{ marginTop: 8 }}>
                <TCPicker
                  dataSource={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                  ]}
                  placeholder={'Select Gender'}
                  value={info.genderText}
                  onValueChange={(value) => {
                    setInfo({ ...info, genderText: value });
                  }}
                />
              </View>
            </EventItemRender>
            <EventItemRender
              title={strings.yearOfBirth}
              containerStyle={{ marginTop: 15 }}
            >
              <BirthSelectItem
                title={moment(info.birthdayText).format('YYYY')}
                onItemPress={() => setDateModalVisible(!dateModalVisible)}
              />
              <DateTimePickerView
                visible={dateModalVisible}
                onDone={handleDatePress}
                onCancel={handleCancelPress}
                onHide={handleCancelPress}
                mode={'date'}
                maximumDate={new Date()}
              />
            </EventItemRender>
            <EventItemRender
              title={strings.language}
              containerStyle={{ marginTop: 15 }}
            >
              <BirthSelectItem
                title={strings.languagesName}
                onItemPress={() => {
                  // onItemPress();
                }}
              />
            </EventItemRender>
            <EventItemRender
              title={strings.currrentCityTitle}
              containerStyle={{ marginTop: 15 }}
            >
              <BirthSelectItem
                title={info.currentCity}
                onItemPress={() => {
                  // onItemPress();
                }}
              />
            </EventItemRender>
          </View>}

          {editPressTitle === strings.certificateTitle && <EventItemRender
            title={strings.addCertiMainTitle}
            headerTextStyle={{ fontSize: 16 }}
          >
            <FlatList
              data={[...addCertificateData, '0']}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={ false }
              renderItem={ ({ item, index }) => {
                if (index === addCertificateData.length) {
                  return (
                    <AddCertiPhotoTitleView
                      placeholder={'Title and photos'}
                      value={addCertiTitle}
                      onChangeText={(text) => {
                        setAddCertiTitle(text);
                      }}
                      onPickImagePress={() => {
                        const selectData = [];
                        ImagePicker.openPicker({
                          width: 300,
                          height: 400,
                          cropping: true,
                        }).then((pickData) => {
                          selectData.push(pickData);
                          setSelectedCerti(selectData);
                        });
                      }}
                    />
                  );
                }
                return (
                  <View style={{ marginTop: 15 }}>
                    <EventTextInput
                      value={item.title}
                      onChangeText={() => {}}
                      containerStyle={{ alignSelf: 'flex-start', width: wp(92), marginLeft: 2 }}
                    />
                    <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Image source={{ uri: item.image }} style={{ width: 195, height: 150, borderRadius: 10 }} resizeMode={'cover'} />
                      <Text style={{
                        marginRight: 5,
                        fontSize: 14,
                        fontFamily: fonts.RRegular,
                        color: colors.redDelColor,
                      }} onPress={() => { deleteItemById(item.id) }}>Delete</Text>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={() => <View>
                {selectedCerti.length > 0 && <Image
                  source={{ uri: selectedCerti[0].path }}
                  style={styles.staticSelectImageStyle}
                  resizeMode={'cover'}
                />}
                <AddTimeItem
                  addTimeText={strings.addCertiTitle}
                  source={images.plus}
                  onAddTimePress={() => {
                    if (addCertiTitle === '') {
                      Alert.alert('Please Enter Certificate Name!')
                    } else if (selectedCerti.length === 0) {
                      Alert.alert('Please Select Certificate Image!')
                    } else {
                      const imageArray = selectedCerti.map((dataItem) => (dataItem))
                      uploadImages(imageArray, authContext).then((responses) => {
                        const certiAddData = [...addCertificateData];
                        const obj = {
                          id: certiAddData.length,
                          image: responses[0].thumbnail,
                          title: addCertiTitle,
                        };
                        certiAddData.push(obj);
                        setAddCertificateData(certiAddData);
                        setSelectedCerti([]);
                        setAddCertiTitle('');
                      })
                    }
                  }}
                />
              </View>}
              ListFooterComponentStyle={{ marginTop: 20 }}
              keyExtractor={(itemValue, index) => index.toString() }
            />
          </EventItemRender>}

          {editPressTitle === strings.refereeFee && <EventTextInput
            value={'$20'}
            onChangeText={() => {}}
            displayLastTitle={true}
            valueEndTitle={' CAD/match'}
            containerStyle={{ justifyContent: 'space-between' }}
          />}
        </SafeAreaView>
      </Modal>

      <ActionSheet
        ref={actionSheet}
        options={[
          (editPressTitle === strings.bio && 'Edit Bio')
          || (editPressTitle === strings.basicinfotitle && 'Edit Basic Info')
          || (editPressTitle === strings.certificateTitle && 'Edit Certificates')
          || (editPressTitle === strings.refereeFee && 'Edit Fee'),
          'Privacy Setting',
          'Cancel',
        ]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0 && (
            editPressTitle === strings.bio
            || editPressTitle === strings.basicinfotitle
            || editPressTitle === strings.certificateTitle
            || editPressTitle === strings.refereeFee
          )) {
            editInfoModal();
          } else if (index === 1 && (
            editPressTitle === strings.bio
            || editPressTitle === strings.basicinfotitle
            || editPressTitle === strings.certificateTitle
            || editPressTitle === strings.refereeFee
          )) {
            privacySettingModal();
          } else if (index === 2) {
            setEditPressTitle(null);
          }
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.whiteColor,
  },
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
  dividerStyle: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 10,
  },
  ntrpValueStyle: {
    fontSize: 16,
    fontFamily: fonts.LRegular,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
  modalContainerViewStyle: {
    height: hp('94%'),
    backgroundColor: colors.themeColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 15,
  },
  cancelImageStyle: {
    height: 17,
    width: 17,
    tintColor: colors.whiteColor,
  },
  soccerImageStyle: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
  },
  headerCenterViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  playInTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  gradiantHeaderViewStyle: {
    position: 'absolute',
    width: '100%',
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  privacySubTitleStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
  privacySepratorStyle: {
    height: 1,
    backgroundColor: colors.lightgrayColor,
    marginTop: 20,
    marginBottom: 5,
  },
  staticSelectImageStyle: {
    width: 150,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default RefereeInfoSection;
