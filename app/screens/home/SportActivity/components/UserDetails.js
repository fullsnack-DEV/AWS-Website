// @flow
import moment from 'moment';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import {getJSDate} from '../../../../utils';
import {PrivacyKeyEnum} from '../../../../Constants/PrivacyOptionsConstant';

const UserDetails = ({user = {}, privacyStatus = {}}) => {
  const getLanguage = () => {
    let language = '';
    if ((user.language ?? []).length > 0) {
      user.language.forEach((item, index) => {
        if (item) {
          language += `${item}${
            index === user.language.length - 1 ? '' : ', '
          }`;
        }
      });
    }
    return language;
  };

  const getGender = () => {
    let gender = '';
    if (user.gender) {
      gender = user.gender
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (str) => str.toUpperCase());
    }
    return gender;
  };

  return (
    <View style={styles.parent}>
      {user.gender && privacyStatus[PrivacyKeyEnum.Gender] ? (
        <View style={styles.row}>
          <View style={{alignItems: 'flex-start'}}>
            <Text
              style={[
                styles.label,
                {fontFamily: fonts.RMedium, color: colors.googleColor},
              ]}>
              {strings.gender}
            </Text>
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={[styles.label, {textAlign: 'right'}]}>
              {getGender()}
            </Text>
          </View>
        </View>
      ) : null}

      {user.birthday && privacyStatus[PrivacyKeyEnum.YearOfBirth] ? (
        <View style={styles.row}>
          <View style={{alignItems: 'flex-start'}}>
            <Text
              style={[
                styles.label,
                {fontFamily: fonts.RMedium, color: colors.googleColor},
              ]}>
              {strings.yearOfBirth}
            </Text>
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={[styles.label, {textAlign: 'right'}]}>
              {moment(getJSDate(new Date(user.birthday).getTime())).format(
                'YYYY',
              )}
            </Text>
          </View>
        </View>
      ) : null}

      {user.height?.height && privacyStatus[PrivacyKeyEnum.Height] ? (
        <View style={styles.row}>
          <View style={{alignItems: 'flex-start'}}>
            <Text
              style={[
                styles.label,
                {fontFamily: fonts.RMedium, color: colors.googleColor},
              ]}>
              {strings.height}
            </Text>
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={[styles.label, {textAlign: 'right'}]}>
              {user.height.height} {user.height?.height_type}
            </Text>
          </View>
        </View>
      ) : null}

      {user.weight?.weight && privacyStatus[PrivacyKeyEnum.Weight] ? (
        <View style={styles.row}>
          <View style={{alignItems: 'flex-start'}}>
            <Text
              style={[
                styles.label,
                {fontFamily: fonts.RMedium, color: colors.googleColor},
              ]}>
              {strings.weight}
            </Text>
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={[styles.label, {textAlign: 'right'}]}>
              {user.weight.weight} {user.weight?.weight_type}
            </Text>
          </View>
        </View>
      ) : null}

      {(user.language ?? []).length > 0 &&
      privacyStatus[PrivacyKeyEnum.Langueages] ? (
        <View style={styles.row}>
          <View style={{alignItems: 'flex-start'}}>
            <Text
              style={[
                styles.label,
                {fontFamily: fonts.RMedium, color: colors.googleColor},
              ]}>
              {strings.languages}
            </Text>
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={[styles.label, {textAlign: 'right'}]}>
              {getLanguage()}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default UserDetails;
