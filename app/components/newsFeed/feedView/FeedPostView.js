import React, {
 useCallback, useRef,
} from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Orientation from 'react-native-orientation';
import { getScreenHeight, getScreenWidth } from '../../../utils';
import FeedImageView from './FeedImageView';
import FeedVideoView from './FeedVideoView';

const FeedPostView = ({
     screenInsets,
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
    currentTime,
    setCurrentTime,
    videoPlayerRef,
    paused,
    setPaused,
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
                              screenInsets={screenInsets}
                              paused={paused}
                              setPaused={setPaused}
                              videoPlayerRef={videoPlayerRef}
                              currentTime={currentTime}
                              setCurrentTime={setCurrentTime}
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
                    screenInsets={screenInsets}
                    setShowParent={setShowParent}
                    sourceData={item}
                    isLandscape={isLandscape}
                />
              )}
        </>
      </View>
      ), [currentTime, currentViewIndex, isFullScreen, isLandscape, isMute, paused, setCurrentTime, setIsFullScreen, setPaused, setShowParent, showParent, videoPlayerRef])

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
           getItemLayout = {(data, index) => ({ length: getScreenWidth({ isLandscape, screenInsets }), offset: getScreenWidth({ isLandscape, screenInsets }) * index, index })}
           data={feedSubItem?.attachments ?? []}
           renderItem={renderAttachments}
           inactiveSlideScale={1}
           inactiveSlideOpacity={1}
           sliderWidth={getScreenWidth({ isLandscape, screenInsets })}
           itemWidth={getScreenWidth({ isLandscape, screenInsets })}
           sliderHeight={getScreenHeight({ isLandscape, screenInsets })}
           itemHeight={getScreenHeight({ isLandscape, screenInsets })}
       />
    )
}
export default FeedPostView;
