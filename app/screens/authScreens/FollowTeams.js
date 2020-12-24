import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { getUserDetails, createUser } from '../../api/Users';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import TCButton from '../../components/TCButton';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import { QBconnectAndSubscribe, QBlogin } from '../../utils/QuickBlox';

export default function FollowTeams({ route }) {
  const [teams, setTeams] = useState(['1']);
  const [followed, setFollowed] = useState(['1']);
  const [loading, setloading] = useState(false);

  const authContext = useContext(AuthContext);

  const followedTeam = [];
  useEffect(() => {
    console.log('UseEffect Called... :::');

    const setFollowData = () => {
      const arr = [];
      for (const tempData of route.params.teamData) {
        tempData.follow = false;

        arr.push(tempData);
      }
      setTeams(arr);
    };
    setFollowData();
  }, []);

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

  const signUpWithTC = async () => {
    setloading(true)
    let userInfo = {};
    const user = await Utility.getStorage('userInfo');
    userInfo = user;
    const data = {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      email: userInfo.email,
      thumbnail: userInfo?.thumbnail,
      full_image: userInfo?.full_image,
      sports: route.params.sports,
      city: route.params.city,
      state_abbr: route.params.state,
      country: route.params.country,
      club_ids: followed,
    };

    createUser(data, authContext).then((response) => {
      if (response.status === true) {
        getUserInfo();
      } else {
        setloading(false)
        Alert.alert(response.messages);
      }
    }).catch(() => setloading(false));
  };

  const followUnfollowClicked = ({ item, index }) => {
    console.log('SELECTED:::', index);

    teams[index].follow = !item.follow;

    setTeams([...teams]);

    for (const temp of teams) {
      if (temp.follow) {
        followedTeam.push(temp.group_id);
      }
    }
    setFollowed(followedTeam);

    console.log('Followed Team:::', followedTeam);
  };
  const getUserInfo = async () => {
    const entity = authContext.entity
    console.log('USER ENTITY:', entity);
    const response = await getUserDetails(entity.auth.user_id, authContext);

    if (response.status) {
      entity.obj = response.payload
      entity.auth.user = response.payload
      entity.role = 'user'
      await Utility.setStorage('loggedInEntity', entity)
      await authContext.setUser(response.payload);
      Utility.setStorage('authContextUser', { ...response.payload })
      QBInitialLogin(entity, response?.payload);
    } else {
      setloading(false);
      throw new Error(response);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={ styles.listItem }>
      <View style={ styles.listItemContainer }>
        <View style={{ flex: 0.2 }}>
          {teams[index].thumbnail ? (
            <Image
              style={ styles.teamImg }
              source={ { uri: teams[index].thumbnail } }
            />
          ) : (
            <Image style={ styles.teamImg } source={ images.team_ph } />
          )}
        </View>
        <View
            style={ {
              flex: 0.5,
              paddingHorizontal: 10,
            } }>
          <Text style={ styles.teamNameText }>{teams[index].group_name}</Text>
          <Text style={ styles.cityText }>
            {teams[index].city}, {teams[index].state_abbr},{' '}
            {teams[index].country}
          </Text>
        </View>
        <View style={{ flex: 0.3 }}>
          <TouchableWithoutFeedback
            onPress={ () => {
              followUnfollowClicked({ item, index });
            } }>
            {teams[index].follow ? (
              <View style={ styles.followingBtn }>
                <Text style={ styles.followingText }>Following</Text>
              </View>
            ) : (
              <View style={ styles.followBtn }>
                <Text style={ styles.followText }>Follow</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>
      </View>

      <Separator />
    </View>
  );

  return (
    <View style={ styles.mainContainer }>
      <ActivityLoader visible={loading} />
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.bgImage } />

      <Text style={ styles.sportText }>Follow sport teams.</Text>
      <FlatList
        data={ teams }
        keyExtractor={(item, index) => index.toString()}
        renderItem={ renderItem }
      />
      <TCButton
        title={ strings.applyTitle }
        extraStyle={ { marginBottom: hp('6.5%'), marginTop: hp('2%') } }
        onPress={ () => signUpWithTC() }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },

  cityText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.5%'),
    textAlign: 'left',
    textAlignVertical: 'center',
  },

  followBtn: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    width: 80,
  },
  followText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('3%'),
  },
  followingBtn: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderColor: colors.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    width: 80,
  },
  followingText: {
    color: colors.themeColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('3%'),
  },
  listItem: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 20,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  sportText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginBottom: hp('4%'),
    marginTop: hp('12%'),
    paddingHorizontal: 30,
    textAlign: 'left',
  },
  teamImg: {
    alignSelf: 'center',
    borderRadius: 6,
    height: 45,
    resizeMode: 'stretch',
    width: 45,
  },
  teamNameText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('4%'),
    textAlign: 'left',
    textAlignVertical: 'center',
  },
});
