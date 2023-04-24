/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {useCallback, useState, useEffect, useContext} from 'react';
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
import {format} from 'react-string-format';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {widthPercentageToDP} from '../../utils';
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
            fields: ['city', 'country', 'state_abbr'],
          },
        });
      }
      if (filerLookingEntity?.sport !== strings.allSport) {
        lookingQuery.query.bool.must[0].nested.query.bool.must.push({
          term: {
            'registered_sports.sport_name.keyword': {
              value: filerLookingEntity?.sport?.toLowerCase(),
              case_insensitive: true,
            },
          },
        });
      }
      if (filerLookingEntity?.searchText?.length > 0) {
        lookingQuery.query.bool.must.push({
          query_string: {
            query: `*${filerLookingEntity?.searchText}*`,
            fields: ['full_name'],
          },
        });
      }
      console.log('Looking for team/club query:', JSON.stringify(lookingQuery));

      // Looking team query

      getUserIndex(lookingQuery)
        .then((res) => {
          if (res.length > 0) {
            setLookingEntity([...lookingEntity, ...res]);
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
      getLookingEntity(filters);
      stopFetchMore = true;
    }
    setLoadMore(false);
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
    getLookingEntity(fil);
  }, []);

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noGroups}
      </Text>
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
  /*
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
  };

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
   */
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
  // return (
  //   <SafeAreaView style={{flex: 1}}>
  //     <ActivityLoader visible={loading} />
  //     <View style={styles.searchView}>
  //       <View style={styles.searchViewContainer}>
  //         <TextInput
  //           clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
  //           clearButtonVisible={Platform.OS === 'android'}
  //           placeholder={strings.searchText}
  //           style={styles.searchTxt}
  //           autoCorrect={false}
  //           onChangeText={(text) => {
  //             const tempFilter = {...filters};

  //             if (text?.length > 0) {
  //               tempFilter.searchText = text;
  //             } else {
  //               delete tempFilter.searchText;
  //             }
  //             setFilters({
  //               ...tempFilter,
  //             });
  //             setPageFrom(0);
  //             setLookingEntity([]);
  //             applyFilter(tempFilter);
  //           }}
  //           // value={search}
  //         />
  //         <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
  //           <Image source={images.homeSetting} style={styles.settingImage} />
  //         </TouchableWithoutFeedback>
  //       </View>
  //     </View>
  //     <TCTagsFilter
  //       filter={filters}
  //       authContext={authContext}
  //       dataSource={Utility.getFiltersOpetions(filters)}
  //       onTagCancelPress={handleTagPress}
  //     />
  //     <FlatList
  //       extraData={location}
  //       showsHorizontalScrollIndicator={false}
  //       data={lookingEntity}
  //       ItemSeparatorComponent={renderSeparator}
  //       keyExtractor={keyExtractor}
  //       renderItem={renderLookingEntityListView}
  //       style={styles.listStyle}
  //       // contentContainerStyle={{ paddingBottom: 1 }}
  //       onScroll={onScrollHandler}
  //       onEndReachedThreshold={0.01}
  //       onScrollBeginDrag={() => {
  //         stopFetchMore = false;
  //       }}
  //       ListEmptyComponent={listEmptyComponent}
  //     />
  //     <Modal
  //       onBackdropPress={() => setChallengePopup(false)}
  //       backdropOpacity={1}
  //       animationType="slide"
  //       hasBackdrop
  //       style={{
  //         margin: 0,
  //         backgroundColor: colors.blackOpacityColor,
  //       }}
  //       visible={challengePopup}>
  //       <View style={styles.bottomPopupContainer}>
  //         <View style={styles.viewsContainer}>
  //           <Text
  //             onPress={() => setChallengePopup(false)}
  //             style={styles.cancelText}>
  //             {strings.cancel}
  //           </Text>
  //           <Text style={styles.challengeText}>{strings.challenge}</Text>
  //           <Text style={styles.challengeText}> </Text>
  //         </View>
  //         <TCThinDivider width={'100%'} />
  //         <TouchableWithoutFeedback
  //           onPress={() => {
  //             setSelectedChallengeOption(0);
  //             const obj = settingObject;
  //             if (obj?.availibility === Verbs.on) {
  //               if (
  //                 currentUserData.sport_type === Verbs.doubleSport &&
  //                 (!('player_deactivated' in currentUserData) ||
  //                   !currentUserData?.player_deactivated) &&
  //                 (!('player_leaved' in currentUserData) ||
  //                   !currentUserData?.player_leaved) &&
  //                 (!('player_leaved' in myGroupDetail) ||
  //                   !myGroupDetail?.player_leaved)
  //               ) {
  //                 if (
  //                   (obj?.game_duration || obj?.score_rules) &&
  //                   obj?.availibility &&
  //                   obj?.special_rules !== undefined &&
  //                   obj?.general_rules !== undefined &&
  //                   obj?.responsible_for_referee &&
  //                   obj?.responsible_for_scorekeeper &&
  //                   obj?.game_fee &&
  //                   obj?.venue &&
  //                   obj?.refund_policy &&
  //                   obj?.home_away &&
  //                   obj?.game_type
  //                 ) {
  //                   setChallengePopup(false);

  //                   navigation.navigate('ChallengeScreen', {
  //                     setting: obj,
  //                     sportName: currentUserData?.sport,
  //                     sportType: currentUserData?.sport_type,
  //                     groupObj: currentUserData,
  //                   });
  //                 } else {
  //                   Alert.alert(strings.teamHaveNoCompletedSetting);
  //                 }
  //               } else {
  //                 console.log('in else continue :', currentUserData);
  //                 if (currentUserData.sport_type === Verbs.doubleSport) {
  //                   if (
  //                     'player_deactivated' in currentUserData &&
  //                     currentUserData?.player_deactivated
  //                   ) {
  //                     Alert.alert(strings.playerDeactivatedSport);
  //                   } else if (
  //                     'player_leaved' in currentUserData &&
  //                     currentUserData?.player_leaved
  //                   ) {
  //                     Alert.alert(
  //                       format(
  //                         strings.groupHaveNo2Player,
  //                         currentUserData?.group_name,
  //                       ),
  //                     );
  //                   } else if (
  //                     'player_leaved' in myGroupDetail &&
  //                     myGroupDetail?.player_leaved
  //                   ) {
  //                     Alert.alert(strings.youHaveNo2Player);
  //                   }
  //                 } else {
  //                   setChallengePopup(false);

  //                   navigation.navigate('ChallengeScreen', {
  //                     setting: obj,
  //                     sportName: obj?.sport,
  //                     sportType: obj?.sport_type,
  //                     groupObj: currentUserData,
  //                   });
  //                 }
  //               }
  //             } else {
  //               Alert.alert(strings.oppTeamNotForChallenge);
  //             }
  //           }}>
  //           {selectedChallengeOption === 0 ? (
  //             <LinearGradient
  //               colors={[colors.yellowColor, colors.orangeGradientColor]}
  //               style={styles.backgroundView}>
  //               <Text
  //                 style={[
  //                   styles.curruentLocationText,
  //                   {color: colors.whiteColor},
  //                 ]}>
  //                 {strings.continueToChallenge}
  //               </Text>
  //             </LinearGradient>
  //           ) : (
  //             <View style={styles.backgroundView}>
  //               <Text style={styles.curruentLocationText}>
  //                 {strings.continueToChallenge}
  //               </Text>
  //             </View>
  //           )}
  //         </TouchableWithoutFeedback>
  //         <TouchableWithoutFeedback
  //           onPress={() => {
  //             setSelectedChallengeOption(1);

  //             const obj = mySettingObject;
  //             if (obj?.availibility === Verbs.on) {
  //               if (
  //                 myGroupDetail.sport_type === Verbs.doubleSport &&
  //                 (!('player_deactivated' in myGroupDetail) ||
  //                   !myGroupDetail?.player_deactivated) &&
  //                 (!('player_leaved' in currentUserData) ||
  //                   !currentUserData?.player_leaved) &&
  //                 (!('player_leaved' in myGroupDetail) ||
  //                   !myGroupDetail?.player_leaved)
  //               ) {
  //                 if (
  //                   (obj?.game_duration || obj?.score_rules) &&
  //                   obj?.availibility &&
  //                   obj?.special_rules !== undefined &&
  //                   obj?.general_rules !== undefined &&
  //                   obj?.responsible_for_referee &&
  //                   obj?.responsible_for_scorekeeper &&
  //                   obj?.game_fee &&
  //                   obj?.venue &&
  //                   obj?.refund_policy &&
  //                   obj?.home_away &&
  //                   obj?.game_type
  //                 ) {
  //                   setChallengePopup(false);
  //                   if (myGroupDetail.is_pause === true) {
  //                     Alert.alert(
  //                       format(strings.groupPaused, myGroupDetail.group_name),
  //                     );
  //                   } else {
  //                     navigation.navigate('InviteChallengeScreen', {
  //                       setting: obj,
  //                       sportName: currentUserData?.sport,
  //                       sportType: currentUserData?.sport_type,
  //                       groupObj: currentUserData,
  //                     });
  //                   }
  //                 } else {
  //                   setTimeout(() => {
  //                     Alert.alert(
  //                       strings.completeSettingBeforeInvite,
  //                       '',
  //                       [
  //                         {
  //                           text: strings.cancel,
  //                           onPress: () => console.log('Cancel Pressed!'),
  //                         },
  //                         {
  //                           text: strings.okTitleText,
  //                           onPress: () => {
  //                             if (currentUserData?.is_pause === true) {
  //                               Alert.alert(strings.yourTeamPaused);
  //                             } else {
  //                               navigation.navigate('ManageChallengeScreen', {
  //                                 groupObj: currentUserData,
  //                                 sportName: currentUserData.sport,
  //                                 sportType: currentUserData?.sport_type,
  //                               });
  //                             }
  //                           },
  //                         },
  //                       ],
  //                       {cancelable: false},
  //                     );
  //                   }, 1000);
  //                 }
  //               } else if (myGroupDetail.sport_type === Verbs.doubleSport) {
  //                 if (
  //                   'player_deactivated' in myGroupDetail &&
  //                   myGroupDetail?.player_deactivated
  //                 ) {
  //                   Alert.alert(strings.playerDeactivatedSport);
  //                 } else if (
  //                   'player_leaved' in currentUserData ||
  //                   currentUserData?.player_leaved
  //                 ) {
  //                   Alert.alert(
  //                     format(
  //                       strings.groupHaveNo2Player,
  //                       currentUserData?.group_name,
  //                     ),
  //                   );
  //                 } else if (
  //                   'player_leaved' in myGroupDetail ||
  //                   myGroupDetail?.player_leaved
  //                 ) {
  //                   Alert.alert(strings.youHaveNo2Player);
  //                 }
  //               } else {
  //                 setChallengePopup(false);
  //                 if (myGroupDetail.is_pause === true) {
  //                   Alert.alert(strings.yourTeamPaused);
  //                 } else {
  //                   setChallengePopup(false);
  //                   navigation.navigate('InviteChallengeScreen', {
  //                     setting: obj,
  //                     sportName: currentUserData?.sport,
  //                     sportType: currentUserData?.sport_type,
  //                     groupObj: currentUserData,
  //                   });
  //                 }
  //               }
  //             } else {
  //               Alert.alert(strings.availibilityOff);
  //             }
  //           }}>
  //           {selectedChallengeOption === 1 ? (
  //             <LinearGradient
  //               colors={[colors.yellowColor, colors.orangeGradientColor]}
  //               style={styles.backgroundView}>
  //               <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
  //                 {strings.inviteToChallenge}
  //               </Text>
  //             </LinearGradient>
  //           ) : (
  //             <View style={styles.backgroundView}>
  //               <Text style={styles.myCityText}>
  //                 {strings.inviteToChallenge}
  //               </Text>
  //             </View>
  //           )}
  //         </TouchableWithoutFeedback>
  //       </View>
  //     </Modal>
  //     <Modal
  //       onBackdropPress={() => setSettingPopup(false)}
  //       style={{
  //         margin: 0,
  //       }}
  //       isVisible={settingPopup}
  //       animationInTiming={300}
  //       animationOutTiming={800}
  //       backdropTransitionInTiming={300}
  //       backdropTransitionOutTiming={800}>
  //       <View
  //         style={[
  //           styles.bottomPopupContainer,
  //           {height: Dimensions.get('window').height - 50},
  //         ]}>
  //         <KeyboardAvoidingView
  //           style={{flex: 1}}
  //           keyboardVerticalOffset={keyboardVerticalOffset}
  //           behavior={Platform.OS === 'ios' ? 'padding' : null}>
  //           <ScrollView style={{flex: 1}}>
  //             <View style={styles.viewsContainer}>
  //               <Text
  //                 onPress={() => {
  //                   setLocationFilterOpetion(lastSelection);
  //                   setSettingPopup(false);
  //                   if (lastSelection !== locationType.SEARCH_CITY) {
  //                     setIsSearchPlaceholder(true);
  //                     setSelectedLocation('');
  //                   } else {
  //                     setIsSearchPlaceholder(false);
  //                     setSelectedLocation(location);
  //                   }
  //                 }}
  //                 style={styles.cancelText}>
  //                 {strings.cancel}
  //               </Text>
  //               <Text style={styles.locationText}>{strings.filter}</Text>
  //               <Text
  //                 style={styles.doneText}
  //                 onPress={() => {
  //                   const tempFilter = {...filters};
  //                   tempFilter.sport = selectedSport.sport;
  //                   tempFilter.sport_type = selectedSport?.sport_type;
  //                   tempFilter.sport_name = selectedSport?.sport_name;
  //                   // setTimeout(() => {
  //                   if (locationFilterOpetion === 0) {
  //                     setLocation(strings.worldTitleText);
  //                     tempFilter.location = location;
  //                   } else if (locationFilterOpetion === 1) {
  //                     setLocation(
  //                       authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
  //                         authContext?.entity?.obj?.city.slice(1),
  //                     );
  //                     tempFilter.location = location;
  //                   } else if (locationFilterOpetion === 2) {
  //                     getLocation();
  //                     tempFilter.location = location;
  //                   } else if (locationFilterOpetion === 3) {
  //                     setLocation(selectedLocation);
  //                   }

  //                   // await setFilters({
  //                   //   ...tempFilter,
  //                   // });
  //                   filters.sport = tempFilter.sport;
  //                   filters.sport_type = tempFilter.sport_type;
  //                   filters.sport_name = tempFilter.sport_name;
  //                   filters.location = tempFilter.location;
  //                   setPageFrom(0);
  //                   setLookingEntity([]);
  //                   applyFilter(tempFilter);
  //                   setSettingPopup(false);
  //                 }}>
  //                 {strings.apply}
  //               </Text>
  //             </View>
  //             <TCThinDivider width={'100%'} marginBottom={15} />
  //             <View>
  //               <View style={{flexDirection: 'column', margin: 15}}>
  //                 <View>
  //                   <Text style={styles.filterTitleBold}>Location</Text>
  //                 </View>
  //                 <View style={{marginTop: 10}}>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       marginBottom: 10,
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     <Text style={styles.filterTitle}>
  //                       {strings.currrentCityTitle}
  //                     </Text>
  //                     <TouchableWithoutFeedback
  //                       onPress={() => {
  //                         setLocationFilterOpetion(
  //                           locationType.CURRENT_LOCATION,
  //                         );
  //                         setIsSearchPlaceholder(true);
  //                       }}>
  //                       <Image
  //                         source={
  //                           locationFilterOpetion === 2
  //                             ? images.checkRoundOrange
  //                             : images.radioUnselect
  //                         }
  //                         style={styles.radioButtonStyle}
  //                       />
  //                     </TouchableWithoutFeedback>
  //                   </View>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       marginBottom: 10,
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     <Text style={styles.filterTitle}>
  //                       {strings.currentCity}
  //                     </Text>
  //                     <TouchableWithoutFeedback
  //                       onPress={() => {
  //                         setLocationFilterOpetion(locationType.HOME_CITY);
  //                         setIsSearchPlaceholder(true);
  //                       }}>
  //                       <Image
  //                         source={
  //                           locationFilterOpetion === 1
  //                             ? images.checkRoundOrange
  //                             : images.radioUnselect
  //                         }
  //                         style={styles.radioButtonStyle}
  //                       />
  //                     </TouchableWithoutFeedback>
  //                   </View>
  //                   <View
  //                     style={{
  //                       flexDirection: 'row',
  //                       marginBottom: 10,
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     <Text style={styles.filterTitle}>{strings.world}</Text>
  //                     <TouchableWithoutFeedback
  //                       onPress={() => {
  //                         setLocationFilterOpetion(locationType.WORLD);
  //                         setIsSearchPlaceholder(true);
  //                       }}>
  //                       <Image
  //                         source={
  //                           locationFilterOpetion === 0
  //                             ? images.checkRoundOrange
  //                             : images.radioUnselect
  //                         }
  //                         style={styles.radioButtonStyle}
  //                       />
  //                     </TouchableWithoutFeedback>
  //                   </View>
  //                   <TouchableWithoutFeedback
  //                     onPress={() => {
  //                       setLocationFilterOpetion(locationType.SEARCH_CITY);
  //                       setVisibleLocationModal(true);
  //                     }}>
  //                     <View
  //                       style={{
  //                         flexDirection: 'row',
  //                         justifyContent: 'space-between',
  //                       }}>
  //                       <View style={styles.searchCityContainer}>
  //                         {/* <Text style={styles.searchCityText}>
  //                           {isSearchPlaceholder === true
  //                             ? strings.searchCityText
  //                             : selectedLocation}
  //                         </Text> */}
  //                         <Text
  //                           style={[
  //                             styles.searchCityText,
  //                             {
  //                               color:
  //                                 isSearchPlaceholder === true
  //                                   ? colors.placeHolderColor
  //                                   : colors.lightBlackColor,
  //                             },
  //                           ]}>
  //                           {isSearchPlaceholder === true
  //                             ? strings.searchTitle
  //                             : selectedLocation}
  //                         </Text>
  //                       </View>
  //                       <View
  //                         style={{
  //                           alignSelf: 'center',
  //                         }}>
  //                         <Image
  //                           source={
  //                             locationFilterOpetion === 3
  //                               ? images.checkRoundOrange
  //                               : images.radioUnselect
  //                           }
  //                           style={styles.radioButtonStyle}
  //                         />
  //                       </View>
  //                     </View>
  //                   </TouchableWithoutFeedback>
  //                 </View>
  //               </View>
  //               <View>
  //                 <View
  //                   style={{
  //                     flexDirection: 'column',
  //                     margin: 15,
  //                     justifyContent: 'space-between',
  //                   }}>
  //                   <View style={{}}>
  //                     <Text style={styles.filterTitleBold}>
  //                       {strings.sportsEventsTitle}
  //                     </Text>
  //                   </View>
  //                   <View style={{marginTop: 10}}>
  //                     <View
  //                       style={[
  //                         {
  //                           marginBottom: 10,
  //                           justifyContent: 'flex-start',
  //                         },
  //                         styles.sportsContainer,
  //                       ]}>
  //                       <TouchableWithoutFeedback
  //                         onPress={() => {
  //                           setVisibleSportsModal(true);
  //                         }}>
  //                         <View
  //                           style={{
  //                             flexDirection: 'row',
  //                             justifyContent: 'flex-start',
  //                           }}>
  //                           <View>
  //                             <Text style={styles.searchCityText}>
  //                               {selectedSport?.sport_name ?? strings.allSport}
  //                             </Text>
  //                           </View>
  //                           <View
  //                             style={{
  //                               position: 'absolute',
  //                               right: 0,
  //                               alignItems: 'center',
  //                               justifyContent: 'center',
  //                             }}>
  //                             <Icon
  //                               size={24}
  //                               color="black"
  //                               name="chevron-down"
  //                             />
  //                           </View>
  //                         </View>
  //                       </TouchableWithoutFeedback>
  //                     </View>
  //                   </View>
  //                 </View>
  //               </View>
  //             </View>
  //             <View style={{flex: 1}} />
  //           </ScrollView>
  //         </KeyboardAvoidingView>

  //         <TouchableOpacity
  //           style={styles.resetButton}
  //           onPress={() => {
  //             Alert.alert(
  //               strings.areYouSureRemoveFilterText,
  //               '',
  //               [
  //                 {
  //                   text: strings.cancel,
  //                   onPress: () => console.log('Cancel Pressed'),
  //                   style: 'cancel',
  //                 },
  //                 {
  //                   text: strings.okTitleText,
  //                   onPress: () => onPressReset(),
  //                 },
  //               ],
  //               {cancelable: false},
  //             );
  //           }}>
  //           <Text style={styles.resetTitle}>{strings.resetTitleText}</Text>
  //         </TouchableOpacity>

  //         <LocationModal
  //           visibleLocationModal={visibleLocationModal}
  //           title={strings.cityStateOrCountryTitle}
  //           setVisibleLocationModalhandler={() =>
  //             setVisibleLocationModal(false)
  //           }
  //           onLocationSelect={handleSetLocationOptions}
  //           placeholder={strings.searchTitle}
  //           type={'country'}
  //         />

  //         <Modal
  //           isVisible={visibleSportsModal}
  //           onBackdropPress={() => setVisibleSportsModal(false)}
  //           onRequestClose={() => setVisibleSportsModal(false)}
  //           animationInTiming={300}
  //           animationOutTiming={800}
  //           backdropTransitionInTiming={300}
  //           backdropTransitionOutTiming={800}
  //           style={{
  //             margin: 0,
  //           }}>
  //           <View
  //             behavior="position"
  //             style={{
  //               width: '100%',
  //               height: Dimensions.get('window').height - 75,
  //               maxHeight: Dimensions.get('window').height - 75,
  //               backgroundColor: 'white',
  //               position: 'absolute',
  //               bottom: 0,
  //               left: 0,
  //               borderTopLeftRadius: 30,
  //               borderTopRightRadius: 30,
  //               shadowColor: '#000',
  //               shadowOffset: {width: 0, height: 1},
  //               shadowOpacity: 0.5,
  //               shadowRadius: 5,
  //               elevation: 15,
  //             }}>
  //             {ModalHeader()}
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 paddingHorizontal: 15,
  //                 justifyContent: 'space-between',
  //                 alignItems: 'center',
  //               }}></View>
  //             <View style={styles.separatorLine} />
  //             <FlatList
  //               ItemSeparatorComponent={() => <TCThinDivider />}
  //               data={sports}
  //               keyExtractor={(item, index) => index.toString()}
  //               renderItem={renderSports}
  //             />
  //           </View>
  //         </Modal>
  //       </View>
  //     </Modal>

  //   </SafeAreaView>
  // );
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
              setLookingEntity([]);
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
        fType={filterType.SCOREKEEPERS}
        filterObject={filters}
        isVisible={settingPopup}
        onPressApply={(filterData) => {
          setloading(false);
          console.log('filterData==>', filterData);
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

  // separator: {
  //   borderRightWidth: 20,
  //   borderColor: colors.whiteColor,
  // },

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
    // backgroundColor: colors.grayBackgroundColor,
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
    width: widthPercentageToDP('75%'),
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
