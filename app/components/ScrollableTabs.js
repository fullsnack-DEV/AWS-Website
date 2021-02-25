import React from 'react';
import {
 ScrollView, Text, TouchableOpacity,
} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const ScrollableTabs = ({
  currentTab,
  tabs = [],
  onTabPress = () => {},
}) => (
  <ScrollView
      bounces={false}
      horizontal={true}
      showsHorizontalScrollIndicator={false}>
    {tabs?.map((item, index) => (
      <TouchableOpacity
                    onPress={() => onTabPress(index)}
                    key={item}
                    style={{
                      width: 120,
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
  </ScrollView>
)
export default ScrollableTabs;
