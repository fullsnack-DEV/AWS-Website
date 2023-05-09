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

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {patchGroup} from '../../../api/Groups';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';

export default function TeamJoinClubScreen({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);

  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const teamCanJoinClubOpetions = [
    {key: strings.everyTeam, id: 0},
    {
      key: strings.acceptedByClub,
      id: 1,
    },
    {key: strings.inviteOnly, id: 2},
  ];

  const [teamCanJoinClub, setTeamCanJoinClub] = useState(
    (route?.params?.teamCanJoinClub === 0 && {
      key: strings.everyTeam,
      id: 0,
    }) ||
      (route?.params?.teamCanJoinClub === 1 && {
        key: strings.acceptedByClub,
        id: 1,
      }) ||
      (route?.params?.teamCanJoinClub === 2 && {
        key: strings.inviteOnly,
        id: 2,
      }),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      // headerTitle: () => (
      //   <Text style={styles.headerTitle}>{strings.whatTeamJoinClub}</Text>
      // ),
      // headerRight: () => (
      //   <Text
      //     style={styles.saveButtonStyle}
      //     onPress={() => {
      //       onSavePressed();
      //     }}>
      //     {strings.save}
      //   </Text>
      // ),
    });
  }, [comeFrom, navigation, teamCanJoinClub]);
  const saveTeam = () => {
    const bodyParams = {};

    if (teamCanJoinClub.key === teamCanJoinClubOpetions[0].key) {
      bodyParams.who_can_join_for_team = 0;
    }
    if (teamCanJoinClub.key === teamCanJoinClubOpetions[1].key) {
      bodyParams.who_can_join_for_team = 1;
    }
    if (teamCanJoinClub.key === teamCanJoinClubOpetions[2].key) {
      bodyParams.who_can_join_for_team = 2;
    }

    setloading(true);
    patchGroup(authContext.entity.uid, bodyParams, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          entity.obj = response.payload;
          authContext.setEntity({...entity});

          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            teamCanJoinClub: response?.payload?.who_can_join_for_team,
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
  const onSavePressed = () => {
    if (
      authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub
    ) {
      saveTeam();
    }
  };

  const renderWhocanJoinOption = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setTeamCanJoinClub(item);
      }}>
      <View style={styles.radioItem}>
        <Text style={styles.languageList}>{item.key}</Text>
        <View style={styles.checkbox}>
          {teamCanJoinClub?.key === item?.key ? (
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
        title={strings.WhatTeamCanJoinClub}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={() => {
          onSavePressed();
        }}
      />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <ActivityLoader visible={loading} />
        <Text style={styles.optionsTitle}>{strings.WhatTeamCanJoinClub}</Text>
        <FlatList
          data={teamCanJoinClubOpetions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderWhocanJoinOption}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('4%'),
    height: 40,
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    width: wp('92%'),
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.5%'),
    height: 40,
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  mainContainer: {
    flex: 1,
  },
  optionsTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 20,
    margin: 15,
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
  checkbox: {},
  radioItem: {
    paddingLeft: 25,
    paddingTop: 15,
    paddingRight: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // saveButtonStyle: {
  //   fontFamily: fonts.RMedium,
  //   fontSize: 16,
  //   marginRight: 10,
  // },
  // headerTitle: {
  //   fontFamily: fonts.RBold,
  //   fontSize: 16,
  //   color: colors.lightBlackColor,
  // },
});
