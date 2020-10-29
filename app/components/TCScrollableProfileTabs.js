import React from 'react';
import { View, Platform } from 'react-native';

import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCScrollableProfileTabs({
  onChangeTab, currentTab, renderTabContain, tabItem,
}) {
  return (
    <View>
      <ScrollableTabView
        onChangeTab={onChangeTab}
        style={{ marginTop: 5 }}
        tabBarTextStyle={{
          fontSize: 16,
          fontFamily: fonts.RBold,
        }}
        tabBarActiveTextColor={colors.themeColor}
        tabBarInactiveTextColor={colors.lightBlackColor}
        tabBarUnderlineStyle={{ backgroundColor: colors.themeColor }}
        initialPage={0}
        renderTabBar={() => <ScrollableTabBar />}>
        {
          tabItem.map((item, key) => (
            <View key={key} tabLabel={item}>
              {Platform.OS === 'ios' ? renderTabContain(key) : (<View />)}
            </View>
          ))
        }
      </ScrollableTabView>
      {Platform.OS !== 'ios' ? renderTabContain(currentTab) : (<View />)}
    </View>
  );
}
