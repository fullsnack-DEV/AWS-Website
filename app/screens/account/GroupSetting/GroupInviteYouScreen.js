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
} from 'react-native';
import {format} from 'react-string-format';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import {patchPlayer} from '../../../api/Users';

export default function GroupInviteYouScreen({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const groupInviteOpetions = [
    {
      key: strings.yes,
      id: 0,
    },
    {
      key: strings.no,
      id: 1,
    },
  ];

  const [groupInviteYou, setGroupInviteYou] = useState(
    (route?.params?.groupInviteYou === 1 && {
      key: strings.yes,
      id: 0,
    }) ||
      (route?.params?.groupInviteYou === 0 && {
        key: strings.no,
        id: 1,
      }),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>{`Can ${Utility.capitalize(
          route?.params?.type,
        )} Invite You`}</Text>
      ),
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            if (
              authContext.entity.role === 'user' ||
              authContext.entity.role === 'player'
            ) {
              saveUser();
            }
          }}>
          Save
        </Text>
      ),
    });
  }, [
    comeFrom,
    navigation,
    groupInviteYou,
    route?.params?.type,
    authContext.entity.role,
  ]);

  const saveUser = () => {
    const bodyParams = {};

    if (groupInviteYou.key === groupInviteOpetions[0].key) {
      if (route?.params?.type === 'team') {
        bodyParams.who_can_invite_for_team = 1;
      } else {
        bodyParams.who_can_invite_for_club = 1;
      }
    }
    if (groupInviteYou.key === groupInviteOpetions[1].key) {
      if (route?.params?.type === 'team') {
        bodyParams.who_can_invite_for_team = 0;
      } else {
        bodyParams.who_can_invite_for_club = 0;
      }
    }

    setloading(true);
    patchPlayer(bodyParams, authContext)
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
            type: route?.params?.type,
            groupInviteYou:
              route?.params?.type === 'team'
                ? response?.payload?.who_can_invite_for_team
                : response?.payload?.who_can_invite_for_club,
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

  const renderWhocanJoinOption = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setGroupInviteYou(item);
      }}>
      <View style={styles.radioItem}>
        <Text style={styles.languageList}>{item.key}</Text>
        <View style={styles.checkbox}>
          {groupInviteYou?.key === item?.key ? (
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
    <ScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}>
      <ActivityLoader visible={loading} />
      <Text style={styles.opetionsTitle}>
        {format(
          strings.canInviteYouToJoinText,
          route?.params?.type,
          route?.params?.type,
        )}
      </Text>
      <FlatList
        data={groupInviteOpetions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderWhocanJoinOption}
      />
    </ScrollView>
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
  opetionsTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
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
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
