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
  FlatList,
  Image,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';

import images from '../../Constants/ImagePath';
import {widthPercentageToDP} from '../../utils';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';
import {strings} from '../../../Localization/translation';
import {getEntityIndex} from '../../api/elasticSearch';
import TCTagsFilter from '../../components/TCTagsFilter';
import Verbs from '../../Constants/Verbs';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {locationType, filterType, ErrorCodes} from '../../utils/constant';
import SearchModal from '../../components/Filter/SearchModal';
import {getSportList} from '../../utils/sportsActivityUtils';
import TCTeamSearchView from '../../components/TCTeamSearchView';
import TCPlayerView from '../../components/TCPlayerView';
import {joinTeam} from '../../api/Groups';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';
import {inviteUser} from '../../api/Users';

let stopFetchMore = true;

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
  console.log('filters ==>', filters);
  console.log('sports ==>', sports);

  /*
  useEffect(() => {
    if (settingPopup) {
      setLastSelection(locationFilterOpetion);
    }
  }, [settingPopup]);
  useEffect(() => {
    if (route.params?.locationText) {
      setSettingPopup(true);
      setLocation(route.params?.locationText);
      setTimeout(() => {
        setLocation(route.params?.locationText);
      }, 10);
    }
  }, [route.params?.locationText]);
  useEffect(() => {
    const list = [
      {
        label: strings.all,
        value: strings.allType,
      },
    ];

    let sportArr = [];

    authContext.sports.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });
    sportArr.map((obj) => {
      const dataSource = {
        label: Utility.getSportName(obj, authContext),
        value: Utility.getSportName(obj, authContext),
      };
      list.push(dataSource);
    });

    setSports(list);
  }, [authContext, authContext.sports]);
  useEffect(() => {
    getAvailableForChallenge(filters);
  }, []);
  useEffect(() => {
    const tempFilter = {...filters};
    tempFilter.sport = selectedSport?.sport;
    tempFilter.location = location;
    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setAvailableChallenge([]);
    applyFilter(tempFilter);
  }, [location]);

  */

  useEffect(() => {
    const defaultSport = [
      {
        sport: strings.allSport,
        sport_name: strings.allSport,
        sport_type: strings.allSport,
      },
    ];

    setSports([
      ...defaultSport,
      ...getSportList(authContext.sports, Verbs.entityTypePlayer),
    ]);
  }, [authContext]);

  useEffect(() => {
    getAvailableForChallenge(filters);
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

  const getAvailableForChallenge = useCallback(
    (filerdata) => {
      // Looking Challengee query
      const availableForchallengeQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            should: [
              {
                bool: {
                  must: [
                    {match: {'setting.availibility': Verbs.on}},
                    {term: {entity_type: 'team'}},
                  ],
                },
              },
              {
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
                                match: {
                                  'registered_sports.setting.availibility':
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
            ],
          },
        },
      };

      if (filerdata.location !== strings.worldTitleText) {
        availableForchallengeQuery.query.bool.should[0].bool.must.push({
          multi_match: {
            query: filerdata.location,
            fields: ['city', 'country', 'state_abbr', 'venue.address'],
          },
        });

        availableForchallengeQuery.query.bool.should[1].bool.must.push({
          multi_match: {
            query: filerdata.location,
            fields: ['city', 'country', 'state_abbr', 'venue.address'],
          },
        });
      }

      if (filerdata?.searchText?.length > 0) {
        availableForchallengeQuery.query.bool.should[0].bool.must.push({
          query_string: {
            query: `*${filerdata?.searchText}*`,
            fields: ['group_name'],
          },
        });
        availableForchallengeQuery.query.bool.should[1].bool.must.push({
          query_string: {
            query: `*${filerdata?.searchText}*`,
            fields: ['full_name'],
          },
        });
      }

      if (filerdata?.sport !== strings.allSport) {
        availableForchallengeQuery.query.bool.should[0].bool.must.push({
          term: {
            'sport.keyword': {
              // value: filerdata?.sport,
              value: `${filerdata.sport.toLowerCase()}`,
            },
          },
        });

        availableForchallengeQuery.query.bool.should[0].bool.must.push({
          term: {
            'sport_type.keyword': {
              // value: filerdata?.sport_type,
              value: `${filerdata.sport_type.toLowerCase()}`,
            },
          },
        });

        availableForchallengeQuery.query.bool.should[1].bool.must[1].nested.query.bool.must.push(
          {
            term: {
              'registered_sports.sport.keyword': {
                // value: filerdata?.sport,
                value: `${filerdata.sport.toLowerCase()}`,
              },
            },
          },
        );

        availableForchallengeQuery.query.bool.should[1].bool.must[1].nested.query.bool.must.push(
          {
            term: {
              'registered_sports.sport_type.keyword': {
                // value: filerdata?.sport_type,
                value: `${filerdata.sport.toLowerCase()}`,
              },
            },
          },
        );
      }

      if (filerdata.gameFee) {
        availableForchallengeQuery.query.bool.should[0].bool.must.push({
          range: {
            'setting.game_fee.fee': {
              gte: Number(
                parseFloat(filerdata.gameFee.split('-')[0]).toFixed(2),
              ),
              lte: Number(
                parseFloat(filerdata.gameFee.split('-')[1]).toFixed(2),
              ),
            },
          },
        });

        availableForchallengeQuery.query.bool.should[1].bool.must.push({
          range: {
            'registered_sports.setting.game_fee.fee': {
              gte: Number(
                parseFloat(filerdata.gameFee.split('-')[0]).toFixed(2),
              ),
              lte: Number(
                parseFloat(filerdata.gameFee.split('-')[1]).toFixed(2),
              ),
            },
          },
        });
      }
      console.log(
        'Available For challengeQuery  match Query:=>',
        JSON.stringify(availableForchallengeQuery),
      );
      // Looking Challengee query

      getEntityIndex(availableForchallengeQuery)
        .then((entity) => {
          if (entity.length > 0) {
            setAvailableChallenge([...availableChallenge, ...entity]);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
          }
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [pageFrom, pageSize, availableChallenge],
  );

  const userJoinGroup = (groupId) => {
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
                  joinTeam({...params, is_confirm: true}, groupId, authContext)
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
          Alert.alert(strings.alertmessagetitle, response.payload.user_message);
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
          Alert.alert(strings.alertmessagetitle, response.payload.user_message);
        } else if (response.payload.action === Verbs.joinVerb) {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        } else if (response.payload.action === Verbs.requestVerb) {
          Alert.alert(strings.alertmessagetitle, strings.sendRequest);
        } else {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        }
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };
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
  // const renderAvailableChallengeListView = useCallback(
  //   ({item}) => (
  //     <View style={[styles.separator, {flex: 1}]}>
  //       <TCAvailableForChallenge
  //         data={item}
  //         entityType={item.entity_type}
  //         selectedSport={selectedSport}
  //         onPress={() => {
  //           navigation.navigate('HomeScreen', {
  //             uid: ['user', 'player']?.includes(item?.entity_type)
  //               ? item?.user_id
  //               : item?.group_id,
  //             role: ['user', 'player']?.includes(item?.entity_type)
  //               ? 'user'
  //               : item.entity_type,
  //             backButtonVisible: true,
  //             menuBtnVisible: false,
  //           });
  //         }}
  //       />
  //     </View>
  //   ),
  //   [navigation, selectedSport],
  // );
  const renderAvailableChallengeListView = useCallback(
    ({item}) => (
      <View style={{flex: 1}}>
        {item.entity_type === Verbs.entityTypePlayer && (
          <TCPlayerView
            data={item}
            authContext={authContext}
            showSport={true}
            showStar={filters.sport !== strings.allSport && true}
            subTab={strings.playerTitle}
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
    [navigation],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSeparator = () => (
    <TCThinDivider marginTop={10} marginBottom={10} width={'100%'} />
  );

  const onScrollHandler = () => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getAvailableForChallenge(filters);
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
        if (Object.keys(item)[0] === 'gameFee') {
          tempFilter.minFee = 0;
          tempFilter.maxFee = 0;
          delete tempFilter.fee;
        }
        // delete tempFilter[key];
      }
    });
    console.log('Temp filter', tempFilter);
    setFilters({...tempFilter});
    // applyFilter();
    setTimeout(() => {
      setPageFrom(0);
      setAvailableChallenge([]);
      applyFilter(tempFilter);
    }, 10);
  };

  const getLocation = () => {
    // setloading(true);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
        setloading(false);
        if (currentLocation.position) {
          setLocation(
            currentLocation.city?.charAt(0).toUpperCase() +
              currentLocation.city?.slice(1),
          );
          setFilters({...filters, locationOption: 2});
        }
      })
      .catch((e) => {
        setloading(false);
        if (e.message !== strings.userdeniedgps) {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        }
      });
  };

  const applyFilter = useCallback((fil) => {
    getAvailableForChallenge(fil);
  }, []);

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noTeamsOrPlayer}
      </Text>
    </View>
  );

  // const applyValidation = useCallback(() => {
  //   if (Number(minFee) > 0 && Number(maxFee) <= 0) {
  //     Alert.alert(strings.pleaseEnterCorrectMaxFee);
  //     return false;
  //   }
  //   if (Number(minFee) <= 0 && Number(maxFee) > 0) {
  //     Alert.alert(strings.pleaseEnterCorrectMinFee);
  //     return false;
  //   }
  //   if (Number(minFee) > Number(maxFee)) {
  //     Alert.alert(strings.pleaseEnterCorrectFee);
  //     return false;
  //   }
  //   return true;
  // }, [maxFee, minFee]);

  // const onPressReset = () => {
  //   setFilters({
  //     location: strings.worldTitleText,
  //     sport: strings.allType,
  //     sport_type: strings.allType,
  //   });
  //   setSelectedSport({
  //     sport: strings.allType,
  //     sport_type: strings.allType,
  //   });
  //   setLocationFilterOpetion(
  //     locationContext?.selectedLocation.toUpperCase() ===
  //       /* eslint-disable */
  //       authContext.entity.obj?.city?.toUpperCase()
  //       ? 1
  //       : locationContext?.selectedLocation === strings.worldTitleText
  //       ? 0
  //       : 2,
  //   );
  //   setMinFee(0);
  //   setMaxFee(0);
  // };

  // const renderSports = ({item}) => (
  //   <Pressable
  //     style={styles.listItem}
  //     onPress={() => {
  //       if (item.value === strings.allType) {
  //         setSelectedSport({
  //           sport: strings.allType,
  //           sport_type: strings.allType,
  //         });
  //       } else {
  //         setSelectedSport(
  //           Utility.getSportObjectByName(item.value, authContext),
  //         );
  //       }
  //       setVisibleSportsModal(false);
  //     }}>
  //     <View
  //       style={{
  //         width: '100%',
  //         padding: 20,
  //         alignItems: 'center',
  //         flexDirection: 'row',
  //         justifyContent: 'space-between',
  //       }}>
  //       <Text style={styles.languageList}>{item.value}</Text>
  //       <View style={styles.checkbox}>
  //         {selectedSport?.sport.toLowerCase() === item.value.toLowerCase() ? (
  //           <Image
  //             source={images.radioCheckYellow}
  //             style={styles.checkboxImg}
  //           />
  //         ) : (
  //           <Image source={images.radioUnselect} style={styles.checkboxImg} />
  //         )}
  //       </View>
  //     </View>
  //   </Pressable>
  // );

  // const ModalHeader = () => (
  //   <View
  //     style={{
  //       flexDirection: 'row',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //     }}>
  //     <View style={styles.handleStyle} />
  //   </View>
  // );

  // const handleSetLocationOptions = (location) => {
  //   if (location.hasOwnProperty('address')) {
  //     setLocation(location?.formattedAddress);
  //   } else {
  //     setLocation(location?.city);
  //   }
  // };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
          <TextInput
            clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
            clearButtonVisible={Platform.OS === 'android'}
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
              setAvailableChallenge([]);
              applyFilter(tempFilter);
            }}
            // value={search}
          />
          <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
            <Image source={images.homeSetting} style={styles.settingImage} />
          </TouchableWithoutFeedback>
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
      />

      {/* <Modal
        onBackdropPress={() => {
          setLocationFilterOpetion(lastSelection);
          setSettingPopup(false);
        }}
        style={{
          margin: 0,
        }}
        isVisible={settingPopup}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}>
        <View
          style={[
            styles.bottomPopupContainer,
            {height: Dimensions.get('window').height - 50},
          ]}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <ScrollView style={{flex: 1}}>
              <View style={styles.viewsContainer}>
                <Text
                  onPress={() => {
                    setLocationFilterOpetion(lastSelection);
                    setSettingPopup(false);
                  }}
                  style={styles.cancelText}>
                  {strings.cancel}
                </Text>
                <Text style={styles.locationText}>{strings.filter}</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                    if (applyValidation()) {
                      const tempFilter = {...filters};
                      tempFilter.sport = selectedSport.sport;
                      tempFilter.sport_type = selectedSport.sport_type;
                      // tempFilter.location = location;
                      if (locationFilterOpetion === 0) {
                        setLocation(strings.worldTitleText);
                        tempFilter.location = location;
                      } else if (locationFilterOpetion === 1) {
                        setLocation(
                          authContext?.entity?.obj?.city
                            .charAt(0)
                            .toUpperCase() +
                            authContext?.entity?.obj?.city.slice(1),
                        );
                        tempFilter.location = location;
                      } else if (locationFilterOpetion === 2) {
                        getLocation();
                        tempFilter.location = location;
                      }
                      if (minFee && maxFee) {
                        tempFilter.gameFee = `${minFee}-${maxFee}`;
                      }
                      setFilters({
                        ...tempFilter,
                      });
                      setPageFrom(0);
                      setAvailableChallenge([]);
                      applyFilter(tempFilter);
                      setSettingPopup(false);
                    }
                  }}>
                  {strings.apply}
                </Text>
              </View>
              <TCThinDivider width={'100%'} marginBottom={15} />
              <View>
                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitleBold}>
                      {strings.locationTitleText}
                    </Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>
                        {strings.locationTitle}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(
                            locationType.CURRENT_LOCATION,
                          );
                        }}>
                        <Image
                          source={
                            locationFilterOpetion === 2
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>
                        {strings.currentCity}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(locationType.HOME_CITY);
                        }}>
                        <Image
                          source={
                            locationFilterOpetion === 1
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>{strings.world}</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(locationType.WORLD);
                        }}>
                        <Image
                          source={
                            locationFilterOpetion === 0
                              ? images.checkRoundOrange
                              : images.radioUnselect
                          }
                          style={styles.radioButtonStyle}
                        />
                      </TouchableWithoutFeedback>
                    </View>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        setLocationFilterOpetion(locationType.SEARCH_CITY);
                        // setSettingPopup(false);
                        // navigation.navigate('SearchCityScreen', {
                        //   comeFrom: 'LookingForChallengeScreen',
                        // });

                        setVisibleLocationModal(true);
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.searchCityContainer}>
                          <Text style={styles.searchCityText}>
                            {route?.params?.locationText ||
                              (filters.location !== strings.worldTitleText &&
                                filters.location) ||
                              strings.searchCityText}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignSelf: 'center',
                          }}>
                          <Image
                            source={
                              locationFilterOpetion === 3
                                ? images.checkRoundOrange
                                : images.radioUnselect
                            }
                            style={styles.radioButtonStyle}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'column',
                      margin: 15,
                      justifyContent: 'space-between',
                    }}>
                    <View style={{}}>
                      <Text style={styles.filterTitleBold}>
                        {strings.sportsEventsTitle}
                      </Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <View
                        style={[
                          {
                            marginBottom: 10,
                            justifyContent: 'flex-start',
                          },
                          styles.sportsContainer,
                        ]}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            setVisibleSportsModal(true);
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                            }}>
                            <View>
                              <Text style={styles.searchCityText}>
                                {selectedSport?.sport_name ?? strings.allType}
                              </Text>
                            </View>
                            <View
                              style={{
                                position: 'absolute',
                                right: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Icon
                                size={24}
                                color="black"
                                name="chevron-down"
                              />
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {selectedSport?.sport !== strings.allType && (
                <View
                  style={{
                    flexDirection: 'column',
                    margin: 15,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{}}>
                    <Text style={styles.filterTitle}>
                      {strings.matchFeesTitle}
                    </Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        onChangeText={(text) => setMinFee(text)}
                        value={minFee}
                        style={styles.minFee}
                        placeholder={strings.minPlaceholder}
                        autoCorrect={false}
                        // clearButtonMode={'always'}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.userPostTimeColor}
                      />
                      <TextInput
                        onChangeText={(text) => setMaxFee(text)}
                        value={maxFee}
                        style={styles.minFee}
                        placeholder={strings.maxPlaceholder}
                        autoCorrect={false}
                        // clearButtonMode={'always'}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.userPostTimeColor}
                      />
                    </View>
                  </View>
                </View>
              )}
              <View style={{flex: 1}} />
            </ScrollView>
          </KeyboardAvoidingView>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                strings.areYouSureRemoveFilterText,
                '',
                [
                  {
                    text: strings.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: strings.okTitleText,
                    onPress: () => onPressReset(),
                  },
                ],
                {cancelable: false},
              );
            }}>
            <Text style={styles.resetTitle}>{strings.resetTitleText}</Text>
          </TouchableOpacity>

          <LocationModal
            visibleLocationModal={visibleLocationModal}
            title={strings.cityStateOrCountryTitle}
            setVisibleLocationModalhandler={() =>
              setVisibleLocationModal(false)
            }
            onLocationSelect={handleSetLocationOptions}
            placeholder={strings.searchTitle}
            type={'country'}
          />

          <Modal
            isVisible={visibleSportsModal}
            onBackdropPress={() => setVisibleSportsModal(false)}
            onRequestClose={() => setVisibleSportsModal(false)}
            animationInTiming={300}
            animationOutTiming={800}
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={800}
            style={{
              margin: 0,
            }}>
            <View
              behavior="position"
              style={{
                width: '100%',
                height: Dimensions.get('window').height - 75,
                maxHeight: Dimensions.get('window').height - 75,
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
              {ModalHeader()}
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}></View>
              <View style={styles.separatorLine} />
              <FlatList
                ItemSeparatorComponent={() => <TCThinDivider />}
                data={sports}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderSports}
              />
            </View>
          </Modal>
        </View>
      </Modal> */}
      <ActionSheet
        ref={actionSheet}
        title={message}
        options={[strings.acceptInvite, strings.declineInvite, strings.cancel]}
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
        fType={filterType.TEAMAVAILABLECHALLENGE}
        sports={sports}
        filterObject={filters}
        isVisible={settingPopup}
        onPressApply={(filterData) => {
          setloading(false);
          console.log('filterData==>', filterData);
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
            getLocation();
            tempFilter.location = location;
          } else if (filterData.locationOption === locationType.SEARCH_CITY) {
            setLocation(filterData.searchCityLoc);
            tempFilter.location = filterData.searchCityLoc;
          }
          setFilters({...tempFilter});
          console.log('tempFilter-2===>', tempFilter);
          applyFilter(tempFilter);
        }}
        onPressCancel={() => {
          setSettingPopup(false);
        }}></SearchModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listStyle: {
    padding: 15,
  },

  searchViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    width: widthPercentageToDP('92%'),
    borderRadius: 25,
    elevation: 2,
    backgroundColor: '#F5F5F5',
    marginTop: 10,
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

  // minMaxTitle: {
  //   fontSize: 16,
  //   fontFamily: fonts.RRegular,
  //   color: colors.userPostTimeColor,
  //   marginRight: 15,
  // },
  // starCount: {
  //   fontSize: 16,
  //   fontFamily: fonts.RMedium,
  //   color: colors.themeColor,
  //   marginLeft: 15,
  // },
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
  // fieldView: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   flex: 1,
  //   height: 40,
  //   alignItems: 'center',
  //   backgroundColor: colors.offwhite,
  //   borderRadius: 5,
  //   shadowColor: colors.grayColor,
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 1,
  //   elevation: 1,
  // },
  // fieldTitle: {
  //   fontSize: 16,
  //   color: colors.lightBlackColor,
  //   fontFamily: fonts.RLight,
  //   marginLeft: 10,
  // },
  // fieldValue: {
  //   fontSize: 16,
  //   color: colors.lightBlackColor,
  //   fontFamily: fonts.RRegular,
  //   textAlign: 'center',
  // },

  searchTxt: {
    marginLeft: 15,
    fontSize: widthPercentageToDP('3.8%'),
    width: widthPercentageToDP('75%'),
  },
});
