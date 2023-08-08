// @flow
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const CustomScrollTabs = React.memo(
  ({
    tabsItem = [],
    subTabItems = [],
    currentTab = '',
    currentGroupTab = '',
    setCurrentTab = () => {},

    setCurrentSubTab = () => {},
  }) => {
    const handleTabPress = (index) => {
      setCurrentTab(index);
    };

    return (
      <View style={styles.parent}>
        <View style={styles.row}>
          {tabsItem.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.tabItem,
                {flex: 1},
                currentTab === index ? styles.activeTabItem : {},
              ]}
              onPress={() => handleTabPress(index)}>
              <Text
                style={[
                  styles.tabText,
                  currentTab === index ? styles.activeTabText : {},
                ]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={[
            styles.row,
            {
              borderBottomColor: colors.grayBackgroundColor,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
            },
          ]}>
          {subTabItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tabItem, {borderBottomWidth: 0, marginRight: 20}]}
              onPress={() => setCurrentSubTab(index)}>
              <Text
                style={[
                  styles.subTabText,
                  currentGroupTab === index ? styles.activeTabText : {},
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  parent: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.whiteGradientColor,
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
    paddingBottom: 7,
    borderBottomWidth: 2,
    borderBottomColor: colors.orangeColor,
  },
  activeTabText: {
    color: colors.tabFontColor,
    fontFamily: fonts.RBold,
  },
  activeSubTabtext: {
    color: colors.themeColor,
    fontFamily: fonts.RBold,
  },
  subTabText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});

export default CustomScrollTabs;
