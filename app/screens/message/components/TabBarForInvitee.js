// @flow
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const TabBarForInvitee = ({
  activeTab = strings.allType,
  onChange = () => {},
  TAB_ITEMS = [],
}) => (
  <View style={styles.row}>
    {TAB_ITEMS.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.tabItem, activeTab === item ? styles.activeTabItem : {}]}
        onPress={() => {
          onChange(item);
        }}>
        <Text
          style={[
            styles.tabText,
            activeTab === item ? styles.activeTabText : {},
          ]}>
          {item}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.grayBackgroundColor,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderBottomColor: colors.tabFontColor,
    paddingBottom: 7,
  },
  activeTabText: {
    color: colors.tabFontColor,
    fontFamily: fonts.RBold,
  },
});
export default TabBarForInvitee;
