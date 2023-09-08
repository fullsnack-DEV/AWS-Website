/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {useCallback, useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  TextInput,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {widthPercentageToDP, getStorage, calculateRatio} from '../../utils';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';
import {strings} from '../../../Localization/translation';
import {getUserIndex} from '../../api/elasticSearch';
import TCTagsFilter from '../../components/TCTagsFilter';
// import TCLookingForEntityView from '../../components/TCLookingForEntityView';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {locationType, filterType} from '../../utils/constant';
import TCPlayerView from '../../components/TCPlayerView';
import {inviteUser} from '../../api/Users';
import Verbs from '../../Constants/Verbs';
import {getSportList} from '../../utils/sportsActivityUtils';
import SearchModal from '../../components/Filter/SearchModal';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import ScreenHeader from '../../components/ScreenHeader';

let stopFetchMore = true;

export default function LookingTeamScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);
  const [settingPopup, setSettingPopup] = useState(false);
  const [sports, setSports] = useState([]);

  const [lookingEntity, setLookingEntity] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);

  const [location, setLocation] = useState(
    route?.params?.filters?.location ?? route.params?.locationText,
  );

  // new changes

  const [challengePopup, setChallengePopup] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [settingObject, setSettingObject] = useState();
  const [selectedChallengeOption, setSelectedChallengeOption] = useState();
  const [mySettingObject] = useState(authContext.entity.obj.setting);
  const [myGroupDetail] = useState(
    authContext.entity.role === Verbs.entityTypeTeam && authContext.entity.obj,
  );
  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [playerDetailPopup, setPlayerDetailPopup] = useState();
  const [playerDetail, setPlayerDetail] = useState();
  const [smallLoader, setSmallLoader] = useState(false);

  useEffect(() => {
    getStorage('appSetting').then((setting) => {
      setImageBaseUrl(setting.base_url_sporticon);
    });
    const defaultSport = [
      {
        sport: strings.allSport,
        sport_name: strings.allSport,
        sport_type: strings.allSport,
      },
    ];

    if (authContext.entity.role === Verbs.entityTypeClub) {
      const clubSports = Utility.getClubRegisterSportsList(authContext);
      setSports([...defaultSport, ...clubSports]);
    } else {
      setSports([
        ...defaultSport,
        ...getSportList(authContext.sports, Verbs.entityTypePlayer),
      ]);
    }
  }, [authContext]);

  useEffect(() => {
    const tempFilter = {...filters};
    tempFilter.location = location;
    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setLookingEntity([]);
    applyFilter(tempFilter);
  }, [location]);

  useEffect(() => {
    getLookingEntity(filters);
  }, [filters]);

  const getLookingEntity = useCallback(
    (filerLookingEntity) => {
      // Looking team query
      setSmallLoader(true);
      const lookingQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [
              {
                nested: {
                  path: 'registered_sports',
                  query: {
                    bool: {
                      must: [
                        {
                          match: {
                            'registered_sports.lookingForTeamClub': true,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      };

      if (filerLookingEntity.location !== strings.worldTitleText) {
        lookingQuery.query.bool.must.push({
          multi_match: {
            query: `${filerLookingEntity.location}`,
            fields: ['city', 'country', 'state_abbr', 'state'],
          },
        });
      }

      if (
        authContext.entity.role === Verbs.entityTypeLeague ||
        authContext.entity.role === Verbs.entityTypeClub
      ) {
        if (filerLookingEntity.sport !== strings.allSport) {
          lookingQuery.query.bool.must[0].nested.query.bool.must.push({
            term: {
              'registered_sports.sport_name.keyword': {
                value: `${filerLookingEntity.sport.toLowerCase()}`,
                case_insensitive: true,
              },
            },
          });
        }
      } else if (authContext.entity.role === Verbs.entityTypeTeam) {
        if (route.params.teamSportData?.sport) {
          lookingQuery.query.bool.must[0].nested.query.bool.must.push({
            term: {
              'registered_sports.sport.keyword': {
                value: `${route.params.teamSportData.sport.toLowerCase()}`,
                case_insensitive: true,
              },
            },
          });
        }
      }

      // Search filter

      if (filerLookingEntity.searchText) {
        /*
        if (
          filerLookingEntity.sport === strings.allSport &&
          filerLookingEntity.location === strings.worldTitleText
        ) {
          lookingQuery.query.bool.must.push({
            bool: {
              should: [
                {
                  query_string: {
                    query: `*${filerLookingEntity.searchText.toLowerCase()}*`,
                    fields: [
                      'full_name',
                      'city',
                      'country',
                      'state',
                      'state_abbr',
                    ],
                  },
                },
                {
                  nested: {
                    path: 'registered_sports',
                    query: {
                      term: {
                        'registered_sports.sport.keyword': `${filerLookingEntity.searchText.toLowerCase()}`,
                      },
                    },
                  },
                },
              ],
            },
          });
        } else if (filerLookingEntity.sport === strings.allSport) {
          lookingQuery.query.bool.must.push({
            query_string: {
              query: `*${filerLookingEntity.searchText.toLowerCase()}*`,
              fields: ['full_name', 'registered_sports.sport'],
            },
          });
        } else if (filerLookingEntity.location === strings.worldTitleText) {
          lookingQuery.query.bool.must.push({
            query_string: {
              query: `*${filerLookingEntity.searchText.toLowerCase()}*`,
              fields: ['full_name', 'city', 'country', 'state', 'state_abbr'],
            },
          });
        } else {
          lookingQuery.query.bool.must.push({
            query_string: {
              query: `*${filerLookingEntity.searchText.toLowerCase()}*`,
              fields: ['full_name'],
            },
          });
        }
        */
        // simple search with full name
        lookingQuery.query.bool.must.push({
          query_string: {
            query: `*${filerLookingEntity.searchText.toLowerCase()}*`,
            fields: ['full_name'],
          },
        });
      }

      // Looking team query

      getUserIndex(lookingQuery)
        .then((res) => {
          setSmallLoader(false);
          if (res.length > 0) {
            const fetchData = [...lookingEntity, ...res];
            const filterData = fetchData.filter(
              (obj) => obj?.user_id !== authContext.entity.auth?.user.user_id,
            );
            setLookingEntity(filterData);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
          }
        })
        .catch((e) => {
          setSmallLoader(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [pageFrom, pageSize, lookingEntity],
  );

  const renderLookingEntityListView = useCallback(
    ({item}) => (
      <View style={{flex: 1}}>
        <TCPlayerView
          data={item}
          authContext={authContext}
          showStar={filters.sport !== strings.allSport && true}
          showSport={true}
          subTab={strings.playerTitle}
          // sportFilter={filters}
          sportFilter={
            (authContext.entity.role === Verbs.entityTypeTeam && {
              ...filters,
              sport: route.params.teamSportData?.sport,
              sport_name: route.params.teamSportData?.sport_name,
              sport_type: route.params.teamSportData?.sport_type,
            }) ||
            filters
          }
          onPress={(sportsObj) => {
            if (sportsObj.length > 1) {
              const data = {
                sports: sportsObj,
                uid: item?.user_id,
                entityType: item?.entity_type,
              };
              setPlayerDetail(data);
              setPlayerDetailPopup(true);
            } else {
              navigation.navigate('SportActivityHome', {
                sport: sportsObj[0].sport,
                sportType: sportsObj[0]?.sport_type,
                uid: item?.user_id,
                entityType: item?.entity_type,
                showPreview: true,
                backScreen: 'LookingTeamScreen',
              });
            }
          }}
          onPressChallengButton={(dataObj, sportsObj) => {
            setChallengePopup(true);
            setSettingObject(sportsObj.setting);
            setCurrentUserData(dataObj);
          }}
          onPressInviteButton={(dataObj) => {
            groupInviteUser(dataObj);
          }}
        />
      </View>
    ),
    [navigation, filters],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSeparator = () => (
    <TCThinDivider marginTop={10} marginBottom={10} width={'100%'} />
  );

  const onScrollHandler = () => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getLookingEntity(filters);
      stopFetchMore = true;
    }
    setLoadMore(false);
  };
  const getLocation = async () => {
    try {
      // setloading(true);
      const currentLocation = await getGeocoordinatesWithPlaceName(Platform.OS);
      let loc = '';
      if (currentLocation.position) {
        loc =
          currentLocation.city?.charAt(0).toUpperCase() +
          currentLocation.city?.slice(1);
      }
      setloading(false);
      setSettingPopup(false);
      return loc;
    } catch (error) {
      setloading(false);
      setSettingPopup(false);
      if (error.message !== strings.userdeniedgps) {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      }
      return null;
    }
  };
  const applyFilter = useCallback((fil) => {
    getLookingEntity(fil);
  }, []);

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {smallLoader ? (
        <ActivityIndicator
          style={styles.loaderStyle}
          size="small"
          color="#000000"
        />
      ) : (
        <Text
          style={{
            fontFamily: fonts.RRegular,
            color: colors.grayColor,
            fontSize: 26,
          }}>
          {strings.noGroups}
        </Text>
      )}
    </View>
  );

  const handleTagPress = ({item}) => {
    const tempFilter = filters;
    Object.keys(tempFilter).forEach((key) => {
      if (key === Object.keys(item)[0]) {
        if (Object.keys(item)[0] === 'sport') {
          tempFilter.sport = strings.allSport;
          tempFilter.sport_name = strings.allSport;
          tempFilter.sport_type = strings.allSport;
          delete tempFilter.fee;
        }
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = strings.worldTitleText;
          tempFilter.locationOption = locationType.WORLD;
          tempFilter.isSearchPlaceholder = true;
        }
        if (Object.keys(item)[0] === 'availableTime') {
          delete tempFilter.availableTime;
          delete tempFilter.fromDateTime;
          delete tempFilter.toDateTime;
        }
        // delete tempFilter[key];
      }
    });
    setFilters({...tempFilter});
    setTimeout(() => {
      setPageFrom(0);
      setLookingEntity([]);
      applyFilter(tempFilter);
    }, 10);
  };

  const groupInviteUser = async (dataObj) => {
    setloading(true);
    const params = {
      entity_type: authContext.entity.role,
      uid: authContext.entity.uid,
    };
    inviteUser(params, dataObj.user_id, authContext)
      .then(() => {
        setloading(false);

        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            format(strings.entityInvitedSuccessfully, `${dataObj.full_name}`),
            [{text: strings.okTitleText}],
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);

        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message, [
            {text: strings.okTitleText},
          ]);
        }, 10);
      });
  };

  const sportsView = (item) => (
    <Pressable
      style={[
        styles.sportView,
        styles.row,
        {borderLeftColor: colors.redColorCard},
      ]}
      onPress={() => {
        setPlayerDetailPopup(false);
        navigation.navigate('SportActivityHome', {
          sport: item.sport,
          sportType: item?.sport_type,
          uid: playerDetail.uid,
          entityType: playerDetail.entity_type,
          showPreview: true,
          backScreen: 'LookingTeamScreen',
        });
      }}
      disabled={item.is_hide}>
      <View style={styles.innerViewContainer}>
        <View style={styles.row}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: `${imageBaseUrl}${item.player_image}`}}
              style={styles.sportIcon}
            />
          </View>
          <View>
            <Text style={styles.sportName}>{item.sport_name}</Text>
            <Text style={styles.matchCount}>0 match</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.individualsLookingforGroups}
        isFullTitle={true}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <ActivityLoader visible={loading} />
      <View style={styles.searchView}>
        <View style={styles.floatingInput}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={strings.searchText}
              style={styles.searchTxt}
              autoCorrect={false}
              onChangeText={(text) => {
                const tempFilter = {...filters};

                if (text?.length > 0) {
                  tempFilter.searchText = text;
                } else {
                  delete tempFilter.searchText;
                }
                setFilters({
                  ...tempFilter,
                });
                setPageFrom(0);
                setLookingEntity([]);
                applyFilter(tempFilter);
              }}
              value={filters.searchText}
            />
            {filters.searchText?.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  const tempFilter = {...filters};
                  tempFilter.searchText = '';
                  setFilters({
                    ...tempFilter,
                  });
                  setPageFrom(0);
                  setLookingEntity([]);
                  applyFilter(tempFilter);
                }}>
                <Image
                  source={images.closeRound}
                  style={{
                    height: 15,
                    width: 15,
                    resizeMode: 'cover',
                    alignSelf: 'center',
                    marginRight: 10,
                  }}
                />
              </TouchableOpacity>
            )}
            <TouchableWithoutFeedback
              onPress={() => {
                setSettingPopup(true);
              }}>
              <Image source={images.homeSetting} style={styles.settingImage} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <TCTagsFilter
        filter={filters}
        authContext={authContext}
        dataSource={Utility.getFiltersOpetions(filters)}
        onTagCancelPress={handleTagPress}
      />
      <FlatList
        extraData={location}
        showsHorizontalScrollIndicator={false}
        data={lookingEntity}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        renderItem={renderLookingEntityListView}
        style={styles.listStyle}
        // contentContainerStyle={{ paddingBottom: 1 }}
        onScroll={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={() => <View style={{height: 30}} />}
      />
      <Modal
        onBackdropPress={() => setChallengePopup(false)}
        backdropOpacity={1}
        animationType="slide"
        hasBackdrop
        style={{
          margin: 0,
          backgroundColor: colors.blackOpacityColor,
        }}
        visible={challengePopup}>
        <View style={styles.bottomPopupContainer}>
          <View style={styles.viewsContainer}>
            <Text
              onPress={() => setChallengePopup(false)}
              style={styles.cancelText}>
              {strings.cancel}
            </Text>
            <Text style={styles.challengeText}>{strings.challenge}</Text>
            <Text style={styles.challengeText}> </Text>
          </View>
          <TCThinDivider width={'100%'} />
          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedChallengeOption(0);
              const obj = settingObject;
              if (obj?.availibility === Verbs.on) {
                if (
                  currentUserData.sport_type === Verbs.doubleSport &&
                  (!('player_deactivated' in currentUserData) ||
                    !currentUserData?.player_deactivated) &&
                  (!('player_leaved' in currentUserData) ||
                    !currentUserData?.player_leaved) &&
                  (!('player_leaved' in myGroupDetail) ||
                    !myGroupDetail?.player_leaved)
                ) {
                  if (
                    (obj?.game_duration || obj?.score_rules) &&
                    obj?.availibility &&
                    obj?.special_rules !== undefined &&
                    obj?.general_rules !== undefined &&
                    obj?.responsible_for_referee &&
                    obj?.responsible_for_scorekeeper &&
                    obj?.game_fee &&
                    obj?.venue &&
                    obj?.refund_policy &&
                    obj?.home_away &&
                    obj?.game_type
                  ) {
                    setChallengePopup(false);

                    navigation.navigate('ChallengeScreen', {
                      setting: obj,
                      sportName: currentUserData?.sport,
                      sportType: currentUserData?.sport_type,
                      groupObj: currentUserData,
                    });
                  } else {
                    Alert.alert(strings.teamHaveNoCompletedSetting);
                  }
                } else {
                  console.log('in else continue :', currentUserData);
                  if (currentUserData.sport_type === Verbs.doubleSport) {
                    if (
                      'player_deactivated' in currentUserData &&
                      currentUserData?.player_deactivated
                    ) {
                      Alert.alert(strings.playerDeactivatedSport);
                    } else if (
                      'player_leaved' in currentUserData &&
                      currentUserData?.player_leaved
                    ) {
                      Alert.alert(
                        format(
                          strings.groupHaveNo2Player,
                          currentUserData?.group_name,
                        ),
                      );
                    } else if (
                      'player_leaved' in myGroupDetail &&
                      myGroupDetail?.player_leaved
                    ) {
                      Alert.alert(strings.youHaveNo2Player);
                    }
                  } else {
                    setChallengePopup(false);

                    navigation.navigate('ChallengeScreen', {
                      setting: obj,
                      sportName: obj?.sport,
                      sportType: obj?.sport_type,
                      groupObj: currentUserData,
                    });
                  }
                }
              } else {
                Alert.alert(strings.oppTeamNotForChallenge);
              }
            }}>
            {selectedChallengeOption === 0 ? (
              <LinearGradient
                colors={[colors.yellowColor, colors.orangeGradientColor]}
                style={styles.backgroundView}>
                <Text
                  style={[
                    styles.curruentLocationText,
                    {color: colors.whiteColor},
                  ]}>
                  {strings.continueToChallenge}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.curruentLocationText}>
                  {strings.continueToChallenge}
                </Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedChallengeOption(1);

              const obj = mySettingObject;
              if (obj?.availibility === Verbs.on) {
                if (
                  myGroupDetail.sport_type === Verbs.doubleSport &&
                  (!('player_deactivated' in myGroupDetail) ||
                    !myGroupDetail?.player_deactivated) &&
                  (!('player_leaved' in currentUserData) ||
                    !currentUserData?.player_leaved) &&
                  (!('player_leaved' in myGroupDetail) ||
                    !myGroupDetail?.player_leaved)
                ) {
                  if (
                    (obj?.game_duration || obj?.score_rules) &&
                    obj?.availibility &&
                    obj?.special_rules !== undefined &&
                    obj?.general_rules !== undefined &&
                    obj?.responsible_for_referee &&
                    obj?.responsible_for_scorekeeper &&
                    obj?.game_fee &&
                    obj?.venue &&
                    obj?.refund_policy &&
                    obj?.home_away &&
                    obj?.game_type
                  ) {
                    setChallengePopup(false);
                    if (myGroupDetail.is_pause === true) {
                      Alert.alert(
                        format(strings.groupPaused, myGroupDetail.group_name),
                      );
                    } else {
                      navigation.navigate('InviteChallengeScreen', {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      });
                    }
                  } else {
                    setTimeout(() => {
                      Alert.alert(
                        strings.completeSettingBeforeInvite,
                        '',
                        [
                          {
                            text: strings.cancel,
                            onPress: () => console.log('Cancel Pressed!'),
                          },
                          {
                            text: strings.okTitleText,
                            onPress: () => {
                              if (currentUserData?.is_pause === true) {
                                Alert.alert(strings.yourTeamPaused);
                              } else {
                                navigation.navigate('ManageChallengeScreen', {
                                  groupObj: currentUserData,
                                  sportName: currentUserData.sport,
                                  sportType: currentUserData?.sport_type,
                                });
                              }
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    }, 1000);
                  }
                } else if (myGroupDetail.sport_type === Verbs.doubleSport) {
                  if (
                    'player_deactivated' in myGroupDetail &&
                    myGroupDetail?.player_deactivated
                  ) {
                    Alert.alert(strings.playerDeactivatedSport);
                  } else if (
                    'player_leaved' in currentUserData ||
                    currentUserData?.player_leaved
                  ) {
                    Alert.alert(
                      format(
                        strings.groupHaveNo2Player,
                        currentUserData?.group_name,
                      ),
                    );
                  } else if (
                    'player_leaved' in myGroupDetail ||
                    myGroupDetail?.player_leaved
                  ) {
                    Alert.alert(strings.youHaveNo2Player);
                  }
                } else {
                  setChallengePopup(false);
                  if (myGroupDetail.is_pause === true) {
                    Alert.alert(strings.yourTeamPaused);
                  } else {
                    setChallengePopup(false);
                    navigation.navigate('InviteChallengeScreen', {
                      setting: obj,
                      sportName: currentUserData?.sport,
                      sportType: currentUserData?.sport_type,
                      groupObj: currentUserData,
                    });
                  }
                }
              } else {
                Alert.alert(strings.availibilityOff);
              }
            }}>
            {selectedChallengeOption === 1 ? (
              <LinearGradient
                colors={[colors.yellowColor, colors.orangeGradientColor]}
                style={styles.backgroundView}>
                <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
                  {strings.inviteToChallenge}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.myCityText}>
                  {strings.inviteToChallenge}
                </Text>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <SearchModal
        // enityType={Verbs.entityTypeReferee}
        sports={sports}
        fType={filterType.LOOKINGFORTEAMCLUB}
        filterObject={filters}
        isVisible={settingPopup}
        showSportOption={
          (authContext.entity.role === Verbs.entityTypeTeam && false) ||
          (authContext.entity.role === Verbs.entityTypeClub && true) ||
          (authContext.entity.role === Verbs.entityTypeLeague && true)
        }
        onPressApply={async (filterData) => {
          setloading(false);
          let tempFilter = {};
          tempFilter = {...filterData};
          setSettingPopup(false);
          setPageFrom(0);
          setLookingEntity([]);
          if (filterData.locationOption === locationType.WORLD) {
            setLocation(strings.worldTitleText);
            tempFilter.location = strings.worldTitleText;
          } else if (filterData.locationOption === locationType.HOME_CITY) {
            setLocation(
              authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
                authContext?.entity?.obj?.city.slice(1),
            );
            tempFilter.location =
              authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
              authContext?.entity?.obj?.city.slice(1);
          } else if (
            filterData.locationOption === locationType.CURRENT_LOCATION
          ) {
            const loc = await getLocation();
            tempFilter.location = loc;
          } else if (filterData.locationOption === locationType.SEARCH_CITY) {
            setLocation(filterData.searchCityLoc);
            tempFilter.location = filterData.searchCityLoc;
          }
          setFilters({...tempFilter});
          applyFilter(tempFilter);
        }}
        onPressCancel={() => {
          setSettingPopup(false);
        }}></SearchModal>
      <CustomModalWrapper
        isVisible={playerDetailPopup}
        closeModal={() => {
          setPlayerDetailPopup(false);
        }}
        modalType={ModalTypes.style2}
        ratio={calculateRatio(playerDetail?.sports.length)}>
        <View style={{paddingTop: 0, paddingHorizontal: 0}}>
          <FlatList
            data={playerDetail?.sports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => sportsView(item, item.type, index)}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </CustomModalWrapper>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listStyle: {
    padding: 15,
  },

  settingImage: {
    height: 20,
    width: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginRight: 15,
  },
  searchView: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomPopupContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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

  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightGray,
  },
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },

  searchTxt: {
    marginLeft: 15,
    fontSize: widthPercentageToDP('3.8%'),
    width: widthPercentageToDP('70%'),
  },
  // New sytles -===>
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  myCityText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  challengeText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  sportView: {
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: colors.lightGrayBackground,
    shadowColor: colors.googleColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 20,
    borderLeftWidth: 8,
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerViewContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  matchCount: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  sportIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  loaderStyle: {
    height: 25,
    width: 25,
    marginBottom: 10,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
    backgroundColor: colors.lightGrey,
    height: 45,
  },
  floatingInput: {
    alignSelf: 'center',
    zIndex: 1,
    width: '90%',
    marginTop: 20,
  },
});
