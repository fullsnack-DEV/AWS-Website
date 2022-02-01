import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ActivityLoader from '../../components/loader/ActivityLoader';

import {getJoinedGroups, getTeamsOfClub} from '../../api/Groups';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';
import strings from '../../Constants/String';

export default function JoinedTeamsScreen({route}) {
  const [teamList, setTeamList] = useState([]);
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  console.log('route?.params?.uid', route?.params?.uid);
  console.log('route?.params?.role', route?.params?.role);

  useEffect(() => {
    getTeamsList();
  }, []);

  const getTeamsList = () => {
    setloading(true);
    if (route?.params?.role === 'club') {
      getTeamsOfClub(route?.params?.uid, authContext)
        .then((response) => {
          setloading(false);
          setTeamList(response.payload);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      getJoinedGroups('team', authContext)
        .then((response) => {
          setloading(false);
          setTeamList(response.payload);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const renderTeams = ({item}) => (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={() => {
        console.log('Pressed Team..');
      }}>
      <View>
        <Image
          source={item?.full_image ? {uri: item?.full_image} : images.team_ph}
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
