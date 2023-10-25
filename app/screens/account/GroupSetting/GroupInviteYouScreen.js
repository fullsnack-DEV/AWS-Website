import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Text,
  Alert,
  SafeAreaView,
  Pressable,
} from 'react-native';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import {patchPlayer} from '../../../api/Users';
import ScreenHeader from '../../../components/ScreenHeader';
import {
  doublesInviteOptionsList,
  eventsInviteOptionsList,
  groupInviteOptionsList,
} from '../../../Constants/GeneralConstants';

export default function GroupInviteYouScreen({navigation, route}) {
  const {groupInviteYou, type, comeFrom, routeParams} = route.params;
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [value, setValue] = useState(groupInviteYou);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const saveUser = () => {
    const bodyParams = {};

    if (type === strings.inviteToDoubleTeamTitle) {
      bodyParams.who_can_invite_for_doubles_team = value;
    }
    if (type === strings.canTeamInviteYou) {
      bodyParams.who_can_invite_for_team = value;
    }
    if (type === strings.canClubInviteYou) {
      bodyParams.who_can_invite_for_club = value;
    }

    if (type === strings.whoCanInviteYouToEvent) {
      bodyParams.invite_me_event = value;
    }

    setloading(true);
    patchPlayer(bodyParams, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          await Utility.setAuthContextData(response.payload, authContext);
          navigation.navigate(comeFrom, {
            ...routeParams,
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

  const getTitle = (option) => {
    switch (option) {
      case strings.inviteToDoubleTeamTitle:
        return strings.whoCanInviteYouToDoubleTeam;

      case strings.canTeamInviteYou:
        return strings.canTeamInviteYouToJoinTeam;

      case strings.canClubInviteYou:
        return strings.canClubInviteYouToJoinClub;

      case strings.whoCanInviteYouToEvent:
        return strings.whoCanInviteToTheirEvent;

      default:
        return strings.whoCanInviteYouToDoubleTeam;
    }
  };

  const renderWhocanJoinOption = ({item}) => (
    <Pressable
      onPress={() => {
        setValue(item.id);
      }}
      style={styles.listItem}>
      <Text style={styles.listText}>{item.key}</Text>
      <View>
        {value === item.id ? (
          <Image source={images.radioCheckYellow} style={styles.checkboxImg} />
        ) : (
          <Image source={images.radioUnselect} style={styles.checkboxImg} />
        )}
      </View>
    </Pressable>
  );

  const getOptions = () => {
    if (type === strings.inviteToDoubleTeamTitle) {
      return doublesInviteOptionsList;
    }

    if (type === strings.whoCanInviteYouToEvent) {
      return eventsInviteOptionsList;
    }
    return groupInviteOptionsList;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={type}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        containerStyle={styles.headerRow}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={() => saveUser()}
        labelStyle={{marginLeft: 29, marginRight: 14}}
      />
      <ActivityLoader visible={loading} />
      <View style={{paddingHorizontal: 15, paddingTop: 25}}>
        <Text style={styles.opetionsTitle}>{getTitle(type)}</Text>
        <FlatList
          data={getOptions()}
          keyExtractor={(item) => item.key}
          renderItem={renderWhocanJoinOption}
        />
        {type === strings.inviteToDoubleTeamTitle && (
          <Text style={[styles.listText, {marginTop: 35}]}>
            {strings.doublesTeamInviteDescriptionText}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 14,
  },
  opetionsTitle: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 23,
  },
  listText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
