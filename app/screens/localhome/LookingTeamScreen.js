import React, { useCallback, useState, useLayoutEffect } from 'react';
import {
 Dimensions,
 Platform,
 View, StyleSheet, FlatList, Image, TouchableOpacity, Text, TouchableWithoutFeedback,
} from 'react-native';

import Modal from 'react-native-modal';

// import ActivityLoader from '../../components/loader/ActivityLoader';

// import AuthContext from '../../auth/context';

import TCEntityView from '../../components/TCEntityView';
import TCTextField from '../../components/TCTextField';
import TCThinDivider from '../../components/TCThinDivider';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import { getHitSlop, widthPercentageToDP } from '../../utils';

export default function LookingTeamScreen({ navigation }) {
  const [settingPopup, setSettingPopup] = useState(false);
  const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);
  // const [loading, setloading] = useState(false);

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

  const renderEntityListView = useCallback(
    () => (
      <View style={[styles.separator, { flex: 1 / 4 }]}>
        <TCEntityView />
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
            '',
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
          renderItem={renderEntityListView}
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

          </View>
          <View style={{ flex: 1 }}/>
          <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
              }}>
            <Text style={styles.resetTitle}>Reset</Text>
          </TouchableOpacity>
        </View>
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

  fieldTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
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
  headerLeftImg: {
    height: 20,
    marginLeft: 5,
    resizeMode: 'contain',
    // width: 10,
  },
});
