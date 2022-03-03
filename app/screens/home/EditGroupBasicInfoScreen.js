/* eslint-disable no-param-reassign */
import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useContext,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import {patchGroup} from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import TCTouchableLabel from '../../components/TCTouchableLabel';
import TCGradientButton from '../../components/TCGradientButton';
import ImageButton from '../../components/WritePost/ImageButton';
import TCKeyboardView from '../../components/TCKeyboardView';
import DataSource from '../../Constants/DataSource';
import AuthContext from '../../auth/context';
import TCThinDivider from '../../components/TCThinDivider';

export default function EditGroupBasicInfoScreen({navigation, route}) {
  // For activity indicator
  const authContext = useContext(AuthContext);

  const {groupDetails} = route?.params;
  console.log('groupDetailsgroupDetails:', groupDetails);
  const [loading, setloading] = useState(false);
  const [groupData, setGroupData] = useState(groupDetails);
  const [minAge, setMinAge] = useState(groupDetails?.min_age ?? 1);
  const [maxAge, setMaxAge] = useState(groupDetails?.max_age ?? 70);
  const [minAgeValue, setMinAgeValue] = useState([]);
  const [maxAgeValue, setMaxAgeValue] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [groupLanguages, setGroupLanguages] = useState(groupDetails?.languages);
  const [languages, setLanguages] = useState([]);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [selectedSports, setSelectedSports] = useState(
    groupDetails?.sports ? groupDetails?.sports : [],
  );
  const [sportsName, setSportsName] = useState('');
  const [sportList, setSportList] = useState([]);

  const onSaveButtonClicked = useCallback(() => {
    if (checkValidation()) {
      console.log('groupData', groupData);

      console.log('selectedSports', selectedSports);
      const newArray = selectedSports.map((obj) => {
        delete obj.isChecked;
        delete obj.entity_type;
        return obj;
      });

      setloading(true);
      const groupProfile = {};
      groupProfile.sports = newArray;
      groupProfile.sports_string = sportsName;
      groupProfile.gender = groupData.gender;
      groupProfile.min_age = minAge;
      groupProfile.max_age = maxAge;
      groupProfile.languages = groupLanguages;
      groupProfile.registration_fee = groupData.registration_fee;
      groupProfile.membership_fee = groupData.membership_fee;
      groupProfile.membership_fee_type = groupData.membership_fee_type;
      groupProfile.office_address =
        groupData.office_address && groupData.office_address;

      console.log('updating values', groupProfile);

      patchGroup(groupData.group_id, groupProfile, authContext)
        .then(async (response) => {
          setloading(false);
          if (response && response.status === true) {
            console.log('response', response);
            const entity = await Utility.getStorage('loggedInEntity');
            entity.obj = response.payload;
            Utility.setStorage('loggedInEntity', entity);
            navigation.goBack();
          } else {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, 'Something went wrong');
            }, 0.1);
          }
        })
        .catch((e) => {
          setloading(false);
          console.log('2');
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [
    authContext,
    groupData,
    groupLanguages,
    maxAge,
    minAge,
    navigation,
    selectedSports,
    sportsName,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={{
            marginEnd: 16,
            fontSize: 14,
            fontFamily: fonts.RRegular,
            color: colors.lightBlackColor,
          }}
          onPress={() => {
            onSaveButtonClicked();
          }}>
          {strings.save}
        </Text>
      ),
    });
  }, [
    navigation,
    groupData,
    groupLanguages,
    onSaveButtonClicked,
    selectedSports,
  ]);

  useEffect(() => {
    getSports();
    const arr = [];
    for (const tempData of Utility.languageList) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, []);
  // Generating min and max age values
  useEffect(() => {
    const minAgeArray = [];
    const maxAgeArray = [];

    console.log('MIN AGE:=>', minAge);
    console.log('MAX AGE:=>', maxAge);

    for (let i = 1; i <= maxAge; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      minAgeArray.push(dataSource);
    }

    for (let i = minAge; i <= 70; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      maxAgeArray.push(dataSource);
    }
    setMinAgeValue(minAgeArray);
    setMaxAgeValue(maxAgeArray);
  }, [minAge, maxAge]);

  const getSports = () => {
    let sportArr = [];

    authContext.sports.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });

    const arr = [];
    for (const tempData of sportArr) {
      console.log('tempData', tempData);
      const sportsArray = selectedSports.filter(
        (spo) =>
          spo.sport === tempData.sport &&
          spo.sport_type === tempData.sport_type,
      );
      const obj = {};
      obj.entity_type = tempData.entity_type;
      obj.sport = tempData.sport;
      obj.sport_type = tempData.sport_type;
      obj.isChecked = sportsArray.length > 0;
      arr.push(obj);
    }
    console.log('Sport array:=>', arr);
    setSportList(arr);
  };

  useEffect(() => {
    let sportText = '';
    console.log('selectedSports:=>', selectedSports);
    if (selectedSports.length > 0) {
      selectedSports.map((sportItem, index) => {
        sportText =
          sportText +
          (index ? ', ' : '') +
          Utility.getSportName(sportItem, authContext);
        return null;
      });
      setSportsName(sportText);
    }
  }, [authContext, selectedSports]);

  const toggleModal = () => {
    setVisibleSportsModal(!visibleSportsModal);
  };

  const checkValidation = () => {
    if (selectedSports.length <= 0) {
      Alert.alert(strings.alertmessagetitle, strings.sportcannotbeblank);
      return false;
    }
    if (groupData.registration_fee >= 1000) {
      Alert.alert(
        strings.alertmessagetitle,
        'Membership Registration fee can not be biggger than 1000.',
      );
      return false;
    }
    if (groupData.membership_fee >= 1000) {
      Alert.alert(
        strings.alertmessagetitle,
        'Membership fee can not be biggger than 1000.',
      );
      return false;
    }

    // else if (player1ID === player2ID) {
    //   if (player1ID !== '' && player2ID !== '') {
    //     Alert.alert(strings.appName, 'Both player cannot be same');
    //   }
    // } else if (
    //   (player1ID === '' && player2ID !== '')
    //   || (player1ID !== '' && player2ID === '')
    // ) {
    //   Alert.alert(strings.appName, 'One player cannot be blank');
    // }
    return true;
  };

  const isIconCheckedOrNot = ({item, index}) => {
    languages[index].isChecked = !item.isChecked;
    setLanguages([...languages]);
  };

  const toggleLanguageModal = () => {
    const selectedLanguages = groupLanguages || [];
    console.log('groupLanguages', groupLanguages);

    // if (groupLanguages) {
    //   selectedLanguages = groupLanguages.split(', ');
    // }
    console.log('Utility.languages', Utility.languageList);
    const arr = [];
    for (const tempData of Utility.languageList) {
      if (selectedLanguages.includes(tempData.language)) {
        tempData.isChecked = true;
      } else {
        tempData.isChecked = false;
      }

      arr.push(tempData);
    }
    setLanguages(arr);
    setModalVisible(!isModalVisible);
  };

  const languageApplyBtnPress = () => {
    const arr = [];
    for (const tempData of languages) {
      if (tempData.isChecked) {
        arr.push(tempData.language);
      }
    }
    setGroupLanguages(arr.join(', '));
    setModalVisible(!isModalVisible);
  };

  const renderLanguage = ({item, index}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({item, index});
      }}>
      <View style={{height: 60, justifyContent: 'center'}}>
        <Text style={styles.languageList}>{item.language}</Text>
        <View style={styles.checkbox}>
          <FastImage
            source={
              languages[index].isChecked
                ? images.checkWhiteLanguage
                : images.uncheckWhite
            }
            style={styles.checkboxImg}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const isIconCheckedOrNotSport = ({item, index}) => {
    sportList[index].isChecked = !item.isChecked;
    setSportList([...sportList]);
  };

  const renderSports = ({item, index}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        isIconCheckedOrNotSport({item, index});
      }}>
      <View
        style={{
          // padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>
          {Utility.getSportName(item, authContext)}
        </Text>
        <View style={styles.checkbox}>
          {sportList[index].isChecked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <TCKeyboardView>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        {/* Sport */}
        <View>
          <View style={{flexDirection: 'row'}}>
            <TCLabel
              title={strings.SportsTextFieldTitle}
              style={styles.titleStyle}
            />
            <Text style={styles.validationSign}>*</Text>
          </View>
          {groupData.entity_type === 'club' && (
            <TouchableOpacity style={styles.languageView} onPress={toggleModal}>
              <Text
                style={
                  sportsName
                    ? styles.languageText
                    : styles.languagePlaceholderText
                }
                numberOfLines={50}>
                {sportsName || 'Sports'}
              </Text>
            </TouchableOpacity>
          )}
          {groupData.entity_type === 'team' && (
            <View style={{marginHorizontal: 25, marginTop: 5}}>
              <Text style={{fontFamily: fonts.RRegular, fontSize: 16}}>
                {Utility.capitalize(groupData.sport)}
              </Text>
            </View>
          )}
        </View>
        {/* Member's gender */}
        <View>
          <TCLabel title={strings.genderTitle} style={styles.titleStyle} />
          {groupData.entity_type === 'club' && (
            <View style={{height: 40, marginHorizontal: 15}}>
              <RNPickerSelect
                placeholder={{
                  label: strings.selectGenderPlaceholder,
                  value: null,
                }}
                items={DataSource.Gender}
                onValueChange={(value) => {
                  setGroupData({...groupData, gender: value});
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.inputIOS,
                  inputAndroid: styles.inputAndroid,
                }}
                value={groupData.gender}
                Icon={() => (
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrow}
                  />
                )}
              />
            </View>
          )}
          {groupData.entity_type === 'team' && (
            <View style={{marginHorizontal: 25, marginTop: 5}}>
              <Text style={{fontFamily: fonts.RRegular, fontSize: 16}}>
                {groupData.gender
                  ? Utility.capitalize(groupData.gender)
                  : strings.NA}
              </Text>
            </View>
          )}
        </View>
        {/* Member's Age */}
        <View>
          <TCLabel title={strings.membersAgeTitle} />
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 15,
              justifyContent: 'space-between',
            }}>
            <View style={{width: '49%'}}>
              <RNPickerSelect
                placeholder={{
                  label: strings.minPlaceholder,
                  value: null,
                }}
                items={minAgeValue}
                onValueChange={(value) => {
                  setMinAge(value);
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.inputIOS,
                  inputAndroid: styles.inputAndroid,
                }}
                value={minAge}
                Icon={() => (
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrow}
                  />
                )}
              />
            </View>
            <View style={{width: '49%'}}>
              <RNPickerSelect
                placeholder={{
                  label: strings.maxPlaceholder,
                  value: 0,
                }}
                items={maxAgeValue}
                onValueChange={(value) => {
                  setMaxAge(value);
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.inputIOS,
                  inputAndroid: styles.inputAndroid,
                }}
                value={maxAge}
                Icon={() => (
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrow}
                  />
                )}
              />
            </View>
          </View>
        </View>
        {/* Language Fee */}
        <View>
          <TCLabel title={strings.languageTitle} />
          <TCTouchableLabel
            title={groupLanguages?.toString() || ''}
            onPress={toggleLanguageModal}
            placeholder={strings.languagePlaceholder}
            showNextArrow={true}
          />
        </View>
        {/* Membership Registration Fee */}
        <View>
          <TCLabel title={strings.membershipregfee} />
          <TCTextField
            placeholder={strings.enterFeePlaceholder}
            onChangeText={(text) =>
              setGroupData({...groupData, registration_fee: text})
            }
            value={groupData.registration_fee}
            keyboardType={'decimal-pad'}
            leftView={<Text style={styles.leftViewStyle}>{strings.CAD}</Text>}
          />
        </View>
        {/* Membership Fee */}
        <View>
          <TCLabel title={strings.membershipfee} />
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 15,
              justifyContent: 'space-between',
            }}>
            <View style={{width: '49%'}}>
              <RNPickerSelect
                placeholder={{
                  label: strings.feeCyclePlaceholder,
                  value: null,
                }}
                items={Utility.groupMembershipFeeTypes}
                onValueChange={(value) =>
                  setGroupData({...groupData, membership_fee_type: value})
                }
                value={groupData.membership_fee_type}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.inputIOS,
                  inputAndroid: styles.inputAndroid,
                }}
                Icon={() => (
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrow}
                  />
                )}
              />
            </View>
            <View style={{width: '49%'}}>
              <TCTextField
                placeholder={strings.enterFeePlaceholder}
                onChangeText={(text) =>
                  setGroupData({...groupData, membership_fee: text})
                }
                value={groupData.membership_fee}
                keyboardType={'decimal-pad'}
                leftView={
                  <Text style={styles.leftViewStyle}>{strings.CAD}</Text>
                }
              />
            </View>
          </View>

          <View style={{width: '100%'}}>
            <TCLabel title={strings.officeAddress} />
            <TCTextField
              placeholder={strings.officeAddress}
              onChangeText={(text) =>
                setGroupData({...groupData, office_address: text})
              }
              value={groupData.office_address}
            />
          </View>
        </View>

        <View style={{height: 50}} />
      </ScrollView>
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        backdropOpacity={0.1}
        style={{marginLeft: 0, marginRight: 0, marginBottom: 0}}>
        <View style={styles.languageView}>
          <ImageButton
            source={images.cancelImage}
            style={styles.cancelButtonStyle}
            imageStyle={{width: 13, height: 13}}
            onImagePress={() => {
              toggleLanguageModal();
            }}
          />
          <Text style={styles.languageTitle}>{strings.languages}</Text>
          <View style={styles.separatorLine}></View>
          <FlatList
            data={languages}
            keyExtractor={(item, i) => i?.toString()}
            renderItem={renderLanguage}
            ItemSeparatorComponent={() => (
              <View style={styles.shortSeparatorLine}></View>
            )}
          />
          <View style={styles.separatorLine}></View>
          <TCGradientButton
            outerContainerStyle={{marginBottom: 40}}
            title={strings.applyTitle}
            onPress={() => {
              languageApplyBtnPress();
            }}
          />
        </View>
      </Modal>
      <Modal
        isVisible={visibleSportsModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleSportsModal(false)}
        onRequestClose={() => setVisibleSportsModal(false)}
        backdropOpacity={0}
        style={{
          marginLeft: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginRight: 0,
          marginBottom: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={Utility.getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setVisibleSportsModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              Sports
            </Text>
            <TouchableOpacity
              onPress={() => {
                const filterChecked = sportList.filter((obj) => obj.isChecked);
                setSelectedSports(filterChecked);
                toggleModal();
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={sportList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
          />
        </View>
      </Modal>
    </TCKeyboardView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  downArrow: {
    height: 6,
    top: 18,
    right: 15,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 12,
  },
  titleStyle: {
    marginTop: 25,
  },
  validationSign: {
    fontSize: 20,
    marginLeft: 2,
    marginTop: 21,
    color: colors.redColor,
  },
  inputIOS: {
    height: 40,
    width: '100%',
    fontSize: 16,
    paddingLeft: 15,
    color: 'black',
    paddingRight: 40,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.29,
    shadowRadius: 1,
  },
  inputAndroid: {
    height: 40,
    width: '100%',
    alignSelf: 'center',
    fontSize: 16,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    elevation: 3,
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 40,
    marginTop: 20,
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: 40,
  },
  checkboxImg: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  shortSeparatorLine: {
    backgroundColor: colors.grayBackgroundColor,
    height: 1,
    width: 'auto',
    marginHorizontal: 30,
  },
  separatorLine: {
    backgroundColor: colors.grayBackgroundColor,
    height: 1,
    width: '100%',
  },
  languageTitle: {
    alignSelf: 'center',
    marginTop: 26,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  languageView: {
    // width: '100%',
    // height: Dimensions.get('window').height / 2,
    // backgroundColor: 'white',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.29,
    // shadowRadius: 5,
    // elevation: 5,

    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
  },
  cancelButtonStyle: {
    width: 23,
    height: 23,
    top: 23,
    left: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftViewStyle: {
    alignSelf: 'center',
    marginRight: 15,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  languageText: {
    backgroundColor: colors.whiteColor,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  languagePlaceholderText: {
    backgroundColor: colors.whiteColor,
    color: colors.userPostTimeColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },
});
