import React, {
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import {getSportName} from '../../../../utils';

export default function ActivitySettingScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [sportObj] = useState(route?.params?.sport);

  const [userSetting, setUserSetting] = useState();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.titleTextStyle}>
          {getSportName(sportObj, authContext)}
        </Text>
      ),
    });
  }, [authContext, navigation, sportObj]);

  console.log('authContext?.entity?.obj', authContext);

  const getSettingMenu = useCallback(() => {
    if (getSportName(sportObj, authContext) === 'Tennis') {
      setUserSetting([
        {key: 'Looking For Club', id: 1},
        {key: 'Deactivate This Activity', id: 2},
      ]);
    } else {
      setUserSetting([
        {key: 'Looking For Team', id: 1},
        {key: 'Deactivate This Activity', id: 2},
      ]);
    }
  }, [authContext, sportObj]);

  useEffect(() => {
    getSettingMenu();
  }, [getSettingMenu]);

  const handleOpetions = async (opetions) => {
    if (opetions === 'Looking For Team') {
      navigation.navigate('LookingForSettingScreen', {
        sport: sportObj
      });
    }
    if (opetions === 'Looking For Club') {
      navigation.navigate('LookingForSettingScreen', {
        sport: sportObj
      });
    } else if (opetions === 'Deactivate This Activity') {
      console.log('click on sport setting');
      navigation.navigate('DeactivateSportScreen',{
        sport: sportObj
      });
    }
  };
  const renderMenu = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.listItems}>{item.key}</Text>
        {(item.key === 'Looking For Team' || item.key === 'Looking For Club') && (
          <Text style={styles.currencyTypeStyle}>
            {sportObj.is_active
              ? 'Yes'
              : 'No'}
          </Text>
        )}
        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.mainContainer}>
        <FlatList
          data={userSetting}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMenu}
          ItemSeparatorComponent={() => (
            <View style={styles.separatorLine}></View>
          )}
        />
        <View style={styles.separatorLine}></View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  currencyTypeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
});
