import React, {
 useCallback, useEffect, useRef, useState,
} from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Orientation from 'react-native-orientation';
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
    const carouselRef = useRef();
    const [currentViewIndex, setCurrentViewIndex] = useState(0);
    useEffect(() => {
        if (carouselRef?.current?.scrollToIndex) {
            carouselRef.current.scrollToIndex({
                animated: false,
                index: currentPage - 1,
            });
        }
    }, [currentPage])

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
           ref={carouselRef}
           onSnapToItem={(itemIndex) => {
                   Orientation.unlockAllOrientations();
                   setIsFullScreen(false)
                   setShowParent(true)
                   setCurrentViewIndex(itemIndex)
           }}
           nestedScrollEnabled={false}
           getItemLayout = {(data, index) => ({ length: getWidth(isLandscape, 100), offset: getWidth(isLandscape, 100) * index, index })}
           initialScrollIndex={0}
           firstItem={Number(currentPage) - 1}
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
