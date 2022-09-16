/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import React, {useState, useContext} from 'react';
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

import {patchGroup} from '../../../api/Groups';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import TCGradientButton from '../../../components/TCGradientButton';
import * as Utility from '../../../utils';

export default function MembersViewPrivacyScreen({navigation}) {
  // For activity indigator
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [member, setMember] = useState(
    authContext.entity.obj.who_can_see_member ?? 0,
  );
  const [follower, setFollower] = useState(
    authContext.entity.obj.who_can_see_follower ?? 0,
  );
  const [profile, setProfile] = useState(
    authContext.entity.obj.who_can_see_member_profile ?? 0,
  );

  const saveGroupSetting = () => {
    setloading(true);
    const bodyParams = {
      who_can_see_member: member,
      who_can_see_follower: follower,
      who_can_see_member_profile: profile,
    };
    console.log('BODY :', bodyParams);
    patchGroup(authContext.entity.uid, bodyParams, authContext)
      .then(async (response) => {
        console.log('Response :', response.payload);
        const entity = authContext.entity;
        entity.obj = response.payload;
        authContext.setEntity({...entity});

        await Utility.setStorage('authContextEntity', {...entity});
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
          <Text
            style={
              styles.privacyNameStyle
            }>{`Who can see members in ${authContext.entity.role} connections?`}</Text>
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
          <Text
            style={
              styles.privacyNameStyle
            }>{`Who can see followers in ${authContext.entity.role} connections?`}</Text>
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
        onPress={() => saveGroupSetting()}
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
