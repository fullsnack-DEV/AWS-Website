import React, { memo, useCallback } from 'react';
import {
    FlatList,
    Text,
    TouchableOpacity, View,
} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TAB_WIDTH = 120
const TAB_HEIGHT = 45
const ScrollableTabs = ({
    currentTab = 0,
    tabs = [],
    onTabPress = () => {},
}) => {
    const renderTabs = ({ item, index }) => (
      <TouchableOpacity
            onPress={() => onTabPress(index)}
            key={item}
            style={{
                flex: 1,
                paddingHorizontal: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 3,
                borderColor: currentTab === index ? colors.themeColor : colors.grayBackgroundColor,
            }}
        >
        <Text
                style={{
                    fontFamily: currentTab === index ? fonts.RBold : fonts.RRegular,
                    color: currentTab === index ? colors.themeColor : colors.lightBlackColor,
                }}
            >{item}</Text>
      </TouchableOpacity>
    )

    const getItemLayout = useCallback((data, index) => ({ length: TAB_WIDTH, offset: TAB_WIDTH * index, index }), [])
    const tabKeyExtractor = useCallback((item, index) => index.toString(), [])
    return (
      <View style={{ height: TAB_HEIGHT }}>
        <FlatList
            style={{ alignSelf: 'center', width: '100%', flex: 1 }}
            keyExtractor={tabKeyExtractor}
            // pagingEnabled={true}
            getItemLayout={getItemLayout}
            initialScrollIndex={currentTab}
            data={tabs}
            bounces={false}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={renderTabs}
        />
      </View>
    )
}
export default memo(ScrollableTabs);
