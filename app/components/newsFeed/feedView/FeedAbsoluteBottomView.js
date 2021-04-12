import React, {
    useCallback, Fragment, useContext, useEffect, useState, useMemo,
} from 'react';
import {
    Image, SafeAreaView, StyleSheet, Text, View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import { getWidth } from '../../../utils';
import fonts from '../../../Constants/Fonts';
import TagView from '../TagView';
import AuthContext from '../../../auth/context';
import FeedDescriptionSection from './FeedDescriptionSection';

const FeedAbsoluteBottomView = ({
    feedItem = {},
    feedSubItem = {},
    isLandscape,
    navigation,
    onLikePress,
    readMore,
    setReadMore,
    showParent,
}) => {
    const authContext = useContext(AuthContext);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        if (feedItem) {
            let filterLike = []
            setLikeCount(feedItem?.reaction_counts?.clap ?? 0)
            setCommentCount(feedItem?.reaction_counts?.comment ?? 0)
            if (feedItem?.own_reactions?.clap !== undefined) {
                filterLike = feedItem?.own_reactions.clap?.filter((clapItem) => clapItem.user_id === authContext?.entity?.uid);
                if (filterLike?.length > 0) setLike(true);
                else setLike(false);
            } else {
                setLike(false);
            }
        }
    }, [feedItem])

    const onCommentButtonPress = useCallback(() => {
        navigation.navigate('WriteCommentScreen', {
            data: feedItem,
            onDonePress: (commentData) => { setCommentCount(commentData?.count) },
        });
    }, [feedItem, navigation]);

    const onTaggedPress = useCallback(() => {
        navigation.navigate('FeedTaggedScreen', { taggedData: feedSubItem?.format_tagged_data ?? [] })
    }, [feedSubItem?.format_tagged_data, navigation])

    const taggedText = useMemo(() => {
        const gameTagList = feedSubItem?.format_tagged_data?.filter((item) => item?.entity_type === 'game')
        const entityTagList = feedSubItem?.format_tagged_data?.filter((item) => item?.entity_type !== 'game')
        if (entityTagList?.length > 0 && gameTagList?.length > 0) {
            if (entityTagList?.length > 1 && gameTagList?.length > 1) {
                return `${entityTagList?.length} matches and ${entityTagList?.length} people were tagged`;
            }
            if (entityTagList?.length === 1 && gameTagList?.length > 1) {
                return `${entityTagList?.length} match and ${entityTagList?.length} people were tagged`;
            }
            if (entityTagList?.length > 1 && gameTagList?.length === 1) {
                return `${entityTagList?.length} matches and ${entityTagList?.length} person were tagged`;
            }
            if (entityTagList?.length === 1 && gameTagList?.length === 1) {
                return `${entityTagList?.length} match and ${entityTagList?.length} person were tagged`;
            }
        } else {
            if (entityTagList?.length > 0 && gameTagList?.length === 0) {
                if (entityTagList?.length > 1 && gameTagList?.length === 0) {
                    return `${entityTagList?.length} matches were tagged`;
                }
                if (entityTagList?.length === 1 && gameTagList?.length === 0) {
                    return `${entityTagList?.length} match was tagged`;
                }
            }
            if (entityTagList?.length === 0 && gameTagList?.length > 0) {
                if (entityTagList?.length === 0 && gameTagList?.length > 1) {
                    return `${gameTagList?.length} people were tagged`;
                }
                if (entityTagList?.length === 0 && gameTagList?.length === 1) {
                    return `${gameTagList?.length} person was tagged`;
                }
            }
            if (entityTagList?.length === 0 && gameTagList?.length === 0) {
                return '';
            }
        }
        return '';
    }, [feedSubItem]);

    const renderBottomButtons = useMemo(() => (
      <View style={{ ...styles.commentShareLikeView, width: getWidth(isLandscape, 100) }}>

        {/* Comment And Share Button Button */}
        <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: 15,
                width: getWidth(isLandscape, 70),
        }}>
          <View
                    style={{
                        flexDirection: 'row',
                    }}>
            <TouchableOpacity
                        onPress={onCommentButtonPress}
                        style={styles.imageTouchStyle}>
              <Image
                            style={[styles.commentImage, { top: 2 }]}
                            source={images.commentImage}
                            resizeMode={'cover'}
                        />
            </TouchableOpacity>
            <Text style={styles.commentlengthStyle}>
              {commentCount > 0 ? commentCount : ''}
            </Text>
          </View>

          {/* Share Button */}
          <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
            <TouchableOpacity
                        onPress={() => {
                            // shareActionSheet.current.show();
                        }}
                        style={styles.imageTouchStyle}>
              <Image
                            style={styles.commentImage}
                            source={images.shareImage}
                            resizeMode={'contain'}
                        />
            </TouchableOpacity>
            <Text style={styles.commentlengthStyle}>{''}</Text>
          </View>
        </View>

        {/* Like Button */}
        <View
                style={{
                    paddingRight: 15,
                    width: getWidth(isLandscape, 30),
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>

          <Text
                    style={[
                        styles.commentlengthStyle,
                        {
                            color: like === true ? '#FF8A01' : colors.whiteColor,
                        },
                    ]}>
            {likeCount === 0 ? '' : likeCount}
          </Text>
          <TouchableOpacity
                    onPress={() => {
                        setLike(!like);
                        if (like) setLikeCount((val) => val - 1);
                        else setLikeCount((val) => val + 1);
                        onLikePress()
                    }}
                    style={styles.imageTouchStyle}>
            {like === true ? (
              <Image
                            style={styles.commentImage}
                            source={images.likeImage}
                            resizeMode={'contain'}
                        />
                    ) : (
                      <Image
                            style={styles.commentImage}
                            source={images.unlikeImage}
                            resizeMode={'contain'}
                        />
                    )}
          </TouchableOpacity>
        </View>
      </View>
    ), [commentCount, isLandscape, like, likeCount, onCommentButtonPress, onLikePress])

    return (
      <Fragment>
        <SafeAreaView
            pointerEvents={showParent ? 'auto' : 'none'}
            style={{
                position: 'absolute',
                bottom: 0,
                width: getWidth(isLandscape, 100),
                opacity: showParent ? 1 : 0,
            }}>
          <View>
            {!readMore && !isLandscape && <FeedDescriptionSection
            readMore={readMore}
            setReadMore={setReadMore}
            navigation={navigation}
            tagData={feedSubItem?.format_tagged_data}
            descriptions={feedSubItem?.text}
            isLandscape={isLandscape}
            descriptionTxt={{ color: colors.whiteColor }}
           />}
            {!isLandscape && (
              <TouchableOpacity onPress={onTaggedPress}>
                <TagView
                  source={images.tagGreenImage}
                  tagText={taggedText}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom Buttons */}
          {renderBottomButtons}

        </SafeAreaView>
      </Fragment>
    )
}

const styles = StyleSheet.create({
    commentImage: {
        height: 32,
        width: 32,
        alignSelf: 'flex-end',
    },
    commentShareLikeView: {
        flexDirection: 'row',
        margin: '3%',
        marginVertical: '2%',
        alignSelf: 'center',
    },
    commentlengthStyle: {
        alignSelf: 'center',
        color: colors.whiteColor,
        fontFamily: fonts.RMedium,
        fontSize: 14,
        marginHorizontal: 5,
    },
    imageTouchStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FeedAbsoluteBottomView;
