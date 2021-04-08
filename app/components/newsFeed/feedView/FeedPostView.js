import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { getHeight, getWidth } from '../../../utils';
import FeedImageView from './FeedImageView';
import FeedVideoView from './FeedVideoView';

const FeedPostView = ({
 isLandscape,
                          feedSubItem,
                          setIsFullScreen,
                          isFullScreen,
                          setCurruentViewIndex,

}) => {
    const renderAttachments = useCallback(({ item }) => (
      <View style={{
              height: getHeight(isLandscape, 100),
              width: getWidth(isLandscape, 100),
              justifyContent: 'center',
              alignItems: 'center',
      }}>
        {item?.type === 'video' ? (
          <FeedVideoView
              isFullScreen={isFullScreen}
              setIsFullScreen={setIsFullScreen}
              sourceData={item}
              isLandscape={isLandscape}
          />
      ) : (
        <FeedImageView
            sourceData={item}
            isLandscape={isLandscape}
        />
      )}
      </View>
      ), [isFullScreen, isLandscape, setIsFullScreen])

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurruentViewIndex(viewableItems[0].index);
        }
    }, [setCurruentViewIndex]);

 return useMemo(() => (
   <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: getWidth(isLandscape, 100),
        height: getHeight(isLandscape, 100),
   }}>
     <FlatList
         initialNumToRender={1}
         maxToRenderPerBatch={1}
         windowSize={feedSubItem?.attachments?.length ?? 1}
         removeClippedSubviews={true}
         viewabilityConfig={{ itemVisiblePercentThreshold: 5 }}
         showsVerticalScrollIndicator={false}
         showsHorizontalScrollIndicator={false}
         style={{ zIndex: -100 }}
         horizontal={true}
         pagingEnabled={true}
         bounces={false}
         onViewableItemsChanged={onViewableItemsChanged}
         keyExtractor={(item, index) => `IMG_VID${index}`}
         data={feedSubItem?.attachments ?? []}
         renderItem={renderAttachments}
     />
   </View>
  ), [feedSubItem?.attachments, isLandscape, renderAttachments])
}
export default FeedPostView;
