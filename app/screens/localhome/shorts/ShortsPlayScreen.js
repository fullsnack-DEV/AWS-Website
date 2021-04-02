import React, {
 useEffect, useRef, useState, useCallback,
 } from 'react';
import { View, FlatList, StatusBar } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import colors from '../../../Constants/Colors';

import ShortsVideoView from '../../../components/shorts/ShortsVideoView';

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

function ShortsPlayScreen({ route }) {
  const { caller_id, currentPage, shorts } = route?.params;

  const carouselRef = useRef(0);

  const [, setCurrentAssetIndex] = useState(0);
  const [curruentViewIndex, setCurruentViewIndex] = useState(0);
  const [shortsData, setShortsData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    setShortsData(shorts);
    setTimeout(() => {
      if (carouselRef && currentPage > 1) {
        carouselRef.current.scrollToIndex({
          animated: false,
          index: currentPage - 1,
        });
      }
    }, 1000);
  }, [currentPage, carouselRef, shorts]);

  useEffect(() => {
    if (isFocused) {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  }, [isFocused]);

  const renderShortsVideo = ({ item: multiAttachItem, index }) => (
    <ShortsVideoView
      multiAttachItem={multiAttachItem}
      index={index}
      caller_id={caller_id}
      curruentViewIndex={curruentViewIndex}
    />
  );

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurruentViewIndex(viewableItems[0].index);
    }
  }, []);
  const keyExtractor = useCallback((item, index) => index.toString(), [])

  return (
    <View style={{ backgroundColor: colors.blackColor, flex: 1 }}>
      <FlatList
        nestedScrollEnabled={false}
        ref={carouselRef}
        data={shortsData}
        renderItem={renderShortsVideo}
        pagingEnabled={true}
        onSnapToItem={setCurrentAssetIndex}
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}

export default ShortsPlayScreen;
