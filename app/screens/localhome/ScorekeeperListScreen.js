import React, {
 useCallback, useState, useEffect, useLayoutEffect,
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
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';

// import AuthContext from '../../auth/context';

import Modal from 'react-native-modal';
import moment from 'moment';
import { AirbnbRating } from 'react-native-ratings';
import RNPickerSelect from 'react-native-picker-select';
import TCEntityView from '../../components/TCEntityView';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import { getHitSlop, widthPercentageToDP } from '../../utils';
import DateTimePickerView from '../../components/Schedule/DateTimePickerModal';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../../components/TCThinDivider';
import TCTextField from '../../components/TCTextField';

import strings from '../../Constants/String';

export default function ScorekeeperListScreen({ navigation }) {
  // const [loading, setloading] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);
  const [datePickerFor, setDatePickerFor] = useState();
  const [show, setShow] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [minAgeValue, setMinAgeValue] = React.useState([]);
  const [maxAgeValue, setMaxAgeValue] = React.useState([]);
  // const authContext = useContext(AuthContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}
          hitSlop={getHitSlop(15)}>
          <Image source={images.navigationBack} style={styles.headerLeftImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const minAgeArray = [];
    let maxAgeArray = [];
    for (let i = 1; i <= 70; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      minAgeArray.push(dataSource);
    }
    for (let i = minAge; i <= 70; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      maxAgeArray.push(dataSource);
    }
    setMinAgeValue(minAgeArray);
    setMaxAgeValue(maxAgeArray);
    if (minAge === 0 || minAge === null) {
      setMaxAge((maxAgeArray = []));
    }
  }, [minAge]);

  const renderRefereesScorekeeperListView = useCallback(
    () => (
      <View style={[styles.separator, { flex: 1 / 4, alignItems: 'center' }]}>
        <TCEntityView showStar={true}/>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSeparator = () => (
    <View
      style={{
        height: 10,
      }}
    />
  );

  const handleDonePress = (date) => {
    if (datePickerFor === 'from') {
      setFromDate(new Date(date));
    } else {
      setToDate(new Date(date));
    }
    setShow(!show);
    console.log('Date:=', date);
  };
  const handleCancelPress = () => {
    setShow(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={styles.searchView}>
        <View
          style={styles.searchViewContainer}>
          <Image
          source={images.arrowDown}
          style={styles.arrowStyle}
        />
        </View>
        <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
          <Image source={images.homeSetting} style={styles.settingImage} />
        </TouchableWithoutFeedback>
      </View>
      <FlatList
          numColumns={4}
          showsHorizontalScrollIndicator={false}
          data={[
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
          ]}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={keyExtractor}
          renderItem={renderRefereesScorekeeperListView}
          style={styles.listStyle}
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
        <View style={[styles.bottomPopupContainer, { height: Dimensions.get('window').height - 100 }]}>
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
                console.log('DONE::');
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
                  <TCTextField
                    style={{ marginLeft: 0, marginRight: 0 }}
                    textStyle={styles.fieldTitle}
                    placeholder={'Country, State or City '}
                  />
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
                      setDatePickerFor('from');
                      setShow(!show);
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
                        {moment(fromDate).format('MMM DD, YYYY')} {'   '}
                      </Text>
                      <Text style={styles.fieldValue} numberOfLines={1}>
                        {moment(fromDate).format('h:mm a')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={styles.fieldView}
                    onPress={() => {
                      setDatePickerFor('to');
                      setShow(!show);
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
                        {moment(toDate).format('MMM DD, YYYY')} {'   '}
                      </Text>
                      <Text style={styles.fieldValue} numberOfLines={1}>
                        {moment(toDate).format('h:mm a')}
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
          {/* Rate View */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                margin: 15,
                marginTop: 0,
                justifyContent: 'space-between',
              }}>
              <View style={{ flex: 0.2 }}>
                <Text style={styles.filterTitle}>Rating</Text>
              </View>
              <View
                style={{
                  marginLeft: 15,
                  flex: 0.6,
                  alignSelf: 'flex-end',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.minMaxTitle}>Min</Text>
                  <AirbnbRating
                    count={5}
                    fractions={1}
                    showRating={false}
                    defaultRating={0}
                    size={20}
                    isDisabled={false}
                    selectedColor={'#f49c20'}
                  />
                  <Text style={styles.starCount}>2.0</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.minMaxTitle}>Max</Text>
                  <AirbnbRating
                    count={5}
                    fractions={1}
                    showRating={false}
                    defaultRating={0}
                    size={20}
                    isDisabled={false}
                    selectedColor={'#f49c20'}
                  />
                  <Text style={styles.starCount}>2.0</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', margin: 15, justifyContent: 'space-between' }}>
              <View style={{ flex: 0.2 }}>
                <Text style={styles.filterTitle}>Referee fee</Text>
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
          {/* Rate View */}
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.resetButton} onPress={() => {}}>
            <Text style={styles.resetTitle}>Reset</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerView
          date={new Date()}
          visible={show}
          onDone={handleDonePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          // minutesGap={30}
          mode={'datetime'}
        />
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  listStyle: { marginLeft: 15 },

   separator: {
    borderRightWidth: 20,
    borderColor: colors.whiteColor,
   },
   arrowStyle: {
    height: 26,
    width: 14,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginTop: 8,
    marginRight: 15,
  },
  searchViewContainer: {
    height: 40,
    width: widthPercentageToDP('85%'),
    borderRadius: 20,
    shadowColor: colors.googleColor,
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
  },
  searchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
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
  minMaxTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
    marginRight: 15,
  },
  starCount: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    marginLeft: 15,
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
  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 15,
    tintColor: colors.grayColor,

    top: 15,
    width: 12,
  },
  inputIOS: {
    height: 40,

    fontSize: widthPercentageToDP('3.5%'),
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: widthPercentageToDP('26%'),
    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
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
    shadowOpacity: 0.5,
    shadowRadius: 1,

    elevation: 3,
  },
  headerLeftImg: {
    height: 20,
    marginLeft: 5,
    resizeMode: 'contain',
    // width: 10,
  },
});
