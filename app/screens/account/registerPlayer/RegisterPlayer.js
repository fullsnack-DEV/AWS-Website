// @flow
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  BackHandler,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {groupValidate} from '../../../api/Groups';
import {patchPlayer, sportActivate} from '../../../api/Users';
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
import SportsListModal from './modals/SportsListModal';
import ActivityLoader from '../../../components/loader/ActivityLoader';

const RegisterPlayer = ({navigation, route}) => {
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);

  const [sportsData, setSportsData] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);

  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const bioInputRef = useRef(null);

  useEffect(() => {
    const sportArr = getExcludedSportsList(authContext);
    setSportsData([...sportArr]);
  }, [authContext]);

  useEffect(() => {
    if (route.params.sport_name) {
      setSelectedSport({...route.params});
    }
  }, [route.params]);

  const checkIfDeactivated = () => {
    let isActive = true; // Default to false

    authContext.entity?.obj?.registered_sports?.forEach((item) => {
      if (selectedSport.sport_type === Verbs.sportTypeDouble) {
        if (
          item.sport === selectedSport.sport &&
          item.sport_type === selectedSport.sport_type
        ) {
          isActive = item.is_active;
        }
      } else if (selectedSport.sport_type === Verbs.sportTypeSingle) {
        if (
          item.sport === selectedSport.sport &&
          item.sport_type === selectedSport.sport_type
        ) {
          isActive = item.is_active;
        }
      } else if (item.sport === item.sport_type) {
        if (
          item.sport === selectedSport.sport &&
          item.sport_type === selectedSport.sport_type
        ) {
          isActive = item.is_active;
        }
      }
    });
    return isActive;
  };

  const activateSport = (sportObj) => {
    setLoading(true);

    const body = {
      sport: sportObj.sport,
      sport_type: sportObj.sport_type,
      entity_type: Verbs.entityTypePlayer,
    };

    sportActivate(body, authContext)
      .then(async (response) => {
        setLoading(false);
        await setAuthContextData(response.payload, authContext);

        navigation.pop(2);
      })
      .catch((e) => {
        setLoading(false);
        Alert.alert(strings.alertmessagetitle, e.message);
      });
  };

  const handleNextOrApply = () => {
    if (!selectedSport?.sport_type && !selectedSport?.sport_name) {
      Alert.alert(strings.sportNameValidationText);
    } else if (!checkIfDeactivated()) {
      Alert.alert(
        Platform.OS === 'android' ? '' : strings.userDeactivatedSport,
        Platform.OS === 'android' ? strings.userDeactivatedSport : '',
        [
          {
            text: strings.yes,
            onPress: () => activateSport(selectedSport),
          },
          {
            text: strings.cancel,
            onPress: () => console.log('Pressed'),
          },
        ],
        {cancelable: false},
      );
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
          routeParams: route.params?.routeParams ?? {},
        });
      } else {
        setLoading(true);
        patchPlayer(body, authContext)
          .then(async (response) => {
            if (response.status === true) {
              setShowCongratulationsModal(true);
              await setAuthContextData(response.payload, authContext);
              setLoading(false);
            } else {
              setLoading(false);
              Alert.alert(strings.appName, response.messages);
            }
            // setLoading(false);
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
  const handleBackPress = useCallback(() => {
    if (route.params?.parentStack) {
      navigation.navigate(route.params?.parentStack, {
        screen: route.params.screen,
      });
    } else {
      navigation.goBack();
    }
  }, [navigation, route.params?.parentStack, route.params?.screen]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <SafeAreaView style={styles.parent}>
      <ActivityLoader visible={loading} />
      <ScreenHeader
        title={strings.registerAsPlayerTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => handleBackPress}
        isRightIconText
        rightButtonText={
          selectedSport?.sport_type === Verbs.singleSport
            ? strings.next
            : strings.done
        }
        onRightButtonPress={handleNextOrApply}
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
        rightButtonText={strings.apply}
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
          setLoading(true);
          setShowCongratulationsModal(false);

          if (route.params?.comeFrom) {
            navigation.navigate(route.params.comeFrom, {
              ...route.params.routeParams,
            });
            setLoading(false);
          } else {
            navigation.navigate('App', {
              screen: 'Account',
              params: {
                createdSportName: selectedSport?.sport_name,
                sportType: selectedSport?.sport_type,
              },
            });
            setLoading(false);
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
            navigation.navigate('AccountStack', {
              screen: 'LookingForChallengeScreen',
              params: {
                filters,
              },
            });
          }
          if (filters.sport_type === Verbs.sportTypeDouble) {
            navigation.navigate('App', {
              screen: 'Account',
              params: {
                createdSportName: selectedSport?.sport_name,
                sportType: selectedSport?.sport_type,
                isSearchPlayerForDoubles: true,
                doubleSport: selectedSport,
              },
            });
          }
        }}
        onUserClick={(userData) => {
          if (!userData) return;
          navigation.navigate('HomeStack', {
            screen: 'HomeScreen',
            params: {
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
            },
          });
        }}
        searchTeam={(filters) => {
          navigation.navigate('LocalHomeStack', {
            screen: 'RecruitingPlayerScreen',
            params: {
              filters: {
                ...filters,
                groupTeam: strings.teamstitle,
              },
            },
          });
        }}
        joinTeam={() => {
          // navigation.navigate('LookingTeamScreen', {
          //   filters,
          // });
        }}
        createTeam={() => {
          navigation.navigate('AccountStack', {
            screen: 'CreateTeamForm1',
            params: {
              sportData: {...selectedSport},
              roleValues: {
                is_player: false,
                is_coach: false,
                is_parent: false,
                is_other: false,
                other_role: false,
              },
            },
          });
        }}
        goToSportActivityHome={({sport, sportType}) => {
          // setShowCongratulationsModal(false);
          navigation.navigate('HomeStack', {
            screen: 'SportActivityHome',
            params: {
              sport,
              sportType,
              uid: authContext.entity.uid,
              selectedTab: strings.infoTitle,
              parentStack: 'App',
              backScreen: 'Account',
              backScreenParams: {
                createdSportName: selectedSport?.sport_name,
                sportType: selectedSport?.sport_type,
              },
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
