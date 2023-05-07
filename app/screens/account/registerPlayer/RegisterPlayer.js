// @flow
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  TextInput,
  Keyboard,
  Alert,
  Platform,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {groupValidate} from '../../../api/Groups';
import {patchPlayer} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ScreenHeader from '../../../components/ScreenHeader';
import TCFormProgress from '../../../components/TCFormProgress';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import {getTCDate, setAuthContextData} from '../../../utils';
import {getExcludedSportsList} from '../../../utils/sportsActivityUtils';
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
    const sportArr = getExcludedSportsList(authContext);
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
        lookingForTeamClub: true,
        default_setting: {},
        created_at: getTCDate(new Date()),
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
          comeFrom: route.params?.comeFrom ?? '',
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

  const handleDoubleTeamCreate = (p1, p2, _sport) => {
    const obj = {
      player1: p1,
      player2: p2.user_id,
      sport: _sport.sport,
      sport_type: _sport.sport_type,
      entity_type: Verbs.entityTypeTeam,
    };

    setLoading(true);
    groupValidate(obj, authContext)
      .then((response) => {
        if (typeof response.payload === 'boolean' && response.payload) {
          navigation.navigate('CreateTeamForm1', {
            sports: _sport,
            double_Player: p2,
            showDouble: true,
            backScreen: 'AccountScreen',
            backScreenParams: {
              createdSportName: selectedSport?.sport_name,
              sportType: selectedSport?.sport_type,
            },
          });
          setShowCongratulationsModal(false);
          setLoading(false);
        }
      })
      .catch((e) => {
        Alert.alert(
          Platform.OS === 'android' ? '' : e.message,
          Platform.OS === 'android' ? e.message : '',

          [
            {
              text: strings.OkText,
              onPress: () => console.log('PRessed'),
            },
          ],
          {cancelable: false},
        );

        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.registerAsPlayerTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          if (route.params?.comeFrom) {
            navigation.navigate(route.params.comeFrom);
          } else {
            navigation.navigate('AccountScreen');
          }
        }}
        isRightIconText
        rightButtonText={
          selectedSport?.sport_type === Verbs.singleSport
            ? strings.next
            : strings.done
        }
        onRightButtonPress={handleNextOrApply}
        loading={loading}
        containerStyle={styles.headerRow}
      />
      {selectedSport?.sport_type === Verbs.singleSport ? (
        <TCFormProgress totalSteps={2} curruentStep={1} />
      ) : (
        <View
          style={{height: 1, backgroundColor: colors.writePostSepratorColor}}
        />
      )}

      <View style={styles.container}>
        <View style={{marginBottom: 35}}>
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

        <View>
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
        title={strings.registerAsPlayerTitle}
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
        settingsObj={selectedSport?.default_setting}
        closeModal={() => {
          setShowCongratulationsModal(true);
          if (route.params?.comeFrom) {
            navigation.navigate(route.params.comeFrom);
          } else {
            navigation.navigate('AccountScreen', {
              createdSportName: selectedSport?.sport_name,
              sportType: selectedSport?.sport_type,
            });
          }
        }}
        sportName={selectedSport?.sport_name}
        sport={selectedSport?.sport}
        sportType={selectedSport?.sport_type}
        onChanllenge={(type, payload) => {
          const obj = {
            setting: payload.setting,
            sportName: payload.sport,
            sportType: payload.sport_type,
            groupObj: payload.groupObj,
          };
          if (type === strings.challenge) {
            navigation.navigate('ChallengeScreen', {
              ...obj,
            });
          }

          if (type === strings.inviteToChallenge) {
            navigation.navigate('InviteChallengeScreen', {
              ...obj,
            });
          }
        }}
        searchPlayer={(filters) => {
          if (filters.sport_type === Verbs.sportTypeSingle) {
            navigation.navigate('LookingForChallengeScreen', {
              filters,
            });
          }
          if (filters.sport_type === Verbs.sportTypeDouble) {
            navigation.navigate('AccountScreen', {
              createdSportName: selectedSport?.sport_name,
              sportType: selectedSport?.sport_type,
              isSearchPlayerForDoubles: true,
            });
          }
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
        searchTeam={(filters) => {
          navigation.navigate('RecruitingPlayerScreen', {
            filters: {
              ...filters,
              groupTeam: strings.teamstitle,
            },
          });
        }}
        joinTeam={() => {
          // navigation.navigate('LookingTeamScreen', {
          //   filters,
          // });
        }}
        createTeam={() => {
          navigation.navigate('CreateTeamForm1');
        }}
        goToSportActivityHome={({sport, sportType}) => {
          setShowCongratulationsModal(false);
          navigation.navigate('SportActivityHome', {
            sport,
            sportType,
            uid: authContext.entity.uid,
            selectedTab: strings.infoTitle,
            backScreen: 'AccountScreen',
            backScreenParams: {
              createdSportName: selectedSport?.sport_name,
              sportType: selectedSport?.sport_type,
            },
          });
        }}
        onLoad={loading}
        onChoose={(player2) => {
          handleDoubleTeamCreate(
            authContext.entity.obj.user_id,
            player2,
            selectedSport,
          );
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
    paddingRight: 14,
    paddingBottom: 12,
    paddingTop: 8,
    borderBottomWidth: 0,
  },
  inputLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
  },
  inputContainer: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    color: colors.lightBlackColor,
    padding: 0,
  },
});

export default RegisterPlayer;
