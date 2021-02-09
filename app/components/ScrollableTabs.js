import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const ScrollableTabs = ({
  currentTab,
  tabs = [],
  onTabPress = () => {},
}) => (
  <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
        >
    {tabs?.map((item, index) => (
      <TouchableOpacity
                    onPress={() => onTabPress(index)}
                    key={item}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderBottomWidth: 3,
                      borderColor: currentTab === index ? colors.themeColor : colors.grayBackgroundColor,
                    }}
                >
        <Text
            style={{
              fontFamily: currentTab === index ? fonts.RBold : fonts.RRegular,
              paddingVertical: 16,
              color: currentTab === index ? colors.themeColor : colors.lightBlackColor,
            }}
          >{item}</Text>
      </TouchableOpacity>
    ))}
  </View>
)
export default ScrollableTabs;
