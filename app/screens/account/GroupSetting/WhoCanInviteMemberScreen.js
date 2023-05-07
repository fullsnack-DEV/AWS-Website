import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
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

const whoCanInviteTeamOptions = [
  {key: strings.teamAndMembersText, id: 1},
  {key: strings.teamOnly, id: 0},
];

const whoCanInviteClubOptions = [
  {key: strings.clubAndMembersText, id: 1},
  {key: strings.clubOnly, id: 0},
];
export default function WhoCanInviteMemberScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [whoCanInvite, setWhoCanInvite] = useState(
    authContext.entity.obj.who_can_invite_member ?? 0,
  );

  const [whoCanJoinGroupOpetions] = useState(
    authContext.entity.role === Verbs.entityTypeClub
      ? whoCanInviteClubOptions
      : whoCanInviteTeamOptions,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const saveTeam = () => {
    const bodyParams = {who_can_invite_member: whoCanInvite};

    setloading(true);
    patchGroup(authContext.entity.uid, bodyParams, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          await Utility.setAuthContextData(response.payload, authContext);
          navigation.goBack();
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

  const renderWhoCanInvite = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setWhoCanInvite(item.id);
      }}
      style={styles.radioItem}>
      <View style={{flex: 1}}>
        <Text style={styles.labelText}>{item.key}</Text>
      </View>
      <View style={styles.checkbox}>
        {whoCanInvite === item.id ? (
          <Image source={images.radioCheckYellow} style={styles.checkboxImg} />
        ) : (
          <Image source={images.radioUnselect} style={styles.checkboxImg} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.whoCanInviteMemberText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={() => {
          saveTeam();
        }}
      />
      <ActivityLoader visible={loading} />
      <Text style={styles.opetionsTitle}>
        {authContext.entity.role === Verbs.entityTypeClub
          ? strings.whoCanInviteMemberToClub
          : strings.whoCanInviteMemberToTeam}
      </Text>
      <FlatList
        data={whoCanJoinGroupOpetions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderWhoCanInvite}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  opetionsTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginTop: 20,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  labelText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 15,
  },
});
