import React, {useLayoutEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {format} from 'react-string-format';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import AuthContext from '../../../../auth/context';
import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';
import TCThinDivider from '../../../../components/TCThinDivider';
import TCFormProgress from '../../../../components/TCFormProgress';
import {strings} from '../../../../../Localization/translation';

let entity = {};
export default function CreateMemberProfileClubForm2({navigation, route}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const [setting, setSetting] = useState({
    is_member: true,
    is_admin: false,
  });

  // const [memberDetail, setMemberDetail] = useState({
  //   group_id: entity.uid,
  //   is_admin: false,
  // });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => pressedNext()}>
          {strings.next}
        </Text>
      ),
    });
  }, [navigation, setting]);

  const pressedNext = () => {
    const membersAuthority = {
      ...route.params.form1,
      group_id: entity.uid,
      is_admin: setting.is_admin,
      is_member: setting.is_member,
    };
    navigation.navigate('CreateMemberProfileClubForm3', {
      form2: membersAuthority,
    });
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <TCFormProgress totalSteps={3} curruentStep={2} />

      <Text style={styles.checkBoxTitle}>{strings.teamMemberShipText}</Text>
      <View style={styles.mainCheckBoxContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 15,
          }}>
          <View style={styles.profileView}>
            <Image
              source={
                ((entity || {}).obj || {}).thumbnail
                  ? {uri: entity.obj.thumbnail}
                  : images.clubPlaceholder
              }
              style={styles.profileImage}
            />
          </View>
          <TCGroupNameBadge
            name={((entity || {}).obj || {}).group_name || ''}
            groupType={strings.entityTypeClub}
          />
        </View>
        <View style={styles.mainCheckBoxContainer}>
          <View style={[styles.checkBoxContainer, {opacity: 0.5}]}>
            <Text style={styles.checkBoxItemText}>{strings.member}</Text>
            <TouchableOpacity
              disabled={true}
              onPress={() => {
                const member_setting = !setting.is_member;
                setSetting({
                  ...setting,
                  is_member: member_setting,
                });
              }}>
              <Image
                source={
                  // item.join_membership_acceptedadmin === false
                  setting.is_member
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.checkBoxContainer, {opacity: 0.5}]}>
            <Text style={[styles.checkBoxItemText, {marginLeft: 0}]}>
              {format(
                strings.adminText_dy,
                entity.role.charAt(0).toUpperCase() + entity.role.slice(1),
              )}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const admin_setting = !setting.is_admin;
                setSetting({
                  ...setting,
                  is_admin: admin_setting,
                });
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
      </View>
      <TCThinDivider />
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
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    marginBottom: 15,
    marginRight: 15,
    justifyContent: 'space-between',
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 20,
  },
  checkBoxTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 15,
  },
  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
