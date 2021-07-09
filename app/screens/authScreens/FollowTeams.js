import React, {
 useState, useEffect, useContext,
} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,

} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { updateUserProfile } from '../../api/Users';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import TCButton from '../../components/TCButton';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils/index';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

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

  const updateProfile = async (params, callback = () => {}) => {
    setloading(true);
    updateUserProfile(params, authContext).then(async (userResoponse) => {
      const userData = userResoponse?.payload;
      const entity = { ...authContext?.entity };
      entity.isLoggedIn = true;
      entity.auth.user = userData;
      entity.obj = userData;
      await Utility.setStorage('loggedInEntity', { ...entity })
      await Utility.setStorage('authContextEntity', { ...entity })
      await Utility.setStorage('authContextUser', { ...userData });
      await authContext.setUser({ ...userData });
      await authContext.setEntity({ ...entity });
      setloading(false);
      callback();
    }).catch(() => setloading(false))
  }

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

  const renderItem = ({ item, index }) => (
    <View>
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
                <View style={ styles.followBtn }>
                  <Text style={ styles.followText}>Following</Text>
                </View>
            ) : (
              <View style={ styles.followingBtn }>
                <Text style={ styles.followingText }>Follow</Text>
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
    updateProfile({ club_ids: followed })
  }
  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage resizeMode={'stretch'} style={styles.background} source={images.loginBg} />

      <Text style={ styles.sportText }>Follow sport teams.</Text>
      <FlatList
          style={{ padding: 15 }}
        data={ teams }
        keyExtractor={(item, index) => index.toString()}
        renderItem={ renderItem }
      />
      <TCButton
        title={'CONTINUE'}
        extraStyle={ { marginBottom: hp('6.5%'), marginTop: hp('2%') } }
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
