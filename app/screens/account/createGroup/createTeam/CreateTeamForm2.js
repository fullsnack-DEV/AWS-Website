import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AuthContext from '../../../../auth/context';

import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import {
  getHitSlop,
  groupMemberGenderItems,
  languageList,
} from '../../../../utils';
import TCFormProgress from '../../../../components/TCFormProgress';

import TCThinDivider from '../../../../components/TCThinDivider';
import TCGradientButton from '../../../../components/TCGradientButton';
import TCSearchBox from '../../../../components/TCSearchBox';
import TCFollowerList from '../../../../components/TCFollowerList';

export default function CreateTeamForm2({ navigation, route }) {
  const { createTeamForm1, followersList } = route?.params;

  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [gender, setGender] = useState('');
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);

  const [languagesName, setLanguagesName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [description, setDescription] = useState('');

  const [minAgeValue, setMinAgeValue] = React.useState([]);
  const [maxAgeValue, setMaxAgeValue] = React.useState([]);

  const [isModalVisible, setModalVisible] = useState(false);

  const [gendersSelection, setGendersSelection] = useState();
  const [followersSelection, setFollowersSelection] = useState();

  const [visibleGendersModal, setVisibleGendersModal] = useState(false);
  const [visibleFollowersModal, setVisibleFollowersModal] = useState(false);

  const [follower, setFollower] = useState();
  const [followers, setFollowers] = useState(followersList);
  const [searchFollowers] = useState(followersList);

  const selectedLanguage = [];
  useEffect(() => {
    if (isFocused) {
      const minAgeArray = [];
      let maxAgeArray = [];
      for (let i = 1; i <= 70; i++) {
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
      if (minAge === 0) {
        maxAgeArray = [];
        setMaxAge(maxAgeArray);
      }
      setMinAgeValue(minAgeArray);
      setMaxAgeValue(maxAgeArray);
    }
  }, [minAge, isFocused]);

  useEffect(() => {
    let languageText = '';
    if (selectedLanguages) {
      selectedLanguages.map((langItem, index) => {
        languageText = languageText + (index ? ', ' : '') + langItem;
        return null;
      });
      setLanguagesName(languageText);
    }
  }, [selectedLanguages]);

  useEffect(() => {
    const arr = [];
    for (const tempData of languageList) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, []);

  const isIconCheckedOrNot = ({ item, index }) => {
    languages[index].isChecked = !item.isChecked;

    setLanguages([...languages]);
  };

  const renderLanguage = ({ item, index }) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({ item, index });
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.language}</Text>
        <View style={styles.checkbox}>
          {languages[index].isChecked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderFollowers = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setFollowersSelection(item.user_id);
        setTimeout(() => {
          setFollower(item);
          setVisibleFollowersModal(false);
        }, 300);
      }}>
      <View
        style={{
          padding: 20,
           alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          // backgroundColor: 'red',
        }}>
        <TCFollowerList
          type={'medium'}
          name={item.full_name}
          location={item.city}
          image={item?.thumbnail ? { uri: item?.thumbnail } : images.profilePlaceHolder}
        />
        <View style={styles.checkbox}>
          {followersSelection === item.user_id ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderGenders = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setGendersSelection(item?.value);
        setTimeout(() => {
          setGender(item?.label);
          setVisibleGendersModal(false);
        }, 300);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.label}</Text>
        <View style={styles.checkbox}>
          {gendersSelection === item?.value ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const searchFilterFunction = (text) => {
    const result = searchFollowers.filter(
      (x) => x.full_name.toLowerCase().includes(text.toLowerCase())
        || x.city.toLowerCase().includes(text.toLowerCase()),
    );
    setFollowers(result);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const nextOnPress = () => {
    if (
      createTeamForm1.sport === 'tennis' && createTeamForm1.sport_type === 'double'
      && authContext?.entity?.role === ('user' || 'player')
    ) {
      const obj = {
        player1: authContext?.entity?.obj,
        player2: follower,
        language: selectedLanguages,
      };
      if (description !== '') {
        obj.descriptions = description;
      }

      navigation.navigate('CreateTeamForm3', {
        createTeamForm2: {
          ...createTeamForm1,
          ...obj,
          // can_join_everyone: canJoinEveryone,
          // join_membership_acceptedadmin: joinMembershipAcceptedadmin,
          // can_join_invited_person: canJoinInvitedPerson,
        },
      });
    } else {
      const obj = {
        gender: gender.toLowerCase(),
        language: selectedLanguages,
      };
      if (description !== '') {
        obj.descriptions = description;
      }
      if (minAge !== 0) {
        obj.min_age = minAge;
      }
      if (maxAge !== 0) {
        obj.max_age = maxAge;
      }
      navigation.navigate('CreateTeamForm3', {
        createTeamForm2: {
          ...createTeamForm1,
          ...obj,
        },
      });
    }
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={2} />
      <KeyboardAwareScrollView>
        <ScrollView
          style={styles.mainContainer}
          showsVerticalScrollIndicator={false}>
          {followersList ? (
            <View style={styles.fieldView}>
              <TCLabel title={strings.followersDescription} />
              {follower && (
                <View
                  style={{
                    margin: 15,
                    marginTop: 25,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TCFollowerList
                    type={'medium'}
                    name={follower?.full_name}
                    location={follower?.city}
                    image={follower?.thumbnail ? { uri: follower?.thumbnail } : images.profilePlaceHolder}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    hitSlop={getHitSlop(15)}
                    onPress={() => {
                      setFollower();
                      setFollowersSelection();
                    }}>
                    <Image
                      source={images.cancelImage}
                      style={styles.closeButton}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {!follower && (

                <TouchableOpacity
                  style={styles.languageView}
                  onPress={() => setVisibleFollowersModal(true)}>
                  <Text
                    style={styles.languagePlaceholderText}
                    numberOfLines={1}>
                    {strings.followersPlaceholder}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={styles.fieldView}>
                <TCLabel title={strings.genderTitle} />
                <TouchableOpacity onPress={() => setVisibleGendersModal(true)}>
                  <View style={styles.searchView}>
                    <TextInput
                      style={styles.searchTextField}
                      placeholder={strings.selectGenderPlaceholder}
                      value={gender}
                      editable={false}
                      pointerEvents="none"
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldView}>
                <TCLabel title={strings.membersAgeTitle} />

                <View
                  style={{
                    flexDirection: 'row',

                    marginTop: 12,

                    align: 'center',
                    marginLeft: 15,
                    marginRight: 15,
                    justifyContent: 'space-between',
                  }}>
                  <RNPickerSelect
                    placeholder={{
                      label: strings.minPlaceholder,
                      value: 0,
                    }}
                    items={minAgeValue}
                    onValueChange={(value) => {
                      setMinAge(value);
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      iconContainer: {
                        top: 0,
                        right: 0,
                      },
                      inputIOS: {
                        height: 40,

                        fontSize: wp('3.5%'),
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                        width: wp('45%'),
                        color: 'black',
                        paddingRight: 30,
                        backgroundColor: colors.offwhite,

                        borderRadius: 5,
                        shadowColor: colors.googleColor,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.5,
                        shadowRadius: 1,
                      },
                      inputAndroid: {
                        height: 40,

                        fontSize: wp('4%'),
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                        width: wp('45%'),
                        color: 'black',

                        backgroundColor: colors.offwhite,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#fff',

                        elevation: 3,
                      },
                    }}
                    value={minAge}
                    Icon={() => (
                      <Image
                        source={images.dropDownArrow}
                        style={styles.miniDownArrow}
                      />
                    )}
                  />
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
                      inputIOS: {
                        height: 40,

                        fontSize: wp('3.5%'),
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                        width: wp('45%'),
                        color: 'black',

                        backgroundColor: colors.offwhite,

                        borderRadius: 5,
                        shadowColor: colors.googleColor,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.5,
                        shadowRadius: 1,
                      },
                      inputAndroid: {
                        height: 40,
                        fontSize: wp('4%'),
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                        width: wp('45%'),
                        color: 'black',
                        backgroundColor: colors.offwhite,
                        borderRadius: 5,
                        elevation: 3,
                      },
                    }}
                    value={maxAge}
                    Icon={() => (
                      <Image
                        source={images.dropDownArrow}
                        style={styles.miniDownArrow}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          )}
          <Text style={styles.LocationText}>{strings.languageText}</Text>
          <TouchableOpacity style={styles.languageView} onPress={toggleModal}>
            <Text
              style={
                languagesName
                  ? styles.languageText
                  : styles.languagePlaceholderText
              }
              numberOfLines={50}>
              {languagesName || 'Add language'}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.LocationText}>
              {strings.descriptionTeamTextDetails}
            </Text>
          </View>
          <TextInput
            style={styles.descriptionTxt}
            onChangeText={(text) => setDescription(text)}
            value={description}
            multiline
            maxLength={1000}
            textAlignVertical={'top'}
            numberOfLines={4}
            placeholder={strings.descriptionTeamTextPlaceholder}
            placeholderTextColor={colors.userPostTimeColor}
          />

          {/* <View style={{ flex: 1 }} /> */}
        </ScrollView>
      </KeyboardAwareScrollView>
      <TCGradientButton
        isDisabled={
          follower
            ? !follower || languagesName === ''
            : gender === '' || languagesName === ''
        }
        title={strings.nextTitle}
        style={{ marginBottom: 30 }}
        onPress={nextOnPress}
      />
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        onBackdropPress={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
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
            shadowOffset: { width: 0, height: 1 },
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
             hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
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
              Languages
            </Text>
            <TouchableOpacity
              onPress={() => {
                for (const temp of languages) {
                  if (temp.isChecked) {
                    selectedLanguage.push(temp.language);
                  }
                }
                setSelectedLanguages(selectedLanguage);
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
            data={languages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLanguage}
          />
        </View>
      </Modal>

      <Modal
        isVisible={visibleGendersModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleGendersModal(false)}
        onRequestClose={() => setVisibleGendersModal(false)}
        backdropOpacity={0}
        style={{
          margin: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 2.8,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
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
             hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setVisibleGendersModal(false)}>
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
              {strings.playersGenderText}
            </Text>

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.themeColor,
              }}></Text>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={groupMemberGenderItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderGenders}
          />
        </View>
      </Modal>
      <Modal
        isVisible={visibleFollowersModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleFollowersModal(false)}
        onRequestClose={() => setVisibleFollowersModal(false)}
        backdropOpacity={0}
        style={{
          margin: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
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
            shadowOffset: { width: 0, height: 1 },
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
             hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setVisibleFollowersModal(false)}>
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
              Player
            </Text>

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.themeColor,
              }}></Text>
          </View>
          <View style={styles.separatorLine} />

          <TCSearchBox
            alignSelf={'center'}
            marginTop={20}
            marginBottom={20}
            onChangeText={(text) => searchFilterFunction(text)}
          />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={followers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFollowers}
          />
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  fieldView: {
    marginTop: 15,
  },

  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  miniDownArrow: {
    height: 12,
    resizeMode: 'contain',
    right: 15,

    tintColor: colors.grayColor,

    top: 15,
    width: 12,
  },

  searchTextField: {
    alignSelf: 'center',
    color: colors.blackColor,
    flex: 1,
    width: wp('80%'),
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',

    height: 40,
    marginTop: 12,
    paddingHorizontal: 15,

    paddingRight: 30,
    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
  },
  languageView: {
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
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
  LocationText: {
    marginTop: hp('3%'),
    color: colors.lightBlackColor,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    paddingLeft: 15,
  },
  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  descriptionTxt: {
    height: 120,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
});
