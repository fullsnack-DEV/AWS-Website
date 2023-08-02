import React, {memo, useCallback, useContext} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import Orientation from 'react-native-orientation';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import {getScreenWidth} from '../../../utils';
import {formatTimestampForDisplay} from '../../../utils/formatTimestampForDisplay';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import FeedDescriptionSection from './FeedDescriptionSection';
import GroupIcon from '../../GroupIcon';
import Verbs from '../../../Constants/Verbs';

const FeedAbsoluteTopView = memo(
  ({
    screenInsets,
    feedItem = {},
    isLandscape = false,
    readMore = false,
    setReadMore = () => {},
    navigation,
    feedSubItem = {},
    currentViewIndex,
    onThreeDotPress = () => {},
  }) => {
    const userImage = feedItem?.actor?.data?.thumbnail
      ? {uri: feedItem?.actor?.data?.thumbnail}
      : images?.profilePlaceHolder;
    const authContext = useContext(AuthContext);

    const onProfilePress = useCallback(() => {
      if (feedItem?.actor?.id) {
        if (feedItem?.actor?.id !== authContext?.entity?.uid) {
          navigation.push('HomeScreen', {
            uid: feedItem?.actor?.id,
            backButtonVisible: true,
            role: ['player', 'user']?.includes(
              feedItem?.actor?.data?.entity_type,
            )
              ? 'user'
              : feedItem?.actor?.data?.entity_type,
          });
        }
      }
    }, [
      authContext?.entity?.uid,
      feedItem?.actor?.data?.entity_type,
      feedItem?.actor?.id,
      navigation,
    ]);

    return (
      <SafeAreaView
        style={[
          styles.topMainContainer,
          {
            position: Platform.OS === 'ios' ? 'relative' : 'absolute',
          },
          readMore ? {backgroundColor: colors.blackColor} : {},
        ]}>
        <View
          style={{
            ...styles.topSubContainer,
            width: getScreenWidth({isLandscape, screenInsets}),
          }}>
          <View style={styles.profileContainer}>
            <TouchableOpacity
              onPress={() => {
                Orientation.lockToPortrait();
                navigation.goBack(null);
              }}>
              <FastImage
                tintColor={colors.whiteColor}
                source={images.backArrow}
                resizeMode={'contain'}
                style={{height: 20, width: 20}}
              />
            </TouchableOpacity>

            <View style={styles.mainContainer}>
              <TouchableOpacity
                onPress={onProfilePress}
                style={{marginLeft: 10, marginRight: 15}}>
                <GroupIcon
                  imageUrl={userImage}
                  containerStyle={styles.profileImageContainer}
                  entityType={Verbs.entityTypePlayer}
                />
              </TouchableOpacity>
              <View style={styles.userNameView}>
                <Text
                  numberOfLines={1}
                  style={styles.userNameTxt}
                  onPress={() => {}}>
                  {feedItem.actor?.data?.full_name}
                </Text>
                <Text style={styles.activeTimeAgoTxt}>
                  {formatTimestampForDisplay(feedItem?.time)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            {feedSubItem?.attachments?.length > 1 && (
              <View style={styles.lengthViewStyle}>
                <Text style={styles.lengthTextStyle}>
                  {currentViewIndex + 1}
                  {'/'}
                  {feedSubItem.attachments.length}
                </Text>
              </View>
            )}

            <TouchableOpacity onPress={onThreeDotPress} style={styles.moreIcon}>
              <Image source={images.threeDotIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <FeedDescriptionSection
          readMore={readMore}
          descriptions={feedSubItem?.text}
          setReadMore={setReadMore}
          tagData={feedSubItem?.format_tagged_data ?? []}
          navigation={navigation}
        />
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  topMainContainer: {
    // flex: 1,
    top: 30,
    zIndex: 99,
  },
  topSubContainer: {
    zIndex: 100,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameTxt: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  userNameView: {
    flex: 1,
  },
  activeTimeAgoTxt: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
  },
  profileImageContainer: {
    height: 40,
    width: 40,
    borderWidth: 1,
  },
  lengthTextStyle: {
    fontSize: 15,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
  },
  lengthViewStyle: {
    width: 40,
    height: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pagingBgColor,
    marginRight: 15,
  },
  moreIcon: {
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default FeedAbsoluteTopView;
