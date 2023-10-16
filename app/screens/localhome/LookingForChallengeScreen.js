/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
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
import ActionSheet from 'react-native-actionsheet';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {widthPercentageToDP, getStorage, calculateRatio} from '../../utils';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';
import {strings} from '../../../Localization/translation';
import {getUserIndex, getGroupIndex} from '../../api/elasticSearch';
import TCTagsFilter from '../../components/TCTagsFilter';
import Verbs from '../../Constants/Verbs';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {locationType, filterType, ErrorCodes} from '../../utils/constant';
import SearchModal from '../../components/Filter/SearchModal';
import {
  getSportList,
  getSingleSportList,
} from '../../utils/sportsActivityUtils';
import TCTeamSearchView from '../../components/TCTeamSearchView';
import TCPlayerView from '../../components/TCPlayerView';
import {joinTeam} from '../../api/Groups';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';
import {inviteUser} from '../../api/Users';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import ScreenHeader from '../../components/ScreenHeader';

let stopFetchMore = true;
let timeout;

export default function LookingForChallengeScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);
  const [settingPopup, setSettingPopup] = useState(false);

  const [sports, setSports] = useState([]);
  const [availableChallenge, setAvailableChallenge] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);

  const [location, setLocation] = useState(route.params?.filters?.location);

  // For challenge
  const [challengePopup, setChallengePopup] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [settingObject, setSettingObject] = useState();
  const actionSheet = useRef();
  const [message, setMessage] = useState('');
  const [activityId, setActibityId] = useState();
  const cancelReqActionSheet = useRef();
  const [selectedChallengeOption, setSelectedChallengeOption] = useState();
  const [mySettingObject] = useState(authContext.entity.obj.setting);
  const [myGroupDetail] = useState(
    authContext.entity.role === Verbs.entityTypeTeam && authContext.entity.obj,
  );
  const [playerDetailPopup, setPlayerDetailPopup] = useState();
  const [playerDetail, setPlayerDetail] = useState();

  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [smallLoader, setSmallLoader] = useState(false);

  useEffect(() => {
    getStorage('appSetting').then((setting) => {
      setImageBaseUrl(setting.base_url_sporticon);
    });

    if (authContext.entity.role === Verbs.entityTypeUser) {
      const singleSports = getSingleSportList(
        getSportList(authContext.sports, Verbs.entityTypePlayer),
      );
      const registerAndFavSports = route.params.registerFavSports;

      const filteredArray = singleSports.filter(
        (item) =>
          !registerAndFavSports.find(
            (removeItem) => item.sport_name === removeItem.sport_name,
          ),
      );

      setSports([...filteredArray]);
    }
  }, [authContext]);

  useEffect(() => {
    if (authContext.entity.role === Verbs.entityTypeUser) {
      getPlayerAvailableForChallenge(filters);
    } else {
      getTeamAvailableForChallenge(filters);
    }
  }, []);

  useEffect(() => {
    const tempFilter = {...filters};
    tempFilter.location = location;
    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setAvailableChallenge([]);
    applyFilter(tempFilter);
  }, [location]);
  const modifiedPlayerElasticSearchResult = (response) => {
    const modifiedData = [];
    for (const item of response) {
      const registerSports = item.registered_sports.map((obj) => ({
        ...obj,
        sport_name: Utility.getSportName(obj, authContext),
        player_image: Utility.getSportImage(obj.sport, obj.type, authContext)
          .player_image,
      }));
      item.registered_sports = registerSports;
      modifiedData.push(item);
    }
    return modifiedData;
  };
  const modifiedTeamElasticSearchResult = (response) => {
    const modifiedData = response.map((obj) => ({
      ...obj,
      sport_name: Utility.getSportName(obj, authContext),
    }));
    return modifiedData;
  };
  const getPlayerAvailableForChallenge = useCallback(
    (filerdata) => {
      setSmallLoader(true);
      // Looking Challengee query
      const availableForchallengeQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [
              {match: {entity_type: 'player'}},

              {
                nested: {
                  path: 'registered_sports',
                  query: {
                    bool: {
                      must: [
                        {
                          term: {
                            'registered_sports.setting.availibility.keyword':
                              Verbs.on,
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

      // Sport filter
      if (filerdata.sport !== strings.allSport) {
        availableForchallengeQuery.query.bool.must[1].nested.query.bool.must.push(
          {
            term: {
              'registered_sports.sport.keyword': `${filerdata.sport.toLowerCase()}`,
            },
          },
        );
        availableForchallengeQuery.query.bool.must[1].nested.query.bool.must.push(
          {
            term: {
              'registered_sports.sport_type.keyword': `${filerdata.sport_type.toLowerCase()}`,
            },
          },
        );
      }

      // World filter
      if (filerdata.location !== strings.worldTitleText) {
        availableForchallengeQuery.query.bool.must.push({
          multi_match: {
            query: `${filerdata.location.toLowerCase()}`,
            fields: ['city', 'country', 'state', 'state_abbr'],
          },
        });
      }

      // Search filter
      if (filerdata?.searchText?.length > 0) {
        /*
        if (
          filerdata.sport === strings.allSport &&
          filerdata.location === strings.worldTitleText
        ) {
          availableForchallengeQuery.query.bool.must.push({
            query_string: {
              query: `*${filerdata?.searchText}*`,
              fields: [
                'full_name',
                'city',
                'country',
                'state',
                'state_abbr',
                'registered_sports.sport',
              ],
            },
          });
        } else if (filerdata.sport === strings.allSport) {
          availableForchallengeQuery.query.bool.must.push({
            query_string: {
              query: `*${filerdata.searchText.toLowerCase()}*`,
              fields: ['full_name', 'registered_sports.sport'],
            },
          });
        } else if (filerdata.location === strings.worldTitleText) {
          availableForchallengeQuery.query.bool.must.push({
            query_string: {
              query: `*${filerdata.searchText.toLowerCase()}*`,
              fields: ['full_name', 'city', 'country', 'state', 'state_abbr'],
            },
          });
        } else {
          availableForchallengeQuery.query.bool.must.push({
            query_string: {
              query: `*${filerdata.searchText.toLowerCase()}*`,
              fields: ['full_name'],
            },
          });
        }
        */
        // Simple search with full name
        availableForchallengeQuery.query.bool.must.push({
          match_phrase_prefix: {
            full_name: `*${filerdata.searchText.toLowerCase()}*`,
          },
        });
      }

      if (filerdata.fee) {
        availableForchallengeQuery.query.bool.must.push({
          range: {
            'registered_sports.setting.game_fee.fee': {
              gte: Number(parseFloat(filerdata.fee.split('-')[0]).toFixed(2)),
              lte: Number(parseFloat(filerdata.fee.split('-')[1]).toFixed(2)),
            },
          },
        });
      }

      // Looking Challengee query

      getUserIndex(availableForchallengeQuery)
        .then((res) => {
          setSmallLoader(false);
          if (res.length > 0) {
            const modifiedResult = modifiedPlayerElasticSearchResult(res);
            const fetchedData = [...availableChallenge, ...modifiedResult];
            const filterData = fetchedData.filter(
              (obj) => obj.user_id !== authContext.entity.uid,
            );
            setAvailableChallenge(filterData);
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
    [pageFrom, pageSize, availableChallenge],
  );

  const getTeamAvailableForChallenge = useCallback(
    (filerdata) => {
      setSmallLoader(true);
      // Looking Challengee query
      const availableForchallengeQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [
              {term: {'setting.availibility.keyword': Verbs.on}},
              {term: {entity_type: 'team'}},
              {term: {is_pause: false}},
            ],
          },
        },
      };

      availableForchallengeQuery.query.bool.must.push({
        term: {
          'sport.keyword': {
            value: `${route.params.teamSportData.sport.toLowerCase()}`,
          },
        },
      });
      availableForchallengeQuery.query.bool.must.push({
        term: {
          'sport_type.keyword': {
            value: `${route.params.teamSportData.sport.toLowerCase()}`,
          },
        },
      });

      if (filerdata.location !== strings.worldTitleText) {
        availableForchallengeQuery.query.bool.must.push({
          multi_match: {
            query: filerdata.location,
            fields: ['city', 'country', 'state_abbr', 'venue.address'],
          },
        });
      }

      if (filerdata.searchText) {
        /*
        // No filter case
        if (
          filerdata.sport === strings.allSport &&
          filerdata.location === strings.worldTitleText
        ) {
          availableForchallengeQuery.query.bool.must.push({
            query_string: {
              query: `*${filerdata.searchText.toLowerCase()}*`,
              fields: [
                'group_name',
                'city',
                'country',
                'state',
                'state_abbr',
                'sport',
              ],
            },
          });
        }
        // Sport filter case
        else if (filerdata.sport === strings.allSport) {
          availableForchallengeQuery.query.bool.must.push({
            query_string: {
              query: `*${filerdata.searchText.toLowerCase()}*`,
              fields: ['group_name', 'sport'],
            },
          });
        } // location filter case
        else if (filerdata.location === strings.worldTitleText) {
          availableForchallengeQuery.query.bool.must.push({
            query_string: {
              query: `*${filerdata.searchText.toLowerCase()}*`,
              fields: ['group_name', 'city', 'country', 'state', 'state_abbr'],
            },
          });
        } else {
          // Default case
          availableForchallengeQuery.query.bool.must.push({
            query_string: {
              query: `*${filerdata.searchText.toLowerCase()}*`,
              fields: ['group_name'],
            },
          });
        }
        */
        // Simple search with group name
        availableForchallengeQuery.query.bool.must.push({
          match_phrase_prefix: {
            group_name: `*${filerdata.searchText.toLowerCase()}*`,
          },
        });
      }

      // Looking Challengee query

      getGroupIndex(availableForchallengeQuery)
        .then((res) => {
          setSmallLoader(false);
          if (res.length > 0) {
            const modifiedResult = modifiedTeamElasticSearchResult(res);
            const fetchedData = [...availableChallenge, ...modifiedResult];
            const filterData = fetchedData.filter(
              (obj) => obj?.group_id !== authContext.entity.obj?.group_id,
            );
            setAvailableChallenge(filterData);
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
    [pageFrom, pageSize, availableChallenge],
  );
  const userJoinGroup = useCallback(
    (groupId) => {
      setloading(true);
      const params = {};
      joinTeam(params, groupId, authContext)
        .then((response) => {
          setloading(false);
          if (response.payload.error_code === ErrorCodes.MEMBEREXISTERRORCODE) {
            Alert.alert(
              '',
              response.payload.user_message,
              [
                {
                  text: strings.join,
                  onPress: () => {
                    joinTeam(
                      {...params, is_confirm: true},
                      groupId,
                      authContext,
                    )
                      .then(() => {})
                      .catch((error) => {
                        setTimeout(() => {
                          Alert.alert(strings.alertmessagetitle, error.message);
                        }, 10);
                      });
                  },
                  style: 'destructive',
                },
                {
                  text: strings.cancel,
                  onPress: () => {},
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          } else if (
            response.payload.error_code === ErrorCodes.MEMBERALREADYERRORCODE
          ) {
            Alert.alert(
              strings.alertmessagetitle,
              response.payload.user_message,
            );
          } else if (
            response.payload.error_code ===
            ErrorCodes.MEMBERALREADYINVITEERRORCODE
          ) {
            setloading(false);
            const messageStr = response.payload.user_message;
            setMessage(messageStr);
            setTimeout(() => {
              setActibityId(response.payload.data.activity_id);
              setloading(false);
              actionSheet.current.show();
            }, 50);
          } else if (
            response.payload.error_code ===
            ErrorCodes.MEMBERALREADYREQUESTERRORCODE
          ) {
            const messageStr = response.payload.user_message;
            setActibityId(response.payload.data.activity_id);
            setMessage(messageStr);
            setTimeout(() => {
              cancelReqActionSheet.current.show();
            }, 50);
          } else if (
            response.payload.error_code === ErrorCodes.MEMBERINVITEONLYERRORCODE
          ) {
            Alert.alert(
              strings.alertmessagetitle,
              response.payload.user_message,
            );
          } else if (response.payload.action === Verbs.joinVerb) {
            Alert.alert(
              strings.alertmessagetitle,
              strings.acceptRequestMessage,
            );
          } else if (response.payload.action === Verbs.requestVerb) {
            Alert.alert(strings.alertmessagetitle, strings.sendRequest);
          } else {
            Alert.alert(
              strings.alertmessagetitle,
              strings.acceptRequestMessage,
            );
          }
        })
        .catch((error) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext],
  );

  // const userJoinGroup = (groupId) => {

  // };
  const onAccept = (requestId) => {
    setloading(true);
    acceptRequest({}, requestId, authContext)
      .then(() => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId) => {
    setloading(true);

    declineRequest(requestId, authContext)
      .then(() => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            strings.declinedRequestMessage,
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };
  const groupInviteUser = useCallback(
    (dataObj) => {
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
              format(strings.isinvitedsuccesfully, `${dataObj.full_name}`),
            );
          }, 10);
        })
        .catch((error) => {
          setloading(false);

          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext],
  );

  const renderAvailableChallengeListView = useCallback(
    ({item}) => (
      <View style={{flex: 1}}>
        {item.entity_type === Verbs.entityTypePlayer && (
          <TCPlayerView
            data={item}
            fType={filterType.PLAYERAVAILABLECHALLENGE}
            authContext={authContext}
            showSport={true}
            showLevel={filters.sport !== strings.allSport}
            subTab={strings.playerTitle}
            sportFilter={filters}
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
                navigation.navigate('HomeStack', {
                  screen: 'SportActivityHome',
                  params: {
                    sport: sportsObj[0].sport,
                    sportType: sportsObj[0]?.sport_type,
                    uid: item?.user_id,
                    entityType: item?.entity_type,
                    showPreview: true,
                    parentStack: 'AccountStack',
                    backScreen: 'LookingForChallengeScreen',
                  },
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
        )}
        {item.entity_type === Verbs.entityTypeTeam && (
          <TCTeamSearchView
            data={item}
            authContext={authContext}
            isClub={false}
            showStar={item.entity_type === Verbs.entityTypeTeam}
            sportFilter={filters}
            onPress={() => {
              navigation.navigate('HomeScreen', {
                uid: ['user', 'player']?.includes(item?.entity_type)
                  ? item?.user_id
                  : item?.group_id,
                role: ['user', 'player']?.includes(item?.entity_type)
                  ? 'user'
                  : item.entity_type,
                backButtonVisible: true,
                menuBtnVisible: false,
              });
            }}
            onPressChallengeButton={(dataObj) => {
              setChallengePopup(true);
              setSettingObject(dataObj.setting);
              setCurrentUserData(dataObj);
            }}
            onPressJoinButton={(groupId) => {
              userJoinGroup(groupId);
            }}
          />
        )}
      </View>
    ),
    [authContext, filters, navigation, groupInviteUser, userJoinGroup],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSeparator = () => (
    <TCThinDivider marginTop={10} marginBottom={10} width={'100%'} />
  );

  const onScrollHandler = () => {
    setLoadMore(true);
    if (!stopFetchMore) {
      // getAvailableForChallenge(filters);
      if (authContext.entity.role === Verbs.entityTypeUser) {
        getPlayerAvailableForChallenge(filters);
      } else {
        getTeamAvailableForChallenge(filters);
      }
      stopFetchMore = true;
    }
    setLoadMore(false);
  };

  const handleTagPress = ({item}) => {
    const tempFilter = filters;
    Object.keys(tempFilter).forEach((key) => {
      if (key === Object.keys(item)[0]) {
        if (Object.keys(item)[0] === 'sport') {
          tempFilter.sport = strings.allSport;
          tempFilter.sport_name = strings.allSport;
          tempFilter.sport_type = strings.allSport;
          tempFilter.minFee = 0;
          tempFilter.maxFee = 0;
          delete tempFilter.fee;
        }
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = strings.worldTitleText;
          tempFilter.locationOption = locationType.WORLD;
          tempFilter.isSearchPlaceholder = true;
        }
        if (Object.keys(item)[0] === 'fee') {
          tempFilter.minFee = 0;
          tempFilter.maxFee = 0;
          delete tempFilter.fee;
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
      setAvailableChallenge([]);
      applyFilter(tempFilter);
    }, 10);
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
    // getAvailableForChallenge(fil);
    if (authContext.entity.role === Verbs.entityTypeUser) {
      getPlayerAvailableForChallenge(fil);
    } else {
      getTeamAvailableForChallenge(fil);
    }
  }, []);

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {smallLoader ? (
        <ActivityIndicator
          style={styles.loaderStyle}
          size="small"
          color={colors.blackColor}
        />
      ) : (
        <Text
          style={{
            fontFamily: fonts.RRegular,
            color: colors.grayColor,
            fontSize: 26,
          }}>
          {strings.noTeamsOrPlayer}
        </Text>
      )}
    </View>
  );
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
          backScreen: 'LookingForChallengeScreen',
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
        title={
          authContext.entity.role === Verbs.entityTypeUser
            ? strings.playersAvailableforChallenge
            : strings.teamAvailableforChallenge
        }
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isFullTitle={true}
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
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                  setPageFrom(0);
                  setAvailableChallenge([]);
                  applyFilter(tempFilter);
                }, 300);
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
                  setAvailableChallenge([]);
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
        data={availableChallenge}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        renderItem={renderAvailableChallengeListView}
        style={styles.listStyle}
        onScroll={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
        // ListFooterComponent={() => <View style={{height: 30}} />}
        ListFooterComponent={() => (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {!stopFetchMore && (
              <ActivityIndicator
                style={styles.loaderStyle}
                size="small"
                color={colors.blackColor}
              />
            )}
          </View>
        )}
      />
      <ActionSheet
        ref={actionSheet}
        title={message}
        options={[strings.acceptInvite, strings.declineTitle, strings.cancel]}
        cancelButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            onAccept(activityId);
          } else if (index === 1) {
            onDecline(activityId);
          }
        }}
      />
      <ActionSheet
        ref={cancelReqActionSheet}
        title={message}
        options={[strings.cancelRequestTitle, strings.cancel]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            onDecline(activityId);
          }
        }}
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
                  {strings.inviteToChallengeText}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.myCityText}>
                  {strings.inviteToChallengeText}
                </Text>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <SearchModal
        fType={
          authContext.entity.role === Verbs.entityTypeTeam
            ? filterType.TEAMAVAILABLECHALLENGE
            : filterType.PLAYERAVAILABLECHALLENGE
        }
        showSportOption={authContext.entity.role === Verbs.entityTypeUser}
        favoriteSportsList={route.params.registerFavSports}
        sports={sports}
        filterObject={filters}
        feeTitle={
          authContext.entity.role === Verbs.entityTypeUser && strings.matchFee
        }
        isVisible={settingPopup}
        onPressApply={async (filterData) => {
          setloading(false);
          let tempFilter = {};
          tempFilter = {...filterData};
          setSettingPopup(false);
          setPageFrom(0);
          setAvailableChallenge([]);
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
  challengeText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
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
  myCityText: {
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
