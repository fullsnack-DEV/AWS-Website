import React, {useState, useEffect, useContext} from 'react';
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

import {getuserDetail, createUser} from '../../../api/Authapi';
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import TCButton from '../../../components/TCButton';
import Separator from '../../../components/Separator';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import AuthContext from '../../../auth/context';
import * as Utility from '../../../utility/index';
import styles from './style';
// const {strings, colors, fonts, urls, PATH} = constants;

export default function FollowTeams({navigation, route}) {
  const [teams, setTeams] = useState([]);
  const [followed, setFollowed] = useState([]);

  const authContext = useContext(AuthContext);

  
var followedTeam=[];
  useEffect(() => {
    console.log('UseEffect Called... :::');

    setFollowData = () => {
      let arr = [];
      for (let tempData of route.params.teamData) {
        tempData['follow'] = false;

        arr.push(tempData);
        console.log(teams);
      }
      setTeams(arr);
    };
    setFollowData();
  }, []);

  const signUpWithTC = async () => {
    var userInfo = {};

    try {
      let user = await AsyncStorage.getItem('userInfo');
      if (JSON.parse(user) !== null) {
        userInfo = JSON.parse(user);
        console.log('DATA RETRIVED... ', userInfo.first_name);
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
      club_ids: followed,
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

  followUnfollowClicked = ({item, index}) => {
    console.log('SELECTED:::', index);

    teams[index].follow = !item.follow;

    setTeams((teams) => [...teams]);
    // followedTeam = [];
    for (var temp of teams) {
      if (temp.follow) {
        followedTeam.push(temp.group_id);
      }
    }
    setFollowed(followedTeam);

    console.log('Followed Team:::', followedTeam);
  };
  const getUserInfo = async () => {
   
    let  uid = await Utility.getStorage('UID');
    
    getuserDetail(uid).then(async(response) => {
      if (response.status == true) {
        await Utility.setStorage('user', response.payload);
        authContext.setUser(response.payload);
      } else {
        alert('Something went wrong..!!');
      }
    });
  };

  renderItem = ({item, index}) => {
    return (
      <View style={styles.listItem}>
        <View style={styles.listItemContainer}>
          {teams[index].thumbnail ? (
            <Image
              style={styles.teamImg}
              source={{uri: teams[index].thumbnail}}
            />
          ) : (
            <Image style={styles.teamImg} source={PATH.team_ph} />
          )}
          <View
            style={{
              width: wp('52%'),
            }}>
            <Text style={styles.teamNameText}>{teams[index].group_name}</Text>
            <Text style={styles.cityText}>
              {teams[index].city}, {teams[index].state_abbr},{' '}
              {teams[index].country}
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              this.followUnfollowClicked({item, index});
            }}>
            {teams[index].follow ? (
              <View style={styles.followingBtn}>
                <Text style={styles.followingText}>Following</Text>
              </View>
            ) : (
              <View style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>

        <Separator />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />

      <Text style={styles.sportText}>Follow sport teams.</Text>
      <FlatList
        data={teams}
        keyExtractor={(teams) => teams.group_id}
        renderItem={this.renderItem}
      />
      <TCButton
        title={strings.applyTitle}
        extraStyle={{marginBottom: hp('6.5%'), marginTop: hp('2%')}}
        onPress={() => signUpWithTC()}
      />
    </View>
  );
}
