// @flow
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {formatTimestampForDisplay} from '../../../utils/formatTimestampForDisplay';
import GroupIcon from '../../GroupIcon';

const FeedProfile = ({
  time,
  data = {},
  onImageProfilePress = () => {},
  isRepost = false,
  onThreeDotPress = () => {},
  isEvent = false,
  showMoreOptions = false,
  groupName = '',
}) => (
  <View style={styles.mainContainer}>
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
      }}
      onPress={onImageProfilePress}>
      <GroupIcon
        imageUrl={data.full_image ?? data.thumbnail}
        entityType={data.entity_type}
        groupName={data.full_name ?? data.group_name}
        containerStyle={styles.imageMainContainer}
        textstyle={{fontSize: 12}}
      />
      <View style={{flex: 1}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Text
            numberOfLines={2}
            style={styles.userNameTxt}
            onPress={onImageProfilePress}>
            {data.full_name ?? data.group_name}{' '}
            {isEvent && (
              <Text style={[styles.userNameTxt, {fontFamily: fonts.RRegular}]}>
                {strings.createdEvent}
              </Text>
            )}
          </Text>
          {groupName && (
            <Image
              source={images.nextFilledArrow}
              style={styles.iconContainer}
            />
          )}
          {groupName && (
            <Text numberOfLines={2} style={styles.userNameTxt}>
              {groupName}{' '}
            </Text>
          )}
        </View>
        <Text style={styles.activeTimeAgoTxt}>
          {formatTimestampForDisplay(time)}
        </Text>
      </View>
    </TouchableOpacity>
    {!isRepost && showMoreOptions && (
      <TouchableOpacity
        style={styles.dotImageTouchStyle}
        onPress={() => {
          onThreeDotPress();
        }}>
        <Image style={styles.dotImageStyle} source={images.threeDotIcon} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  activeTimeAgoTxt: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
  dotImageStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.googleColor,
  },
  dotImageTouchStyle: {
    paddingLeft: 5,
    alignItems: 'flex-start',
    marginTop: 10,
    justifyContent: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  userNameTxt: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    textAlign: 'left',
  },
  imageMainContainer: {
    height: 40,
    width: 40,
    marginRight: 15,
  },
  iconContainer: {
    height: 8,
    width: 4,
    resizeMode: 'contain',
    marginHorizontal: 8,
  },
});
export default FeedProfile;
