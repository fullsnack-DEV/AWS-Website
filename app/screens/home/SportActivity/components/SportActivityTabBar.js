// @flow
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import Verbs from '../../../../Constants/Verbs';

const TennisSinglesTabList = [
  strings.infoTitle,
  strings.availability,
  strings.scoreboard,
  strings.stats,
  strings.reviews,
];

const TabList = [strings.infoTitle, strings.scoreboard, strings.stats];
const OthersList = [
  strings.infoTitle,
  strings.availability,
  strings.matchesTitleText,
  strings.reviews,
];

const SportActivityTabBar = ({
  activeTab,
  sportType,
  entityType,
  onTabChange = () => {},
}) => {
  const [selectedTab, setSelectedTab] = useState('');
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    if (activeTab) {
      setSelectedTab(activeTab);
    }
  }, [activeTab]);

  const getMenuList = useCallback(() => {
    switch (entityType) {
      case Verbs.entityTypePlayer:
        return sportType === Verbs.singleSport ? TennisSinglesTabList : TabList;

      case Verbs.entityTypeReferee:
      case Verbs.entityTypeScorekeeper:
        return OthersList;

      default:
        return [];
    }
  }, [entityType, sportType]);

  useEffect(() => {
    const menu = getMenuList();
    setMenuList(menu);
  }, [getMenuList]);

  return (
    <View style={styles.parent}>
      {sportType === Verbs.singleSport ||
      entityType !== Verbs.entityTypePlayer ? (
        <FlatList
          data={menuList}
          keyExtractor={(item, index) => index}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.tabItem,
                selectedTab === item ? styles.activeTabItem : {},
              ]}
              onPress={() => {
                setSelectedTab(item);
                onTabChange(item);
              }}>
              <Text
                style={[
                  styles.tabItemText,
                  selectedTab === item ? styles.activeTabItemText : {},
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.row}>
          {menuList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                {paddingHorizontal: 0, flex: 1},
                selectedTab === item ? styles.activeTabItem : {},
              ]}
              onPress={() => {
                setSelectedTab(item);
                onTabChange(item);
              }}>
              <Text
                style={[
                  styles.tabItemText,
                  selectedTab === item ? styles.activeTabItemText : {},
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {},
  tabItem: {
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    paddingBottom: 9,
    borderBottomColor: colors.writePostSepratorColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderBottomColor: colors.tabFontColor,
  },
  tabItemText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  activeTabItemText: {
    fontFamily: fonts.RBlack,
    color: colors.tabFontColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
export default SportActivityTabBar;
