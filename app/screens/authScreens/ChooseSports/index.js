import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';

import {getSportsList, createUser, getuserDetail} from '../../../api/Authapi';

import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import TCButton from '../../../components/TCButton';
import Separator from '../../../components/Separator';
import AuthContext from '../../../auth/context';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Loader from '../../../components/loader/Loader';
import * as Utility from '../../../utility/index';
import styles from './style';

function ChooseSportsScreen({navigation, route}) {
  const [sports, setSports] = useState([]);
  const authContext = useContext(AuthContext);
  var selectedSports = [];

  useEffect(() => {
    getSportsList().then((response) => {
      if (response.status == true) {
        console.log('response', response.payload);

        var arr = [];
        for (var tempData of response.payload) {
          tempData['isChecked'] = false;
          arr.push(tempData);
        }
        setSports(arr);
      } else {
        alert(response.messages);
      }
    });
  }, []);

  const isIconCheckedOrNot = ({item, index}) => {
    console.log('SELECTED:::', index);

    sports[index].isChecked = !item.isChecked;

    setSports((sports) => [...sports]);

    for (let temp of sports) {
      if (temp.isChecked) {
        selectedSports.push(temp.sport_name);
      }
    }

    console.log('sports Checked ?:::', selectedSports);
  };

  const signUpWithTC = async () => {
    var userInfo = {};

    try {
      let user = await AsyncStorage.getItem('userInfo');
      if (JSON.parse(user) !== null) {
        userInfo = JSON.parse(user);
        console.log('DATA RETRIVED USER INFO... ', userInfo);
      }
    } catch (error) {
      console.log('Error while get data', error.message);
    }

    let data = {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      email: userInfo.email,
      thumbnail: '',
      full_image: '',
      sports: route.params.sports,
      city: route.params.city,
      state_abbr: route.params.state,
      country: route.params.country,
    };

    createUser(data).then((response) => {
      if (response.status == true) {
        console.log('PAYLOAD::', JSON.stringify(response));
        getUserInfo();
      } else {
        alert(response.messages);
      }
    });
  };
  const getUserInfo = async () => {
    var uid = (uid = await Utility.getStorage('UID'));
    getuserDetail(uid).then((response) => {
      if (response.status == true) {
        console.log('PAYLOAD OF GET USER::', JSON.stringify(response.payload));
        authContext.setUser(response.payload);

        Utility.setStorage('user', response.payload);
        Utility.setStorage('switchBy', 'user');
        //navigation.navigate('HomeScreen');
      } else {
        console.log(response);
        alert('Something went wrong..!!');
      }
    });
  };

  renderItem = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        style={styles.listItem}
        onPress={() => {
          isIconCheckedOrNot({item, index});
        }}>
        {item.sport_name == 'Soccer' && (
          <Image source={PATH.footballSport} style={styles.sportImg} />
        )}
        {item.sport_name == 'Tennis' && (
          <Image source={PATH.bandySport} style={styles.sportImg} />
        )}
        {item.sport_name == 'Football' && (
          <Image source={PATH.footballSport} style={styles.sportImg} />
        )}
        {item.sport_name == 'Baseball' && (
          <Image source={PATH.baseballSport} style={styles.sportImg} />
        )}
        {item.sport_name == 'Volleyball' && (
          <Image source={PATH.archerySport} style={styles.sportImg} />
        )}

        <Text style={styles.sportList}>{item.sport_name}</Text>
        <View style={styles.checkbox}>
          {sports[index].isChecked ? (
            <Image source={PATH.checkWhite} style={styles.checkboxImg} />
          ) : (
            <Image source={PATH.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
        <Separator />
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <View style={styles.mainContainer}>
        {/* <Loader visible={getSportsList.loading} /> */}
        <Image style={styles.background} source={PATH.orangeLayer} />
        <Image style={styles.background} source={PATH.bgImage} />

        <Text style={styles.sportText}>{strings.sportText}</Text>
        {/* <ActivityIndicator animating={loading} size="large" /> */}
        <FlatList
          data={sports}
          keyExtractor={(sports) => sports.sport_name}
          renderItem={this.renderItem}
        />

        <TCButton
          title={strings.applyTitle}
          extraStyle={{position: 'absolute', bottom: hp('7%')}}
          onPress={() => {
            if (route.params && route.params.teamData) {
              navigation.navigate('FollowTeams', {
                teamData: route.params.teamData,
                city: route.params.city,
                state: route.params.state,
                country: route.params.country,
                sports: selectedSports,
              });
            } else {
              signUpWithTC();
            }
          }}
        />
      </View>
    </>
  );
}

export default ChooseSportsScreen;
