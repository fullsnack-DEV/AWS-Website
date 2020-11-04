import React from 'react';

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

export default function TCScrollableTabs({ children, initialPage }) {
  return (

    <ScrollableTabView
                    style={{ marginTop: 5 }}
                    tabBarTextStyle = {{
                      fontSize: 16,
                      fontFamily: fonts.RBold,
                    }}
                    tabBarActiveTextColor = {colors.themeColor}
                    tabBarInactiveTextColor={colors.lightBlackColor}
                    tabBarUnderlineStyle = {{ backgroundColor: colors.themeColor }}
                    initialPage={0 || initialPage}
                    renderTabBar={() => <ScrollableTabBar />}
                  >

      {children}
    </ScrollableTabView>

  );
}
