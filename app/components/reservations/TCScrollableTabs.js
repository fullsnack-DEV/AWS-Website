import React from 'react';

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

export default function TCScrollableTabs({ children }) {
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
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar />}
                  >

          {children}
      </ScrollableTabView>

  );
}
