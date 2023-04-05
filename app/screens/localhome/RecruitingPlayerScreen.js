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
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
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
// import TCRecruitingPlayers from '../../components/TCRecruitingPlayers';
import {groupsType, locationType, ErrorCodes} from '../../utils/constant';
import ActivityLoader from '../../components/loader/ActivityLoader';
import Verbs from '../../Constants/Verbs';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import LocationModal from '../../components/LocationModal/LocationModal';
import TCTeamSearchView from '../../components/TCTeamSearchView';
import {joinTeam} from '../../api/Groups';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';
import {getSportList} from '../../utils/sportsActivityUtils';

let stopFetchMore = true;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

export default function RecruitingPlayerScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route.params?.filters);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(
    route.params.locationOption,
  );
  const [sports, setSports] = useState([]);

  const [recruitingPlayer, setRecruitingPlayer] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [groups, setGroups] = useState(groupsType);
  const [loading, setloading] = useState(false);
  const [location, setLocation] = useState(
    route.params?.filters?.location ?? route.params?.locationText,
  );
  const [lastSelection, setLastSelection] = useState(0);

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
  const [isSearchPlaceholder, setIsSearchPlaceholder] = useState(
    locationFilterOpetion !== 3,
  );
  const [selectedSport, setSelectedSport] = useState({
    sport: route.params?.filters?.sport,
    sport_type: route.params?.filters?.sport_type,
    sport_name: route.params?.filters?.sport_name,
  });
  const [selectedLocation, setSelectedLocation] = useState(
    route.params?.filters?.location,
  );
  useEffect(() => {
    if (settingPopup) {
      setLastSelection(locationFilterOpetion);
    }
  }, [settingPopup]);
  useEffect(() => {
    groups.forEach((x, i) => {
      if (x.type === strings.teamstitle) {
        groups[i].isChecked = true;
      } else if (x.type === strings.clubstitle) {
        groups[i].isChecked = true;
      } else if (x.type === strings.leaguesTitle) {
        groups[i].isChecked = true;
      }
      setGroups([...groups]);
    });
    if (route.params?.locationText) {
      setSettingPopup(true);
      setTimeout(() => {
        setLocation(route.params.locationText);
      }, 10);
    }
  }, [route.params?.locationText]);

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
      ...getSportList(authContext.sports, Verbs.entityTypeReferee),
    ]);
  }, [authContext]);

  const modifiedClubAndTeamElasticSearchResult = (response) => {
    const modifiedData = [];
    for (const item of response) {
      if (item.entity_type === Verbs.entityTypeTeam) {
        modifiedData.push({
          ...item,
          sport_name: Utility.getSportName(item, authContext),
        });
      } else if (item.entity_type === Verbs.entityTypeClub) {
        const clubSports = item.sports.map((obj) => ({
          ...obj,
          sport_name: Utility.getSportName(obj, authContext),
        }));
        item.sports = clubSports;
        modifiedData.push(item);
      }
    }
    return modifiedData;
  };
  const getRecruitingPlayer = useCallback(
    (filerdata) => {
      const recruitingPlayersQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [{match: {hiringPlayers: 1}}],
          },
        },
      };

      if (filerdata.location !== strings.worldTitleText) {
        recruitingPlayersQuery.query.bool.must.push({
          multi_match: {
            query: filerdata.location.toLowerCase(),
            fields: ['city', 'country', 'state_abbr'],
          },
        });
      }
      if (filerdata.sport !== strings.allSport) {
        recruitingPlayersQuery.query.bool.must.push({
          term: {
            'sport.keyword': {
              value: filerdata.sport,
            },
          },
        });
        recruitingPlayersQuery.query.bool.must.push({
          term: {
            'sport_type.keyword': {
              value: filerdata.sport_type,
            },
          },
        });
      }

      const types = [];
      if (filerdata.groupTeam) {
        types.push(Verbs.entityTypeTeam);
      }
      if (filerdata.groupClub) {
        types.push(Verbs.entityTypeClub);
      }
      if (filerdata.groupLeague) {
        types.push(Verbs.entityTypeLeague);
      }
      if (types.length > 0) {
        recruitingPlayersQuery.query.bool.must.push({
          terms: {
            entity_type: [...types],
          },
        });
      }

      if (filerdata?.searchText?.length > 0) {
        recruitingPlayersQuery.query.bool.must.push({
          query_string: {
            query: `*${filerdata?.searchText}*`,
            fields: ['group_name'],
          },
        });
      }
      console.log(
        'Recuriting query==>',
        JSON.stringify(recruitingPlayersQuery),
      );

      // Looking Challengee query
      getEntityIndex(recruitingPlayersQuery)
        .then((entity) => {
          if (entity.length > 0) {
            const modifiedResult =
              modifiedClubAndTeamElasticSearchResult(entity);
            setRecruitingPlayer([...recruitingPlayer, ...modifiedResult]);
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
    [pageFrom, pageSize, recruitingPlayer],
  );

  useEffect(() => {
    getRecruitingPlayer(filters);
  }, []);

  const renderRecruitingPlayerListView = useCallback(
    ({item}) => (
      <View style={[styles.separator, {flex: 1}]}>
        {/* <TCRecruitingPlayers
          data={item}
          entityType={item.entity_type}
          selectedSport={selectedSport}
          onPress={() => {
            navigation.navigate('HomeScreen', {
              uid: item?.group_id,
              role: item.entity_type,
              backButtonVisible: true,
              menuBtnVisible: false,
            });
          }}
        /> */}
        <TCTeamSearchView
          data={item}
          authContext={authContext}
          isClub={item.entity_type === Verbs.entityTypeClub}
          showStar={item.entity_type === Verbs.entityTypeTeam}
          sportFilter={
            (item.entity_type === Verbs.entityTypeTeam && filters) ||
            (item.entity_type === Verbs.entityTypeClub && filters)
          }
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
      </View>
    ),
    [navigation, selectedSport],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSeparator = () => (
    <TCThinDivider marginTop={10} marginBottom={10} width={'100%'} />
  );

  const onScrollHandler = () => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getRecruitingPlayer(filters);
      stopFetchMore = true;
    }
    setLoadMore(false);
  };
  const handleTagPress = ({item}) => {
    const tempFilter = filters;
    Object.keys(tempFilter).forEach((key) => {
      if (key === Object.keys(item)[0]) {
        if (Object.keys(item)[0] === Verbs.sportType) {
          tempFilter.sport = strings.allSport;
          delete tempFilter.gameFee;
          setSelectedSport({
            sport: strings.allSport,
            sport_type: strings.allSport,
            sport_name: strings.allSport,
          });
        }
        if (Object.keys(item)[0] === Verbs.locationType) {
          tempFilter.location = strings.worldTitleText;
          setIsSearchPlaceholder(true);
          setLocationFilterOpetion(0);
        }

        if (Object.keys(item)[0] === 'groupTeam') {
          delete tempFilter.groupTeam;
        }
        if (Object.keys(item)[0] === 'groupClub') {
          delete tempFilter.groupClub;
        }
        if (Object.keys(item)[0] === 'groupLeague') {
          delete tempFilter.groupLeague;
        }

        // delete tempFilter[key];
      }
    });

    const temp = [];
    groups.forEach((x) => {
      if (x.type === (item.groupClub || item.groupTeam || item.groupLeague)) {
        const obj = {
          type: x.type,
          isChecked: false,
        };
        temp.push(obj);
      } else {
        temp.push(x);
      }
    });
    setGroups([...temp]);

    setTimeout(() => {
      setFilters({...tempFilter});

      setPageFrom(0);
      setRecruitingPlayer([]);
      applyFilter(tempFilter);
    }, 10);
  };

  const getLocation = () => {
    setloading(true);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
        setloading(false);
        if (currentLocation.position) {
          setLocation(
            currentLocation.city?.charAt(0).toUpperCase() +
              currentLocation.city?.slice(1),
          );
          setLocationFilterOpetion(2);
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
    getRecruitingPlayer(fil);
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

  const onPressReset = () => {
    setFilters({
      location: strings.worldTitleText,
      sport: strings.allSport,
      sport_type: strings.allSport,
    });
    setSelectedSport({
      sport: strings.allSport,
      sport_type: strings.allSport,
      sport_name: strings.allSport,
    });
    setIsSearchPlaceholder(true);
    setSelectedLocation(location);
    // setLocationFilterOpetion(
    //   locationContext?.selectedLocation.toUpperCase() ===
    //     /* eslint-disable */
    //     authContext.entity.obj?.city?.toUpperCase()
    //     ? 1
    //     : locationContext?.selectedLocation === strings.worldTitleText
    //     ? 0
    //     : 2,
    // );
  };
  const isIconCheckedOrNot = useCallback(
    ({item, index}) => {
      if (item.isChecked) {
        groups[index].isChecked = false;
      } else {
        groups[index].isChecked = true;
      }

      setGroups([...groups]);
    },
    [groups],
  );
  useEffect(() => {
    const tempFilter = {...filters};
    tempFilter.sport = selectedSport?.sport;
    tempFilter.sport_name = selectedSport?.sport_name;
    tempFilter.location = location;
    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setRecruitingPlayer([]);
    applyFilter(tempFilter);
  }, [location]);
  const renderGroupsTypeItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => isIconCheckedOrNot({item, index})}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 15,
          alignSelf: 'flex-start',
        }}>
        <Text style={styles.sportList}>{item?.type}</Text>
        <View style={styles.checkbox}>
          {item?.isChecked ? (
            <FastImage
              resizeMode={'contain'}
              source={images.orangeCheckBox}
              style={styles.checkboxImg}
            />
          ) : (
            <FastImage
              resizeMode={'contain'}
              source={images.uncheckWhite}
              style={styles.unCheckboxImg}
            />
          )}
        </View>
      </View>
      <TCThinDivider />
    </TouchableOpacity>
  );

  const renderSports = ({item}) => (
    <Pressable
      style={styles.listItem}
      onPress={() => {
        if (item.sport === strings.allSport) {
          setSelectedSport({
            sport: strings.allSport,
            sport_type: strings.allSport,
            sport_name: strings.allSport,
          });
        } else {
          // setSelectedSport(
          //   Utility.getSportObjectByName(item.value, authContext),
          // );
          setSelectedSport(item);
        }
        setVisibleSportsModal(false);
      }}>
      <View
        style={{
          width: '100%',
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.sport_name}</Text>
        <View style={styles.checkbox}>
          {selectedSport?.sport.toLowerCase() === item.sport.toLowerCase() ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </Pressable>
  );

  const ModalHeader = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={styles.handleStyle} />
    </View>
  );

  const handleSetLocationOptions = (locationObj) => {
    setIsSearchPlaceholder(false);
    // eslint-disable-next-line no-prototype-builtins
    if (locationObj.hasOwnProperty('address')) {
      // setLocation(location?.formattedAddress);
      setSelectedLocation(locationObj?.formattedAddress);
    } else {
      // setLocation(location?.city);
      setSelectedLocation(locationObj?.city);
    }
  };

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
  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
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
              setRecruitingPlayer([]);
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
        data={recruitingPlayer}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        renderItem={renderRecruitingPlayerListView}
        style={styles.listStyle}
        // contentContainerStyle={{ paddingBottom: 1 }}
        onScroll={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
      />
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
                    if (lastSelection !== locationType.SEARCH_CITY) {
                      setIsSearchPlaceholder(true);
                      setSelectedLocation('');
                    } else {
                      setIsSearchPlaceholder(false);
                      setSelectedLocation(location);
                    }
                  }}
                  style={styles.cancelText}>
                  {strings.cancel}
                </Text>
                <Text style={styles.locationText}>{strings.filter}</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                    const tempFilter = {...filters};
                    tempFilter.sport = selectedSport.sport;
                    tempFilter.sport_type = selectedSport.sport_type;
                    tempFilter.sport_name = selectedSport.sport_name;
                    if (locationFilterOpetion === 0) {
                      setLocation(strings.worldTitleText);
                      tempFilter.location = location;
                    } else if (locationFilterOpetion === 1) {
                      setLocation(
                        authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
                          authContext?.entity?.obj?.city.slice(1),
                      );
                      tempFilter.location = location;
                    } else if (locationFilterOpetion === 2) {
                      getLocation();
                      tempFilter.location = location;
                    }
                    if (
                      groups.filter(
                        (obj) =>
                          obj.type === strings.teamstitle && obj.isChecked,
                      ).length > 0
                    ) {
                      tempFilter.groupTeam = strings.teamstitle;
                    } else {
                      delete tempFilter.groupTeam;
                    }
                    if (
                      groups.filter(
                        (obj) =>
                          obj.type === strings.clubstitle && obj.isChecked,
                      ).length > 0
                    ) {
                      tempFilter.groupClub = strings.clubstitle;
                    } else {
                      delete tempFilter.groupClub;
                    }
                    if (
                      groups.filter(
                        (obj) =>
                          obj.type === strings.leaguesTitle && obj.isChecked,
                      ).length > 0
                    ) {
                      tempFilter.groupLeague = strings.leaguesTitle;
                    } else {
                      delete tempFilter.groupLeague;
                    }

                    setFilters({
                      ...tempFilter,
                    });
                    setPageFrom(0);
                    setRecruitingPlayer([]);
                    applyFilter(tempFilter);
                    setSettingPopup(false);
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
                          setIsSearchPlaceholder(true);
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
                        {strings.homeCityTitleText}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(locationType.HOME_CITY);
                          setIsSearchPlaceholder(true);
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
                          setIsSearchPlaceholder(true);
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
                        setVisibleLocationModal(true);
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.searchCityContainer}>
                          <Text style={styles.searchCityText}>
                            {isSearchPlaceholder === true
                              ? strings.searchCityText
                              : selectedLocation}
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
                      <Text style={styles.filterTitle}>
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
                                {selectedSport?.sport_name ?? strings.allSport}
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
                      {/* <TCPicker
                        dataSource={sports}
                        placeholder={strings.selectSportTitleText}
                        onValueChange={(value) => {
                          if (value === strings.allType) {
                            setSelectedSport({
                              sport: strings.allType,
                              sport_type: strings.allType,
                            });
                          } else {
                            setSelectedSport(
                              Utility.getSportObjectByName(value, authContext),
                            );
                          }
                        }}
                        value={Utility.getSportName(selectedSport, authContext)}
                      /> */}
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'column', margin: 15}}>
                  <View>
                    <Text style={styles.filterTitle}>
                      {strings.groupsTitleText}
                    </Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <FlatList
                        data={groups}
                        keyExtractor={keyExtractor}
                        renderItem={renderGroupsTypeItem}
                      />
                    </View>
                  </View>
                </View>
              </View>

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
      </Modal>
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listStyle: {
    padding: 15,
  },

  separator: {
    borderRightWidth: 20,
    borderColor: colors.whiteColor,
  },

  searchViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    width: widthPercentageToDP('92%'),
    borderRadius: 20,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    backgroundColor: colors.offwhite,
  },
  settingImage: {
    height: 20,
    width: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginRight: 15,
  },
  searchView: {
    backgroundColor: colors.grayBackgroundColor,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
  },

  filterTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  filterTitleBold: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
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

  doneText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
  },
  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
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

  resetButton: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    height: 30,
    width: 113,
    shadowOpacity: 0.16,
    flexDirection: 'row',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  resetTitle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },

  searchCityContainer: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('75%'),
    justifyContent: 'center',
  },

  sportsContainer: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('93%'),
    justifyContent: 'center',
  },

  searchCityText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  searchTxt: {
    marginLeft: 15,
    fontSize: widthPercentageToDP('3.8%'),
    width: widthPercentageToDP('75%'),
  },

  checkbox: {
    alignSelf: 'center',
    marginRight: 15,
  },
  unCheckboxImg: {
    width: widthPercentageToDP('5.5%'),
    height: widthPercentageToDP('5.5%'),
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
  },
  checkboxImg: {
    width: widthPercentageToDP('5.5%'),
    height: widthPercentageToDP('5.5%'),
  },
  listItem: {
    alignSelf: 'center',
    // marginLeft: wp('10%'),
    width: widthPercentageToDP('100%'),
    // backgroundColor: 'red',
  },

  sportList: {
    color: colors.lightBlackColor,
    fontSize: widthPercentageToDP('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    margin: widthPercentageToDP('4%'),
    textAlignVertical: 'center',
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4%'),
  },
  // checkboxImg: {
  //   width: 22,
  //   height: 22,
  //   resizeMode: 'contain',
  //   alignSelf: 'center',
  // },

  handleStyle: {
    marginVertical: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 5,
    width: 40,
    borderRadius: 15,
    backgroundColor: '#DADBDA',
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
});
