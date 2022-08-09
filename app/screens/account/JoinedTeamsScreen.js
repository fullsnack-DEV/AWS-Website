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
        setTeamList(res.payload);
      })
      .catch((error) => {
        console.log('error coming', error);
        setloading(false);
        Alert.alert(strings.alertmessagetitle, error.message);
      });
  };

  const renderTeams = ({item}) => (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={() => {
        console.log('Pressed Team..');
      }}
    >
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
  return (
    <SafeAreaView>
      <ActivityLoader visible={loading} />
      <FlatList data={teamList} renderItem={renderTeams} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  entityImg: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 10,

    borderWidth: 1,
    height: 60,
    margin: 15,
    resizeMode: 'cover',
    width: 60,
  },
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
});
