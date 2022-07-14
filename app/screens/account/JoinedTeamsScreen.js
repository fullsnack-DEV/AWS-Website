import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ActivityLoader from '../../components/loader/ActivityLoader';

import {getUserFollowerFollowing} from '../../api/Users';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';
import strings from '../../Constants/String';

export default function JoinedTeamsScreen({route}) {
  const [teamList, setTeamList] = useState([]);
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [uid] = useState(route?.params?.uid);
  const [role] = useState(route?.params?.role);

  console.log('route?.params?.uid', route?.params?.uid);
  console.log('route?.params?.role', route?.params?.role);

  useEffect(() => {
    getFollowingList();
  }, []);

  const getFollowingList = () => {
    setloading(true);
    getUserFollowerFollowing(
      uid,
      role === 'user' ? 'players' : 'groups',
      'following',
      authContext,
    )
      .then((res) => {
        setloading(false);
        console.log('Following list===>', res.payload);
        setTeamList(res.payload);
      })
      .catch((error) => {
        console.log('error coming', error);
        setloading(false);
        Alert.alert(strings.alertmessagetitle, error.message);
      });
  };
  const renderTeamClubLeague = ({item}) => {
    console.log('Items ===>', item);
    return (
      <TouchableOpacity
        style={styles.listContainer}
        onPress={() => {
          console.log('Pressed Team..');
        }}>
        <View>
          {item.entity_type === 'player' && (
            <View style={styles.placeholderView}>
              <Image
                source={
                  item.thumbnail
                    ? {uri: item.thumbnail}
                    : images.profilePlaceHolder
                }
                style={
                  item.thumbnail ? styles.playerProfileImg : styles.playerImg
                }
              />
            </View>
          )}
          {item.entity_type === 'club' && (
            <View style={styles.placeholderView}>
              <Image
                source={
                  item.thumbnail
                    ? {uri: item.thumbnail}
                    : images.clubPlaceholder
                }
                style={
                  item.thumbnail ? styles.entityProfileImg : styles.entityImg
                }
              />
              {item.thumbnail ? null : (
                <Text style={styles.oneCharacterText}>
                  {item.group_name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          )}
          {item.entity_type === 'team' && (
            <View style={styles.placeholderView}>
              <Image
                source={
                  item.thumbnail
                    ? {uri: item.thumbnail}
                    : images.teamPlaceholder
                }
                style={
                  item.thumbnail ? styles.entityProfileImg : styles.entityImg
                }
              />
              {item.thumbnail ? null : (
                <Text style={styles.oneCharacterText}>
                  {item.group_name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          {item.entity_type === 'player' && (
            <Text style={styles.entityNameText}>{item?.full_name}</Text>
          )}
          {item.entity_type === 'team' && (
            <Text style={styles.entityNameText}>{item?.group_name}</Text>
          )}
          {item.entity_type === 'club' && (
            <Text style={styles.entityNameText}>{item?.group_name}</Text>
          )}
          <Text style={styles.entityLocationText}>
            {item?.city}, {item?.state_abbr}, {item?.country}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  /*
  const renderTeams = ({item}) => (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={() => {
        console.log('Pressed Team..');
      }}>
      <View>
        <Image
          source={item?.thumbnail ? {uri: item?.thumbnail} : images.team_ph}
          style={styles.entityImg}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.entityNameText}>{item?.group_name}</Text>
        <Text style={styles.entityLocationText}>
          {item?.city}, {item?.state_abbr}, {item?.country}
        </Text>
      </View>
    </TouchableOpacity>
  );
  */
  return (
    <SafeAreaView>
      <ActivityLoader visible={loading} />
      <FlatList data={teamList} renderItem={renderTeamClubLeague} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  // entityImg: {
  //   alignSelf: 'center',
  //   borderColor: colors.whiteColor,
  //   borderRadius: 10,

  //   borderWidth: 1,
  //   height: 60,
  //   margin: 15,
  //   resizeMode: 'cover',
  //   width: 60,
  // },
  entityLocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: wp('3.8%'),
    marginTop: 5,
  },
  entityNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  textContainer: {
    height: 80,
    justifyContent: 'center',
  },

  entityImg: {
    alignSelf: 'center',
    borderRadius: 25,
    height: 50,
    margin: 15,
    resizeMode: 'cover',
    width: 50,
  },
  entityProfileImg: {
    alignSelf: 'center',
    borderRadius: 25,
    height: 36,
    margin: 15,
    resizeMode: 'cover',
    width: 36,
  },

  oneCharacterText: {
    // alignSelf:'center',
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom: 5,
  },
  placeholderView: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    height: 40,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    margin: 15,
    width: 40,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1.5,
  },
  playerImg: {
    alignSelf: 'center',
    borderColor: colors.offwhite,
    borderRadius: 25,

    borderWidth: 3,
    height: 40,
    margin: 15,
    resizeMode: 'cover',
    width: 40,
  },
  playerProfileImg: {
    alignSelf: 'center',
    borderRadius: 20,
    height: 36,
    margin: 15,
    resizeMode: 'cover',
    width: 36,
  },

  // closeMenu: {
  //   height: 14,
  //   width: 14,
  //   resizeMode: 'cover',
  //   alignSelf: 'center',
  //   marginRight: 20,
  // },
});
