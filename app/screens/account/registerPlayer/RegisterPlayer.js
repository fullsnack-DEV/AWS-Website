// @flow
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  TextInput,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {patchPlayer} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import TCFormProgress from '../../../components/TCFormProgress';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import {getSportList, setAuthContextData} from '../../../utils';
import CongratulationsModal from './modals/CongratulationsModal';
// import LanguagesListModal from './modals/LanguagesListModal';
import SportsListModal from './modals/SportsListModal';

const RegisterPlayer = ({navigation, route}) => {
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  // const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);
  // const [languages, setLanguages] = useState([]);
  // const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sportsData, setSportsData] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  // const [languageName, setLanguageName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const bioInputRef = useRef(null);

  // useEffect(() => {
  //   const arr = languageList.map((item) => ({
  //     ...item,
  //     isChecked: false,
  //   }));
  //   setLanguages(arr);
  // }, []);

  useEffect(() => {
    const sportArr = getSportList(authContext);
    setSportsData([...sportArr]);
  }, [authContext]);

  useEffect(() => {
    if (route.params.sport_name) {
      setSelectedSport({...route.params});
    }
  }, [route.params]);

  // useEffect(() => {
  //   if (selectedLanguages.length > 0) {
  //     let name = '';
  //     selectedLanguages.forEach((item) => {
  //       name += name ? `, ${item.language}` : item.language;
  //     });
  //     setLanguageName(name);
  //   }
  // }, [selectedLanguages]);

  // const handleLanguageSelection = (language) => {
  //   const newList = languages.map((item) => ({
  //     ...item,
  //     isChecked: item.id === language.id ? !item.isChecked : item.isChecked,
  //   }));
  //   setLanguages([...newList]);

  //   const list = newList.filter((item) => item.isChecked);
  //   setSelectedLanguages([...list]);
  // };

  const handleNextOrApply = () => {
    if (!selectedSport?.sport_type && !selectedSport?.sport_name) {
      Alert.alert(strings.sportNameValidationText);
    } else if (bio.length > 50) {
      Alert.alert('Please fill in Bio with at least 50 characters.');
    } else {
      const bodyParams = {
        sport_type: selectedSport.sport_type,
        sport: selectedSport.sport,
        sport_name: selectedSport.sport_name,
        is_active: true,
        descriptions: bio,
        is_published: true,
        type: Verbs.entityTypePlayer,
        // language: selectedLanguages,
        lookingForTeamClub: true,
        default_setting: {},
      };

      const registerdPlayerData = [
        ...(authContext.entity.obj.registered_sports || []),
        bodyParams,
      ];

      const body = {
        ...authContext.entity.obj,
        registered_sports: registerdPlayerData,
      };

      if (selectedSport?.sport_type === Verbs.sportTypeSingle) {
        // navigate to incoming challenge settings
        navigation.navigate('IncomingChallengeSettings', {
          playerData: body,
          sportName: selectedSport.sport_name,
          sportType: selectedSport.sport_type,
          sport: selectedSport.sport,
          settingObj: selectedSport.default_setting ?? {},
          settingType: selectedSport.default_setting?.default_setting_key,
        });
      } else {
        setLoading(true);
        patchPlayer(body, authContext)
          .then(async (response) => {
            if (response.status === true) {
              setLoading(false);
              await setAuthContextData(response.payload, authContext);
              setShowCongratulationsModal(true);
            } else {
              setLoading(false);
              Alert.alert(strings.appName, response.messages);
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.backIconContainer}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.image} />
        </Pressable>
        <Text style={styles.headerTitle}>{strings.registerAsPlayerTitle}</Text>
        {loading ? (
          <ActivityIndicator size={'small'} />
        ) : (
          <Pressable style={styles.buttonContainer} onPress={handleNextOrApply}>
            <Text
              style={[
                styles.buttonText,
                selectedSport?.sport_type && selectedSport?.sport_name
                  ? {}
                  : {opacity: 0.5},
              ]}>
              {selectedSport?.sport_type === Verbs.singleSport
                ? strings.next
                : strings.done}
            </Text>
          </Pressable>
        )}
      </View>
      <TCFormProgress totalSteps={2} curruentStep={1} />
      <View style={styles.container}>
        <View style={{marginBottom: 25}}>
          <Text style={styles.inputLabel}>
            {strings.whichSport}{' '}
            <Text style={[styles.inputLabel, {color: colors.redColor}]}>*</Text>
          </Text>

          <TextInput
            testID="choose-sport"
            style={[styles.inputContainer, styles.input]}
            value={selectedSport?.sport_name}
            onFocus={() => {
              Keyboard.dismiss();
              setVisibleSportsModal(true);
            }}
          />
        </View>

        {/* <View style={{marginBottom: 25}}>
          <Text style={styles.inputLabel}>{strings.whichLanguage}</Text>

          <TextInput
            testID="choose-language"
            style={[styles.inputContainer, styles.input]}
            value={languageName}
            onFocus={() => {
              Keyboard.dismiss();
              setShowLanguageModal(true);
            }}
          />
        </View> */}

        <View style={{marginBottom: 25}}>
          <Text style={styles.inputLabel}>{strings.bio.toUpperCase()}</Text>
          <Pressable
            style={[styles.inputContainer, {minHeight: 100}]}
            onPress={() => {
              bioInputRef.current?.focus();
            }}>
            <TextInput
              ref={bioInputRef}
              testID="register-player-description"
              style={styles.input}
              placeholder={strings.bioDescription}
              multiline
              onChangeText={(text) => {
                setBio(text);
              }}
              value={bio}
              maxLength={50}
            />
          </Pressable>
        </View>
      </View>
      <SportsListModal
        isVisible={visibleSportsModal}
        closeList={() => setVisibleSportsModal(false)}
        sportsList={sportsData}
        onNext={(sport) => {
          setVisibleSportsModal(false);
          setSelectedSport({...sport});
        }}
        sport={selectedSport}
      />

      {/* <LanguagesListModal
        isVisible={showLanguageModal}
        closeList={() => setShowLanguageModal(false)}
        languageList={languages}
        onSelect={handleLanguageSelection}
        onApply={() => {
          setShowLanguageModal(false);
        }}
      /> */}
      <CongratulationsModal
        isVisible={showCongratulationsModal}
        closeModal={() => {
          setShowCongratulationsModal(true);
          navigation.navigate('AccountScreen', {
            createdSportName: selectedSport?.sport_name,
            // eslint-disable-next-line
            sportType: selectedSport?.sport_type,
          });
        }}
        sportName={selectedSport?.sport_name}
        sport={selectedSport?.sport}
        sportType={selectedSport?.sport_type}
        onChanllenge={() => {
          // navigation.navigate('LookingForChallengeScreen', {
          //   filters,
          // });
        }}
        searchPlayer={(filters) => {
          navigation.navigate('LookingForChallengeScreen', {
            filters,
          });
        }}
        onUserClick={(userData) => {
          if (!userData) return;
          navigation.navigate('HomeScreen', {
            uid:
              userData.entity_type === Verbs.entityTypePlayer ||
              userData.entity_type === Verbs.entityTypeUser
                ? userData.user_id
                : userData.group_id,
            role: ['user', 'player']?.includes(userData.entity_type)
              ? 'user'
              : userData.entity_type,
            backButtonVisible: true,
            menuBtnVisible: false,
          });
        }}
        searchTeam={() => {
          const sports = sportsData.map((item) => ({
            label: item?.sport_name,
            value: item?.sport_name.toLowerCase(),
          }));

          navigation.navigate('EntitySearchScreen', {
            sportsList: sports,
            sportsArray: sportsData,
            activeTab: 1,
          });
        }}
        joinTeam={(filters) => {
          navigation.navigate('LookingTeamScreen', {
            filters,
          });
        }}
        createTeam={() => {
          navigation.navigate('CreateTeamForm1');
        }}
        goToSportActivityHome={() => {
          setShowCongratulationsModal(false);
          navigation.navigate('HomeScreen', {
            uid: authContext.entity.uid,
            role: authContext.entity.role,
            backButtonVisible: true,
            menuBtnVisible: false,
          });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingBottom: 13,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  backIconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
  },
  inputContainer: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    marginTop: 5,
    padding: 2,
  },
  input: {
    fontSize: 16,
    color: colors.lightBlackColor,
    padding: 10,
  },
});

export default RegisterPlayer;
