import React, {useCallback, useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import images from '../../Constants/ImagePath';
import {formatTimestampForDisplay} from '../../utils/formatTimestampForDisplay';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import GroupIcon from '../GroupIcon';
import {tagRegex} from '../../Constants/GeneralConstants';

function WriteCommentItems({
  data = {},
  onProfilePress = () => {},
  onLikePress = () => {},
  onReply = () => {},
  showLikesModal = () => {},
  containerStyle = {},
  showReplyButton = true,
}) {
  const authContext = useContext(AuthContext);

  const renderTagText = useCallback(
    (matchingString) => (
      <Text style={styles.tagText}>{`${matchingString}`}</Text>
    ),
    [],
  );

  return (
    <View style={[styles.mainContainer, containerStyle]}>
      <TouchableOpacity
        onPress={() =>
          onProfilePress({
            userId: data.user.id,
            entityType: data.user.data.entity_type,
          })
        }>
        <GroupIcon
          imageUrl={data.user.data.full_image}
          entityType={data.user.data.entity_type}
          groupName={data.user.data.full_name}
          containerStyle={styles.background}
        />
      </TouchableOpacity>
      <View style={styles.commentView}>
        <Text style={styles.userNameTxt}>
          {data.user.data.full_name}{' '}
          <Text style={[styles.userNameTxt, {fontFamily: fonts.RRegular}]}>
            <ParsedText
              parse={[{pattern: tagRegex, renderText: renderTagText}]}
              childrenProps={{allowFontScaling: false}}>
              {data.data.text}
            </ParsedText>
          </Text>
        </Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.activeTimeAgoTxt}>
              {formatTimestampForDisplay(data.created_at, 0)}
            </Text>
          </View>
          <TouchableOpacity style={{marginLeft: 15}} onPress={showLikesModal}>
            <Text style={[styles.activeTimeAgoTxt, {fontFamily: fonts.RBold}]}>
              {data.latest_children?.like?.length ?? 0}{' '}
              {data.latest_children?.like?.length > 1
                ? strings.likesTitle
                : strings.likeTitle}
            </Text>
          </TouchableOpacity>

          {showReplyButton ? (
            <TouchableOpacity style={{marginLeft: 15}} onPress={onReply}>
              <Text
                style={[styles.activeTimeAgoTxt, {fontFamily: fonts.RBold}]}>
                {strings.reply}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <TouchableOpacity style={styles.iconContainer} onPress={onLikePress}>
        <Image
          source={
            data.latest_children?.like?.some(
              (obj) => obj.user_id === authContext.entity.uid,
            )
              ? images.likeImage
              : images.unlikeImage
          }
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.whiteColor,
  },
  background: {
    width: 35,
    height: 35,
  },

  userNameTxt: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.RBold,
    color: colors.extraLightBlackColor,
    marginBottom: 5,
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  commentView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 7,
  },
  activeTimeAgoTxt: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.tagColor,
    fontFamily: fonts.RRegular,
    marginBottom: 5,
  },
});

export default WriteCommentItems;
