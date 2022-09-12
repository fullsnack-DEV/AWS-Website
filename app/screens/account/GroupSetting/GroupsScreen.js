import React, {useState, useContext, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {format} from 'react-string-format';
import {leaveTeam} from '../../../api/Groups';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import TeamClubLeagueView from '../../../components/Home/TeamClubLeagueView';
import TCThinDivider from '../../../components/TCThinDivider';
import Verbs from '../../../Constants/Verbs';

export default function GroupsScreen({route, navigation}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [groups, setGroup] = useState(route?.params?.groups);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        authContext.entity.role === Verbs.entityTypeClub
          ? strings.teamTitle
          : strings.clubstitle,
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => {}}>
          {strings.next}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 10,
              tintColor: colors.lightBlackColor,
              resizeMode: 'contain',
              left: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  const userLeaveGroup = (item, indexObj) => {
    setloading(true);
    const groupId = item.group_id;

    const params = {};
    leaveTeam(params, groupId, authContext)
      .then(() => {
        setGroup((group) => group.filter((_, index) => index !== indexObj));
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };
  const renderTeamClubLeague = ({item, index}) => {
    let teamIcon = '';
    let teamImagePH = '';
    if (item.entity_type === Verbs.entityTypeTeam) {
      teamIcon = images.myTeams;
      teamImagePH = images.team_ph;
    } else if (item.entity_type === Verbs.entityTypeClub) {
      teamIcon = images.myClubs;
      teamImagePH = images.club_ph;
    } else if (item.entity_type === Verbs.entityTypeLeague) {
      teamIcon = images.myLeagues;
      teamImagePH = images.leaguePlaceholder;
    }
    return (
      <View
        style={{
          paddingVertical: 10,
          // left: 30,
          margin: 20,
          flex: 1,
          flexDirection: 'row',
          // backgroundColor: colors.blueColor,
          justifyContent: 'space-between',
        }}>
        <TeamClubLeagueView
          onProfilePress={() => {}}
          teamImage={item?.full_image ? {uri: item?.full_image} : teamImagePH}
          teamTitle={item?.group_name}
          teamIcon={teamIcon}
          teamCityName={`${item?.city}, ${item?.country}`}
        />
        <View
          style={{
            // backgroundColor: colors.yellowColor,
            justifyContent: 'center',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              Alert.alert(
                format(strings.areYouSureLeaveText, item.group_name),
                '',
                [
                  {
                    text: strings.cancel,
                    style: 'cancel',
                  },
                  {
                    text: strings.leave,
                    style: 'destructive',
                    onPress: () => {
                      userLeaveGroup(item, index);
                    },
                  },
                ],
                {cancelable: false},
              );
              // }
            }}>
            <View style={styles.followingBtn}>
              <Text style={styles.followingText}>{strings.leave}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[colors.whiteColor, colors.whiteColor]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <SafeAreaView style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => <TCThinDivider />}
          data={groups}
          renderItem={renderTeamClubLeague}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  followingBtn: {
    alignItems: 'center',
    height: 25,
    backgroundColor: colors.offwhite,
    borderColor: colors.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    width: 80,
    shadowColor: colors.shadowColor,
    shadowOffset: {width: 1.5, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 1,

    elevation: 3,
  },
  followingText: {
    color: colors.redColorCard,
    fontFamily: fonts.RBlack,
    fontSize: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: 3,
  },

  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },

  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
  container: {
    flex: 1,
  },
});
