/* eslint-disable no-underscore-dangle */
import React, { useCallback, useState, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
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
// import { gameData } from '../../utils/constant';
import { getHitSlop, widthPercentageToDP } from '../../utils';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import TCGameCard from '../../components/TCGameCard';
import TCTextField from '../../components/TCTextField';
import TCThinDivider from '../../components/TCThinDivider';
import fonts from '../../Constants/Fonts';

export default function UpcomingMatchScreen({ navigation, route }) {
  // const [loading, setloading] = useState(false);
  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);
  const [upcomingMatch] = useState(route?.params?.gameData);

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

  const renderRecentMatchItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCGameCard data={item._source} cardWidth={'92%'} />
      </View>
    ),
    [],
  );

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
      {/* <FlatList
        showsHorizontalScrollIndicator={false}
        data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
        keyExtractor={keyExtractor}
        renderItem={renderRecentMatchItems}
        style={styles.listViewStyle}
      /> */}
      <SectionList
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
                  <TouchableOpacity style={styles.fieldView}>
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
                        Feb 15, 2021 1:00 am
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.fieldView}>
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
                        Feb 15, 2021 1:00 am
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
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
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
  sectionHeader: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 8,
    marginTop: 8,
  },
  headerLeftImg: {
    tintColor: colors.lightBlackColor,
    height: 22,
    marginLeft: 15,
    resizeMode: 'contain',
    width: 12,
  },
});
