// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import Verbs from '../../../../Constants/Verbs';

const MenuItem = ({
  item = {},
  sportName = '',
  settingsObj = {},
  handleEditOption = () => {},
}) => {
  const getValues = (section) => {
    switch (section) {
      case strings.availability:
        return settingsObj.referee_availibility ?? Verbs.on;

      case strings.refereeFee:
        return `${settingsObj.game_fee?.fee} ${settingsObj.game_fee?.currency_type}`;

      case strings.refundPolicy:
        return settingsObj.refund_policy;

      case strings.servicableAreas:
        return `${settingsObj.available_area?.address_list?.length ?? 0} ${
          strings.areasText
        }`;

      case strings.scorekeeperFee:
        return `${settingsObj.game_fee?.fee} ${settingsObj.game_fee?.currency_type}`;

      default:
        return strings.incomplete;
    }
  };

  return (
    <>
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text style={styles.title}>{item.key.toUpperCase()}</Text>
        </View>
        {item.key === strings.sport ? (
          <View>
            <Text style={styles.description}>{sportName}</Text>
          </View>
        ) : (
          <View style={[styles.listItem, {paddingHorizontal: 0}]}>
            <Text style={[styles.description, {marginRight: 15}]}>
              {getValues(item.key)}
            </Text>
            <TouchableOpacity onPress={() => handleEditOption(item.key)}>
              <Text
                style={[
                  styles.description,
                  {
                    fontFamily: fonts.RMedium,
                    color: colors.greenColorCard,
                  },
                ]}>
                {strings.edit}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.separator} />
    </>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  separator: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
});
export default MenuItem;
