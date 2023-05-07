import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useContext,
  useCallback,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import {patchGroup} from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {strings} from '../../../Localization/translation';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import TCKeyboardView from '../../components/TCKeyboardView';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';
import ScreenHeader from '../../components/ScreenHeader';
import {getSportName} from '../../utils/sportsActivityUtils';
import LocationModal from '../../components/LocationModal/LocationModal';
import LanguagesListModal from '../account/registerPlayer/modals/LanguagesListModal';

const EditGroupBasicInfoScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const {groupDetails} = route.params;

  const [loading, setloading] = useState(false);
  const [groupData, setGroupData] = useState({});
  const [minAgeValue, setMinAgeValue] = useState([]);
  const [maxAgeValue, setMaxAgeValue] = useState([]);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const updateLanguageList = useCallback(() => {
    const arr = Utility.languageList.map((item) => {
      if (groupData.language?.length > 0) {
        if (groupData.language.includes(item.language)) {
          return {
            ...item,
            isChecked: true,
          };
        }
      }
      return {
        ...item,
        isChecked: false,
      };
    });
    setLanguages(arr);
  }, [groupData.language]);

  useEffect(() => {
    if (isFocused) {
      updateLanguageList();
    }
  }, [isFocused, updateLanguageList]);

  useEffect(() => {
    if (languages.length > 0) {
      let name = '';
      languages.forEach((item) => {
        if (item.isChecked) {
          name += name ? `, ${item.language}` : item.language;
        }
      });

      setLanguageName(name);
    }
  }, [languages]);

  useEffect(() => {
    if (isFocused && groupDetails?.group_id) {
      setGroupData({...groupDetails});
    }
  }, [isFocused, groupDetails]);

  useEffect(() => {
    const minAgeArray = [];
    let maxAgeArray = [];

    for (let i = 1; i <= 120; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      minAgeArray.push(dataSource);
    }

    for (let i = groupData.min_age ?? 1; i <= 120; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      maxAgeArray.push(dataSource);
    }
    if (groupData.min_age === 0) {
      maxAgeArray = [];
    }
    setMinAgeValue(minAgeArray);
    setMaxAgeValue(maxAgeArray);
  }, [groupData.min_age]);

  const checkValidation = () => {
    if (!(Verbs.sportType in groupData) && groupData.sport === '') {
      Alert.alert(strings.alertmessagetitle, strings.sportcannotbeblank);
      return false;
    }
    if (groupData.registration_fee >= 1000) {
      Alert.alert(strings.alertmessagetitle, strings.membershipRegister);
      return false;
    }
    if (groupData.membership_fee >= 1000) {
      Alert.alert(strings.alertmessagetitle, strings.membershipFeeNotBigger);
      return false;
    }

    return true;
  };

  const onUpdateButtonClicked = () => {
    if (checkValidation()) {
      setloading(true);
      const groupProfile = {...groupData};
      groupProfile.language = selectedLanguages;

      patchGroup(groupData.group_id, groupProfile, authContext)
        .then(async (response) => {
          setloading(false);
          if (response && response.status === true) {
            await Utility.setAuthContextData(response.payload, authContext);
            navigation.goBack();
          } else {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, strings.defaultError);
            }, 0.1);
          }
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const handleSelectLocationOptions = (currentLocation) => {
    const obj = {
      city: currentLocation.city,
      state: currentLocation.state_full,
      state_abbr: currentLocation.state,
      country: currentLocation.country,
    };
    setGroupData({...groupData, ...obj});
  };

  const handleLanguageSelection = (lang) => {
    const newList = languages.map((item) => ({
      ...item,
      isChecked: item.id === lang.id ? !item.isChecked : item.isChecked,
    }));
    setLanguages([...newList]);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.basicInfoText}
        leftIcon={images.backArrow}
        isRightIconText
        rightButtonText={strings.updateText}
        onRightButtonPress={() => {
          onUpdateButtonClicked();
        }}
        leftIconPress={() => navigation.goBack()}
      />
      <ActivityLoader visible={loading} />
      <TCKeyboardView>
        <ScrollView style={{marginHorizontal: 15, paddingTop: 20}}>
          <View style={{marginBottom: 35}}>
            <Text style={styles.labelText}>
              {strings.sportsTitleText.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.labelText,
                {marginBottom: 0, fontFamily: fonts.RRegular},
              ]}>
              {getSportName(
                groupData.sport,
                groupData.sport_type,
                authContext.sports,
              )}
            </Text>
          </View>

          <View style={{marginBottom: 35}}>
            <Text style={styles.labelText}>
              {strings.homeCityTitle.toUpperCase()}
            </Text>
            <Pressable
              style={styles.inputContainer}
              onPress={() => setVisibleLocationModal(true)}>
              <Text
                style={[
                  styles.labelText,
                  {marginBottom: 0, fontFamily: fonts.RRegular},
                ]}>{`${groupData.city}, ${
                groupData.state_abbr ?? groupData.state
              }, ${groupData.country}`}</Text>
            </Pressable>
          </View>

          <View style={{marginBottom: 35}}>
            <Text style={styles.labelText}>
              {strings.membersgender.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.labelText,
                {marginBottom: 0, fontFamily: fonts.RRegular},
              ]}>
              {groupData.gender
                ? groupData.gender[0].toUpperCase() + groupData.gender.slice(1)
                : '--'}
            </Text>
          </View>

          <View style={{marginBottom: 35}}>
            <Text style={styles.labelText}>
              {strings.membersage.toUpperCase()}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // justifyContent: 'space-between',
              }}>
              <View style={{flex: 1}}>
                <RNPickerSelect
                  placeholder={{
                    label: strings.minPlaceholder,
                    value: null,
                  }}
                  items={minAgeValue}
                  onValueChange={(value) => {
                    setGroupData({...groupData, min_age: value});
                  }}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    inputIOS: [styles.inputIOS, {marginRight: 7}],
                    inputAndroid: [styles.inputAndroid, {marginRight: 7}],
                  }}
                  value={groupData.min_age ?? 1}
                  Icon={() => (
                    <Image
                      source={images.dropDownArrow}
                      style={styles.downArrow}
                    />
                  )}
                />
              </View>

              <View style={{flex: 1}}>
                <RNPickerSelect
                  placeholder={{
                    label: strings.maxPlaceholder,
                    value: 0,
                  }}
                  items={maxAgeValue}
                  onValueChange={(value) => {
                    setGroupData({...groupData, max_age: value});
                  }}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    inputIOS: [styles.inputIOS, {marginLeft: 8}],
                    inputAndroid: [styles.inputAndroid, {marginLeft: 8}],
                  }}
                  value={groupData.max_age ?? 70}
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

          <View style={{marginBottom: 35}}>
            <Text style={styles.labelText}>
              {strings.languages.toUpperCase()}
            </Text>
            <Pressable
              style={styles.inputContainer}
              onPress={() => setShowLanguageModal(true)}>
              <Text
                style={[
                  styles.labelText,
                  {marginBottom: 0, fontFamily: fonts.RRegular},
                ]}>
                {languageName}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TCKeyboardView>

      <LocationModal
        visibleLocationModal={visibleLocationModal}
        title={strings.homeCityTitleText}
        setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
        onLocationSelect={handleSelectLocationOptions}
      />

      <LanguagesListModal
        isVisible={showLanguageModal}
        closeList={() => {
          updateLanguageList();
          setShowLanguageModal(false);
        }}
        languageList={languages}
        onSelect={handleLanguageSelection}
        onApply={() => {
          setShowLanguageModal(false);
          const list = [];
          languages.forEach((item) => {
            if (item.isChecked) {
              list.push(item.language);
            }
          });
          setSelectedLanguages([...list]);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  downArrow: {
    height: 6,
    top: 18,
    right: 15,
    resizeMode: 'contain',
    width: 12,
  },
  labelText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
  inputContainer: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },

  inputIOS: {
    height: 40,
    width: '100%',
    fontSize: 16,
    borderRadius: 5,
    paddingRight: 40,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,
    backgroundColor: colors.textFieldBackground,
  },
});

export default EditGroupBasicInfoScreen;
