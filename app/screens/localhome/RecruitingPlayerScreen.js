/* eslint-disable array-callback-return */
import React, {
 useCallback, useState, useEffect, useContext,
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
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';

import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';
import FastImage from 'react-native-fast-image';
import AuthContext from '../../auth/context';

import { getLocationNameWithLatLong } from '../../api/External';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import { widthPercentageToDP } from '../../utils';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';

import strings from '../../Constants/String';
import { getEntityIndex } from '../../api/elasticSearch';
import TCTagsFilter from '../../components/TCTagsFilter';
import TCPicker from '../../components/TCPicker';
import TCRecruitingPlayers from '../../components/TCRecruitingPlayers';
import { groupsType } from '../../utils/constant';

let stopFetchMore = true;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

export default function RecruitingPlayerScreen({ navigation, route }) {
  // const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState(route?.params?.filters);

  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);

  const [sports, setSports] = useState([]);

  const [recruitingPlayer, setRecruitingPlayer] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const [groups, setGroups] = useState(groupsType);

  const [searchData, setSearchData] = useState();
  const [selectedSport, setSelectedSport] = useState(
    route?.params?.filters.sport,
  );
  const [location, setLocation] = useState(route?.params?.filters.location);

  const { sportsList } = route?.params ?? {};

  console.log('Recruiting Player Filter:=>', filters);

  useEffect(() => {
    groups.forEach((x, i) => {
      if (x.type === 'Teams') {
        groups[i].isChecked = true;
      } else if (x.type === 'Clubs') {
        groups[i].isChecked = true;
      } else if (x.type === 'Leagues') {
        groups[i].isChecked = true;
      }
      setGroups([...groups]);
    });
    if (route?.params?.locationText) {
      setSettingPopup(true);
      setTimeout(() => {
        setLocation(route?.params?.locationText);
        // setFilters({
        //   ...filters,
        //   location: route?.params?.locationText,
        // });
      }, 10);
      // navigation.setParams({ locationText: null });
    }
  }, [route?.params?.locationText]);
  useEffect(() => {
    const list = [
      {
        label: 'All',
        value: 'All',
      },
    ];
    sportsList.map((obj) => {
      const dataSource = {
        label: obj.sport_name,
        value: obj.sport_name,
      };
      list.push(dataSource);
    });

    setSports(list);
  }, [sportsList]);

  const getRecruitingPlayer = useCallback(
    (filerdata) => {
      // Looking Challengee query
      const recruitingPlayersQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [{ match: { hiringPlayers: true } }],
          },
        },
      };

      if (filerdata.location !== 'world') {
        recruitingPlayersQuery.query.bool.must.push({
          multi_match: {
            query: filerdata.location.toLowerCase(),
            fields: ['city', 'country', 'state'],
          },
        });
      }
      if (filerdata.sport !== 'All') {
        recruitingPlayersQuery.query.bool.must.push({
          term: {
            'sport.keyword': {
              value: filerdata.sport.toLowerCase(),
              case_insensitive: true,
            },
          },
        });
      }

      console.log('filters::1::=>', filerdata);
      const types = [];
      if (filerdata.groupTeam) {
        types.push('team');
      } if (filerdata.groupClub) {
        types.push('club');
      } if (filerdata.groupLeague) {
        types.push('league');
      }
      if (types.length > 0) {
        recruitingPlayersQuery.query.bool.must.push({
          terms: {
            entity_type: [...types],
          },
        });
      }

      console.log(
        'Recruiting player  match Query:=>',
        JSON.stringify(recruitingPlayersQuery),
      );
      // Looking Challengee query

      getEntityIndex(recruitingPlayersQuery)
        .then((entity) => {
          if (entity.length > 0) {
            const fetchedData = [...recruitingPlayer, ...entity];
            setRecruitingPlayer(fetchedData);
            setSearchData(fetchedData);
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
    ({ item }) => (
      <View style={[styles.separator, { flex: 1 }]}>
        <TCRecruitingPlayers
          data={item}
          entityType={item.entity_type}
          selectedSport={selectedSport}
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
  const handleTagPress = ({ item }) => {
    const tempFilter = filters;
    Object.keys(tempFilter).forEach((key) => {
      if (key === Object.keys(item)[0]) {
        if (Object.keys(item)[0] === 'sport') {
          tempFilter.sport = 'All';
          delete tempFilter.gameFee;
          setSelectedSport('All');
        }
        if (Object.keys(item)[0] === 'location') {
          tempFilter.location = 'world';
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

    const temp = []
    groups.forEach((x) => {
      console.log('x.type === item.type', x.type, item.groupClub || item.groupTeam || item.groupLeague);
      if (x.type === (item.groupClub || item.groupTeam || item.groupLeague)) {
        const obj = {
          type: x.type,
          isChecked: false,
        }
      temp.push(obj)
      } else {
       temp.push(x)
      }
    });
    setGroups([...temp]);

    console.log('Groups::=>', temp);
    // applyFilter();
    setTimeout(() => {
      setFilters({ ...tempFilter });

      setPageFrom(0);
      setRecruitingPlayer([]);
      applyFilter(tempFilter);
    }, 10);
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Lat/long to position::=>', position);
        // const position = { coords: { latitude: 49.11637199697782, longitude: -122.7776695216056 } }
        getLocationNameWithLatLong(
          position.coords.latitude,
          position.coords.longitude,
          authContext,
        ).then((res) => {
          console.log(
            'Lat/long to address::=>',
            res.results[0].address_components,
          );
          let city;
          res.results[0].address_components.map((e) => {
            if (e.types.includes('administrative_area_level_2')) {
              city = e.short_name;
            }
          });
          console.log(
            'Location:=>',
            city.charAt(0).toUpperCase() + city.slice(1),
          );
          setLocation(city.charAt(0).toUpperCase() + city.slice(1));
          // setFilters({
          //   ...filters,
          //   location: city.charAt(0).toUpperCase() + city.slice(1),
          // });
        });
        console.log(position.coords.latitude);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const applyFilter = useCallback((fil) => {
    getRecruitingPlayer(fil);
  }, []);

  const listEmptyComponent = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        No Teams Or Player
      </Text>
    </View>
  );
  const searchFilterFunction = (text) => {
    const result = recruitingPlayer.filter(
      (x) => x?.full_name?.toLowerCase().includes(text?.toLowerCase())
        || x?.city?.toLowerCase().includes(text?.toLowerCase())
        || x?.group_name?.toLowerCase().includes(text?.toLowerCase()),
    );
    if (text.length > 0) {
      setRecruitingPlayer(result);
    } else {
      setRecruitingPlayer(searchData);
    }
  };

  const onPressReset = () => {
    setFilters({
      location: 'world',
      sport: 'All',
    });
    setSelectedSport('All');
  };
  const isIconCheckedOrNot = useCallback(
    ({ item, index }) => {
      if (item.isChecked) {
        groups[index].isChecked = false;
      } else {
        groups[index].isChecked = true;
      }

      setGroups([...groups]);
      const selectedGroups = groups.filter((e) => e.isChecked);
      console.log('selectedGroups', selectedGroups);
    },
    [groups],
  );
  const renderGroupsTypeItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => isIconCheckedOrNot({ item, index })}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 15,
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

  return (
    <View>
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
          <TextInput
            placeholder={strings.searchText}
            style={styles.searchTxt}
            onChangeText={(text) => {
              searchFilterFunction(text);
            }}
            // value={search}
          />
          <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
            <Image source={images.homeSetting} style={styles.settingImage} />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <TCTagsFilter
        dataSource={Utility.getFiltersOpetions(filters)}
        onTagCancelPress={handleTagPress}
      />
      <FlatList
        extraData={recruitingPlayer}
        showsHorizontalScrollIndicator={false}
        data={recruitingPlayer}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        renderItem={renderRecruitingPlayerListView}
        style={styles.listStyle}
        contentContainerStyle={{ paddingBottom: 1 }}
        onEndReached={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
      />
      <Modal
        onBackdropPress={() => setSettingPopup(false)}
        backdropOpacity={1}
        animationType="slide"
        hasBackdrop
        style={{
          flex: 1,
          margin: 0,
          backgroundColor: colors.blackOpacityColor,
        }}
        visible={settingPopup}>
        <View
          style={[
            styles.bottomPopupContainer,
            { height: Dimensions.get('window').height - 100 },
          ]}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <ScrollView style={{ flex: 1 }}>
              <View style={styles.viewsContainer}>
                <Text
                  onPress={() => setSettingPopup(false)}
                  style={styles.cancelText}>
                  Cancel
                </Text>
                <Text style={styles.locationText}>Filter</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                      setSettingPopup(false);
                      setTimeout(() => {
                        const tempFilter = { ...filters };
                        tempFilter.sport = selectedSport;
                        tempFilter.location = location;

                        if (
                          groups.filter(
                            (obj) => obj.type === 'Teams' && obj.isChecked,
                          ).length > 0
                        ) {
                          tempFilter.groupTeam = 'Teams';
                        } else {
                          delete tempFilter.groupTeam;
                        }
                        if (
                          groups.filter(
                            (obj) => obj.type === 'Clubs' && obj.isChecked,
                          ).length > 0
                        ) {
                          tempFilter.groupClub = 'Clubs';
                        } else {
                          delete tempFilter.groupClub;
                        }
                        if (
                          groups.filter(
                            (obj) => obj.type === 'Leagues' && obj.isChecked,
                          ).length > 0
                        ) {
                          tempFilter.groupLeague = 'Leagues';
                        } else {
                          delete tempFilter.groupLeague;
                        }
                        console.log('tempFilter', tempFilter);

                        setFilters({
                          ...tempFilter,
                        });
                        setPageFrom(0);
                        setRecruitingPlayer([]);
                        applyFilter(tempFilter);
                      }, 100);
                      console.log('DONE::');
                  }}>
                  {'Apply'}
                </Text>
              </View>
              <TCThinDivider width={'100%'} marginBottom={15} />
              <View>
                <View style={{ flexDirection: 'column', margin: 15 }}>
                  <View>
                    <Text style={styles.filterTitle}>Location</Text>
                  </View>
                  <View style={{ marginTop: 10, marginLeft: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>World</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(0);
                          setLocation('world');
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
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.filterTitle}>Home City</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(1);
                          setLocation(
                            authContext?.entity?.obj?.city
                              .charAt(0)
                              .toUpperCase()
                              + authContext?.entity?.obj?.city.slice(1),
                          );
                          // setFilters({
                          //   ...filters,
                          //   location:
                          //     authContext?.entity?.obj?.city
                          //       .charAt(0)
                          //       .toUpperCase()
                          //     + authContext?.entity?.obj?.city.slice(1),
                          // });
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
                      <Text style={styles.filterTitle}>Current City</Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setLocationFilterOpetion(2);
                          getLocation();
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

                    <TouchableWithoutFeedback
                      onPress={() => {
                        setLocationFilterOpetion(3);
                        setSettingPopup(false);
                        navigation.navigate('SearchCityScreen', {
                          comeFrom: 'LookingForChallengeScreen',
                        });
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        {/* <TCSearchCityView
                      getCity={(value) => {
                        console.log('Value:=>', value);
                        setSelectedCity(value);
                      }}
                      // value={selectedCity}
                    /> */}

                        <View style={styles.searchCityContainer}>
                          <Text style={styles.searchCityText}>
                            {route?.params?.locationText || 'Search City'}
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
                      <Text style={styles.filterTitle}>Sport</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <TCPicker
                        dataSource={sports}
                        placeholder={'Select Sport'}
                        onValueChange={(value) => {
                          setSelectedSport(value);
                        }}
                        value={selectedSport}
                      />
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'column', margin: 15 }}>
                  <View>
                    <Text style={styles.filterTitle}>Groups</Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                      <FlatList
                        data={groups}
                        keyExtractor={keyExtractor}
                        renderItem={renderGroupsTypeItem}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ flex: 1 }} />
            </ScrollView>
          </KeyboardAvoidingView>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                'Are you sure want to reset filters?',
                '',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => onPressReset(),
                  },
                ],
                { cancelable: false },
              );
            }}>
            <Text style={styles.resetTitle}>Reset</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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
    shadowOffset: { width: 0, height: 2 },
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
        shadowOffset: { width: 0, height: 3 },
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
    shadowOffset: { width: 0, height: 5 },
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
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    width: widthPercentageToDP('75%'),
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
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
    width: widthPercentageToDP('90%'),
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
});
