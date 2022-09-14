/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import {format} from 'react-string-format';

import {patchGroup} from '../../../api/Groups';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import TCGradientButton from '../../../components/TCGradientButton';
import * as Utility from '../../../utils';
import Verbs from '../../../Constants/Verbs';

let entity = {};
const privacyData = [
  Verbs.privacyTypeEveryone,
  Verbs.privacyTypeFollowers,
  Verbs.privacyTypeMembers,
  Verbs.privacyTypeAdmins,
];
export default function MembersViewPrivacyScreen({navigation}) {
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [switchUser, setSwitchUser] = useState({});
  const [member, setMember] = useState(0);
  const [follower, setFollower] = useState(0);
  const [profile, setProfile] = useState(0);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity;
      setSwitchUser(entity);
    };
    getAuthEntity();
    getSelectedData();
  }, []);

  const getSelectedData = () => {
    const privacyMember = entity?.auth?.user?.privacy_members;
    const privacyFollowers = entity?.auth?.user?.privacy_followers;
    const privacyProfile = entity?.auth?.user?.privacy_profile;
    const getIndexFromPrivacy = (privacy) =>
      privacyData?.findIndex((item) => item === privacy);
    setMember(getIndexFromPrivacy(privacyMember));
    setFollower(getIndexFromPrivacy(privacyFollowers));
    if (privacyProfile === Verbs.privacyTypeMembers) setProfile(0);
    else setProfile(1);
  };
  const sendClubSetting = async () => {
    setloading(true);
    const bodyParams = {
      privacy_members:
        (member === 0 && Verbs.privacyTypeEveryone) ||
        (member === 1 && Verbs.privacyTypeFollowers) ||
        (member === 2 && Verbs.privacyTypeMembers) ||
        (member === 3 && Verbs.privacyTypeAdmins),
      privacy_followers:
        (follower === 0 && Verbs.privacyTypeEveryone) ||
        (follower === 1 && Verbs.privacyTypeFollowers) ||
        (follower === 2 && Verbs.privacyTypeMembers) ||
        (follower === 3 && Verbs.privacyTypeAdmins),
      privacy_profile:
        (profile === 0 && Verbs.privacyTypeMembers) ||
        (profile === 1 && Verbs.privacyTypeAdmins),
    };
    console.log('BODY :', bodyParams);
    patchGroup(switchUser.uid, bodyParams, authContext)
      .then(async (response) => {
        console.log('Response :', response.payload);
        const cloneEntity = JSON.parse(JSON.stringify(entity));
        cloneEntity.auth.user = response.payload;
        authContext.setUser({...response.payload});
        authContext.setEntity({...cloneEntity});
        await Utility.setStorage('authContextEntity', {...cloneEntity});
        await Utility.setStorage('authContextUser', {...response.payload});
        setloading(false);
        navigation.goBack();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <ScrollView>
        <Text style={styles.titleStyle}>{strings.connections}</Text>
        <View style={styles.privacyCell}>
          <Text style={styles.privacyNameStyle}>
            {format(strings.whoCanSeeMembersText, switchUser.role)}
          </Text>
          <View style={styles.radioMainView}>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setMember(0)}>
              <Image
                source={
                  member === 0 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>{strings.everyoneTitleText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setMember(1)}>
              <Image
                source={
                  member === 1 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>{strings.followerTitleText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setMember(2)}>
              <Image
                source={
                  member === 2 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>
                {strings.clubTeamMembersText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setMember(3)}>
              <Image
                source={
                  member === 3 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>
                {strings.onlyClubTeamAdminsText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.privacyCell}>
          <Text style={styles.privacyNameStyle}>
            {format(strings.whoCanSeeFollowersText, switchUser.role)}
          </Text>
          <View style={styles.radioMainView}>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setFollower(0)}>
              <Image
                source={
                  follower === 0 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>{strings.everyoneTitleText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setFollower(1)}>
              <Image
                source={
                  follower === 1 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>{strings.followerTitleText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setFollower(2)}>
              <Image
                source={
                  follower === 2 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>
                {strings.clubTeamMembersText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setFollower(3)}>
              <Image
                source={
                  follower === 3 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>
                {strings.onlyClubTeamAdminsText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.privacyCell}>
          <Text style={styles.privacyNameStyle}>
            {strings.whoCanSeeMemberProfileText}
          </Text>
          <View style={styles.radioMainView}>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setProfile(0)}>
              <Image
                source={
                  profile === 0 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>{strings.clubMembersRadio}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => setProfile(1)}>
              <Image
                source={
                  profile === 1 ? images.radioSelect : images.radioUnselect
                }
                style={styles.radioImage}
              />
              <Text style={styles.radioText}>
                {strings.onlyClubTeamAdminsText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TCGradientButton
        title={strings.saveTitle}
        onPress={() => sendClubSetting()}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  titleStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    padding: 15,
    color: colors.lightBlackColor,
  },
  privacyCell: {
    flexDirection: 'column',
    margin: 15,
  },
  privacyNameStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  radioButtonView: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 15,
  },
  radioMainView: {
    flexDirection: 'column',
  },
  radioText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    alignSelf: 'center',
    marginRight: 15,
    color: colors.lightBlackColor,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
