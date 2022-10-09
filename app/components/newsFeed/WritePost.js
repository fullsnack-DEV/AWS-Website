import React, {memo} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

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
        <Text style={styles.writePostText}>Write a post...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImg: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 35,
    borderWidth: 1,
    height: 38,
    resizeMode: 'cover',
    width: 38,
  },
  writePostView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 8,
    height: 40,
    marginLeft: wp('4%'),
    justifyContent: 'center',
    paddingLeft: 12,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 1,
    width: wp('75%'),
  },
  writePostText: {
    color: colors.userPostTimeColor,
    fontSize: 14,
    fontFamily: fonts.RRegular,
  },
  writePostActorContainer: {
    backgroundColor: colors.whiteColor,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 1,
  },
});

export default memo(WritePost);
