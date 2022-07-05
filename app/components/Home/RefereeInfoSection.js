/* eslint-disable react-native/no-raw-text */
/* eslint-disable no-nested-ternary */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
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
import TCSearchBox from '../TCSearchBox';
import TCTags from '../TCTags';
import ModalLocationSearch from './ModalLocationSearch';
import EditRefereeCertificate from './EditRefereeCertificate';
import TCKeyboardView from '../TCKeyboardView';
import TCThinDivider from '../TCThinDivider';
import DataSource from '../../Constants/DataSource';
import MapPinWithRadious from '../Schedule/MapPinWithRadious';
import {getSportName} from '../../utils';

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

const language_list = [
  {
    id: 0,
    title: 'English',
    isChecked: false,
  },
  {
    id: 1,
    title: 'English(Canada)',
    isChecked: false,
  },
  {
    id: 2,
    title: 'English(Singapore)',
    isChecked: false,
  },
  {
    id: 3,
    title: 'English(UK)',
    isChecked: false,
  },
  {
    id: 4,
    title: 'English(US)',
    isChecked: false,
  },
  {
    id: 5,
    title: 'Deutsch',
    isChecked: false,
  },
  {
    id: 6,
    title: 'Italiano',
    isChecked: false,
  },
  {
    id: 7,
    title: 'Korean',
    isChecked: false,
  },
];

function RefereeInfoSection({
  data,
  refereeSetting,
  selectRefereeData,
  languagesName,
  onSavePress,
}) {
  console.log('refereeSetting::->', refereeSetting);
  const authContext = useContext(AuthContext);
  const [editPressTitle, setEditPressTitle] = useState(null);
  const [info, setInfo] = useState({
    genderText: data.gender || null,
    birthdayText: data.birthday ? new Date(data.birthday * 1000) : '',
    currentCity: `${data.city || ''}`,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (data?.user_id === authContext?.entity?.uid) {
      setIsAdmin(true);
    }
  }, [data]);
  const [bioText, setBioText] = useState(selectRefereeData.descriptions);
  const [certificatesData, setCertificatesData] = useState(
    selectRefereeData.certificates ?? [],
  );
  const [refereeFeeCount, setRefereeFeeCount] = useState(
    selectRefereeData.fee || 0,
  );
  const [privacyModal, setPrivacyModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editLanguageModal, setEditLanguageModal] = useState(false);
  const [privacyData, setPrivacyData] = useState(privacy_Data);
  const [genderPrivacy, setGenderPrivacy] = useState(gender_privacy);
  const [yearOfBirthPrivacy, setYearOfBirthPrivacy] =
    useState(yearOfBirth_privacy);
  const [languagePrivacy, setLanguagePrivacy] = useState(language_privacy);
  const [currentCityPrivacy, setCurrentCityPrivacy] =
    useState(currentCity_privacy);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedCerti, setSelectedCerti] = useState([]);
  const [editCertificateModal, setEditCertificateModal] = useState(false);
  const [selected, setSelected] = useState(() => {
    if (selectRefereeData.cancellation_policy === 'flexible') {
      return 2;
    }
    if (selectRefereeData.cancellation_policy === 'moderate') {
      return 1;
    }
    if (selectRefereeData.cancellation_policy === 'moderate') {
      return 0;
    }
    return 0;
  });

  const [searchLocationModal, setSearchLocationModal] = useState(false);
  const [addCertiTitle, setAddCertiTitle] = useState('');
  const [searchLanguageText, setSearchLanguageText] = useState('');
  const [languageList, setLanguageList] = useState(language_list);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    if (selectRefereeData.language && selectRefereeData.language.length > 0) {
      languageList.map((listItem) => {
        const listValue = listItem;
        selectRefereeData.language.map((default_lang) => {
          if (default_lang.language_name === listValue.title) {
            listValue.isChecked = true;
          }
          return [];
        });
        return [];
      });
      return languageList;
    }
    return [];
  });

  const actionSheet = useRef();

  const privacySettingModal = () => {
    setPrivacyModal(!privacyModal);
  };

  const editInfoModal = () => {
    setEditModal(!editModal);
  };

  const editLanguage = () => {
    setEditLanguageModal(!editLanguageModal);
  };

  const handleDatePress = (date) => {
    setInfo({...info, birthdayText: date});
    setDateModalVisible(!dateModalVisible);
  };
  const handleCancelPress = () => {
    setDateModalVisible(false);
  };

  const deleteItemById = (id) => {
    const filteredData = certificatesData.filter((item, index) => index !== id);
    setCertificatesData(filteredData);
  };

  const Item = ({item, onPress, style, isChecked}) => (
    <TouchableOpacity onPress={onPress} style={[styles.listItems, style]}>
      <LinearGradient
        colors={
          isChecked
            ? [colors.yellowColor, colors.orangeColor]
            : [colors.offwhite, colors.offwhite]
        }
        style={[styles.listItems, {paddingHorizontal: 10, paddingVertical: 0}]}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={styles.selectUnSelectViewStyle}>
            <Text
              style={{
                ...styles.title,
                color: isChecked ? colors.whiteColor : colors.lightBlackColor,
              }}>
              {item.title}
            </Text>
            {isChecked ? (
              <Image
                source={images.checkWhite}
                resizeMode={'contain'}
                style={styles.checkboxImg}
              />
            ) : (
              <Image
                source={images.whiteUncheck}
                resizeMode={'contain'}
                style={styles.checkboxImg}
              />
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (searchLanguageText !== '') {
      const escapeRegExp = (str) => {
        if (!_.isString(str)) {
          return '';
        }
        return str.replace(/[-[\]\\/{}()*+?.^$|]/g, '\\$&');
      };
      const searchStr = escapeRegExp(searchLanguageText);
      const answer = languageList?.filter((a) =>
        a.title
          .toLowerCase()
          .toString()
          .match(searchStr.toLowerCase().toString()),
      );
      setLanguageList([...answer]);
    }
  }, [searchLanguageText]);

  useEffect(() => {
    const selectData = [];
    if (languageList.length > 0) {
      languageList.filter((val) => {
        if (val.isChecked) {
          selectData.push(val);
        }
        return null;
      });
      setSelectedLanguage([...selectData]);
    }
  }, [languageList]);

  const renderItem = ({item}) => {
    const selectVal = item;
    return (
      <Item
        item={item}
        onPress={() => {
          languageList.map((val) => {
            if (val.id === item.id) {
              selectVal.isChecked = !selectVal.isChecked;
            }
            return null;
          });
          setLanguageList([...languageList]);
        }}
        isChecked={item.isChecked}
      />
    );
  };

  const handleTagPress = ({item}) => {
    const selectVal = item;
    languageList.map((val) => {
      if (val.id === item.id) {
        selectVal.isChecked = !selectVal.isChecked;
      }
      return null;
    });
    setLanguageList([...languageList]);
  };

  const onTopEditSavePress = (certiData) => {
    const langNameItem = {
      language_name: '',
    };
    const langParams = [];
    selectedLanguage.map((lang) => {
      langNameItem.language_name = lang.title;
      langParams.push({...langNameItem});
      return null;
    });

    let policyValue = 'strict';
    if (selected === 1) {
      policyValue = 'moderate';
    } else if (selected === 2) {
      policyValue = 'flexible';
    } else {
      policyValue = 'strict';
    }

    const refereeEditParams = {
      cancellation_policy: policyValue,
      certificates: certiData ?? certificatesData,
      descriptions: bioText,
      fee: refereeFeeCount,
      is_published: true,
      language: langParams,
      sport_name: getSportName(selectRefereeData, authContext),
    };
    const newDataList = [];
    data.referee_data.forEach((item) => {
      if (item.sport === selectRefereeData.sport) {
        newDataList.push(refereeEditParams);
      } else {
        newDataList.push(item);
      }
    });
    const finalParams = {
      referee_data: newDataList,
      gender: info.genderText,
      birthday: info.birthdayText / 1000,
      city: info.currentCity,
    };
    onSavePress(finalParams);
    setEditModal(false);
  };
  console.log('CERTI:', certificatesData);
  return (
    <ScrollView style={styles.containerStyle}>
      <EditEventItem
        editButtonVisible={isAdmin}
        title={strings.bio}
        onEditPress={() => {
          setEditPressTitle(strings.bio);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
        containerStyle={{marginTop: 10, marginBottom: 12}}>
        <Text style={styles.bioTextStyle}>{bioText}</Text>
        <Text style={styles.signUpTimeStyle}>{strings.signedUpTime}</Text>
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        editButtonVisible={isAdmin}
        title={strings.basicinfotitle}
        onEditPress={() => {
          setEditPressTitle(strings.basicinfotitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}>
        <BasicInfoItem title={strings.gender} value={data.gender ?? '-'} />
        <BasicInfoItem
          title={strings.yearOfBirth}
          value={
            info.birthdayText ? moment(info.birthdayText).format('YYYY') : '-'
          }
        />
        <BasicInfoItem
          title={strings.language}
          value={languagesName === '' ? '-' : languagesName}
        />
        <BasicInfoItem
          title={strings.currrentCityTitle}
          value={info.currentCity ?? '-'}
          fieldView={{marginBottom: 10}}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        editButtonVisible={isAdmin}
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
          data={certificatesData?.length > 0 ? certificatesData : []}
          bounces={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginHorizontal: 5,
              }}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.notAvailableTextStyle}>
              No certificates found
            </Text>
          }
          style={{marginTop: 5, marginBottom: 15}}
          renderItem={({item: certItem}) => (
            <CertificatesItemView
              certificateImage={{uri: certItem.thumbnail}}
              certificateName={certItem.title}
              teamTitleTextStyle={{
                color: colors.lightBlackColor,
                fontFamily: fonts.RBold,
              }}
              profileImage={{
                borderWidth: 0.5,
                borderColor: colors.linesepratorColor,
                borderRadius: 8,
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 15,
        }}>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 20,
            color: colors.lightBlackColor,
          }}>
          {strings.refereeFee}
        </Text>

        <Text
          style={{
            fontSize: 16,

            color: colors.blackColor,
            fontFamily: fonts.RBold,
          }}>
          {`$${
            refereeSetting?.game_fee?.fee
              ? refereeSetting?.game_fee?.fee
              : 'N/A'
          }`}{' '}
          <Text
            style={{
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
            }}>
            CAD/hours
          </Text>
        </Text>
      </View>
      {/* <EditEventItem
          editButtonVisible={isAdmin}
        title={strings.refereeFee}
        subTitle={strings.perHour}
        onEditPress={() => {
          setEditPressTitle(strings.refereeFee);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
      >
        <Text style={styles.ntrpValueStyle}>{`$${refereeFeeCount} CAD/match`}</Text>
      </EditEventItem> */}
      <View style={styles.dividerStyle} />
      {/* <EditEventItem
        editButtonVisible={isAdmin}
        title={strings.cancellationPolicy}
        onEditPress={() => {
          setEditPressTitle(strings.cancellationPolicy);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}>
        <Text style={styles.ntrpValueStyle}>
          {(selected === 0 && 'Strict')
            || (selected === 1 && 'Moderate')
            || (selected === 2 && 'Flexible')}
        </Text>
      </EditEventItem> */}

      <View
        style={{
          margin: 15,
        }}>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 20,
            color: colors.lightBlackColor,
            marginBottom: 15,
          }}>
          {'Available Area'}
        </Text>
        {refereeSetting?.available_area ? (
          refereeSetting?.available_area?.is_specific_address ? (
            <FlatList
              data={
                refereeSetting?.available_area?.address_list?.length > 0
                  ? refereeSetting?.available_area?.address_list
                  : []
              }
              bounces={false}
              ListEmptyComponent={
                <Text style={styles.notAvailableTextStyle}>No Area found</Text>
              }
              style={{marginTop: 5, marginBottom: 15}}
              renderItem={({item}) => (
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.RRegular,
                      color: colors.lightBlackColor,
                      marginLeft: 10,
                    }}>
                    {item?.address}
                  </Text>
                  <View
                    style={{
                      backgroundColor: colors.grayBackgroundColor,
                      height: 1,
                      margin: 15,
                      marginLeft: 0,
                    }}
                  />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.lightBlackColor,
                }}>
                Within{' '}
                <Text
                  style={{color: colors.themeColor, fontFamily: fonts.RMedium}}>
                  {refereeSetting?.available_area?.radious}{' '}
                  {refereeSetting?.available_area?.distance_type}
                </Text>{' '}
                of{' '}
                <Text
                  style={{color: colors.themeColor, fontFamily: fonts.RMedium}}>
                  {refereeSetting?.available_area?.address}
                </Text>
              </Text>
              <MapPinWithRadious
                coordinate={refereeSetting?.available_area?.latlong}
                radious={
                  refereeSetting?.available_area?.distance_type === 'Mi'
                    ? refereeSetting?.available_area?.radious * 1609.344
                    : refereeSetting?.available_area?.radious * 1000
                }
                region={{
                  ...refereeSetting?.available_area?.latlong,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={styles.map}
              />
            </View>
          )
        ) : (
          <View>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.grayColor,
              }}>
              No Setting Configured Yet
            </Text>
          </View>
        )}
      </View>

      <Modal
        isVisible={privacyModal}
        backdropColor="black"
        style={{
          margin: 0,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0)',
        }}
        hasBackdrop
        onBackdropPress={() => setPrivacyModal(false)}
        backdropOpacity={0}>
        <SafeAreaView
          style={[
            styles.modalContainerViewStyle,
            {backgroundColor: colors.whiteColor},
          ]}>
          <LinearGradient
            colors={[colors.orangeColor, colors.yellowColor]}
            end={{x: 0.0, y: 0.25}}
            start={{x: 1, y: 0.5}}
            style={styles.gradiantHeaderViewStyle}></LinearGradient>
          <Header
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity onPress={() => setPrivacyModal(false)}>
                <Image
                  source={images.backArrow}
                  style={styles.cancelImageStyle}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={styles.headerCenterViewStyle}>
                <Image
                  source={images.refereesInImage}
                  style={styles.soccerImageStyle}
                  resizeMode={'contain'}
                />
                <Text style={styles.playInTextStyle}>{'Privacy Setting'}</Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity onPress={() => setPrivacyModal(false)}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.RLight,
                    color: colors.whiteColor,
                  }}>
                  {'Save'}
                </Text>
              </TouchableOpacity>
            }
          />
          {(editPressTitle === strings.bio ||
            editPressTitle === strings.certificateTitle ||
            editPressTitle === strings.refereeFeesTitle) && (
              <EventItemRender
              title={
                (editPressTitle === strings.bio && strings.bioPrivacyTitle) ||
                (editPressTitle === strings.certificateTitle &&
                  strings.certiPrivacyTitle) ||
                (editPressTitle === strings.refereeFeesTitle &&
                  strings.refereeFeePrivacyTitle)
              }
              containerStyle={{marginTop: 10}}>
                <FlatList
                data={privacyData ?? []}
                style={{marginTop: 10}}
                ItemSeparatorComponent={() => <View style={{height: 15}} />}
                renderItem={({item}) => (
                  <RadioBtnItem
                    titleName={item.title}
                    selected={item.isSelected}
                    touchRadioBtnStyle={{marginRight: 5}}
                    onRadioBtnPress={() => {
                      privacyData.map((scheduleItem) => {
                        const schedule = scheduleItem;
                        if (schedule.id === item.id) {
                          schedule.isSelected = true;
                        } else {
                          schedule.isSelected = false;
                        }
                        return null;
                      });
                      setPrivacyData([...privacyData]);
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              </EventItemRender>
          )}
          {editPressTitle === strings.basicinfotitle && (
            <KeyboardAwareScrollView
              enableOnAndroid={false}
              showsVerticalScrollIndicator={false}>
              <EventItemRender
                title={
                  editPressTitle === strings.basicinfotitle &&
                  strings.basicInfoPrivacyTitle
                }
                containerStyle={{marginTop: 10}}>
                <FlatList
                  data={genderPrivacy ?? []}
                  bounces={false}
                  style={{marginTop: 10}}
                  ListHeaderComponent={() => (
                    <Text style={styles.privacySubTitleStyle}>
                      {strings.gender}
                    </Text>
                  )}
                  ItemSeparatorComponent={() => <View style={{height: 15}} />}
                  renderItem={({item}) => (
                    <RadioBtnItem
                      titleName={item.title}
                      selected={item.isSelected}
                      touchRadioBtnStyle={{marginRight: 5}}
                      onRadioBtnPress={() => {
                        genderPrivacy.map((scheduleItem) => {
                          const schedule = scheduleItem;
                          if (schedule.id === item.id) {
                            schedule.isSelected = true;
                          } else {
                            schedule.isSelected = false;
                          }
                          return null;
                        });
                        setGenderPrivacy([...genderPrivacy]);
                      }}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={styles.privacySepratorStyle} />
                <FlatList
                  data={yearOfBirthPrivacy ?? []}
                  bounces={false}
                  style={{marginTop: 10}}
                  ListHeaderComponent={() => (
                    <Text style={styles.privacySubTitleStyle}>
                      {strings.yearOfBirth}
                    </Text>
                  )}
                  ItemSeparatorComponent={() => <View style={{height: 15}} />}
                  renderItem={({item}) => (
                    <RadioBtnItem
                      titleName={item.title}
                      selected={item.isSelected}
                      touchRadioBtnStyle={{marginRight: 5}}
                      onRadioBtnPress={() => {
                        yearOfBirthPrivacy.map((scheduleItem) => {
                          const schedule = scheduleItem;
                          if (schedule.id === item.id) {
                            schedule.isSelected = true;
                          } else {
                            schedule.isSelected = false;
                          }
                          return null;
                        });
                        setYearOfBirthPrivacy([...yearOfBirthPrivacy]);
                      }}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={styles.privacySepratorStyle} />
                <FlatList
                  data={languagePrivacy ?? []}
                  bounces={false}
                  style={{marginTop: 10}}
                  ListHeaderComponent={() => (
                    <Text style={styles.privacySubTitleStyle}>
                      {strings.language}
                    </Text>
                  )}
                  ItemSeparatorComponent={() => <View style={{height: 15}} />}
                  renderItem={({item}) => (
                    <RadioBtnItem
                      titleName={item.title}
                      selected={item.isSelected}
                      touchRadioBtnStyle={{marginRight: 5}}
                      onRadioBtnPress={() => {
                        languagePrivacy.map((scheduleItem) => {
                          const schedule = scheduleItem;
                          if (schedule.id === item.id) {
                            schedule.isSelected = true;
                          } else {
                            schedule.isSelected = false;
                          }
                          return null;
                        });
                        setLanguagePrivacy([...languagePrivacy]);
                      }}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={styles.privacySepratorStyle} />
                <FlatList
                  data={currentCityPrivacy ?? []}
                  bounces={false}
                  style={{marginTop: 10}}
                  ListHeaderComponent={() => (
                    <Text style={styles.privacySubTitleStyle}>
                      {strings.currrentCityTitle}
                    </Text>
                  )}
                  ItemSeparatorComponent={() => <View style={{height: 15}} />}
                  renderItem={({item}) => (
                    <RadioBtnItem
                      titleName={item.title}
                      selected={item.isSelected}
                      touchRadioBtnStyle={{marginRight: 5}}
                      onRadioBtnPress={() => {
                        currentCityPrivacy.map((scheduleItem) => {
                          const schedule = scheduleItem;
                          if (schedule.id === item.id) {
                            schedule.isSelected = true;
                          } else {
                            schedule.isSelected = false;
                          }
                          return null;
                        });
                        setCurrentCityPrivacy([...currentCityPrivacy]);
                      }}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </EventItemRender>
            </KeyboardAwareScrollView>
          )}
        </SafeAreaView>
      </Modal>

      <EditRefereeCertificate
        certifiData={certificatesData?.length ? certificatesData : []}
        onClose={() => setEditCertificateModal(false)}
        visible={editCertificateModal}
        onSavePress={(certiData) => {
          setEditCertificateModal(false);
          setCertificatesData([...certiData]);
          onTopEditSavePress([...certiData]);
        }}
      />

      <Modal
        isVisible={editModal}
        backdropColor="black"
        style={{
          height: hp(100),
          margin: 0,
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0)',
        }}
        onBackdropPress={() => setEditModal(false)}>
        <TCKeyboardView>
          <View
            style={{
              ...styles.modalContainerViewStyle,
              height: hp(100),
              top: hp(5),
              backgroundColor: colors.whiteColor,
            }}>
            <LinearGradient
              colors={[colors.whiteColor, colors.whiteColor]}
              end={{x: 0.0, y: 0.25}}
              start={{x: 1, y: 0.5}}
              style={styles.gradiantHeaderViewStyle}></LinearGradient>
            <Header
              mainContainerStyle={styles.headerMainContainerStyle}
              leftComponent={
                <TouchableOpacity onPress={() => setEditModal(false)}>
                  <Image
                    source={images.backArrow}
                    style={styles.cancelImageStyle}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              }
              centerComponent={
                <View style={styles.headerCenterViewStyle}>
                  <Image
                    source={images.refereesInImage}
                    style={styles.soccerImageStyle}
                    resizeMode={'contain'}
                  />
                  <Text style={styles.playInTextStyle}>
                    {'Edit'}{' '}
                    {(editPressTitle === strings.bio && strings.bio) ||
                      (editPressTitle === strings.basicinfotitle &&
                        strings.basicinfotitle) ||
                      (editPressTitle === strings.certificateTitle &&
                        strings.certificateTitle) ||
                      (editPressTitle === strings.refereeFeesTitle && 'Fee') ||
                      (editPressTitle === strings.cancellationPolicy &&
                        'Policy')}
                  </Text>
                </View>
              }
              rightComponent={
                <TouchableOpacity
                  onPress={() => onTopEditSavePress(certificatesData)}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.RLight,
                      color: colors.lightBlackColor,
                    }}>
                    {'Save'}
                  </Text>
                </TouchableOpacity>
              }
            />
            <TCThinDivider
              backgroundColor={colors.refereeHomeDividerColor}
              width={'100%'}
              height={1}
            />
            <ScrollView style={{flex: 1}}>
              {editPressTitle === strings.bio && (
                <View>
                  <EventTextInput
                    textInputStyle={{height: 150}}
                    value={bioText}
                    multiline={true}
                    onChangeText={(text) => {
                      setBioText(text);
                    }}
                  />
                </View>
              )}

              {editPressTitle === strings.basicinfotitle && (
                <View>
                  <EventItemRender
                    title={strings.gender}
                    containerStyle={{marginTop: 15}}>
                    <View style={{marginTop: 8}}>
                      <TCPicker
                        dataSource={DataSource.Gender}
                        placeholder={'Select Gender'}
                        value={info?.genderText ?? '-'}
                        onValueChange={(value) => {
                          setInfo({...info, genderText: value});
                        }}
                      />
                    </View>
                  </EventItemRender>
                  <EventItemRender
                    title={strings.yearOfBirth}
                    containerStyle={{marginTop: 15}}>
                    <BirthSelectItem
                      title={
                        info?.birthdayText
                          ? moment(info.birthdayText).format('YYYY')
                          : '-'
                      }
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
                    containerStyle={{marginTop: 15}}>
                    <BirthSelectItem
                      title={
                        selectedLanguage?.length > 0
                          ? selectedLanguage.map((item, index) => {
                              let tit = item?.title;
                              if (index !== selectedLanguage?.length - 1) {
                                tit += ', ';
                              }
                              return tit;
                            })
                          : '-'
                      }
                      onItemPress={() => {
                        editLanguage();
                      }}
                    />
                  </EventItemRender>
                  <ModalLocationSearch
                    visible={searchLocationModal}
                    onClose={() => setSearchLocationModal(false)}
                    onSelect={(location) => {
                      const city = location.terms?.[0]?.value;
                      setInfo({...info, currentCity: city});
                    }}
                  />
                  <EventItemRender
                    title={strings.currrentCityTitle}
                    containerStyle={{marginTop: 15}}>
                    <BirthSelectItem
                      title={info.currentCity}
                      onItemPress={() => {
                        setSearchLocationModal(!searchLocationModal);
                      }}
                    />
                  </EventItemRender>
                </View>
              )}

              {editPressTitle === strings.certificateTitle && (
                <KeyboardAwareScrollView enableOnAndroid={false}>
                  <EventItemRender
                    title={strings.addCertiMainTitle}
                    headerTextStyle={{fontSize: 16}}>
                    <FlatList
                      data={
                        certificatesData?.length
                          ? [...certificatesData, '0']
                          : []
                      }
                      scrollEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({item, index}) => {
                        if (index === certificatesData.length) {
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
                          <View style={{marginTop: 15}}>
                            <EventTextInput
                              value={item.title}
                              onChangeText={(text) => {
                                const certiData = JSON.parse(
                                  JSON.stringify(certificatesData),
                                );
                                certiData[index].title = text;
                                setCertificatesData([...certiData]);
                              }}
                              containerStyle={{
                                alignSelf: 'flex-start',
                                width: wp(92),
                                marginLeft: 2,
                              }}
                            />
                            <View
                              style={{
                                marginTop: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Image
                                source={{uri: item.thumbnail}}
                                style={{
                                  width: 195,
                                  height: 150,
                                  borderRadius: 10,
                                }}
                                resizeMode={'cover'}
                              />
                              <Text
                                style={{
                                  marginRight: 5,
                                  fontSize: 14,
                                  fontFamily: fonts.RRegular,
                                  color: colors.redDelColor,
                                }}
                                onPress={() => {
                                  deleteItemById(index);
                                }}>
                                Delete
                              </Text>
                            </View>
                          </View>
                        );
                      }}
                      ListFooterComponent={() => (
                        <View>
                          {selectedCerti.length > 0 && (
                            <Image
                              source={{uri: selectedCerti[0].path}}
                              style={styles.staticSelectImageStyle}
                              resizeMode={'cover'}
                            />
                          )}
                          <AddTimeItem
                            addTimeText={strings.addCertiTitle}
                            source={images.plus}
                            onAddTimePress={() => {
                              if (addCertiTitle === '') {
                                Alert.alert('Please Enter Certificate Name!');
                              } else if (selectedCerti.length === 0) {
                                Alert.alert('Please Select Certificate Image!');
                              } else {
                                const imageArray = selectedCerti.map(
                                  (dataItem) => dataItem,
                                );
                                uploadImages(imageArray, authContext).then(
                                  (responses) => {
                                    console.log('Response :-', responses);
                                    const certiAddData = [...certificatesData];
                                    const obj = {
                                      id: certiAddData.length,
                                      thumbnail: responses[0].thumbnail,
                                      url: responses[0].fullImage,
                                      title: addCertiTitle,
                                    };
                                    certiAddData.push(obj);
                                    setCertificatesData(certiAddData);
                                    setSelectedCerti([]);
                                    setAddCertiTitle('');
                                  },
                                );
                              }
                            }}
                          />
                        </View>
                      )}
                      ListFooterComponentStyle={{marginTop: 20}}
                      keyExtractor={(itemValue, index) => index.toString()}
                    />
                  </EventItemRender>
                </KeyboardAwareScrollView>
              )}

              {editPressTitle === strings.refereeFee && (
                <EventTextInput
                  value={refereeFeeCount.toString()}
                  onChangeText={(text) => {
                    if (text <= 0.0 || text >= 1.0) {
                      setRefereeFeeCount(text);
                    } else {
                      Alert.alert(strings.enterValidGameFee);
                    }
                  }}
                  keyboardType={'numeric'}
                  displayLastTitle={true}
                  displayFirstTitle={true}
                  valueFirstTitle={
                    refereeFeeCount.toString().length > 0 ? '$' : ''
                  }
                  valueEndTitle={' CAD/match'}
                  containerStyle={{justifyContent: 'space-between'}}
                />
              )}

              {editPressTitle === strings.cancellationPolicy && (
                <View>
                  <View>
                    <Text style={styles.LocationText}>
                      {strings.cancellationPolicyTitle}
                    </Text>
                  </View>
                  <View style={styles.radioButtonView}>
                    <TouchableWithoutFeedback onPress={() => setSelected(0)}>
                      {selected === 0 ? (
                        <FastImage
                          source={images.radioSelect}
                          style={styles.radioImage}
                        />
                      ) : (
                        <FastImage
                          source={images.radioUnselect}
                          style={styles.unSelectRadioImage}
                        />
                      )}
                    </TouchableWithoutFeedback>
                    <Text style={styles.radioText}>{strings.strictText}</Text>
                  </View>
                  <View style={styles.radioButtonView}>
                    <TouchableWithoutFeedback onPress={() => setSelected(1)}>
                      {selected === 1 ? (
                        <FastImage
                          source={images.radioSelect}
                          style={styles.radioImage}
                        />
                      ) : (
                        <FastImage
                          source={images.radioUnselect}
                          style={styles.unSelectRadioImage}
                        />
                      )}
                    </TouchableWithoutFeedback>
                    <Text style={styles.radioText}>{strings.moderateText}</Text>
                  </View>
                  <View style={styles.radioButtonView}>
                    <TouchableWithoutFeedback onPress={() => setSelected(2)}>
                      {selected === 2 ? (
                        <FastImage
                          source={images.radioSelect}
                          style={styles.radioImage}
                        />
                      ) : (
                        <FastImage
                          source={images.radioUnselect}
                          style={styles.unSelectRadioImage}
                        />
                      )}
                    </TouchableWithoutFeedback>
                    <Text style={styles.radioText}>{strings.flexibleText}</Text>
                  </View>
                  {selected === 0 && (
                    <View>
                      <Text style={styles.membershipText}>
                        {strings.strictText}{' '}
                      </Text>
                      <Text style={styles.whoJoinText}>
                        <Text style={styles.membershipSubText}>
                          {strings.strictPoint1Title}
                        </Text>
                        {'\n'}
                        {strings.strictPoint1Desc}
                        {'\n'}
                        {'\n'}
                        <Text style={styles.membershipSubText}>
                          {strings.strictPoint2Title}
                        </Text>
                        {'\n'}
                        {strings.strictPoint2Desc}
                      </Text>
                    </View>
                  )}
                  {selected === 1 && (
                    <View>
                      <Text style={styles.membershipText}>
                        {strings.moderateText}{' '}
                      </Text>
                      <Text style={styles.whoJoinText}>
                        <Text style={styles.membershipSubText}>
                          {strings.moderatePoint1Title}
                        </Text>
                        {'\n'}
                        {strings.moderatePoint1Desc}
                        {'\n'}
                        {'\n'}
                        <Text style={styles.membershipSubText}>
                          {strings.moderatePoint2Title}
                        </Text>
                        {'\n'}
                        {strings.moderatePoint2Desc}
                        {'\n'}
                        {'\n'}
                        <Text style={styles.membershipSubText}>
                          {strings.moderatePoint3Title}
                        </Text>
                        {strings.moderatePoint3Desc}
                      </Text>
                    </View>
                  )}
                  {selected === 2 && (
                    <View>
                      <Text style={styles.membershipText}>
                        {strings.flexibleText}{' '}
                      </Text>
                      <Text style={styles.whoJoinText}>
                        <Text style={styles.membershipSubText}>
                          {strings.flexiblePoint1Title}
                        </Text>
                        {'\n'}
                        {strings.flexiblePoint1Desc}
                        {'\n'}
                        {'\n'}
                        <Text style={styles.membershipSubText}>
                          {strings.flexiblePoint2Title}
                        </Text>
                        {'\n'}
                        {strings.flexiblePoint2Desc}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>

          <Modal
            isVisible={editLanguageModal}
            backdropColor="black"
            style={{
              margin: 0,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            hasBackdrop
            onBackdropPress={() => setEditLanguageModal(false)}>
            <TCKeyboardView>
              <SafeAreaView
                style={[
                  styles.modalContainerViewStyle,
                  {
                    top: hp(5),
                    height: hp(100),
                    backgroundColor: colors.whiteColor,
                  },
                ]}>
                <LinearGradient
                  colors={[colors.orangeColor, colors.yellowColor]}
                  end={{x: 0.0, y: 0.25}}
                  start={{x: 1, y: 0.5}}
                  style={styles.gradiantHeaderViewStyle}></LinearGradient>
                <Header
                  mainContainerStyle={styles.headerMainContainerStyle}
                  leftComponent={
                    <TouchableOpacity
                      onPress={() => setEditLanguageModal(false)}>
                      <Image
                        source={images.backArrow}
                        style={styles.cancelImageStyle}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  }
                  centerComponent={
                    <View style={styles.headerCenterViewStyle}>
                      <Image
                        source={images.refereesInImage}
                        style={styles.soccerImageStyle}
                        resizeMode={'contain'}
                      />
                      <Text style={styles.playInTextStyle}>
                        {'Edit Languages'}
                      </Text>
                    </View>
                  }
                  rightComponent={
                    <TouchableOpacity
                      onPress={() => {
                        setEditLanguageModal(false);
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: fonts.RLight,
                          color: colors.whiteColor,
                        }}>
                        {'Done'}
                      </Text>
                    </TouchableOpacity>
                  }
                />
                <TCSearchBox
                  style={{margin: 15}}
                  value={searchLanguageText}
                  onChangeText={(text) => {
                    if (text.length === 0) {
                      setLanguageList(language_list);
                    }
                    setSearchLanguageText(text);
                  }}
                />
                {selectedLanguage.length > 0 && (
                  <TCTags
                    dataSource={selectedLanguage}
                    titleKey={'title'}
                    onTagCancelPress={handleTagPress}
                  />
                )}
                <View style={{margin: wp(3)}}>
                  <FlatList
                    ListEmptyComponent={
                      <Text
                        style={{
                          textAlign: 'center',
                          marginTop: hp(2),
                          color: colors.userPostTimeColor,
                        }}>
                        No Records Found
                      </Text>
                    }
                    data={languageList ?? []}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>
              </SafeAreaView>
            </TCKeyboardView>
          </Modal>
        </TCKeyboardView>
      </Modal>

      <ActionSheet
        ref={actionSheet}
        options={[
          (editPressTitle === strings.bio && 'Edit Bio') ||
            (editPressTitle === strings.basicinfotitle && 'Edit Basic Info') ||
            (editPressTitle === strings.certificateTitle &&
              'Edit Certificates') ||
            (editPressTitle === strings.refereeFee && 'Edit Fee') ||
            (editPressTitle === strings.cancellationPolicy && 'Edit Policy'),
          'Privacy Setting',
          'Cancel',
        ]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            if (
              editPressTitle === strings.bio ||
              editPressTitle === strings.basicinfotitle ||
              editPressTitle === strings.refereeFee ||
              editPressTitle === strings.cancellationPolicy
            ) {
              editInfoModal();
            } else if (editPressTitle === strings.certificateTitle) {
              setEditCertificateModal(true);
            }
          } else if (
            index === 1 &&
            (editPressTitle === strings.bio ||
              editPressTitle === strings.basicinfotitle ||
              editPressTitle === strings.certificateTitle ||
              editPressTitle === strings.refereeFee ||
              editPressTitle === strings.cancellationPolicy)
          ) {
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
  // ntrpValueStyle: {
  //   fontSize: 16,
  //   fontFamily: fonts.RRegular,
  //   color: colors.lightBlackColor,
  //   marginBottom: 10,
  // },
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
    tintColor: colors.lightBlackColor,
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
    color: colors.lightBlackColor,
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
  listItems: {
    paddingVertical: 6,
    color: 'black',
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 0,
  },
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  notAvailableTextStyle: {
    marginLeft: wp(5),
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  checkboxImg: {
    width: wp('7%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  selectUnSelectViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    height: 50,
  },
  LocationText: {
    marginTop: hp('2%'),
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    textAlign: 'left',
    paddingLeft: 15,
  },
  radioButtonView: {
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
  },
  radioText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    marginLeft: 15,
    marginRight: 15,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 22,
  },
  membershipText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginLeft: 15,
    marginTop: 20,
  },
  membershipSubText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    marginLeft: 15,
    marginTop: 20,
  },
  whoJoinText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
  },
  map: {
    height: 150,
    marginTop: 15,
    marginBottom: 15,
  },
});

export default RefereeInfoSection;
