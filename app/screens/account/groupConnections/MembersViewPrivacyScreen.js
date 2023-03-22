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
  const [modalstring, setModalString] = useState('');

  const [OpenInfo, setOpenInfo] = useState(false);
  const [obj, SetObj] = useState({
    members: authContext.entity.obj.who_can_see_member ?? 0,
    followers: authContext.entity.obj.who_can_see_follower ?? 0,
    profiles: authContext.entity.obj.who_can_see_member_profile ?? 3,
  });

  // constants

  const callGroup = async (groupID, authContext) => {
    const response = await getGroupDetails(groupID, authContext);

    SetObj({
      members: response.payload.who_can_see_member,
      followers: response.payload.who_can_see_follower,
      profiles: response.payload.who_can_see_member_profile,
    });
  };

  const PRIVACY_GROUP_MEMBER_EVERYONE = 0;
  const PRIVACY_GROUP_MEMBER_FOLLOWER = 1;
  const PRIVACY_GROUP_MEMBER_TEAMMEMBERS = 2;
  const PRIVACY_GROUP_MEMBER_CLUBMEMBERS = 3;
  const PRIVACY_GROUP_MEMBER_TEAM = 4;
  const PRIVACY_GROUP_MEMBER_CLUB = 5;
  const PRIVACY_GROUP_MEMBER_TEAMCLUB = 6;

  useEffect(() => {
    callGroup(route.params?.groupID, authContext);
  }, []);

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
      <View
        behavior="height"
        enabled={false}
        style={{
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
        }}>
        <View
          style={{
            height: 140,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginTop: 16,
            }}>
            <View
              style={{
                width: 40,
                height: 5,
                backgroundColor: colors.modalHandleColor,
              }}
            />
          </View>
          <Text
            style={{
              marginTop: 24,
              marginBottom: 25,
              lineHeight: 24,
              fontSize: 16,
              fontFamily: fonts.RRegular,

              paddingLeft: 24,
              paddingRight: 21,
            }}>
            {format(strings.infoPrivacyTeamMember, modalstring)}
          </Text>
        </View>
      </View>
    </Modal>
  );

  // render team and club differently

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
                SetObj({...obj, members: PRIVACY_GROUP_MEMBER_EVERYONE});
              }}>
              <Text style={styles.radioText}>{strings.everyoneTitleText}</Text>
              <Image
                source={
                  obj.members === PRIVACY_GROUP_MEMBER_EVERYONE
                    ? images.radioRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioImage}
              />
            </TouchableOpacity>

            {authContext.entity.obj.parent_groups?.length >= 1 &&
            authContext.entity.role === Verbs.entityTypeTeam ? (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  SetObj({...obj, members: PRIVACY_GROUP_MEMBER_FOLLOWER});
                }}>
                <Text style={styles.radioText}>
                  {strings.folloersAndClubMembers}
                </Text>
                <Image
                  source={
                    obj.members === PRIVACY_GROUP_MEMBER_FOLLOWER
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
                  SetObj({...obj, members: PRIVACY_GROUP_MEMBER_FOLLOWER});
                }}>
                <Text style={styles.radioText}>
                  {strings.followerTitleText}
                </Text>
                <Image
                  source={
                    obj.members === PRIVACY_GROUP_MEMBER_FOLLOWER
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {authContext.entity.obj.parent_groups?.length >= 1 &&
              authContext.entity.role === Verbs.entityTypeTeam && (
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    SetObj({...obj, members: PRIVACY_GROUP_MEMBER_CLUBMEMBERS});
                  }}>
                  <Text style={styles.radioText}>{strings.clubMember}</Text>
                  <Image
                    source={
                      obj.members === PRIVACY_GROUP_MEMBER_CLUBMEMBERS
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
                  SetObj({...obj, members: PRIVACY_GROUP_MEMBER_CLUBMEMBERS});
                }}>
                <Text style={styles.radioText}>{strings.clubMember}</Text>
                <Image
                  source={
                    obj.members === PRIVACY_GROUP_MEMBER_CLUBMEMBERS
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {authContext.entity.role === Verbs.entityTypeTeam && (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  SetObj({...obj, members: PRIVACY_GROUP_MEMBER_TEAMMEMBERS});
                }}>
                <Pressable
                  onPress={() => {
                    setOpenInfo(true);

                    setModalString('members');
                  }}
                  hitSlop={Utility.getHitSlop(15)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.radioText}>{strings.teamMember}</Text>
                  <Image
                    source={images.infoIcon}
                    style={{
                      height: 15,
                      width: 15,
                      marginLeft: -9,
                      marginTop: 3,
                      display:
                        authContext.entity.obj.parent_groups?.length >= 1
                          ? 'flex'
                          : 'none',
                    }}
                  />
                </Pressable>

                <Image
                  source={
                    obj.members === PRIVACY_GROUP_MEMBER_TEAMMEMBERS
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
                SetObj({...obj, followers: PRIVACY_GROUP_MEMBER_EVERYONE});
              }}>
              <Text style={styles.radioText}>{strings.everyoneTitleText}</Text>
              <Image
                source={
                  obj.followers === PRIVACY_GROUP_MEMBER_EVERYONE
                    ? images.radioRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioImage}
              />
            </TouchableOpacity>

            {authContext.entity.obj.parent_groups?.length >= 1 &&
            authContext.entity.role === Verbs.entityTypeTeam ? (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  SetObj({...obj, followers: PRIVACY_GROUP_MEMBER_FOLLOWER});
                }}>
                <Text style={styles.radioText}>
                  {strings.folloersAndClubMembers}
                </Text>
                <Image
                  source={
                    obj.followers === PRIVACY_GROUP_MEMBER_FOLLOWER
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
                  SetObj({...obj, followers: PRIVACY_GROUP_MEMBER_FOLLOWER});
                }}>
                <Text style={styles.radioText}>
                  {strings.followerTitleText}
                </Text>
                <Image
                  source={
                    obj.followers === PRIVACY_GROUP_MEMBER_FOLLOWER
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {/* <TouchableOpacity
              style={styles.radioButtonView}
              onPress={() => {
                SetObj({...obj, followers: 1});
              }}>
              <Text style={styles.radioText}>{strings.followerTitleText}</Text>
              <Image
                source={
                  obj.followers === 1
                    ? images.radioRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioImage}
              />
            </TouchableOpacity> */}

            {authContext.entity.obj.parent_groups?.length >= 1 &&
              authContext.entity.role === Verbs.entityTypeTeam && (
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    SetObj({
                      ...obj,
                      followers: PRIVACY_GROUP_MEMBER_CLUBMEMBERS,
                    });
                  }}>
                  <Text style={styles.radioText}>{strings.clubMember}</Text>
                  <Image
                    source={
                      obj.followers === PRIVACY_GROUP_MEMBER_CLUBMEMBERS
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
                  SetObj({...obj, followers: PRIVACY_GROUP_MEMBER_CLUBMEMBERS});
                }}>
                <Text style={styles.radioText}>{strings.clubMember}</Text>
                <Image
                  source={
                    obj.followers === PRIVACY_GROUP_MEMBER_CLUBMEMBERS
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {authContext.entity.role === Verbs.entityTypeTeam && (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  SetObj({...obj, followers: PRIVACY_GROUP_MEMBER_TEAMMEMBERS});
                }}>
                <Pressable
                  onPress={() => {
                    setOpenInfo(true);
                    setModalString('followers');
                  }}
                  hitSlop={Utility.getHitSlop(15)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.radioText}>{strings.teamMember}</Text>
                  <Image
                    source={images.infoIcon}
                    style={{
                      height: 15,
                      width: 15,
                      marginLeft: -9,
                      marginTop: 3,
                      display:
                        authContext.entity.obj.parent_groups?.length >= 1
                          ? 'flex'
                          : 'none',
                    }}
                  />
                </Pressable>

                <Image
                  source={
                    obj.followers === PRIVACY_GROUP_MEMBER_TEAMMEMBERS
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
            {authContext.entity.obj.parent_groups?.length >= 1 &&
              authContext.entity.role === Verbs.entityTypeTeam && (
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    SetObj({
                      ...obj,
                      profiles: PRIVACY_GROUP_MEMBER_CLUBMEMBERS,
                    });
                  }}>
                  <Text style={styles.radioText}>{strings.clubMember}</Text>

                  <Image
                    source={
                      obj.profiles === PRIVACY_GROUP_MEMBER_CLUBMEMBERS
                        ? images.radioRoundOrange
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
              )}
            {authContext.entity.role === Verbs.entityTypeTeam && (
              <TouchableOpacity
                style={styles.radioButtonView}
                onPress={() => {
                  SetObj({...obj, profiles: 2});
                }}>
                <Pressable
                  onPress={() => {
                    setOpenInfo(true);
                    setModalString('member profile');
                  }}
                  hitSlop={Utility.getHitSlop(15)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.radioText}>{strings.teamMember}</Text>
                  <Image
                    source={images.infoIcon}
                    style={{
                      height: 15,
                      width: 15,
                      marginLeft: -9,
                      marginTop: 3,
                      display:
                        authContext.entity.obj.parent_groups?.length >= 1
                          ? 'flex'
                          : 'none',
                    }}
                  />
                </Pressable>

                <Image
                  source={
                    obj.profiles === PRIVACY_GROUP_MEMBER_TEAMMEMBERS
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
                  SetObj({...obj, profiles: PRIVACY_GROUP_MEMBER_CLUBMEMBERS});
                }}>
                <Text style={styles.radioText}>{strings.clubMember}</Text>
                <Image
                  source={
                    obj.profiles === PRIVACY_GROUP_MEMBER_CLUBMEMBERS
                      ? images.radioRoundOrange
                      : images.radioUnselect
                  }
                  style={styles.radioImage}
                />
              </TouchableOpacity>
            )}

            {authContext.entity.obj.parent_groups?.length >= 1 ? (
              <>
                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    SetObj({...obj, profiles: PRIVACY_GROUP_MEMBER_TEAMCLUB});
                  }}>
                  <Text style={styles.radioText}>
                    {strings.onlyTeamAndclub}
                  </Text>
                  <Image
                    source={
                      obj.profiles === PRIVACY_GROUP_MEMBER_TEAMCLUB
                        ? images.radioRoundOrange
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButtonView}
                  onPress={() => {
                    SetObj({...obj, profiles: PRIVACY_GROUP_MEMBER_TEAM});
                  }}>
                  {/* for team team only and for club club only */}
                  <Text style={styles.radioText}>{strings.teamOnly}</Text>
                  <Image
                    source={
                      obj.profiles === PRIVACY_GROUP_MEMBER_TEAM
                        ? images.radioRoundOrange
                        : images.radioUnselect
                    }
                    style={styles.radioImage}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {authContext.entity.role === Verbs.entityTypeTeam ? (
                  <TouchableOpacity
                    style={styles.radioButtonView}
                    onPress={() => {
                      SetObj({...obj, profiles: PRIVACY_GROUP_MEMBER_TEAM});
                    }}>
                    {/* for team team only and for club club only */}
                    <Text style={styles.radioText}>{strings.teamOnly}</Text>
                    <Image
                      source={
                        obj.profiles === PRIVACY_GROUP_MEMBER_TEAM
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
                      SetObj({...obj, profiles: PRIVACY_GROUP_MEMBER_CLUB});
                    }}>
                    {/* for team team only and for club club only */}
                    <Text style={styles.radioText}>{strings.clubOnly}</Text>
                    <Image
                      source={
                        obj.profiles === PRIVACY_GROUP_MEMBER_CLUB
                          ? images.radioRoundOrange
                          : images.radioUnselect
                      }
                      style={styles.radioImage}
                    />
                  </TouchableOpacity>
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
});
