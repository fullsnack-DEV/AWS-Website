import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { getHeight, getWidth } from '../../../utils';
import FeedImageView from './FeedImageView';
import FeedVideoView from './FeedVideoView';

const FeedPostView = ({
 showParent,
 setShowParent,
 currentViewIndex,
 isLandscape,
feedSubItem,
setIsFullScreen,
isFullScreen,
setCurrentViewIndex,

}) => {
    const renderAttachments = useCallback(({ item, index }) => (
      <View style={{
              height: getHeight(isLandscape, 100),
              width: getWidth(isLandscape, 100),
              justifyContent: 'center',
              alignItems: 'center',
      }}>
        {currentViewIndex === index && (
          <>
            {item?.type === 'video' ? (
              <FeedVideoView
                          showParent={showParent}
                          setShowParent={setShowParent}
                          isFullScreen={isFullScreen}
                          setIsFullScreen={setIsFullScreen}
                          sourceData={item}
                          isLandscape={isLandscape}
                      />
                  ) : (
                    <FeedImageView
                        setShowParent={setShowParent}
                        sourceData={item}
                        isLandscape={isLandscape}
                    />
                  )}
          </>
          )}
      </View>
      ), [currentViewIndex, isFullScreen, isLandscape, setIsFullScreen, setShowParent, showParent])

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        console.log(viewableItems);
        if (viewableItems && viewableItems.length > 0) {
            setCurrentViewIndex(viewableItems[0].index);
        }
    }, [setCurrentViewIndex]);

 return useMemo(() => (
   <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: getWidth(isLandscape, 100),
        height: getHeight(isLandscape, 100),
   }}>
     <FlatList
         nestedScrollEnabled={true}
         // initialNumToRender={1}
         // maxToRenderPerBatch={1}
         // windowSize={feedSubItem?.attachments?.length === 0 ? 1 : feedSubItem?.attachments?.length}
         // removeClippedSubviews={true}
         viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
         onViewableItemsChanged={onViewableItemsChanged}
         showsVerticalScrollIndicator={false}
         showsHorizontalScrollIndicator={false}
         style={{ zIndex: -100 }}
         horizontal={true}
         pagingEnabled={true}
         bounces={false}
         keyExtractor={(item, index) => `IMG_VID${index}`}
         data={feedSubItem?.attachments ?? []}
         renderItem={renderAttachments}
     />
   </View>
  ), [feedSubItem?.attachments, isLandscape, onViewableItemsChanged, renderAttachments])
}
export default FeedPostView;
