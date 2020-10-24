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

import { getuserDetail, createUser } from '../../api/Authapi';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import TCButton from '../../components/TCButton';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

export default function FollowTeams({ route }) {
  const [teams, setTeams] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [loading, setloading] = useState(false);

  const authContext = useContext(AuthContext);

  const followedTeam = [];
  useEffect(() => {
    console.log('UseEffect Called... :::');

    setFollowData = () => {
      const arr = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const tempData of route.params.teamData) {
        tempData.follow = false;

        arr.push(tempData);
      }
      setTeams(arr);
    };
    setFollowData();
  }, []);

  const signUpWithTC = async () => {
    setloading(true)
    let userInfo = {};
    const user = await Utility.getStorage('userInfo');
    userInfo = user;
    const data = {
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
      if (response.status === true) {
        getUserInfo();
      } else {
        Alert.alert(response.messages);
      }
    });
  };

  followUnfollowClicked = ({ item, index }) => {
    console.log('SELECTED:::', index);

    teams[index].follow = !item.follow;

    setTeams([...teams]);

    // eslint-disable-next-line no-restricted-syntax
    for (const temp of teams) {
      if (temp.follow) {
        followedTeam.push(temp.group_id);
      }
    }
    setFollowed(followedTeam);

    console.log('Followed Team:::', followedTeam);
  };
  const getUserInfo = async () => {
    const entity = await Utility.getStorage('loggedInEntity');
    console.log('USER ENTITY:', entity);
    const response = await getuserDetail(entity.auth.user_id);

    if (response.status) {
      entity.obj = response.payload
      entity.auth.user = response.payload
      entity.role = 'user'
      await Utility.setStorage('loggedInEntity', entity)
      await authContext.setUser(response.payload);
      setloading(false);
    } else {
      throw new Error(response);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={ styles.listItem }>
      <View style={ styles.listItemContainer }>
        {teams[index].thumbnail ? (
          <Image
              style={ styles.teamImg }
              source={ { uri: teams[index].thumbnail } }
            />
        ) : (
          <Image style={ styles.teamImg } source={ images.team_ph } />
        )}
        <View
            style={ {
              width: wp('52%'),
            } }>
          <Text style={ styles.teamNameText }>{teams[index].group_name}</Text>
          <Text style={ styles.cityText }>
            {teams[index].city}, {teams[index].state_abbr},{' '}
            {teams[index].country}
          </Text>
        </View>
        <TouchableWithoutFeedback
            onPress={ () => {
              this.followUnfollowClicked({ item, index });
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
        keyExtractor={(index) => index.toString()}
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
    paddingLeft: wp('4%'),

    textAlign: 'left',
    textAlignVertical: 'center',

    width: wp('70%'),
  },

  followBtn: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    width: 70,
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
    height: 25,
    justifyContent: 'center',
    width: 70,
  },
  followingText: {
    color: colors.themeColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('3%'),
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  listItemContainer: {
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
    paddingLeft: 30,
    textAlign: 'left',
    width: wp('70%'),
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
    paddingLeft: wp('4%'),

    textAlign: 'left',
    textAlignVertical: 'center',

    width: wp('70%'),
  },
});
