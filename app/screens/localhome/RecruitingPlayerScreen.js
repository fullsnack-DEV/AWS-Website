/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {useCallback, useState, useEffect, useContext} from 'react';
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
  Pressable
} from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import AuthContext from '../../auth/context';
import LocationContext from '../../context/LocationContext';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {widthPercentageToDP} from '../../utils';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';

import {strings} from '../../../Localization/translation';
import {getEntityIndex} from '../../api/elasticSearch';
import TCTagsFilter from '../../components/TCTagsFilter';
import TCRecruitingPlayers from '../../components/TCRecruitingPlayers';
import {groupsType, locationType} from '../../utils/constant';
import ActivityLoader from '../../components/loader/ActivityLoader';
import Verbs from '../../Constants/Verbs';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';

let stopFetchMore = true;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

export default function RecruitingPlayerScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const locationContext = useContext(LocationContext);
  const [filters, setFilters] = useState(route.params?.filters);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);
      /* eslint-disable */ 
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(
    locationContext?.selectedLocation.toUpperCase() ===
    /* eslint-disable */ 
  authContext.entity.obj?.city?.toUpperCase() ? 1 : locationContext?.selectedLocation === strings.worldTitleText ? 0 : 2
  );

  const [sports, setSports] = useState([]);

  const [recruitingPlayer, setRecruitingPlayer] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [groups, setGroups] = useState(groupsType);
  const [loading, setloading] = useState(false);

  const [selectedSport, setSelectedSport] = useState({
    sport: route.params?.filters?.sport,
    sport_type: route.params?.filters?.sport_type,
  });
  const [location, setLocation] = useState(route.params?.filters?.location ?? route.params?.locationText);
  const [lastSelection, setLastSelection] = useState(0);
  useEffect(() => {
    if(settingPopup){
      setLastSelection(locationFilterOpetion)
    }
  },[settingPopup]);
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
    const list = [
      {
        label: strings.allType,
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
  }, [authContext]);

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
      if (filerdata.sport !== strings.allType) {
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

      // Looking Challengee query
      getEntityIndex(recruitingPlayersQuery)
        .then((entity) => {
          if (entity.length > 0) {
            setRecruitingPlayer([...recruitingPlayer, ...entity]);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
          }
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e);
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
        <TCRecruitingPlayers
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
          tempFilter.sport = strings.allType;
          delete tempFilter.gameFee;
          setSelectedSport({
            sport: strings.allType,
            sport_type: strings.allType,
          });
        }
        if (Object.keys(item)[0] === Verbs.locationType) {
          tempFilter.location = strings.worldTitleText;
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
        if(currentLocation.position){
          setLocation(currentLocation.city?.charAt(0).toUpperCase() + currentLocation.city?.slice(1));
          setLocationFilterOpetion(2);
        }
      })
      .catch((e) => {
        setloading(false);
        if(e.message !== strings.userdeniedgps){
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
      sport: strings.allType,
      sport_type: strings.allType,
    });
    setSelectedSport({
      sport: strings.allType,
      sport_type: strings.allType,
    });
    setLocationFilterOpetion(locationContext?.selectedLocation.toUpperCase() ===
    /* eslint-disable */ 
    authContext.entity.obj?.city?.toUpperCase() ? 1 : locationContext?.selectedLocation === strings.worldTitleText ? 0 : 2
      );
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
  useEffect(() =>{
    const tempFilter = {...filters};
    tempFilter.sport = selectedSport?.sport;
    tempFilter.location = location;
    setFilters({
      ...tempFilter,
    });
    setPageFrom(0);
    setRecruitingPlayer([]);
    applyFilter(tempFilter);

  },[location])
  const renderGroupsTypeItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => isIconCheckedOrNot({item, index})}>
      <View
        style={{
          width:'100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 15,
          alignSelf:'flex-start',
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
        if (item.value === strings.allType) {
          setSelectedSport({
            sport: strings.allType,
            sport_type: strings.allType,
          });
        } else {
            setSelectedSport(
            Utility.getSportObjectByName(item.value, authContext),
          );
        }
           setVisibleSportsModal(false);
      }
      }>
      <View
        style={{
          width:'100%',
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>
          {item.value}
        </Text>
        <View style={styles.checkbox}>
          {selectedSport?.sport.toLowerCase() === item.value.toLowerCase() ? (
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
      <Modal
        onBackdropPress={() => {setLocationFilterOpetion(lastSelection) ; setSettingPopup(false)}}
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
                  onPress={() => {{setLocationFilterOpetion(lastSelection) ; setSettingPopup(false)}}}
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
                      if(locationFilterOpetion === 0){
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
                          setLocationFilterOpetion(locationType.CURRENT_LOCATION)
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
                        setSettingPopup(false);
                        navigation.navigate('SearchCityScreen', {
                          comeFrom: 'RecruitingPlayerScreen',
                        });
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.searchCityContainer}>
                          <Text style={styles.searchCityText}>
                            {route?.params?.locationText ||
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
                      <Text style={styles.filterTitle}>
                        {strings.sportsEventsTitle}
                      </Text>
                    </View>
                    <View style={{marginTop: 10}}>
                    <View
                      style={[{
                        marginBottom: 10,
                        justifyContent: 'flex-start',
                      }, styles.sportsContainer]}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setVisibleSportsModal(true)
                        }}>
                        <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                        }}>
                        <View >
                          <Text style={styles.searchCityText}>
                            {selectedSport?.sport_name ?? strings.allType}
                          </Text>
                        </View>
                        <View style={{position:'absolute', right:10,top:-7, alignItems:'center', justifyContent:'center'}}>
                        <Icon size={24} color="black" name="chevron-down" />
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
        behavior='position'
          style={{
            width: '100%',
            height: Dimensions.get('window').height - 75,
            maxHeight:Dimensions.get('window').height - 75,
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
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {/* <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setVisibleSportsModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity> */}
            {/* <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {strings.sportsTitleText}
            </Text> */}

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.themeColor,
              }}></Text>
          </View>
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

  sportsContainer:{
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
  listItem: {
    // flexDirection: 'row',
    // marginLeft: widthPercentageToDP('10%'),
    // width: widthPercentageToDP('80%'),
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    width: 15,
    height: 15,
    marginLeft: 5,
    resizeMode: 'contain',
  },

});
