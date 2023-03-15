/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import React, {useState, useContext, useLayoutEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';

import {patchGroup} from '../../../api/Groups';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';

import * as Utility from '../../../utils';
import Verbs from '../../../Constants/Verbs';

export default function MembersViewPrivacyScreen({navigation}) {
  // For activity indigator
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [member, setMember] = useState(
    authContext.entity.obj.who_can_see_member ?? 1,
  );
  const [follower, setFollower] = useState(
    authContext.entity.obj.who_can_see_follower ?? 1,
  );
  const [profile, setProfile] = useState(
    authContext.entity.obj.who_can_see_member_profile ?? 3,
  );

  const [obj, SetObj] = useState({
    members: 3,
    followers: 0,
    profiles: 0,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
          }}>
          <Pressable
            onPress={() => {
              saveGroupSetting();
            }}>
            <Text
              style={{
                fontFamily: fonts.RMedium,
                fontSize: 16,
              }}>
              {strings.save}
            </Text>
          </Pressable>
        </View>
      ),
      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [obj]);

  const saveGroupSetting = () => {
    setloading(true);
    const bodyParams = {
      who_can_see_member: obj.members,
      who_can_see_follower: obj.followers,
      who_can_see_member_profile: obj.profiles,
    };

    patchGroup(authContext.entity.uid, bodyParams, authContext)
      .then(async (response) => {
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
        <Text style={styles.titleStyle}>{strings.membersTitle}</Text>
        <View style={[styles.privacyCell, {marginTop: 15}]}>
          <Text style={styles.privacyNameStyle}>{strings.whocanseeMember}</Text>
          <View style={styles.radioMainView}>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => {
                setMember(0);
                SetObj({...obj, members: 0});
              }}>
              <Text style={styles.radioText}>{strings.everyoneTitleText}</Text>
              <Image
                source={
                  member === 0 ? images.radioRoundOrange : images.radioUnselect
                }
                style={styles.radioImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => {
                setMember(1);
                SetObj({...obj, members: 1});
              }}>
              <Text style={styles.radioText}>{strings.followerTitleText}</Text>
              <Image
                source={
                  member === 1 ? images.radioRoundOrange : images.radioUnselect
                }
                style={styles.radioImage}
              />
            </TouchableOpacity>
            {authContext.entity.role === Verbs.entityTypeTeam && (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  setMember(2);
                  SetObj({...obj, members: 2});
                }}>
                <Text style={styles.radioText}>{strings.teamMember}</Text>
                <Image
                  source={
                    member === 2
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {authContext.entity.auth?.user?.parent_groups?.length >= 1 &&
              authContext.entity.role === Verbs.entityTypeTeam && (
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    setMember(3);
                    SetObj({...obj, members: 3});
                  }}>
                  <Text style={styles.radioText}>{strings.clubMember}</Text>
                  <Image
                    source={
                      member === 3
                        ? images.radioRoundOrange
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
              )}
            {authContext.entity.role === Verbs.entityTypeClub && (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  setMember(3);
                  SetObj({...obj, members: 3});
                }}>
                <Text style={styles.radioText}>{strings.clubMember}</Text>
                <Image
                  source={
                    member === 3
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.privacyCell}>
          <Text style={styles.privacyNameStyle}>
            {strings.whoCanSeefollwer}
          </Text>
          <View style={styles.radioMainView}>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => {
                setFollower(0);
                SetObj({...obj, followers: 0});
              }}>
              <Text style={styles.radioText}>{strings.everyoneTitleText}</Text>
              <Image
                source={
                  follower === 0
                    ? images.radioRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => {
                setFollower(1);
                SetObj({...obj, followers: 1});
              }}>
              <Text style={styles.radioText}>{strings.followerTitleText}</Text>
              <Image
                source={
                  follower === 1
                    ? images.radioRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioImage}
              />
            </TouchableOpacity>
            {authContext.entity.role === Verbs.entityTypeTeam && (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  setFollower(2);
                  SetObj({...obj, followers: 2});
                }}>
                <Text style={styles.radioText}>{strings.teamMember}</Text>
                <Image
                  source={
                    follower === 2
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}
            {authContext.entity.auth?.user?.parent_groups?.length >= 1 &&
              authContext.entity.role === Verbs.entityTypeTeam && (
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    setFollower(3);
                    SetObj({...obj, followers: 3});
                  }}>
                  <Text style={styles.radioText}>{strings.clubMember}</Text>
                  <Image
                    source={
                      follower === 3
                        ? images.radioRoundOrange
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
              )}
            {authContext.entity.role === Verbs.entityTypeClub && (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  setFollower(3);
                  SetObj({...obj, followers: 3});
                }}>
                <Text style={styles.radioText}>{strings.clubMember}</Text>
                <Image
                  source={
                    follower === 3
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.privacyCell}>
          <Text style={styles.privacyNameStyle}>
            {strings.whoCanSeeMemberProfileText}
          </Text>
          <View style={styles.radioMainView}>
            {authContext.entity.role === Verbs.entityTypeTeam && (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  setProfile(2);
                  SetObj({...obj, profiles: 2});
                }}>
                <Text style={styles.radioText}>{strings.teamMember}</Text>
                <Image
                  source={
                    profile === 2
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}
            {authContext.entity.auth?.user?.parent_groups?.length >= 1 &&
              authContext.entity.role === Verbs.entityTypeTeam && (
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    setProfile(3);
                    SetObj({...obj, profiles: 3});
                  }}>
                  <Text style={styles.radioText}>{strings.clubMember}</Text>
                  <Image
                    source={
                      profile === 3
                        ? images.radioRoundOrange
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
              )}

            {authContext.entity.role === Verbs.entityTypeClub && (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  setProfile(3);
                  SetObj({...obj, profiles: 3});
                }}>
                <Text style={styles.radioText}>{strings.clubMember}</Text>
                <Image
                  source={
                    profile === 3
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {authContext.entity.auth?.user?.parent_groups?.length >= 1 ? (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  setProfile(6);
                  SetObj({...obj, profiles: 6});
                }}>
                <Text style={styles.radioText}>{strings.onlyTeamAndclub}</Text>
                <Image
                  source={
                    profile === 6
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  setProfile(6);
                  SetObj({...obj, profiles: 6});
                }}>
                <Text style={styles.radioText}>{strings.onlyClub}</Text>
                <Image
                  source={
                    profile === 6
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  titleStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    marginTop: 15,
    color: colors.lightBlackColor,
    lineHeight: 24,
    marginLeft: 15,
    textTransform: 'uppercase',
  },
  privacyCell: {
    flexDirection: 'column',
    marginLeft: 30,
    marginRight: 15,
    marginTop: 35,
  },
  privacyNameStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,

    marginLeft: -15,
  },
  radioButtonView: {
    flexDirection: 'row',
    marginTop: 15,

    justifyContent: 'space-between',
  },
  radioMainView: {
    flexDirection: 'column',
  },
  radioText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    // marginLeft: 15,
    alignSelf: 'center',
    marginRight: 15,
    color: colors.lightBlackColor,
    lineHeight: 24,

    margin: 0,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
