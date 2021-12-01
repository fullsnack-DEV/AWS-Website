import React, {useCallback, useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';
// eslint-disable-next-line import/no-unresolved
import DraggableFlatList from 'react-native-draggable-flatlist';
import Modal from 'react-native-modal';
import * as Utility from '../../utils';

import {widthPercentageToDP} from '../../utils';
import colors from '../../Constants/Colors';
import TCThinDivider from '../../components/TCThinDivider';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import SportsListView from '../../components/localHome/SportsListView';

let selectedSports = [];

export default function SportSettingScreen({navigation, route}) {
  const {sports} = route?.params ?? {};
  const [systemSports, setSystemSports] = useState([]);

  const [sportsListPopup, setSportsListPopup] = useState(false);
  const [sportsSource, setSportsSource] = useState(sports);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => onPressSave()}>
          Save
        </Text>
      ),
    });
  }, [navigation, sportsSource, systemSports]);

  useEffect(() => {
    if (route?.params?.sports) {
      setSportsSource([...route?.params?.sports]);
    }
  }, [route?.params?.sports]);
  const onPressSave = () => {
    console.log('sportsSource', sportsSource);
    Utility.setStorage('sportSetting', sportsSource).then(() => {
      navigation.navigate('LocalHomeScreen');
    });
  };
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderSportsView = useCallback(
    ({item, drag}) =>
      item.sport_name !== 'All' && (
        <View style={styles.sportsBackgroundView}>
          <View style={{flexDirection: 'row'}}>
            <Image source={images.gameGoal} style={styles.sportsIcon} />
            <Text style={styles.sportNameTitle}>{item.sport_name}</Text>
          </View>
          <TouchableOpacity onLongPress={drag} style={{alignSelf: 'center'}}>
            <Image source={images.moveIcon} style={styles.moveIconStyle} />
          </TouchableOpacity>
        </View>
      ),
    [],
  );

  const isIconCheckedOrNot = useCallback(
    ({item, index}) => {
      if (item.sport_name === 'All') {
        if (item.isChecked) {
          systemSports[index].isChecked = false;
          systemSports.forEach((x, i) => {
            systemSports[i].isChecked = false;
          });
        } else {
          systemSports[index].isChecked = true;
          systemSports.forEach((x, i) => {
            systemSports[i].isChecked = true;
          });
        }
      } else {
        if (item.isChecked) {
          systemSports[index].isChecked = false;
        } else {
          systemSports[index].isChecked = true;
        }
        if (systemSports.length === selectedSports.length) {
          systemSports[0].isChecked = true;
        } else {
          systemSports[0].isChecked = false;
        }
      }
      setSystemSports([...systemSports]);
      selectedSports = systemSports.filter(
        (e) => e.isChecked && e.sport_name !== 'All',
      );
      console.log('Slected sports', selectedSports);
    },
    [systemSports],
  );
  return (
    <View style={{flex: 1}}>
      <DraggableFlatList
        showsHorizontalScrollIndicator={false}
        data={sportsSource}
        keyExtractor={keyExtractor}
        renderItem={renderSportsView}
        style={{
          width: '100%',
          alignContent: 'center',
          marginBottom: 15,
          paddingVertical: 15,
        }}
        dragHitSlop={{
          top: 15,
          bottom: 15,
          left: 15,
          right: 15,
        }}
        onDragEnd={({data}) => {
          setSportsSource([...data]);
          console.log('DATATATATATA:=', data);
        }}
      />
      <SafeAreaView>
        <TouchableOpacity
          style={styles.addSportsView}
          onPress={() => {
            // setSportsListPopup(true);
            navigation.navigate('AddOrDeleteSport', {
              defaultSports: sportsSource,
            });
          }}>
          <Text style={styles.addSportsTitle}>Add or delete Sports</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Modal
        onBackdropPress={() => setSportsListPopup(false)}
        backdropOpacity={1}
        animationType="slide"
        hasBackdrop
        style={{
          flex: 1,
          margin: 0,
          backgroundColor: colors.blackOpacityColor,
        }}
        visible={sportsListPopup}>
        <View style={[styles.bottomPopupContainer, {height: '80%'}]}>
          <View style={styles.viewsContainer}>
            <Text
              onPress={() => setSportsListPopup(false)}
              style={styles.cancelText}>
              Cancel
            </Text>
            <Text style={styles.locationText}>Add or delete Sports </Text>
            <Text
              style={styles.doneText}
              onPress={() => {
                setSportsSource([
                  ...[
                    {
                      isChecked: true,
                      sport_name: 'All',
                    },
                  ],
                  ...selectedSports,
                ]);

                setTimeout(() => {
                  setSportsListPopup(false);
                }, 10);
                console.log('DONE::', selectedSports);
              }}>
              {'Apply'}
            </Text>
          </View>
          <TCThinDivider width={'100%'} marginBottom={15} />
          <SportsListView sports={systemSports} onSelect={isIconCheckedOrNot} />
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  sportsIcon: {
    resizeMode: 'cover',
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  moveIconStyle: {
    resizeMode: 'cover',
    height: 13,
    width: 15,
    alignSelf: 'center',
    marginRight: 15,
  },
  sportNameTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },
  addSportsTitle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    alignSelf: 'center',
    // margin: 15,
    paddingHorizontal: 10,
  },
  sportsBackgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 40,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: widthPercentageToDP('86%'),
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addSportsView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    height: 25,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // width: widthPercentageToDP('86%'),
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 15,
  },
  bottomPopupContainer: {
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
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 15,
  },
});
