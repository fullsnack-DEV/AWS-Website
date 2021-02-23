import React from 'react';
import { ScrollView, FlatList } from 'react-native';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.heigsourht + contentOffset.y
        >= contentSize.height - paddingToBottom;
};

const MyCoolScrollViewComponent = () => (
  <ScrollView
        onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
                //    On End Reached API Call
            }
        }}
        scrollEventThrottle={400}
    >
    <FlatList
            data={['']}
            renderItem={() => {}}
            scrollEnable={false}
        />
  </ScrollView>
);

export default MyCoolScrollViewComponent;
