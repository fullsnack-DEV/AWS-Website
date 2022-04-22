import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigationState} from '@react-navigation/native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {updateUserProfile} from '../../api/Users';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import TCButton from '../../components/TCButton';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import strings from '../../Constants/String';

export default function FollowTeams({route, navigation}) {
  const [teams, setTeams] = useState(['1']);

  const [followed, setFollowed] = useState(['1']);
  const [loading, setloading] = useState(false);

  const authContext = useContext(AuthContext);

  const followedTeam = [];
  const routes = useNavigationState((state) => state);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            const routeObj = routes?.routes?.[routes?.index] ?? {};
            const routeName =
              routeObj?.state?.routes?.[routeObj?.state?.index]?.name;
            if (routeName === 'ChooseSportsScreen') {
              // navigation.pop(1);
              navigation.navigate('ChooseSportsScreen', {
                city: route.params.city,
                state: route.params.state,
                country: route.params.country,
                teamData: route.params.teamData,
              });
            } else {
              // navigation.navigate('ChooseSportsScreen');
              navigation.navigate('ChooseSportsScreen', {
                city: route.params.city,
                state: route.params.state,
                country: route.params.country,
                teamData: route.params.teamData,
              });
            }
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 15,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  /*
  const isClubSport = ({sportName}) => {
    const data = filterData.filter((obj) => obj.sport === sportName);
    return data.length > 0;
  };

  useEffect(() => {
    console.log('Team Data... :::', route.params.teamData);
    let dataObj = [];
    if (
      route.params.sports[0] === 'Soccer' &&
      route.params.sports.length === 1
    ) {
      dataObj = route.params.teamData.filter((item) => {
        console.log('Sport string ==>', item.sports_string);
        if (item.sport === 'soccer') {
          return item;
        }
        return false;
      });
    } else if (
      route.params.sports[0] === 'Tennis' &&
      route.params.sports.length === 1
    ) {
      dataObj = route.params.teamData.filter((item) => {
        if (item.sport === 'tennis') {
          return item;
        }
        return false;
      });
    } else {
      console.log('Both sport selected', route.params.teamData);
      dataObj = route.params.teamData.filter((item) => {
        if (item.sport === 'tennis' || item.sport === 'soccer') {
          return item;
        }
        return false;
      });
    }

    console.log('Sort dataObj-->', dataObj);
    setFilterData([...dataObj]);
    console.log('filter data-->', filterData);
  }, []);
  */
  useEffect(() => {
    const setFollowData = () => {
      const arr = [];
      for (const tempData of route.params.teamData) {
        tempData.follow = false;

        arr.push(tempData);
      }
      console.log('teams', teams);

      setTeams(arr);
    };
    setFollowData();
  }, []);

  const updateProfile = async (params, callback = () => {}) => {
    setloading(true);
    updateUserProfile(params, authContext)
      .then(async (userResoponse) => {
        const userData = userResoponse?.payload;
        const entity = {...authContext?.entity};
        entity.isLoggedIn = true;
        entity.auth.user = userData;
        entity.obj = userData;
        await Utility.setStorage('loggedInEntity', {...entity});
        await Utility.setStorage('authContextEntity', {...entity});
        await Utility.setStorage('authContextUser', {...userData});
        await authContext.setUser({...userData});
        await authContext.setEntity({...entity});
        setloading(false);
        callback();
      })
      .catch(() => setloading(false));
  };

  const followUnfollowClicked = ({item, index}) => {
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

  const renderItem = ({item, index}) => (
    <View>
      <View style={styles.listItem}>
        <View style={styles.listItemContainer}>
          <View style={{flex: 0.2}}>
            {teams[index].thumbnail ? (
              <Image
                style={styles.teamImg}
                source={{uri: teams[index].thumbnail}}
              />
            ) : (
              <Image style={styles.teamImg} source={images.team_ph} />
            )}
          </View>
          <View
            style={{
              flex: 0.5,
              paddingHorizontal: 10,
            }}>
            <Text style={styles.teamNameText}>
              {teams[index].group_name ?? teams[index].full_name}
            </Text>
            <Text style={styles.cityText}>
              {teams[index].city}, {teams[index].state_abbr},{' '}
              {teams[index].country}
            </Text>
          </View>
          <View style={{flex: 0.3}}>
            <TouchableWithoutFeedback
              onPress={() => {
                followUnfollowClicked({item, index});
              }}>
              {teams[index].follow ? (
                <View style={styles.followBtn}>
                  <Text style={styles.followText}>Following</Text>
                </View>
              ) : (
                <View style={styles.followingBtn}>
                  <Text style={styles.followingText}>Follow</Text>
                </View>
              )}
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <Separator />
    </View>
  );

  const signUpLastStep = () => {
    // updateProfile({club_ids: followed});
    updateProfile({group_id: followed});
  };
  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage
        resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />

      <Text style={styles.sportText}>{strings.followSportTeam}</Text>
      <FlatList
        style={{padding: 15}}
        data={teams}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <TCButton
        title={'CONTINUE'}
        extraStyle={{marginBottom: hp('6.5%'), marginTop: hp('2%')}}
        onPress={signUpLastStep}
      />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
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
    height: 25,
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
    paddingVertical: 20,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
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
