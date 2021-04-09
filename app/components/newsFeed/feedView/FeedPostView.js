import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { getHeight, getWidth } from '../../../utils';
import FeedImageView from './FeedImageView';
import FeedVideoView from './FeedVideoView';

const FeedPostView = ({
     showParent,
     setShowParent,
     isLandscape,
    feedSubItem,
    setIsFullScreen,
    isFullScreen,
    currentPage,
}) => {
    const [currentViewIndex, setCurrentViewIndex] = useState(0);
    const renderAttachments = useCallback(({ item, index }) => (
      <View>
        <>
          {item?.type === 'video'
              ? (
                <>
                  {currentViewIndex === index && <FeedVideoView
                              showParent={showParent}
                              setShowParent={setShowParent}
                              isFullScreen={isFullScreen}
                              setIsFullScreen={setIsFullScreen}
                              sourceData={item}
                              isLandscape={isLandscape}
                        />}
                </>
              ) : (
                <FeedImageView
                    setShowParent={setShowParent}
                    sourceData={item}
                    isLandscape={isLandscape}
                />
              )}
        </>
      </View>
      ), [currentViewIndex, isFullScreen, isLandscape, setIsFullScreen, setShowParent, showParent])

 return (
   <Carousel
           onSnapToItem={setCurrentViewIndex}
           firstItem={Number(currentPage - 1)}
           nestedScrollEnabled={true}
           windowSize={3}
           bounces={false}
           data={feedSubItem?.attachments ?? []}
           renderItem={renderAttachments}
           inactiveSlideScale={1}
           inactiveSlideOpacity={1}
           sliderWidth={getWidth(isLandscape, 100)}
           itemWidth={getWidth(isLandscape, 100)}
           sliderHeight={getHeight(isLandscape, 100)}
           itemHeight={getHeight(isLandscape, 100)}
       />
    )
}
export default FeedPostView;
