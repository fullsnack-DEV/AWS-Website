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
import bodybuilder from 'bodybuilder';

// import { gameData } from '../../utils/constant';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { widthPercentageToDP } from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import TCThinDivider from '../../components/TCThinDivider';
import fonts from '../../Constants/Fonts';
import TCHiringPlayersCard from '../../components/TCHiringPlayersCard';
import { getGroupIndex } from '../../api/elasticSearch';
import strings from '../../Constants/String';

let stopFetchMore = true;

export default function HiringPlayerScreen({ navigation, route }) {
  // const [loading, setloading] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);
  const [hiringPlayerMatch, setHiringPlayerMatch] = useState([]);

  const [pageSize] = useState(1);
  const [pageFrom, setPageFrom] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);

  const [location] = useState(route?.params?.location);
  const [selectedSport, setSelectedSport] = useState(route?.params?.sport);

  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  // const authContext = useContext(AuthContext);

  useEffect(() => {
    getHiringList();
  }, []);

  const getHiringList = () => {
    console.log('pageSize', pageSize);
    console.log('pageFrom', pageFrom);
    const locationFilter = bodybuilder()
      .filter('multi_match', {
        query: location,
        fields: ['city', 'country', 'state'],
      })
      .build();

    // Hiring player query
    const hiringPlayersList = bodybuilder()
      .filter('match', 'entity_type', 'team')
      .filter('match', 'hiringPlayers', true)
      .filter('term', 'sport.keyword', {
        value: selectedSport.toLowerCase(),
        case_insensitive: true,
      })
      .build();
    let hiringPlayerFilter = {
      ...hiringPlayersList.query.bool,
    };
    if (location !== 'world') {
      hiringPlayerFilter = {
        ...locationFilter.query.bool,
      };
    }
    const hiringPlayerQuery = bodybuilder()
    .size(pageSize)
      .from(pageFrom)
      .andFilter('bool', hiringPlayerFilter)
      .build();
    // Hiring player query
    getGroupIndex(hiringPlayerQuery)
      .then((res) => {
        if (res.length > 0) {
          const fetchedData = [...hiringPlayerMatch, ...res];
          setHiringPlayerMatch(fetchedData);
          setPageFrom(pageFrom + pageSize);
          stopFetchMore = true;
        }
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const handleLoadMore = () => {
    console.log('handal called');
    setLoadMore(true);
    if (!stopFetchMore) {
      getHiringList();
      stopFetchMore = true;
    }
    setLoadMore(false);
  };

  const renderRecentMatchItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCHiringPlayersCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );

  const renderSports = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setSelectedSport(item?.sport_name);

        // setUpcomingMatch([]);

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

  const keyExtractor = useCallback((item, index) => index.toString(), []);

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
        data={hiringPlayerMatch}
        keyExtractor={keyExtractor}
        renderItem={renderRecentMatchItems}
        style={styles.listViewStyle}
        contentContainerStyle={{ flex: 1 }}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
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
                let challengeeBody = '';
                if (locationFilterOpetion === 0) {
                  challengeeBody = bodybuilder()
                    .size(pageSize)
                    .query('match', 'entity_type', 'team')
                    .query('match', 'hiringPlayers', true)
                    .query('match', 'sport', selectedSport)
                    .build();
                } else {
                  challengeeBody = bodybuilder()
                    .size(pageSize)
                    .query('match', 'entity_type', 'team')
                    .query('match', 'hiringPlayers', true)
                    .query('match', 'sport', selectedSport)
                    .query('multi_match', {
                      query: location,
                      fields: ['city', 'country', 'state'],
                    })
                    .build();
                }

                // const recentMatchbody = `{"size": 5,"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"match":{"status":"ended"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}},{"range":{"start_datetime":{"lt":${parseFloat(new Date().getTime() / 1000).toFixed(0)}}}}]}},"sort":[{"actual_enddatetime":"desc"}]}`

                getGroupIndex(challengeeBody)
                  .then((res) => {
                    if (res.length === 0) {
                      setHiringPlayerMatch([]);
                    } else {
                      console.log('hiringplayer  API Response:=>', res);
                      console.log('Total record:=>', res);

                      if (res.length > 0) {
                        setHiringPlayerMatch(res);
                      }
                    }
                  })
                  .catch((e) => {
                    setTimeout(() => {
                      Alert.alert(strings.alertmessagetitle, e.message);
                    }, 10);
                  });
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
                        comeFrom: 'LookingForChallengeScreen',
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
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity style={styles.resetButton} onPress={() => {}}>
            <Text style={styles.resetTitle}>Reset</Text>
          </TouchableOpacity>
        </View>
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
  listViewStyle: {
    flex: 1,
    padding: 15,
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

  fieldTitle: {
    fontSize: 16,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RLight,
    marginLeft: 10,
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
