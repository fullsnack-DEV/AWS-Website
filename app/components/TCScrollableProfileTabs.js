import React from 'react';
import {ScrollView, View} from 'react-native';

import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view-forked';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCScrollableProfileTabs = ({
  onChangeTab,
  currentTab = 0,
  renderTabContain = () => {},
  bounces = true,
  tabItem,
  customStyle,
}) => (
  <ScrollView style={customStyle} nestedScrollEnabled={true} bounces={bounces}>
    <ScrollableTabView
      locked={true}
      onChangeTab={onChangeTab}
      style={{marginTop: 5}}
      tabBarTextStyle={{
        fontSize: 16,
        fontFamily: fonts.RBold,
      }}
      tabBarActiveTextColor={colors.themeColor}
      tabBarInactiveTextColor={colors.lightBlackColor}
      tabBarUnderlineStyle={{backgroundColor: colors.themeColor}}
      initialPage={0}
      renderTabBar={() => <ScrollableTabBar />}
    >
      {tabItem.map((item, key) => (
        <View key={key} tabLabel={item} />
      ))}
    </ScrollableTabView>

    <ScrollView style={{flex: 1}}>{renderTabContain(currentTab)}</ScrollView>
  </ScrollView>
);
export default TCScrollableProfileTabs;
