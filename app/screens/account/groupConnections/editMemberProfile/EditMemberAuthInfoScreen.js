import React, {useLayoutEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {format} from 'react-string-format';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import AuthContext from '../../../../auth/context';
import {patchMember, deleteMember} from '../../../../api/Groups';
import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';
import {strings} from '../../../../../Localization/translation';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

let entity = {};
export default function EditMemberAuthInfoScreen({navigation, route}) {
  const [groupMemberDetail] = useState(route?.params?.groupMemberDetail);
  const authContext = useContext(AuthContext);
  entity = authContext.entity;

  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState({
    is_member: true,
    is_admin: groupMemberDetail.is_admin,
  });

  // const [memberDetail, setMemberDetail] = useState({
  //   group_id: entity.uid,
  //   is_admin: false,
  // });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.titleScreenText}>
          Team Membership {'&'} Admin Authority
        </Text>
      ),
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => pressedNext()}>
          Save
        </Text>
      ),
    });
  }, [navigation, setting]);

  const pressedNext = () => {
    doneSetting();
  };

  const doneSetting = () => {
    const bodyParams = {...groupMemberDetail, ...setting};

    if (!bodyParams?.is_member) {
      setLoading(true);
      Alert.alert(
        strings.alertmessagetitle,
        format(
          strings.doYouWantToRemoText_dy,
          groupMemberDetail.first_name,
          groupMemberDetail.last_name,
          entity.obj.group_name,
        ),
        [
          {
            text: strings.cancel,
            onPress: () => {
              setLoading(false);
            },
            style: 'cancel',
          },
          {
            text: strings.okTitleText,
            onPress: () =>
              patchMember(
                entity?.obj?.group_id,
                groupMemberDetail.user_id,
                bodyParams,
                authContext,
              )
                .then(() => {
                  if (!bodyParams?.is_member) {
                    deleteMember(
                      entity.uid,
                      groupMemberDetail.user_id,
                      authContext,
                    ).then(() => {
                      setLoading(false);
                      navigation.goBack();
                    });
                  } else {
                    setLoading(false);
                    navigation.goBack();
                  }
                })
                .catch((e) => {
                  setLoading(false);
                  setTimeout(() => {
                    Alert.alert(strings.alertmessagetitle, e.message);
                  }, 10);
                }),
          },
        ],
        {cancelable: false},
      );
    } else {
      setLoading(true);
      patchMember(
        entity?.obj?.group_id,
        groupMemberDetail.user_id,
        bodyParams,
        authContext,
      )
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((e) => {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <View style={styles.mainCheckBoxContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 15,
            marginBottom: 15,
          }}>
          <View style={styles.profileView}>
            <Image
              source={
                entity.obj.thumbnail
                  ? {uri: entity.obj.thumbnail}
                  : images.teamPlaceholder
              }
              style={styles.profileImage}
            />
          </View>
          <TCGroupNameBadge
            name={entity.obj.group_name}
            groupType={entity.role}
          />
        </View>
        <View
          style={[
            styles.checkBoxContainer,
            {opacity: groupMemberDetail?.teams ? 0.5 : 1},
          ]}>
          <Text style={styles.checkBoxItemText}>Member</Text>
          <TouchableOpacity
            disabled={!!groupMemberDetail?.teams}
            onPress={() => {
              const member_setting = !setting.is_member;
              if (member_setting) {
                setSetting({
                  ...setting,
                  is_member: member_setting,
                });
              } else {
                setSetting({
                  ...setting,
                  is_member: false,
                  is_admin: false,
                });
              }
            }}>
            <Image
              source={
                // item.join_membership_acceptedadmin === false
                setting.is_member ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxItemText}>
            {format(
              strings.adminText_dy,
              entity.role.charAt(0).toUpperCase() + entity.role.slice(1),
            )}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const admin_setting = !setting.is_admin;
              if (admin_setting) {
                setSetting({
                  ...setting,
                  is_member: true,
                  is_admin: admin_setting,
                });
              } else {
                setSetting({
                  ...setting,
                  is_admin: false,
                });
              }
            }}>
            <Image
              source={
                setting.is_admin ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginBottom: 20}} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  profileView: {
    backgroundColor: colors.whiteColor,
    height: 26,
    width: 26,
    borderRadius: 54,
    marginRight: 5,

    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    alignSelf: 'center',
    height: 25,
    resizeMode: 'cover',
    width: 25,
    borderRadius: 50,
  },

  nextButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginRight: 8,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    marginBottom: 10,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 20,
  },
  titleScreenText: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
});
