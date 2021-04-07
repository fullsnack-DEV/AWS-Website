import React, {
 useEffect, useRef, useState, useCallback, useLayoutEffect,
 } from 'react';
import {
 View, FlatList, StatusBar, TouchableWithoutFeedback, Image, StyleSheet,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import colors from '../../../Constants/Colors';

import ShortsVideoView from '../../../components/shorts/ShortsVideoView';
import images from '../../../Constants/ImagePath';

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

function ShortsPlayScreen({ route, navigation }) {
  const { caller_id, currentPage, shorts } = route?.params;

  const carouselRef = useRef(0);

  const [, setCurrentAssetIndex] = useState(0);
  const [curruentViewIndex, setCurruentViewIndex] = useState(0);
  const [closeButtonVisible, setCloseButtonVisible] = useState(false);
  const [shortsData, setShortsData] = useState([]);
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (closeButtonVisible ? (

        <TouchableWithoutFeedback style={styles.mainContainerStyle} onPress={() => {
          setCloseButtonVisible(false)
        }}>
          <Image
            source={images.menuClose}
            style={styles.imageStyle}
            resizeMode={'contain'}
          />
        </TouchableWithoutFeedback>
      ) : null),
    });
  }, [closeButtonVisible, navigation]);

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
      StatusBar.setBackgroundColor(colors.blackColor);
    } else {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(colors.whiteColor);
    }
  }, [isFocused]);

  const renderShortsVideo = useCallback(({ item: multiAttachItem, index }) => (
    <ShortsVideoView
      onclosePress={handleCloseButton}
      isClose={closeButtonVisible}
      multiAttachItem={multiAttachItem}
      index={index}
      caller_id={caller_id}
      curruentViewIndex={curruentViewIndex}
    />
  ), [caller_id, closeButtonVisible, curruentViewIndex]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurruentViewIndex(viewableItems[0].index);
    }
  }, []);
  const keyExtractor = useCallback((item, index) => index.toString(), [])

const handleCloseButton = (toggleValue) => {
setCloseButtonVisible(toggleValue)
}

  return (
    <View style={{ backgroundColor: colors.blackColor, flex: 1 }}>
      <FlatList
      bounces={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        ref={carouselRef}
        data={shortsData}
        renderItem={renderShortsVideo}
        pagingEnabled={true}
        onSnapToItem={setCurrentAssetIndex}
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={keyExtractor}
        onMomentumScrollEnd={() => {
          setCloseButtonVisible(false)
        }}
        onScrollToIndexFailed={() => {
          const wait = new Promise((resolve) => setTimeout(resolve, 200));
          wait.then(() => {
            carouselRef.current.scrollToIndex({
              animated: false,
              index: currentPage - 1,
            });
          });
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  imageStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
    marginRight: 15,
  },

});
export default ShortsPlayScreen;
