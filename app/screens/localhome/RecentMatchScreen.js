/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  TextInput,
} from 'react-native';
// import ActivityLoader from '../../components/loader/ActivityLoader';
// import AuthContext from '../../auth/context';
import Modal from 'react-native-modal';
import moment from 'moment';
import bodybuilder from 'bodybuilder';

// import { gameData } from '../../utils/constant';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { widthPercentageToDP } from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import TCThinDivider from '../../components/TCThinDivider';
import fonts from '../../Constants/Fonts';
import TCRecentMatchCard from '../../components/TCRecentMatchCard';
import { postElasticSearch } from '../../api/elasticSearch';
import strings from '../../Constants/String';
import DateTimePickerView from '../../components/Schedule/DateTimePickerModal';

export default function RecentMatchScreen({ navigation, route }) {
  // const [loading, setloading] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);
  const [recentMatch, setRecentMatch] = useState([]);

  const [pageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecord, setTotalRecord] = useState();

  const [location] = useState(route?.params?.location);
  const [selectedSport, setSelectedSport] = useState(
    route?.params?.selectedSport,
  );

  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(
    new Date().setMinutes(new Date().getMinutes() + 5),
  );

  const [fromPickerVisible, setFromPickerVisible] = useState(false);
  const [toPickerVisible, setToPickerVisible] = useState(false);
  // const authContext = useContext(AuthContext);

  useEffect(() => {
    const recentMatchbody = bodybuilder()
    .size(pageSize)
    .query('match', 'sport', selectedSport)
    .query('match', 'status', 'ended')
    .query('multi_match', {
      query: location,
      fields: ['city', 'country', 'state'],
    })
    .query('range', 'start_datetime', {
      lt: parseFloat(new Date().getTime() / 1000).toFixed(0),
    })
    .sort('actual_enddatetime', 'desc')
    .build();

    // const recentMatchbody = `{"size": 5,"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"match":{"status":"ended"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}},{"range":{"start_datetime":{"lt":${parseFloat(new Date().getTime() / 1000).toFixed(0)}}}}]}},"sort":[{"actual_enddatetime":"desc"}]}`

    postElasticSearch(recentMatchbody, 'gameindex/game')
      .then((res1) => {
        if (res1.hits.hits.length === 0) {
          setRecentMatch([]);
        } else {
          console.log('recent  API Response:=>', res1.hits.hits);
          console.log('Total record:=>', res1.hits.total.value);
          setTotalRecord(res1.hits.total.value);
          let entityArr = [];
          let recentArr = [];

          if (res1.hits) {
            const arr = [];
            res1.hits.hits.map((e) => {
              arr.push(e._source.away_team);
              arr.push(e._source.home_team);
            });
            const uniqueArray = [...new Set(arr)];
            entityArr = uniqueArray;
            recentArr = res1.hits.hits;
          }

          const ids = {
            query: {
              ids: {
                values: entityArr,
              },
            },
          };
          if (entityArr?.length > 0) {
            postElasticSearch(ids, 'entityindex/entity')
              .then((response) => {
                const arr = [];
                recentArr.map((e) => {
                  const obj = {
                    ...e._source,
                    home_team: response.hits.hits.find(
                      (x) => x._source.group_id === e._source.home_team,
                    ),
                    away_team: response.hits.hits.find(
                      (x) => x._source.group_id === e._source.away_team,
                    ),
                  };

                  arr.push(obj);
                });

                setRecentMatch(arr);

                console.log(' USER response.hits.hits:=>', arr);
              })
              .catch((e) => {
                setTimeout(() => {
                  Alert.alert(strings.alertmessagetitle, e.message);
                }, 10);
              });
          }
        }
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [location, pageSize, selectedSport]);

  const handleLoadMore = () => {
    console.log('Page Size:', pageSize);
    console.log('Page Number:', pageNumber);
    console.log('Total:', totalRecord);
    const recentMatchbody = bodybuilder()
    .size(pageSize)
    .from((pageNumber * pageSize))
    .query('match', 'sport', selectedSport)
    .query('match', 'status', 'ended')
    .query('multi_match', {
      query: location,
      fields: ['city', 'country', 'state'],
    })
    .query('range', 'start_datetime', {
      lt: parseFloat(new Date().getTime() / 1000).toFixed(0),
    })
    .sort('actual_enddatetime', 'desc')
    .build();

    setPageNumber(pageNumber + 1);
    // const recentMatchbody = `{"size": 5,"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"match":{"status":"ended"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}},{"range":{"start_datetime":{"lt":${parseFloat(new Date().getTime() / 1000).toFixed(0)}}}}]}},"sort":[{"actual_enddatetime":"desc"}]}`
    if (pageNumber < 1) {
      setRecentMatch([]);
    }

    postElasticSearch(recentMatchbody, 'gameindex/game')
      .then((res1) => {
        console.log('recent  API Response:=>', res1.hits.hits);
        console.log('Total record:=>', res1.hits.total.value);
        setTotalRecord(res1.hits.total.value);
        let entityArr = [];
        let recentArr = [];

        if (res1.hits) {
          const arr = [];
          res1.hits.hits.map((e) => {
            arr.push(e._source.away_team);
            arr.push(e._source.home_team);
          });
          const uniqueArray = [...new Set(arr)];
          entityArr = uniqueArray;
          recentArr = res1.hits.hits;
        }

        const ids = {
          query: {
            ids: {
              values: entityArr,
            },
          },
        };
        if (entityArr?.length > 0) {
          postElasticSearch(ids, 'entityindex/entity')
            .then((response) => {
              const arr = [];
              recentArr.map((e) => {
                const obj = {
                  ...e._source,
                  home_team: response.hits.hits.find(
                    (x) => x._source.group_id === e._source.home_team,
                  ),
                  away_team: response.hits.hits.find(
                    (x) => x._source.group_id === e._source.away_team,
                  ),
                };

                arr.push(obj);
              });

              setRecentMatch(recentMatch.concat(arr));

              console.log(
                ' USER response.hits.hits:=>',
                recentMatch.concat(arr),
              );
            })
            .catch((e) => {
              setTimeout(() => {
                Alert.alert(strings.alertmessagetitle, e.message);
              }, 10);
            });
        }
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const renderRecentMatchItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCRecentMatchCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );

  const renderSports = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setSelectedSport(item?.sport_name);
        setVisibleSportsModal(false);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.sport_name}</Text>
        <View style={styles.checkbox}>
          {selectedSport === item?.sport_name ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const onFromDone = (date) => {
    setFrom(date.getTime());
    if (new Date(to) < new Date(from)) {
      setTo(date.getTime());
    }

    setFromPickerVisible(false);
  };

  const onToDone = (date) => {
    console.log('To Date:=>', date);
    setTo(date.getTime());
    if (new Date(to) < new Date(from)) {
      setFrom(date.getTime());
    }

    setToPickerVisible(false);
  };

  const handleCancelPress = () => {
    setFromPickerVisible(false);
    setToPickerVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchView}>
        <TouchableOpacity
          style={styles.searchViewContainer}
          onPress={() => setVisibleSportsModal(true)}>
          <Text>{selectedSport}</Text>
          <Image source={images.arrowDown} style={styles.arrowStyle} />
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
          <Image source={images.homeSetting} style={styles.settingImage} />
        </TouchableWithoutFeedback>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={recentMatch}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRecentMatchItems}
        style={styles.listViewStyle}
        scrollEnabled={true}
        // onScroll={onScroll}
        onScrollEndDrag={handleLoadMore}
      />
      {/* <SectionList
        sections={[
          {
            title: 'Today',
            data: upcomingMatch?.filter((obj) => {
              const date = new Date();
              date.setHours(0, 0, 0, 0);

              const start = new Date(obj?._source?.start_datetime * 1000);
              start.setHours(0, 0, 0, 0);

              return start.getTime() === date.getTime();
          }),

            // upcomingMatch?.filter((obj) => obj._source.start_datetime === new Date().getTime() / 1000),
            // [{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }],
          },
          {
            title: 'Tomorrow',
            data: upcomingMatch?.filter((obj) => {
              const date = new Date();
              date.setDate(date.getDate() + 1);
              date.setHours(0, 0, 0, 0);

              const tomorrow = new Date(obj?._source?.start_datetime * 1000);
              tomorrow.setHours(0, 0, 0, 0);

              return tomorrow.getTime() === date.getTime();
          }),
          },
          {
            title: 'Future',
            data: upcomingMatch?.filter((obj) => {
              const dt = new Date();
              dt.setHours(0, 0, 0, 0);

              const start = new Date(obj?._source?.start_datetime * 1000);
              start.setHours(0, 0, 0, 0);

              const date = new Date();
              date.setDate(date.getDate() + 1);
              date.setHours(0, 0, 0, 0);

              const tomorrow = new Date(obj?._source?.start_datetime * 1000);
              tomorrow.setHours(0, 0, 0, 0);

              return start.getTime() !== dt.getTime() && tomorrow.getTime() !== date.getTime();
          }),
          },
        ]}
        renderItem={renderRecentMatchItems}
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={({ section }) => (
          section.data.length > 0 ? <Text style={styles.sectionHeader}>{section.title}</Text> : null
        )}
      /> */}
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
                if (new Date(from).getTime() > new Date(to).getTime()) {
                  Alert.alert('From date should be less than to date.')
                } else {
                  setSettingPopup(false);
                  let recentMatchBody = ''
                  if (locationFilterOpetion === 0) {
                    recentMatchBody = bodybuilder()
                    .size(pageSize)
                    .query('match', 'sport', selectedSport)
                    .query('match', 'status', 'ended')
                    .query('range', 'start_datetime', {
                      gt: parseFloat(new Date(from).getTime() / 1000).toFixed(0),
                    })
                    .query('range', 'start_datetime', {
                      lt: parseFloat(new Date(to).getTime() / 1000).toFixed(0),
                    })
                    .sort('actual_enddatetime', 'desc')
                    .build();
                  } else {
                    recentMatchBody = bodybuilder()
                    .size(pageSize)
                    .query('match', 'sport', selectedSport)
                    .query('match', 'status', 'ended')
                    .query('multi_match', {
                      query: location,
                      fields: ['city', 'country', 'state'],
                    })
                    .query('range', 'start_datetime', {
                      gt: parseFloat(new Date(from).getTime() / 1000).toFixed(0),
                    })
                    .query('range', 'start_datetime', {
                      lt: parseFloat(new Date(to).getTime() / 1000).toFixed(0),
                    })
                    .sort('actual_enddatetime', 'desc')
                    .build();
                  }

                  // const recentMatchbody = `{"size": 5,"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"match":{"status":"ended"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}},{"range":{"start_datetime":{"lt":${parseFloat(new Date().getTime() / 1000).toFixed(0)}}}}]}},"sort":[{"actual_enddatetime":"desc"}]}`

                  postElasticSearch(recentMatchBody, 'gameindex/game')
                    .then((res1) => {
                      if (res1.hits.hits.length === 0) {
                        setRecentMatch([]);
                      } else {
                        console.log('recent  API Response:=>', res1.hits.hits);
                        console.log('Total record:=>', res1.hits.total.value);
                        setTotalRecord(res1.hits.total.value);
                        let entityArr = [];
                        let recentArr = [];

                        if (res1.hits) {
                          const arr = [];
                          res1.hits.hits.map((e) => {
                            arr.push(e._source.away_team);
                            arr.push(e._source.home_team);
                          });
                          const uniqueArray = [...new Set(arr)];
                          entityArr = uniqueArray;
                          recentArr = res1.hits.hits;
                        }

                        const ids = {
                          query: {
                            ids: {
                              values: entityArr,
                            },
                          },
                        };
                        if (entityArr?.length > 0) {
                          postElasticSearch(ids, 'entityindex/entity')
                            .then((response) => {
                              const arr = [];
                              recentArr.map((e) => {
                                const obj = {
                                  ...e._source,
                                  home_team: response.hits.hits.find(
                                    (x) => x._source.group_id === e._source.home_team,
                                  ),
                                  away_team: response.hits.hits.find(
                                    (x) => x._source.group_id === e._source.away_team,
                                  ),
                                };

                                arr.push(obj);
                              });

                              setRecentMatch(arr);

                              console.log(' USER response.hits.hits:=>', arr);
                            })
                            .catch((e) => {
                              setTimeout(() => {
                                Alert.alert(strings.alertmessagetitle, e.message);
                              }, 10);
                            });
                        }
                      }
                    })
                    .catch((e) => {
                      setTimeout(() => {
                        Alert.alert(strings.alertmessagetitle, e.message);
                      }, 10);
                    });
                }
              }}>
              {'Apply'}
            </Text>
          </View>
          <TCThinDivider width={'100%'} marginBottom={15} />
          <View>
            <View style={{ flexDirection: 'row', margin: 15 }}>
              <View style={{ flex: 0.2 }}>
                <Text style={styles.filterTitle}>Location</Text>
              </View>
              <View style={{ marginLeft: 15, flex: 0.8 }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <TouchableWithoutFeedback
                    onPress={() => setLocationFilterOpetion(0)}>
                    <Image
                      source={
                        locationFilterOpetion === 0
                          ? images.checkRoundOrange
                          : images.radioUnselect
                      }
                      style={styles.radioButtonStyle}
                    />
                  </TouchableWithoutFeedback>

                  <Text style={styles.filterTitle}>World</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableWithoutFeedback
                    onPress={() => setLocationFilterOpetion(1)}
                    style={{ alignSelf: 'center' }}>
                    <Image
                      source={
                        locationFilterOpetion === 1
                          ? images.checkRoundOrange
                          : images.radioUnselect
                      }
                      style={styles.radioButtonStyle}
                    />
                  </TouchableWithoutFeedback>

                  {/* <TCTextField
                    value={location}
                    style={{ marginLeft: 0, marginRight: 0 }}
                    textStyle={styles.fieldTitle}
                    placeholder={'Country, State or City '}
                    editable={false}
                    pointerEvents="none"
                  /> */}
                  <TouchableOpacity
                    onPress={() => {
                      console.log('OK');
                      navigation.navigate('SearchCityScreen', {
                        comeFrom: 'UpcomingMatchScreen',
                      });
                    }}
                    style={[
                      styles.textContainer,
                      { marginLeft: 0, marginRight: 0, height: 40 },
                    ]}>
                    <TextInput
                      style={[styles.textInput, styles.fieldTitle]}
                      placeholder={'Country, State or City '}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                  style={{ marginLeft: 0, marginRight: 0 }}
                  onPress={() => {
                    setLocationPopup(false);
                    navigation.navigate('SearchCityScreen', { comeFrom: 'LocalHomeScreen' });
                  }}>
                  <Text style={styles.fieldTitle}>{strings.searchTitle}</Text>
                </TouchableOpacity> */}
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', margin: 15 }}>
              <View style={{ flex: 0.2 }}>
                <Text style={styles.filterTitle}>Time</Text>
              </View>
              <View style={{ marginLeft: 15, flex: 0.8 }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <TouchableOpacity
                    style={styles.fieldView}
                    onPress={() => {
                      setFromPickerVisible(true);
                      setToPickerVisible(false);
                    }}>
                    <View
                      style={{
                        height: 35,
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.fieldTitle} numberOfLines={1}>
                        From
                      </Text>
                    </View>
                    <View style={{ marginRight: 15, flexDirection: 'row' }}>
                      <Text style={styles.fieldValue} numberOfLines={1}>
                        {' '}
                        {from
                          ? moment(new Date(from)).format(
                              'MMM DD, yyyy hh:mm a',
                            )
                          : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={styles.fieldView}
                    onPress={() => {
                      setFromPickerVisible(false);
                      setToPickerVisible(true);
                    }}>
                    <View
                      style={{
                        height: 35,
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.fieldTitle} numberOfLines={1}>
                        To
                      </Text>
                    </View>
                    <View style={{ marginRight: 15, flexDirection: 'row' }}>
                      <Text style={styles.fieldValue} numberOfLines={1}>
                        {to
                          ? moment(new Date(to)).format('MMM DD, yyyy hh:mm a')
                          : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.RLight,
                    color: colors.lightBlackColor,
                    textAlign: 'right',
                    marginTop: 10,
                  }}>
                  Time zone{' '}
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.RRegular,
                      color: colors.lightBlackColor,
                      textDecorationLine: 'underline',
                    }}>
                    Vancouver
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.resetButton} onPress={() => {}}>
            <Text style={styles.resetTitle}>Reset</Text>
          </TouchableOpacity>
        </View>
        <DateTimePickerView
          title={'Choose a Date & Time'}
          date={new Date(from)}
          visible={fromPickerVisible}
          onDone={onFromDone}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}

           maximumDate={new Date()}
          // minutesGap={5}
          mode={'datetime'}
          style={{ zIndex: 100 }}
        />
        <DateTimePickerView
          title={'Choose a Date & Time'}
          date={new Date(to)}
          visible={toPickerVisible}
          onDone={onToDone}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
            minimumDate={new Date(from)}
           maximumDate={new Date()}
          // minutesGap={5}
          mode={'datetime'}
        />
      </Modal>

      {/* Sports modal */}
      <Modal
        isVisible={visibleSportsModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleSportsModal(false)}
        onRequestClose={() => setVisibleSportsModal(false)}
        backdropOpacity={0}
        style={{
          margin: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisibleSportsModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              Sports
            </Text>

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
            data={route?.params?.sports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
          />
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  arrowStyle: {
    height: 8.5,
    width: 15,
    resizeMode: 'contain',
    // alignSelf: 'flex-end',
  },
  searchViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    width: widthPercentageToDP('85%'),
    borderRadius: 20,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    backgroundColor: colors.offwhite,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  settingImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  searchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  fieldView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    height: 40,
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RLight,
    marginLeft: 10,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
  resetButton: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    height: 30,
    width: 113,
    shadowOpacity: 0.16,
    shadowColor: colors.googleColor,
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

  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginRight: 15,
  },

  filterTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
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
  // sectionHeader: {
  //   fontSize: 20,
  //   fontFamily: fonts.RRegular,
  //   color: colors.lightBlackColor,
  //   marginLeft: 15,
  //   marginBottom: 8,
  //   marginTop: 8,
  // },
  // headerLeftImg: {
  //   tintColor: colors.lightBlackColor,
  //   height: 22,
  //   marginLeft: 15,
  //   resizeMode: 'contain',
  //   width: 12,
  // },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  textContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignContent: 'center',
    marginHorizontal: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 2,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
    flex: 1,
  },
  textInput: {
    height: '100%',
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,
  },
});
