import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import Header from '../../../components/Home/Header';
import colors from '../../../Constants/Colors';
import Verbs from '../../../Constants/Verbs';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import TCThinDivider from '../../../components/TCThinDivider';
import {getGroupDetails, getGroups, getTeamsOfClub} from '../../../api/Groups';
import * as Utility from '../../../utils/index';
import ChangeOtherListScreen from './ChangeOtherListScreen';
import ChangeSportsOrderScreen from './ChangeSportsOrderScreen';
import {getUserSettings, saveUserSettings} from '../../../api/Users';
import {getGroupIndex} from '../../../api/elasticSearch';

export default function ViewEventSettingsScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const sortFilterData = [
    strings.eventFilterNoneTitle,
    strings.eventFilterOrganiserTitle,
    strings.eventFilterRoleTitle,
    strings.eventFilterSportTitle,
  ];

  const [sortFilterDataClub] = useState([
    strings.eventFilterNoneTitle,
    strings.eventFilterOrganiserTitle,
    strings.eventFilterSportTitle,
  ]);

  const [loading, setLoading] = useState(false);
  const [sortFilterOption, setSortFilterOpetion] = useState(1);
  const [hasGroup, setHasGroup] = useState(false);
  const [hasSports, setHasSports] = useState(true);
  const [hasRole, setHasRole] = useState(false);
  const [registeredSports, setRegisteredSports] = useState([]);
  const [listOfOrganiser, setListOfOrganiser] = useState(false);
  const [listOfSports, setListOfSports] = useState(false);
  const [optionValue, setOptionValue] = useState(route?.params?.sort);
  const [userSetting, setUserSetting] = useState(route?.params?.sort);
  const [optionRender, setOptionRender] = useState(route?.params?.sort);
  const [listOfClubs, setListofClubs] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [orderoForganizer, setOrderOfOrganizer] = useState(false);

  useEffect(() => {
    checkHasSports(authContext);
    checkHasRole(authContext);

    getUserSettings(authContext).then((setting) => {
      let eventViewOption;

      if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
        eventViewOption =
          setting?.payload?.user?.club_event_view_settings_option;
      } else if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
        eventViewOption =
          setting?.payload?.user?.team_event_view_settings_option;
      } else {
        eventViewOption = setting?.payload?.user?.event_view_settings_option;
      }
      if (eventViewOption) {
        setSortFilterOpetion(eventViewOption);
        setOptionValue(eventViewOption);
        setOptionRender(eventViewOption ?? 0);
      }
      setUserSetting(setting.payload.user);
    });

    if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
      getTeamsOfClub(authContext.entity.uid, authContext)
        .then((response) => {
          checkHasGroup(response);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          Alert.alert(strings.townsCupTitle, e.message);
        });
    } else if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
      // get all the clubs of the team

      getGroupDetails(authContext.entity.uid, authContext)
        .then((res) => {
          const groupIDs = res.payload?.parent_groups ?? [];

          const groupQuery = {
            query: {
              terms: {
                _id: groupIDs,
              },
            },
          };

          getGroupIndex(groupQuery)
            .then((response) => {
              //  setGroups(response);
              checkHasGroup(response);
              setListofClubs(response);
            })
            .catch((e) => {
              Alert.alert('', e.messages);
            });
        })
        .catch((e) => {
          console.log(e.message);
        });
    } else {
      getGroups(authContext)
        .then((response) => {
          checkHasGroup(response);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          Alert.alert(strings.townsCupTitle, e.message);
        });
    }
  }, [authContext, hasGroup, hasSports, hasRole]);

  // Check user has any role
  const checkHasRole = () => {
    let role = false;

    // Check if role contains referee
    if (authContext?.entity?.obj?.referee_data) {
      role = true;
    }

    // Check if role contains scorekeeper
    if (authContext?.entity?.obj?.scorekeeper_data) {
      role = true;
    }

    // Check if user has any registered sport
    if (authContext?.entity?.obj?.registered_sports) {
      role = true;
    }

    setHasRole(role);
  };

  // Check user belong to any group
  const checkHasGroup = (data) => {
    if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
      if (data.payload && data.payload.length > 1) {
        setHasGroup(true);
      } else {
        setHasGroup(false);
      }
    } else if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
      if (data && data.length >= 1) {
        setHasGroup(true);
      } else if (data && data.length > 1) {
        setOrderOfOrganizer(true);
      } else {
        setHasGroup(false);
      }
    } else if (Object.entries(data.payload).length > 0) {
      const group = data.payload?.teams.length + data?.payload?.clubs.length;
      if (group > 1) {
        setHasGroup(true);
      }
    } else {
      setHasGroup(false);
    }
  };

  // Check user has any registered sports
  const checkHasSports = () => {
    if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
      const res = authContext?.entity?.obj?.sports.map((obj) => ({
        sport: obj.sport,
      }));

      const data = Utility.uniqueArray(res, Verbs.sportType);

      if (data.length === 0) {
        setHasSports(false);
      }
      setRegisteredSports(data);
    } else {
      const sportsList = [
        ...(authContext?.entity?.obj?.registered_sports?.filter(
          (obj) => obj.is_active,
        ) || []),
        ...(authContext?.entity?.obj?.referee_data?.filter(
          (obj) => obj.is_active,
        ) || []),
        ...(authContext?.entity?.obj?.scorekeeper_data?.filter(
          (obj) => obj.is_active,
        ) || []),
      ];
      const res = sportsList.map((obj) => ({
        sport: obj.sport,
      }));
      const data = Utility.uniqueArray(res, Verbs.sportType);
      if (data.length === 0) {
        setHasSports(false);
      }
      setRegisteredSports(data);
    }
  };

  const renderOpacityOfOptions = (item) => {
    if (item === strings.eventFilterOrganiserTitle) {
      if (authContext.entity.role === Verbs.entityTypeClub && !hasGroup) {
        return false;
      }

      if (
        authContext.entity.role === Verbs.entityTypePlayer ||
        authContext.entity.role === Verbs.entityTypeUser
      ) {
        if (!hasGroup) {
          return false;
        }
      }

      if (authContext.entity.role === Verbs.entityTypeTeam && !hasGroup) {
        return false;
      }
    }

    if (item === strings.eventFilterRoleTitle) {
      if (!hasRole) {
        return false;
      }
    }

    if (item === strings.eventFilterSportTitle) {
      if (authContext.entity.role === Verbs.entityTypeTeam) {
        return true;
      }
      if (!hasSports) {
        return false;
      }
    }

    return true;
  };

  const renderSortFilterOpetions = ({index, item}) => (
    <View
      // pointerEvents={!renderOpacityOfOptions(item) ? 'none' : 'box-only'}
      style={{
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 15,
      }}>
      <View>
        <Text
          style={[
            styles.filterTitle,
            {
              opacity: !renderOpacityOfOptions(item) ? 0.5 : 1,
            },
          ]}>
          {item}
        </Text>
        {item === strings.eventFilterSportTitle &&
          sortFilterOption === index &&
          registeredSports.length > 0 && (
            <Text
              style={styles.changeOrderStyle}
              onPress={() => {
                setListOfSports(true);
              }}>
              {strings.changeListOfSport}
            </Text>
          )}

        {item === strings.eventFilterOrganiserTitle &&
          sortFilterOption === index &&
          hasGroup && (
            <Text
              style={styles.changeOrderStyle}
              onPress={() => {
                setListOfOrganiser(true);
              }}>
              {strings.chnageListOfOrganizer}
            </Text>
          )}
      </View>
      <TouchableOpacity
        onPress={() => {
          if (renderOpacityOfOptions(item)) {
            setSortFilterOpetion(index);

            setOptionRender(index);
            setOptionValue(index);
          } else {
            Alert.alert('option is not Activated');
          }
        }}>
        <Image
          source={
            index === optionRender
              ? images.radioRoundOrange
              : images.radioUnselect
          }
          style={styles.radioButtonStyle}
        />
      </TouchableOpacity>
    </View>
  );

  const onDonePress = () => {
    setLoading(true);
    let params;
    if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
      params = {
        ...userSetting,
        club_event_view_settings_option: optionValue,
      };
    } else if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
      params = {
        ...userSetting,
        team_event_view_settings_option: optionValue,
      };
    } else {
      params = {
        ...userSetting,
        event_view_settings_option: optionValue,
      };
    }

    saveUserSettings(params, authContext)
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <View
        style={styles.mainContainerStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ActivityLoader visible={loading} />
        <Header
          leftComponent={
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('App', {
                  screen: 'Schedule',
                });
              }}>
              <Image source={images.backArrow} style={styles.backImageStyle} />
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={styles.eventTextStyle}>
              {strings.eventsViewSettings}
            </Text>
          }
          rightComponent={
            <TouchableOpacity
              style={{padding: 2}}
              onPress={() => {
                onDonePress();

                // navigation.navigate('App', {
                //   screen: 'Schedule',
                //   params: {
                //     refresh: Date.now(),
                //     optionValue,
                //   },
                // });
              }}>
              <Text style={{fontFamily: fonts.RMedium, fontSize: 16}}>
                {strings.save}
              </Text>
            </TouchableOpacity>
          }
        />
        <SafeAreaView>
          {[
            Verbs.entityTypeUser,
            Verbs.entityTypePlayer,
            Verbs.entityTypeClub,
            Verbs.entityTypeTeam,
          ].includes(authContext.entity.role) && (
            <View>
              <TCThinDivider width={'100%'} marginBottom={15} />
              <View>
                <Text style={styles.titleText}>{strings.sortBy}</Text>
                <FlatList
                  data={
                    [Verbs.entityTypeClub, Verbs.entityTypeTeam].includes(
                      authContext.entity.role,
                    )
                      ? sortFilterDataClub
                      : sortFilterData
                  }
                  renderItem={renderSortFilterOpetions}
                  style={{marginTop: 15}}
                />
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>

      <Modal
        isVisible={listOfOrganiser}
        backdropColor="black"
        style={{margin: 0, justifyContent: 'flex-end'}}
        hasBackdrop
        onBackdropPress={() => {
          setListOfOrganiser(false);
        }}
        backdropOpacity={0.5}>
        <View
          style={[
            styles.bottomPopupContainer,
            {height: Dimensions.get('window').height - 50},
          ]}>
          <ChangeOtherListScreen
            closeBtn={setListOfOrganiser}
            userSetting={userSetting}
            setUserSetting={setUserSetting}
            clubLists={listOfClubs}
          />
        </View>
      </Modal>

      {/* change list of sports modal */}
      <Modal
        isVisible={listOfSports}
        backdropColor="black"
        style={{margin: 0, justifyContent: 'flex-end'}}
        hasBackdrop
        onBackdropPress={() => {
          setListOfSports(false);
        }}
        backdropOpacity={0.5}>
        <View
          style={[
            styles.bottomPopupContainer,
            {height: Dimensions.get('window').height - 50},
          ]}>
          <ChangeSportsOrderScreen
            closeBtn={setListOfSports}
            userSetting={userSetting}
            setUserSetting={setUserSetting}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  mainContainerStyle: {
    flex: 1,
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  changeOrderStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
    textDecorationLine: 'underline',
    marginLeft: 20,
    marginTop: 10,
  },
  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});
