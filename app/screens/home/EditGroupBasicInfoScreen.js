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
} from 'react-native';
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

  const onSaveButtonClicked = useCallback(() => {
    if (checkValidation()) {
      console.log('groupData', groupData);

      setloading(true);
      const groupProfile = {};
      groupProfile.sport = groupData.sport;
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
  }, [authContext, groupData, groupLanguages, maxAge, minAge, navigation]);

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
  }, [navigation, groupData, groupLanguages, onSaveButtonClicked]);

  useEffect(() => {
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

  const checkValidation = () => {
    if (groupData.sport === '') {
      Alert.alert(strings.alertmessagetitle, strings.sportcannotbeblank);
      return false;
    }

    // else if (player1ID === player2ID) {
    //   if (player1ID !== '' && player2ID !== '') {
    //     Alert.alert('Towns Cup', 'Both player cannot be same');
    //   }
    // } else if (
    //   (player1ID === '' && player2ID !== '')
    //   || (player1ID !== '' && player2ID === '')
    // ) {
    //   Alert.alert('Towns Cup', 'One player cannot be blank');
    // }
    return true;
  };

  const isIconCheckedOrNot = ({item, index}) => {
    languages[index].isChecked = !item.isChecked;
    setLanguages([...languages]);
  };

  const toggleLanguageModal = () => {
    const selectedLanguages = groupLanguages || [];
    console.log('groupLanguages',groupLanguages);
    
    // if (groupLanguages) {
    //   selectedLanguages = groupLanguages.split(', ');
    // }
    console.log('Utility.languages',Utility.languageList);
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
            <View style={{height: 40, marginHorizontal: 15}}>
              <RNPickerSelect
                placeholder={{
                  label: strings.selectSportPlaceholder,
                  value: '',
                }}
                items={[
                  {label: 'Football', value: 'football'},
                  {label: 'Baseball', value: 'baseball'},
                  {label: 'Tennis', value: 'tennis'},
                  {label: 'Hockey', value: 'hockey'},
                ]}
                onValueChange={(value) => {
                  setGroupData({...groupData, sport: value});
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.inputIOS,
                  inputAndroid: styles.inputAndroid,
                }}
                value={groupData.sport}
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
    width: '100%',
    height: Dimensions.get('window').height / 2,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.29,
    shadowRadius: 5,
    elevation: 5,
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
});
