import React, { memo, useCallback, useContext } from 'react';
import {
    Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import { getHeight, getHitSlop, getWidth } from '../../../utils';
import { commentPostTimeCalculate } from '../../../Constants/LoaderImages';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import FeedDescriptionSection from './FeedDescriptionSection';

const FeedAbsoluteTopView = ({
    showParent,
    feedItem = {},
    isLandscape,
    readMore,
    setReadMore,
    navigation,
    feedSubItem,
 }) => {
    const userImage = feedItem?.actor?.data?.thumbnail ? { uri: feedItem?.actor?.data?.thumbnail } : images?.profilePlaceHolder;
    const authContext = useContext(AuthContext);

    const onProfilePress = useCallback(() => {
        if (feedItem?.actor?.id) {
            if (feedItem?.actor?.id !== authContext?.entity?.uid) {
                navigation.push('HomeScreen', {
                    uid: feedItem?.actor?.id,
                    backButtonVisible: true,
                    role: ['player', 'user']?.includes(feedItem?.actor?.data?.entity_type) ? 'user' : feedItem?.actor?.data?.entity_type,
                });
            }
        }
    }, [authContext?.entity?.uid, feedItem?.actor?.data?.entity_type, feedItem?.actor?.id, navigation])

    return (
      <SafeAreaView
          pointerEvents={showParent ? 'auto' : 'none'}
          style={{
              opacity: showParent ? 1 : 0,
              position: 'absolute',
              top: 0,
          ...(readMore && { bottom: 0 }),
          backgroundColor: readMore ? 'rgba(0,0,0,0.6)' : 'transparent',
          }}>
        <View
                style={{
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    flexDirection: 'row',
                    width: getWidth(isLandscape, 100),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
          <TouchableOpacity
                    hitSlop={getHitSlop(15)}
                    onPress={() => {
                        Orientation.lockToPortrait();
                        navigation.goBack();
                    }}
                >
            <Image
                        source={images.backArrow}
                        resizeMode={'contain'}
                        style={{ height: 20, width: 20, tintColor: colors.whiteColor }}
                    />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image
                        source={images.vertical3Dot}
                        resizeMode={'contain'}
                        style={{ height: 20, width: 20, tintColor: colors.whiteColor }} />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContainer}>
          <TouchableWithoutFeedback onPress={onProfilePress}>
            <Image
                        style={styles.background}
                        source={userImage}
                        resizeMode={'cover'}
                    />
          </TouchableWithoutFeedback>
          <View style={styles.userNameView}>
            <Text style={styles.userNameTxt} onPress={() => {}}>{feedItem?.actor?.data?.full_name}</Text>
            <Text style={styles.activeTimeAgoTxt}>
              {commentPostTimeCalculate(feedItem?.time, true)}
            </Text>
          </View>
        </View>

        {(!readMore && isLandscape) && <FeedDescriptionSection
              readMore={readMore}
              setReadMore={setReadMore}
              navigation={navigation}
              tagData={feedSubItem?.format_tagged_data}
              descriptions={feedSubItem?.text}
              isLandscape={isLandscape}
              descriptionTxt={{ color: colors.whiteColor }}
          />}

        {readMore && <View style={{ height: getHeight(isLandscape, 65, 40), paddingVertical: 15 }}>
          <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1} onPress={() => setReadMore(!readMore)}>
              <FeedDescriptionSection
                      readMore={readMore}
                      setReadMore={setReadMore}
                      navigation={navigation}
                      tagData={feedSubItem?.format_tagged_data}
                      descriptions={feedSubItem?.text}
                      isLandscape={isLandscape}
                      descriptionTxt={{ color: colors.whiteColor }}
                  />
            </TouchableOpacity>
          </ScrollView>
        </View>
          }
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        padding: wp('3%'),
    },
    userNameTxt: {
        color: colors.whiteColor,
        fontFamily: fonts.RBold,
        fontSize: 16,
    },
    userNameView: {
        flexDirection: 'column',
        marginLeft: wp('4%'),
        width: wp('70%'),
    },
    activeTimeAgoTxt: {
        color: colors.whiteColor,
        fontFamily: fonts.RRegular,
        fontSize: 14,
        top: 2,
    },
    background: {
        borderRadius: 50,
        height: 40,
        width: 40,
    },
});

export default memo(FeedAbsoluteTopView);
