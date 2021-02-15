import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { QBconnectAndSubscribe, QBlogin } from '../../utils/QuickBlox';
import { createUser, getUserDetails } from '../../api/Users';
import { getSportsList } from '../../api/Games';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import TCButton from '../../components/TCButton';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

export default function ChooseSportsScreen({ navigation, route }) {
  const [sports, setSports] = useState([]);
  const [selected, setSelected] = useState([]);
  // For activity indigator
  const [loading, setloading] = useState(true);

  const authContext = useContext(AuthContext);
  const selectedSports = [];

  useEffect(() => {
    getSportsList(authContext).then((response) => {
      const arr = [];
      for (const tempData of response.payload) {
        tempData.isChecked = false;
        arr.push(tempData);
      }
      setSports(arr);
      setTimeout(() => setloading(false), 1000);
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  }, []);

  const isIconCheckedOrNot = ({ item, index }) => {
    console.log('SELECTED:::', index);

    sports[index].isChecked = !item.isChecked;

    setSports([...sports]);

    for (const temp of sports) {
      if (temp.isChecked) {
        selectedSports.push(temp.sport_name);
      }
    }

    setSelected(selectedSports);
  };

  const signUpWithTC = async () => {
    setloading(true);
    const user = await Utility.getStorage('userInfo');
    const data = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      thumbnail: user?.thumbnail ?? '',
      full_image: user?.full_image ?? '',
      sports: selected,
      city: route.params.city,
      state_abbr: route.params.state,
      country: route.params.country,
    };

    createUser(data, authContext).then(() => {
      getUserInfo();
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  };

  const QBInitialLogin = (response) => {
    let qbEntity = authContext?.entity;
    QBlogin(qbEntity.uid, response).then(async (res) => {
      qbEntity = { ...qbEntity, isLoggedIn: true, QB: { ...res.user, connected: true, token: res?.session?.token } }
      QBconnectAndSubscribe(qbEntity)
      await Utility.setStorage('authContextEntity', { ...qbEntity })
      authContext.setEntity({ ...qbEntity })
      setloading(false);
    }).catch(async (error) => {
      qbEntity = { ...qbEntity, QB: { connected: false } }
      await Utility.setStorage('authContextEntity', { ...qbEntity, isLoggedIn: true })
      authContext.setEntity({ ...qbEntity, isLoggedIn: true })
      console.log('QB Login Error : ', error.message);
      setloading(false);
    });
  }

  const getUserInfo = async () => {
    const entity = authContext.entity
    console.log('USER ENTITY:', entity);
    const response = await getUserDetails(entity.auth.user_id, authContext);
    if (response.status) {
      entity.obj = response.payload
      entity.auth.user = response.payload
      entity.role = 'user'

      authContext.setEntity({ ...entity })
      await authContext.setUser(response.payload);
      await Utility.setStorage('authContextUser', { ...response.payload })
      QBInitialLogin(response?.payload);
    } else {
      throw new Error(response);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback
        style={ styles.listItem }
        onPress={ () => {
          isIconCheckedOrNot({ item, index });
        } }>
      {item.sport_name?.toLowerCase() === 'carom' && (
        <FastImage resizeMode={'contain'} source={ images.bandySport } style={ styles.sportImg } />
      )}
      {item.sport_name?.toLowerCase() === 'soccer' && (
        <FastImage resizeMode={'contain'} source={ images.footballSport } style={ styles.sportImg } />
      )}
      {item.sport_name?.toLowerCase() === 'tennis' && (
        <FastImage resizeMode={'contain'} source={ images.bandySport } style={ styles.sportImg } />
      )}
      {item.sport_name?.toLowerCase() === 'football' && (
        <FastImage resizeMode={'contain'} source={ images.footballSport } style={ styles.sportImg } />
      )}
      {item.sport_name?.toLowerCase() === 'baseball' && (
        <FastImage resizeMode={'contain'} source={ images.baseballSport } style={ styles.sportImg } />
      )}
      {item.sport_name?.toLowerCase() === 'volleyball' && (
        <FastImage resizeMode={'contain'} source={ images.archerySport } style={ styles.sportImg } />
      )}

      <Text style={ styles.sportList }>{item.sport_name}</Text>
      <View style={ styles.checkbox }>
        {sports[index].isChecked ? (
          <FastImage resizeMode={'contain'} source={ images.checkWhite } style={ styles.checkboxImg } />
        ) : (
          <FastImage resizeMode={'contain'} source={ images.uncheckWhite } style={ styles.unCheckboxImg } />
        )}
      </View>
      <Separator />

    </TouchableWithoutFeedback>
  );

  return (
    <>
      <View style={ styles.mainContainer }>
        <ActivityLoader visible={ loading } />
        <FastImage style={ styles.background } source={ images.orangeLayer } />
        <FastImage style={ styles.background } source={ images.bgImage } />

        <Text style={ styles.sportText }>{strings.sportText}</Text>
        {/* <ActivityIndicator animating={loading} size="large" /> */}
        <FlatList
          data={ sports }
          keyExtractor={(item, index) => index.toString()}
          renderItem={ renderItem }
        />

        <TCButton
          title={ strings.applyTitle }
          extraStyle={ { position: 'absolute', bottom: hp('7%') } }
          onPress={ () => {
            if (route.params && route.params.teamData) {
              navigation.navigate('FollowTeams', {
                teamData: route.params.teamData,
                city: route.params.city,
                state: route.params.state,
                country: route.params.country,
                sports: selected,
              });
            } else {
              signUpWithTC();
            }
          } }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('2%'),
  },
  unCheckboxImg: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    tintColor: colors.whiteColor,
    alignSelf: 'center',
  },
  checkboxImg: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    alignSelf: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sportImg: {
    width: wp('5%'),
    height: hp('4%'),
    alignSelf: 'center',
  },
  sportList: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  sportText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginBottom: hp('4%'),
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
    width: wp('70%'),
  },
});
