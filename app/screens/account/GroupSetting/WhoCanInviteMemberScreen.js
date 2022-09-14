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

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {patchGroup} from '../../../api/Groups';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';

const whoCanInviteTeamOpetions = [
  {key: 'Team & members', id: 1},
  {key: 'Team only', id: 2},
];

const whoCanInviteClubOpetions = [
  {key: 'Club & members', id: 1},
  {key: 'Club only', id: 2},
];
export default function WhoCanInviteMemberScreen({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);

  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const [whoCanInvite, setWhoCanInvite] = useState(
    (route?.params?.whoCanInviteGroup === 1 && {
      key: `${
        authContext.entity.role === 'team' ? 'Team & members' : 'Club & members'
      }`,
      id: 1,
    }) ||
      (route?.params?.whoCanInviteGroup === 0 && {
        key: `${
          authContext.entity.role === 'team' ? 'Team Only' : 'Club only'
        }`,
        id: 2,
      }),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>Who Can Invite Member</Text>
      ),
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            onSavePressed();
          }}>
          Save
        </Text>
      ),
    });
  }, [comeFrom, navigation, whoCanInvite]);

  const saveTeam = () => {
    const bodyParams = {};

    if (authContext.entity.role === 'team') {
      if (whoCanInvite.key === whoCanInviteTeamOpetions[0].key) {
        bodyParams.who_can_invite_member = 1;
      }
      if (whoCanInvite.key === whoCanInviteTeamOpetions[1].key) {
        bodyParams.who_can_invite_member = 0;
      }
    } else {
      if (whoCanInvite.key === whoCanInviteClubOpetions[0].key) {
        bodyParams.who_can_invite_member = 1;
      }
      if (whoCanInvite.key === whoCanInviteClubOpetions[1].key) {
        bodyParams.who_can_invite_member = 0;
      }
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
            whoCanInviteGroup: response?.payload?.who_can_invite_member,
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
      authContext.entity.role === 'team' ||
      authContext.entity.role === 'club'
    ) {
      saveTeam();
    }
  };

  const renderWhoCanInvite = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setWhoCanInvite(item);
      }}>
      <View style={styles.radioItem}>
        <Text style={styles.languageList}>{item.key}</Text>
        <View style={styles.checkbox}>
          {whoCanInvite?.key === item?.key ? (
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
      <Text
        style={
          styles.opetionsTitle
        }>{`Who can invite a member to ${authContext.entity.role}?`}</Text>
      <FlatList
        // ItemSeparatorComponent={() => <TCThinDivider />}
        data={
          authContext.entity.role === 'team'
            ? whoCanInviteTeamOpetions
            : whoCanInviteClubOpetions
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderWhoCanInvite}
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
