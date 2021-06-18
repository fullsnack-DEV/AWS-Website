/* eslint-disable no-unused-vars */
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
import RNPickerSelect from 'react-native-picker-select';
import { widthPercentageToDP } from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import TCThinDivider from '../../components/TCThinDivider';
import fonts from '../../Constants/Fonts';
import TCChallengerCard from '../../components/TCChallengerCard';
import { postElasticSearch } from '../../api/elasticSearch';
import strings from '../../Constants/String';
import DateTimePickerView from '../../components/Schedule/DateTimePickerModal';

export default function LookingForChallengeScreen({ navigation, route }) {
  // const [loading, setloading] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);
  const [challengeeMatch, setChallengeeMatch] = useState([]);

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

  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [minAgeValue, setMinAgeValue] = React.useState([]);
  const [maxAgeValue, setMaxAgeValue] = React.useState([]);
  const [secureLocation, setSecureLocation] = useState(0);

  // const authContext = useContext(AuthContext);

  useEffect(() => {
    // ,{"match":{"sport":"${selectedSport}"}}]}}}`

    const challengeeBody = bodybuilder()
      .size(pageSize)
      .query('match', 'entity_type', 'team')
      .query('match', 'sport', selectedSport)
      .query('multi_match', {
        query: location,
        fields: ['city', 'country', 'state'],
      })
      .build();

    // const recentMatchbody = `{"size": 5,"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"match":{"status":"ended"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}},{"range":{"start_datetime":{"lt":${parseFloat(new Date().getTime() / 1000).toFixed(0)}}}}]}},"sort":[{"actual_enddatetime":"desc"}]}`

    postElasticSearch(challengeeBody, 'entityindex/entity')
      .then((res1) => {
        if (res1.hits.hits.length === 0) {
          setChallengeeMatch([]);
        } else {
          console.log('challengee  API Response:=>', res1.hits.hits);
          console.log('Total record:=>', res1.hits.total.value);
          setTotalRecord(res1.hits.total.value);

            setChallengeeMatch(res1.hits.hits)
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

    const challengeeBody = bodybuilder()
    .size(pageSize)
    .from(pageNumber * pageSize)
    .query('match', 'entity_type', 'team')
    .query('match', 'sport', selectedSport)
    .query('multi_match', {
      query: location,
      fields: ['city', 'country', 'state'],
    })
    .build();

    setPageNumber(pageNumber + 1);
    // const recentMatchbody = `{"size": 5,"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"match":{"status":"ended"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}},{"range":{"start_datetime":{"lt":${parseFloat(new Date().getTime() / 1000).toFixed(0)}}}}]}},"sort":[{"actual_enddatetime":"desc"}]}`
    if (pageNumber < 1) {
      setChallengeeMatch([]);
    }

    postElasticSearch(challengeeBody, 'gameindex/game')
      .then((res1) => {
        console.log('upcoming  API Response:=>', res1.hits.hits);
        console.log('Total record:=>', res1.hits.total.value);
        setTotalRecord(res1.hits.total.value);

        if (res1.hits.hits.length > 0) {
          setChallengeeMatch(challengeeMatch.concat(res1.hits.hits));
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
        <TCChallengerCard data={item._source} cardWidth={'92%'} />
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
        data={challengeeMatch}
        keyExtractor={keyExtractor}
        renderItem={renderRecentMatchItems}
        style={styles.listViewStyle}
        scrollEnabled={true}
          // onScroll={onScroll}
          onScrollEndDrag={handleLoadMore}
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
                if (new Date(from).getTime() > new Date(to).getTime()) {
                  Alert.alert('From date should be less than to date.')
                } else {
                  setSettingPopup(false);
                  let challengeeBody = ''
                  if (locationFilterOpetion === 0) {
                     challengeeBody = bodybuilder()
                    .size(pageSize)
                    .query('match', 'entity_type', 'team')
                    .query('match', 'sport', selectedSport)
                    .query('range', 'start_datetime', {
                      gt: parseFloat(new Date(from).getTime() / 1000).toFixed(0),
                    })
                    .query('range', 'start_datetime', {
                      lt: parseFloat(new Date(to).getTime() / 1000).toFixed(0),
                    })
                    .build();
                  } else {
                    challengeeBody = bodybuilder()
                    .size(pageSize)
                    .query('match', 'sport', selectedSport)
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

                    .build();
                  }

                  // const recentMatchbody = `{"size": 5,"query":{"bool":{"must":[{"match":{"sport":"${selectedSport}"}},{"match":{"status":"ended"}},{"multi_match":{"query":"${location}","fields":["city","country","state"]}},{"range":{"start_datetime":{"lt":${parseFloat(new Date().getTime() / 1000).toFixed(0)}}}}]}},"sort":[{"actual_enddatetime":"desc"}]}`

                  postElasticSearch(challengeeBody, 'gameindex/game')
                    .then((res1) => {
                      if (res1.hits.hits.length === 0) {
                        setChallengeeMatch([]);
                      } else {
                        console.log('upcoming  API Response:=>', res1.hits.hits);
                        console.log('Total record:=>', res1.hits.total.value);
                        setTotalRecord(res1.hits.total.value);

                        if (res1.hits.hits.length > 0) {
                          setChallengeeMatch(res1.hits.hits);
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

          <View style={{ marginBottom: 15 }}>
            <View
               style={{
                 flexDirection: 'row',
                 margin: 15,
                 justifyContent: 'space-between',
               }}>
              <View style={{ flex: 0.2 }}>
                <Text style={styles.filterTitle}>TC Level</Text>
              </View>
              <View style={{ marginLeft: 15, flex: 0.6 }}>
                <View
                   style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     flex: 1,
                   }}>
                  <RNPickerSelect
                     placeholder={{
                       label: strings.minPlaceholder,
                       value: 0,
                     }}
                     items={minAgeValue}
                     onValueChange={(value) => {
                       setMinAge(value);
                     }}
                     useNativeAndroidPickerStyle={false}
                     style={{
                       ...(Platform.OS === 'ios'
                         ? styles.inputIOS
                         : styles.inputAndroid),
                       ...styles,
                     }}
                     value={minAge}
                     Icon={() => (
                       <Image
                         source={images.dropDownArrow}
                         style={styles.miniDownArrow}
                       />
                     )}
                   />
                  <RNPickerSelect
                     placeholder={{
                       label: strings.maxPlaceholder,
                       value: 0,
                     }}
                     items={maxAgeValue}
                     onValueChange={(value) => {
                       setMaxAge(value);
                     }}
                     useNativeAndroidPickerStyle={false}
                     style={{
                       ...(Platform.OS === 'ios'
                         ? styles.inputIOS
                         : styles.inputAndroid),
                       ...styles,
                     }}
                     value={maxAge}
                     Icon={() => (
                       <Image
                         source={images.dropDownArrow}
                         style={styles.miniDownArrow}
                       />
                     )}
                   />
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginBottom: 15 }}>
            <View
               style={{
                 flexDirection: 'row',
                 margin: 15,
                 justifyContent: 'space-between',
               }}>
              <View style={{ flex: 0.2 }}>
                <Text style={styles.filterTitle}>Match fee</Text>
              </View>
              <View style={{ marginLeft: 15, flex: 0.6 }}>
                <View
                   style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     flex: 1,
                   }}>
                  <RNPickerSelect
                     placeholder={{
                       label: strings.minPlaceholder,
                       value: 0,
                     }}
                     items={minAgeValue}
                     onValueChange={(value) => {
                       setMinAge(value);
                     }}
                     useNativeAndroidPickerStyle={false}
                     style={{
                       ...(Platform.OS === 'ios'
                         ? styles.inputIOS
                         : styles.inputAndroid),
                       ...styles,
                     }}
                     value={minAge}
                     Icon={() => (
                       <Image
                         source={images.dropDownArrow}
                         style={styles.miniDownArrow}
                       />
                     )}
                   />
                  <RNPickerSelect
                     placeholder={{
                       label: strings.maxPlaceholder,
                       value: 0,
                     }}
                     items={maxAgeValue}
                     onValueChange={(value) => {
                       setMaxAge(value);
                     }}
                     useNativeAndroidPickerStyle={false}
                     style={{
                       ...(Platform.OS === 'ios'
                         ? styles.inputIOS
                         : styles.inputAndroid),
                       ...styles,
                     }}
                     value={maxAge}
                     Icon={() => (
                       <Image
                         source={images.dropDownArrow}
                         style={styles.miniDownArrow}
                       />
                     )}
                   />
                </View>
              </View>
            </View>
          </View>
          <View>
            <View
               style={{
                 flexDirection: 'row',
                 margin: 15,
                 justifyContent: 'space-between',
               }}>
              <View style={{ flex: 0.2 }}>
                <Text style={styles.filterTitle}>Match duration</Text>
              </View>
              <View style={{ marginLeft: 15, flex: 0.6 }}>
                <View
                   style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     flex: 1,
                   }}>
                  <RNPickerSelect
                     placeholder={{
                       label: strings.minPlaceholder,
                       value: 0,
                     }}
                     items={minAgeValue}
                     onValueChange={(value) => {
                       setMinAge(value);
                     }}
                     useNativeAndroidPickerStyle={false}
                     style={{
                       ...(Platform.OS === 'ios'
                         ? styles.inputIOS
                         : styles.inputAndroid),
                       ...styles,
                     }}
                     value={minAge}
                     Icon={() => (
                       <Image
                         source={images.dropDownArrow}
                         style={styles.miniDownArrow}
                       />
                     )}
                   />
                  <RNPickerSelect
                     placeholder={{
                       label: strings.maxPlaceholder,
                       value: 0,
                     }}
                     items={maxAgeValue}
                     onValueChange={(value) => {
                       setMaxAge(value);
                     }}
                     useNativeAndroidPickerStyle={false}
                     style={{
                       ...(Platform.OS === 'ios'
                         ? styles.inputIOS
                         : styles.inputAndroid),
                       ...styles,
                     }}
                     value={maxAge}
                     Icon={() => (
                       <Image
                         source={images.dropDownArrow}
                         style={styles.miniDownArrow}
                       />
                     )}
                   />
                </View>
              </View>
            </View>
          </View>

          <View style={{ margin: 15 }}>
            <Text style={styles.filterTitle}>Match Place</Text>
            <View
               style={{
                 flexDirection: 'row',
                 marginBottom: 10,
                 marginTop: 10,
                 justifyContent: 'space-between',
               }}>
              <Text style={styles.filterTitle}>
                {strings.challengerSecureText}
              </Text>
              <TouchableWithoutFeedback onPress={() => setSecureLocation(0)}>
                <Image
                   source={
                     secureLocation === 0
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
                 marginTop: 10,
                 justifyContent: 'space-between',
               }}>
              <Text style={styles.filterTitle}>
                {strings.challengeeSecureText}
              </Text>
              <TouchableWithoutFeedback onPress={() => setSecureLocation(1)}>
                <Image
                   source={
                     secureLocation === 1
                       ? images.checkRoundOrange
                       : images.radioUnselect
                   }
                   style={styles.radioButtonStyle}
                 />
              </TouchableWithoutFeedback>
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
          minimumDate={new Date()}
          // maximumDate={maxFromDate()}
          // minutesGap={5}
          mode={'datetime'}
        />
        <DateTimePickerView
          title={'Choose a Date & Time'}
          date={new Date(to)}
          visible={toPickerVisible}
          onDone={onToDone}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          minimumDate={new Date(from)}
          // maximumDate={new Date(selectedSlot?.endtime * 1000)}
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

  //= =====

  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 15,
    tintColor: colors.grayColor,

    top: 10,
    width: 12,
  },
  inputIOS: {
    height: 30,

    fontSize: widthPercentageToDP('3.5%'),
    // paddingVertical: 6,
    paddingHorizontal: 15,
    width: widthPercentageToDP('26%'),
    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 1,
  },
  inputAndroid: {
    height: 40,

    fontSize: widthPercentageToDP('4%'),
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: widthPercentageToDP('26%'),
    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 1,

    elevation: 3,
  },

});
