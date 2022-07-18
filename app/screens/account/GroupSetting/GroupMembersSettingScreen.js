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
  TouchableOpacity,
} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import Header from '../../../components/Home/Header';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

export default function GroupMembersSettingScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [hiringPlayersObject, setHiringPlayersObject] = useState();

  const [userSetting] = useState([
    {key: 'Recruiting Player', id: 1},
    {key: 'Members Profile', id: 2},
  ]);
  console.log('Authcontext==>', authContext.entity.obj);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleOpetions = async (opetions) => {
    console.log('auth Enity', authContext.entity.obj);
    if (opetions === 'Recruiting Player') {
      navigation.navigate('RecruitingMemberScreen', {
        settingObj: hiringPlayersObject,
        comeFrom: 'GroupMembersSettingScreen',
        sportName: authContext.entity?.obj?.sport,
        sportType: authContext.entity?.obj?.sport_type,
      });
    } else if (opetions === 'Members Profile') {
      const entity = authContext.entity;
      navigation.navigate('GroupMembersScreen', {groupID: entity.uid});
    }
  };
  const getSettings = useCallback(() => {
    if (
      authContext.entity.role === 'team' ||
      authContext.entity.role === 'club'
    ) {
      console.log('Au:::=>', authContext);
      setHiringPlayersObject(authContext?.entity?.obj);
    }
  }, [authContext]);
  useEffect(() => {
    if (route?.params?.entity?.obj) {
      setHiringPlayersObject(route?.params?.entity?.obj);
    } else {
      getSettings();
    }
  }, [
    authContext,
    getSettings,
    route?.params?.settingObj,
    hiringPlayersObject,
    route?.params?.entity?.obj,
  ]);

  const getSettingValue = (item) => {
    if (item === 'Recruiting Player') {
      if (hiringPlayersObject?.hiringPlayers) {
        return hiringPlayersObject?.hiringPlayers;
      }
    }
    return 'No';
  };
  const renderMenu = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Text style={styles.listItems}>{item.key}</Text>
        {item.key === 'Recruiting Player' && (
          <Text style={styles.currencyTypeStyle}>
            {getSettingValue(item.key)}
          </Text>
        )}
        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text
            style={{
              fontSize: 16,
              color: colors.lightBlackColor,
              textAlign: 'center',
              fontFamily: fonts.RBold,
            }}
          >
            Settings
          </Text>
        }
      />
      <View
        style={{
          width: '100%',
          height: 0.5,
          backgroundColor: colors.writePostSepratorColor,
        }}
      />
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
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },
});
