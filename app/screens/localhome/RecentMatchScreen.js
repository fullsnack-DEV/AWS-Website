/* eslint-disable no-underscore-dangle */
import React, { useCallback, useState, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  Text,
 Dimensions,
} from 'react-native';
// import ActivityLoader from '../../components/loader/ActivityLoader';
// import AuthContext from '../../auth/context';
import Modal from 'react-native-modal';
import moment from 'moment';
import { getHitSlop, widthPercentageToDP } from '../../utils';

import DateTimePickerView from '../../components/Schedule/DateTimePickerModal';

import TCRecentMatchCard from '../../components/TCRecentMatchCard';
import TCTextField from '../../components/TCTextField';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';

import TCThinDivider from '../../components/TCThinDivider';

export default function RecentMatchScreen({ navigation, route }) {
  // const [loading, setloading] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);
  const [datePickerFor, setDatePickerFor] = useState();
  const [show, setShow] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [recentMatch] = useState(route?.params?.gameData);

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

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderRecentMatchItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCRecentMatchCard data={item._source} cardWidth={'92%'} />
      </View>
    ),
    [],
  );

  const handleDonePress = (date) => {
    if (datePickerFor === 'from') {
      setFromDate(new Date(date))
    } else {
      setToDate(new Date(date))
    }
    setShow(!show)
    console.log('Date:=', date);
  };
  const handleCancelPress = () => {
    setShow(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchView}>
        <View style={styles.searchViewContainer}>
          <View style={{
 position: 'absolute', top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', right: 15,
          }}>
            <Image source={images.arrowDown} style={styles.arrowStyle} />
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
          <Image source={images.homeSetting} style={styles.settingImage} />
        </TouchableWithoutFeedback>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={recentMatch}
        keyExtractor={keyExtractor}
        renderItem={renderRecentMatchItems}
        style={styles.listViewStyle}
      />
      <Modal
        onBackdropPress={() => setSettingPopup(false)}
        backdropOpacity={1}
        animationType="slide"
        hasBackdrop
        style={{
          flex: 1,
          margin: 0,

          // marginTop: 100,
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
                  <TouchableWithoutFeedback onPress={() => setLocationFilterOpetion(0)}>
                    <Image
                    source={locationFilterOpetion === 0 ? images.checkRoundOrange : images.radioUnselect}
                    style={styles.radioButtonStyle}
                  />
                  </TouchableWithoutFeedback>

                  <Text style={styles.filterTitle}>World</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableWithoutFeedback onPress={() => setLocationFilterOpetion(1)} style={{ alignSelf: 'center' }}>
                    <Image
                    source={locationFilterOpetion === 1 ? images.checkRoundOrange : images.radioUnselect}
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
                  <TouchableOpacity style={styles.fieldView} onPress={() => {
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
                      <Text style={styles.fieldValue} numberOfLines={1}>{moment(fromDate).format('MMM DD, YYYY')} {'   '}</Text>
                      <Text style={styles.fieldValue} numberOfLines={1}>{moment(fromDate).format('h:mm a')}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.fieldView} onPress={() => {
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
                      <Text style={styles.fieldValue} numberOfLines={1}>{moment(toDate).format('MMM DD, YYYY')} {'   '}</Text>
                      <Text style={styles.fieldValue} numberOfLines={1}>{moment(toDate).format('h:mm a')}</Text>
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
          <View style={{ flex: 1 }}/>
          <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
              }}>
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
  listViewStyle: {
    width: '100%',
    height: 50,
    alignContent: 'center',
  },
  arrowStyle: {
    height: 8.5,
    width: 15,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
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
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginRight: 15,
  },
  searchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
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
  headerLeftImg: {
    height: 20,
    marginLeft: 5,
    resizeMode: 'contain',
    // width: 10,
  },
});
