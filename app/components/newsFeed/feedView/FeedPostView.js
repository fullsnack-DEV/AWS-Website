import React, {
 useCallback, useRef,
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
    currentViewIndex,
    setCurrentViewIndex,
    setIsMute,
    isMute,
}) => {
    const carouselRef = useRef();
    const renderAttachments = useCallback(({ item, index }) => (
      <View>
        <>
          {item?.type === 'video'
              ? (
                <>
                  {currentViewIndex === index && (
                    <FeedVideoView
                              isMute={isMute}
                              showParent={showParent}
                              setShowParent={setShowParent}
                              isFullScreen={isFullScreen}
                              setIsFullScreen={setIsFullScreen}
                              sourceData={item}
                              isLandscape={isLandscape}
                        />
                  )}
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
      ), [currentViewIndex, isFullScreen, isLandscape, isMute, setIsFullScreen, setShowParent, showParent])

 return (
   <Carousel
           ref={carouselRef}
           onSnapToItem={(itemIndex) => {
                   setCurrentViewIndex(itemIndex)
                   Orientation.unlockAllOrientations();
                   setIsFullScreen(false)
                    setIsMute(false)
                    setShowParent(true)
           }}
           nestedScrollEnabled={false}
           getItemLayout = {(data, index) => ({ length: getWidth(isLandscape, 100), offset: getWidth(isLandscape, 100) * index, index })}
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
