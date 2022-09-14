/* eslint-disable no-nested-ternary */
import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import AuthContext from '../../../../auth/context';
import {patchPlayer} from '../../../../api/Users';
import {patchGroup} from '../../../../api/Groups';

import * as Utility from '../../../../utils';

import ActivityLoader from '../../../../components/loader/ActivityLoader';

import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';

export default function HomeAway({navigation, route}) {
  const authContext = useContext(AuthContext);
  console.log('Auth:=>', authContext);
  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const [sportType] = useState(route?.params?.sportType);
  const [loading, setloading] = useState(false);

  console.log('route?.params?.settingObj', route?.params?.settingObj);
  const [teams, setteams] = useState(
    route?.params?.settingObj?.home_away
      ? route?.params?.settingObj?.home_away === 'Home'
        ? [{name: 'Challenger'}, authContext?.entity?.obj]
        : [authContext?.entity?.obj, {name: 'Challenger'}]
      : [authContext?.entity?.obj, {name: 'Challenger'}],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            onSavePressed();
          }}>
          {strings.save}
        </Text>
      ),
    });
  }, [comeFrom, navigation]);

  const swapTeam = () => {
    setteams(([teams[0], teams[1]] = [teams[1], teams[0]]));

    console.log('Team[0]:=>', teams[0]);
    console.log('Team[1]:=>', teams[1]);
  };

  const saveUser = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: Verbs.entityTypePlayer,
      home_away:
        authContext?.entity?.uid === teams?.[0]?.user_id ||
        authContext?.entity?.uid === teams?.[0]?.group_id
          ? 'Home'
          : 'Away',
    };
    setloading(true);
    const registerdPlayerData =
      authContext?.entity?.obj?.registered_sports?.filter((obj) => {
        if (obj.sport === sportName && obj.sport_type === sportType) {
          return null;
        }
        return obj;
      });

    let selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) => obj?.sport === sportName && obj?.sport_type === sportType,
    )[0];

    selectedSport = {
      ...selectedSport,
      setting: {...selectedSport?.setting, ...bodyParams},
    };
    registerdPlayerData.push(selectedSport);

    const body = {
      ...authContext?.entity?.obj,
      registered_sports: registerdPlayerData,
    };
    console.log('Body::::--->', body);

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          console.log('Register player response IS:: ', response.payload);
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({...entity});
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            settingObj: response.payload.registered_sports.filter(
              (obj) => obj.sport === sportName && obj.sport_type === sportType,
            )[0].setting,
          });
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        console.log('RESPONSE IS:: ', response);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const saveTeam = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: 'team',
      home_away:
        authContext?.entity?.uid === teams?.[0]?.user_id ||
        authContext?.entity?.uid === teams?.[0]?.group_id
          ? 'Home'
          : 'Away',
    };
    setloading(true);
    const selectedTeam = authContext?.entity?.obj;
    selectedTeam.setting = {...selectedTeam.setting, ...bodyParams};
    const body = {...selectedTeam};
    console.log('Body Team::::--->', body);

    patchGroup(authContext.entity.uid, body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          console.log('Team patch::::--->', response.payload);

          setloading(false);
          const entity = authContext.entity;
          entity.obj = response.payload;
          authContext.setEntity({...entity});

          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            settingObj: response.payload.setting,
          });
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const onSavePressed = () => {
    if (comeFrom === 'InviteChallengeScreen' || comeFrom === 'EditChallenge') {
      navigation.navigate(comeFrom, {
        homeAway:
          authContext?.entity?.uid === teams?.[0]?.user_id ??
          authContext?.entity?.uid === teams?.[0]?.group_id
            ? 'Home'
            : 'Away',
        home_team: teams[0],
        away_team: teams[1],
      });
    } else if (authContext.entity.role === 'team') {
      saveTeam();
    } else {
      saveUser();
    }
  };

  return (
    <SafeAreaView>
      <View>
        <ActivityLoader visible={loading} />

        <TCLabel title={strings.homeAwayTitle} style={{marginRight: 15}} />

        <View>
          <View style={styles.teamContainer}>
            <Text style={styles.homeLableStyle}>{strings.home}</Text>
            <View style={styles.teamViewStyle}>
              <View style={styles.imageShadowView}>
                <Image
                  source={
                    teams[0]?.thumbnail
                      ? {uri: teams[0]?.thumbnail}
                      : images.teamPlaceholder
                  }
                  style={styles.imageView}
                />
              </View>
              <View style={styles.teamTextContainer}>
                <Text style={styles.teamNameLable}>
                  {teams[0]?.name
                    ? 'Challenger'
                    : teams[0]?.entity_type === Verbs.entityTypeUser ||
                      teams[0]?.entity_type === Verbs.entityTypePlayer
                    ? teams[0]?.full_name
                    : teams[0]?.group_name}
                </Text>
                {teams[0]?.city && (
                  <Text style={styles.locationLable}>
                    {`${teams[0]?.city}, ${teams[0]?.state_abbr}`}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.swapContainer}
            onPress={() => swapTeam()}>
            <Image source={images.swapTeam} style={styles.swapImageStyle} />
          </TouchableOpacity>
          <View style={styles.teamContainer}>
            <Text style={styles.homeLableStyle}>{strings.away}</Text>
            <View style={styles.teamViewStyle}>
              <View style={styles.imageShadowView}>
                <Image
                  source={
                    teams[1]?.thumbnail
                      ? {uri: teams[1]?.thumbnail}
                      : images.teamPlaceholder
                  }
                  style={styles.imageView}
                />
              </View>
              <View style={styles.teamTextContainer}>
                <Text style={styles.teamNameLable}>
                  {teams[1]?.name
                    ? 'Challenger'
                    : teams[1]?.entity_type === Verbs.entityTypeUser ||
                      teams[1]?.entity_type === Verbs.entityTypePlayer
                    ? teams[1]?.full_name
                    : teams[1]?.group_name}
                </Text>
                {teams[1]?.city && (
                  <Text style={styles.locationLable}>
                    {`${teams[1]?.city}, ${teams[1]?.state_abbr}`}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },

  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
  },
  homeLableStyle: {
    margin: 15,
    marginRight: 20,
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageShadowView: {
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  imageView: {
    height: 40,
    width: 40,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  swapImageStyle: {
    height: 25,
    width: 25,
    resizeMode: 'cover',
    marginLeft: 20,
  },
  teamNameLable: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  locationLable: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamTextContainer: {
    marginLeft: 20,
  },
  swapContainer: {
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 5,
  },
});
