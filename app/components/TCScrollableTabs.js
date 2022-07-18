import React, {memo} from 'react';

import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view-forked';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCScrollableTabs = ({
  children,
  initialPage,
  locked = true,
  onChangeTab,
}) => (
  <ScrollableTabView
    locked={locked}
    style={{marginTop: 5}}
    tabBarTextStyle={{
      fontSize: 16,
      fontFamily: fonts.RBold,
    }}
    onChangeTab={onChangeTab}
    tabBarActiveTextColor={colors.themeColor}
    tabBarInactiveTextColor={colors.lightBlackColor}
    tabBarUnderlineStyle={{backgroundColor: colors.themeColor}}
    initialPage={0 || initialPage}
    renderTabBar={() => <ScrollableTabBar />}
  >
    {children}
  </ScrollableTabView>
);

export default memo(TCScrollableTabs);
