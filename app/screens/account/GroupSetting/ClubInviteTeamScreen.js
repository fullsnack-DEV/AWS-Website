/* eslint-disable no-bitwise */
import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  Text,
  Alert,
  SafeAreaView,
} from 'react-native';

// import {widthPercentageToDP} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {patchGroup} from '../../../api/Groups';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import ScreenHeader from '../../../components/ScreenHeader';

export default function ClubInviteTeamScreen({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);

  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const clubInviteTeamOpetions = [
    {key: strings.yes, id: 0},
    {
      key: strings.no,
      id: 1,
    },
  ];

  const [clubInviteTeam, setClubInviteTeam] = useState(
    (route?.params?.clubInviteTeam === 1 && {
      key: strings.yes,
      id: 0,
    }) ||
      (route?.params?.clubInviteTeam === 0 && {
        key: strings.no,
        id: 1,
      }),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const saveTeam = () => {
    const bodyParams = {};

    if (clubInviteTeam.key === clubInviteTeamOpetions[0].key) {
      bodyParams.who_can_invite_for_club = 1;
    }
    if (clubInviteTeam.key === clubInviteTeamOpetions[1].key) {
      bodyParams.who_can_invite_for_club = 0;
    }

    setloading(true);
    patchGroup(authContext.entity.uid, bodyParams, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          await Utility.setAuthContextData(response.payload, authContext);
          navigation.navigate(comeFrom, {
            clubInviteTeam: response.payload?.who_can_invite_for_club,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSaveButtonClicked = () => {
    if (
      authContext.entity.role === 'team' ||
      authContext.entity.role === 'club'
    ) {
      saveTeam();
    }
  };

  const renderClubInviteTeam = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setClubInviteTeam(item);
      }}>
      <View style={styles.radioItem}>
        <Text style={styles.languageList}>{item.key}</Text>
        <View style={styles.checkbox}>
          {clubInviteTeam?.key === item?.key ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.canClubInviteTeamText}
        leftIcon={images.backArrow}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={() => {
          onSaveButtonClicked();
        }}
        leftIconPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <ActivityLoader visible={loading} />
        <Text style={styles.opetionsTitle}>
          {strings.canClubInviteYourTeamText}
        </Text>
        <FlatList
          data={clubInviteTeamOpetions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderClubInviteTeam}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  opetionsTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 20,
    marginHorizontal: 15,
    lineHeight: 30,
    marginTop: 20,
  },
  languageList: {
    width: '90%',
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  radioItem: {
    paddingLeft: 25,
    paddingTop: 15,
    paddingRight: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
