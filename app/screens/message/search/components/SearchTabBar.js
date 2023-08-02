// @flow
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const TAB_ITEMS = [strings.chatroomText, strings.message];

const SearchTabBar = ({currentTab = '', setCurrentTab = () => {}}) => (
  <View style={styles.parent}>
    <View style={styles.row}>
      {TAB_ITEMS.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tabItem,
            {flex: 1},
            currentTab === item ? styles.activeTabItem : {},
          ]}
          onPress={() => {
            setCurrentTab(item);
          }}>
          <Text
            style={[
              styles.tabText,
              currentTab === item ? styles.activeTabText : {},
            ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  parent: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
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
export default SearchTabBar;
