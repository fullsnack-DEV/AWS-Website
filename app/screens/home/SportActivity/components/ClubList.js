// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import ClubCard from '../../../../components/ClubCard';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const ClubList = ({list = [], sport = ''}) => {
  const [clubsList, setClubsList] = useState([]);

  useEffect(() => {
    if (list.length > 0) {
      const newList = [];
      list.forEach((item) => {
        const obj = item.sports.find((ele) => ele.sport === sport);
        if (obj) {
          newList.push(item);
        }
      });
      setClubsList(newList);
    }
  }, [sport, list]);

  return clubsList.length > 0 ? (
    clubsList.map((item, index) => (
      <View key={index}>
        <ClubCard item={item} />
        {index !== clubsList.length - 1 ? (
          <View style={styles.lineSpearator} />
        ) : null}
      </View>
    ))
  ) : (
    <Text style={styles.label}>{strings.noneText}</Text>
  );
};

const styles = StyleSheet.create({
  lineSpearator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default ClubList;
