/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import React, {useState, useContext, useLayoutEffect, useEffect} from 'react';
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
import Modal from 'react-native-modal';
import {format} from 'react-string-format';

import {getGroupDetails, patchGroup} from '../../../api/Groups';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';

import * as Utility from '../../../utils';
import Verbs from '../../../Constants/Verbs';

export default function MembersViewPrivacyScreen({navigation, route}) {
  // For activity indigator
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [grpInfo, setGrpInfo] = useState();

  const [OpenInfo, setOpenInfo] = useState(false);

  const [modalstring, setModalString] = useState('');
  const [obj, SetObj] = useState({
    members:
      authContext.entity.obj.who_can_see_member ??
      Verbs.PRIVACY_GROUP_MEMBER_EVERYONE,
    followers:
      authContext.entity.obj.who_can_see_follower ??
      Verbs.PRIVACY_GROUP_MEMBER_EVERYONE,
    profiles:
      authContext.entity.obj.who_can_see_member_profile ??
      Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS,
  });

  // constants

  const callGroup = async (groupID, authContext) => {
    const response = await getGroupDetails(groupID, authContext);

    setGrpInfo(response.payload);
    SetObj({
      members: response.payload.who_can_see_member,
      followers: response.payload.who_can_see_follower,
      profiles: response.payload.who_can_see_member_profile,
    });
  };

  useEffect(() => {
    if (route.params?.groupID) {
      callGroup(route.params?.groupID, authContext);
    }
  }, [route.params?.groupID, authContext]);

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

  const OpenInfoModal = () => (
    <Modal
      isVisible={OpenInfo}
      onBackdropPress={() => setOpenInfo(false)}
      animationInTiming={300}
      animationOutTiming={800}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={800}
      style={{
        margin: 0,
      }}>
      <View behavior="height" enabled={false} style={styles.modalContainer}>
        <View style={styles.modalHeight}>
          <View
            style={{
              marginTop: 16,
            }}>
            <View style={styles.modalHandle} />
          </View>
          <Text style={styles.modalText}>
            {format(strings.infoPrivacyTeamMember, modalstring)}
          </Text>
        </View>
      </View>
    </Modal>
  );

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
      <OpenInfoModal />
      <ScrollView>
        <Text style={styles.titleStyle}>{strings.membersTitle}</Text>
        <View style={[styles.privacyCell, {marginTop: 15}]}>
          <Text style={styles.privacyNameStyle}>{strings.whocanseeMember}</Text>
          <View style={styles.radioMainView}>
            <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => {
                SetObj({...obj, members: Verbs.PRIVACY_GROUP_MEMBER_EVERYONE});
              }}>
              <Text style={styles.radioText}>{strings.everyoneTitleText}</Text>
              <Image
                source={
                  obj.members === Verbs.PRIVACY_GROUP_MEMBER_EVERYONE
                    ? images.radioRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioImage}
              />
            </TouchableOpacity>

            {grpInfo?.parent_groups?.length >= 1 &&
            authContext.entity.role === Verbs.entityTypeTeam ? (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  SetObj({
                    ...obj,
                    members: Verbs.PRIVACY_GROUP_MEMBER_FOLLOWER,
                  });
                }}>
                <Text style={styles.radioText}>
                  {strings.folloersAndClubMembers}
                </Text>
                <Image
                  source={
                    obj.members === Verbs.PRIVACY_GROUP_MEMBER_FOLLOWER
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
                  SetObj({
                    ...obj,
                    members: Verbs.PRIVACY_GROUP_MEMBER_FOLLOWER,
                  });
                }}>
                <Text style={styles.radioText}>
                  {strings.followerTitleText}
                </Text>
                <Image
                  source={
                    obj.members === Verbs.PRIVACY_GROUP_MEMBER_FOLLOWER
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {grpInfo?.parent_groups?.length >= 1 &&
              authContext.entity.role === Verbs.entityTypeTeam && (
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    SetObj({
                      ...obj,
                      members: Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS,
                    });
                  }}>
                  <Text style={styles.radioText}>{strings.clubMember}</Text>
                  <Image
                    source={
                      obj.members === Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS
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
                  SetObj({
                    ...obj,
                    members: Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS,
                  });
                }}>
                <Text style={styles.radioText}>{strings.clubMember}</Text>
                <Image
                  source={
                    obj.members === Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {authContext.entity.role === Verbs.entityTypeTeam && (
              <>
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    SetObj({
                      ...obj,
                      members: Verbs.PRIVACY_GROUP_MEMBER_TEAMMEMBERS,
                    });
                  }}>
                  <View style={styles.infoIconContainer}>
                    <Text style={styles.radioText}>{strings.teamMember}</Text>
                    <Pressable
                      onPress={() => {
                        setOpenInfo(true);

                        setModalString('members');
                      }}>
                      <Image
                        source={images.infoIcon}
                        style={{
                          height: 15,
                          width: 15,
                          marginLeft: -9,
                          marginTop: 3,
                          display:
                            grpInfo?.parent_groups?.length >= 1
                              ? 'flex'
                              : 'none',
                        }}
                      />
                    </Pressable>
                  </View>

                  <Image
                    source={
                      obj.members === Verbs.PRIVACY_GROUP_MEMBER_TEAMMEMBERS
                        ? images.radioRoundOrange
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
                {grpInfo?.parent_groups?.length >= 1 &&
                  authContext.entity.role === Verbs.entityTypeTeam && (
                    <Text
                      style={[
                        styles.radioText,
                        {
                          color: colors.userPostTimeColor,
                          fontSize: 14,
                          fontFamily: fonts.RRegular,
                          marginTop: 14,
                          alignSelf: 'flex-start',
                        },
                      ]}>
                      {strings.clubteamPrivacyText}
                    </Text>
                  )}
              </>
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
                SetObj({
                  ...obj,
                  followers: Verbs.PRIVACY_GROUP_MEMBER_EVERYONE,
                });
              }}>
              <Text style={styles.radioText}>{strings.everyoneTitleText}</Text>
              <Image
                source={
                  obj.followers === Verbs.PRIVACY_GROUP_MEMBER_EVERYONE
                    ? images.radioRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioImage}
              />
            </TouchableOpacity>

            {grpInfo?.parent_groups?.length >= 1 &&
            authContext.entity.role === Verbs.entityTypeTeam ? (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  SetObj({
                    ...obj,
                    followers: Verbs.PRIVACY_GROUP_MEMBER_FOLLOWER,
                  });
                }}>
                <Text style={styles.radioText}>
                  {strings.folloersAndClubMembers}
                </Text>
                <Image
                  source={
                    obj.followers === Verbs.PRIVACY_GROUP_MEMBER_FOLLOWER
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
                  SetObj({
                    ...obj,
                    followers: Verbs.PRIVACY_GROUP_MEMBER_FOLLOWER,
                  });
                }}>
                <Text style={styles.radioText}>
                  {strings.followerTitleText}
                </Text>
                <Image
                  source={
                    obj.followers === Verbs.PRIVACY_GROUP_MEMBER_FOLLOWER
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {grpInfo?.parent_groups?.length >= 1 &&
              authContext.entity.role === Verbs.entityTypeTeam && (
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    SetObj({
                      ...obj,
                      followers: Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS,
                    });
                  }}>
                  <Text style={styles.radioText}>{strings.clubMember}</Text>
                  <Image
                    source={
                      obj.followers === Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS
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
                  SetObj({
                    ...obj,
                    followers: Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS,
                  });
                }}>
                <Text style={styles.radioText}>{strings.clubMember}</Text>
                <Image
                  source={
                    obj.followers === Verbs.PRIVACY_GROUP_MEMBER_CLUBMEMBERS
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {authContext.entity.role === Verbs.entityTypeTeam && (
              <>
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    SetObj({
                      ...obj,
                      followers: Verbs.PRIVACY_GROUP_MEMBER_TEAMMEMBERS,
                    });
                  }}>
                  <Pressable
                    hitSlop={Utility.getHitSlop(15)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.radioText}>{strings.teamMember}</Text>
                  </Pressable>

                  <Image
                    source={
                      obj.followers === Verbs.PRIVACY_GROUP_MEMBER_TEAMMEMBERS
                        ? images.radioRoundOrange
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>

                {grpInfo?.parent_groups?.length >= 1 &&
                  authContext.entity.role === Verbs.entityTypeTeam && (
                    <Text
                      style={[
                        styles.radioText,
                        {
                          color: colors.userPostTimeColor,
                          fontSize: 14,
                          fontFamily: fonts.RRegular,
                          marginTop: 14,
                          alignSelf: 'flex-start',
                        },
                      ]}>
                      {strings.clubteamPrivacyTextFollwers}
                    </Text>
                  )}
              </>
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
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  modalText: {
    marginTop: 24,
    marginBottom: 25,
    lineHeight: 24,
    fontSize: 16,
    fontFamily: fonts.RRegular,

    paddingLeft: 24,
    paddingRight: 21,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: colors.modalHandleColor,
  },
  modalHeight: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',

    flexDirection: 'row',
  },
});
