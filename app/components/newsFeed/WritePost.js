import React, {memo} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';

function WritePost({postDataItem, onWritePostPress}) {
  let userImage = '';
  if (postDataItem && postDataItem.thumbnail) {
    userImage = postDataItem.thumbnail;
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.writePostActorContainer}>
        <Image
          style={styles.profileImg}
          source={userImage ? {uri: userImage} : images.profilePlaceHolder}
        />
      </View>
      <TouchableOpacity style={styles.writePostView} onPress={onWritePostPress}>
        <Text style={styles.writePostText}> {strings.writePostText} </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackgroundColor,
  },
  writePostActorContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.greyBorderColor,
  },
  profileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 20,
  },
  writePostView: {
    flex: 1,
    padding: 10,
    marginLeft: 15,
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
  },
  writePostText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
});

export default memo(WritePost);
