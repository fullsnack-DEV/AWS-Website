import React, {useCallback, useState, useLayoutEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';
// eslint-disable-next-line import/no-unresolved
// import DraggableFlatList from 'react-native-draggable-flatlist';
import * as Utility from '../../utils';

import {widthPercentageToDP} from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';

export default function SportSettingScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const [sportsSource] = useState(route?.params?.sports);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => onPressSave()}>
          {strings.save}
        </Text>
      ),
    });
  }, [navigation, sportsSource]);

  const onPressSave = () => {
    console.log('sportsSource', sportsSource);
    Utility.setStorage('sportSetting', sportsSource).then(() => {
      navigation.navigate('App', {screen: 'LocalHomeScreen'});
    });
  };
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderSportsView = useCallback(
    ({item}) =>
      item.sport !== 'All' && (
        <View style={styles.sportsBackgroundView}>
          <View style={{flexDirection: 'row'}}>
            <Image source={images.gameGoal} style={styles.sportsIcon} />
            <Text style={styles.sportNameTitle}>
              {Utility.getSportName(item, authContext)}
            </Text>
          </View>
        </View>
      ),
    [],
  );

  return (
    <View style={{flex: 1}}>
      {/* <DraggableFlatList
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
      /> */}
      <FlatList
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
      />
      <SafeAreaView>
        <TouchableOpacity
          style={styles.addSportsView}
          onPress={() => {
            // setSportsListPopup(true);
            navigation.navigate('AddOrDeleteSport', {
              sports: sportsSource,
            });
          }}>
          <Text style={styles.addSportsTitle}>{strings.addDeleteSports}</Text>
        </TouchableOpacity>
      </SafeAreaView>
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

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 15,
  },
});
