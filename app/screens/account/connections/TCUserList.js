import React, { useEffect, useState } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import { heightPercentageToDP as hp } from '../../../utils';
import TCGroupNameBadge from '../../../components/TCGroupNameBadge';

const TCUserList = ({
  title,
  subTitle,
  is_following = false,
  profileImage,
  followUnfollowPress,
  entityType,
  showFollowUnfollowButton = true,
  onProfilePress = () => {},
}) => {
  const [follow, setFollow] = useState(is_following);
  useEffect(() => setFollow(is_following), [is_following])
  return (
    <View>
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 15,
      }}>
        <TouchableOpacity onPress={onProfilePress} style={{ flex: 0.18, alignItems: 'flex-start' }}>
          <FastImage
                        resizeMode={'cover'}
                        source={profileImage ? { uri: profileImage } : images.profilePlaceHolder}
                        style={{ width: 45, height: 45, borderRadius: 25 }}
                    />
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress} style={{ flex: 0.65, paddingVertical: 10, justifyContent: 'center' }}>
          <TCGroupNameBadge name={title} groupType={entityType}/>
          <Text style={{ fontSize: 14, fontFamily: fonts.RRegular, color: colors.userPostTimeColor }}>{subTitle}</Text>
        </TouchableOpacity>
        <View style={{ flex: 0.25, alignItems: 'center' }}>

          <View>
            {showFollowUnfollowButton && <TCGradientButton
                onPress={() => {
                  setFollow(!follow)
                  followUnfollowPress(!follow)
                }}
                outerContainerStyle={{
                  borderRadius: 5,
                  height: 25,
                  width: 75,
                  borderWidth: 1,
                  borderColor: follow ? colors.yellowColor : colors.whiteColor,
                }}
                title={follow ? 'Following' : 'Follow'}
                startGradientColor={!follow ? colors.yellowColor : colors.whiteColor}
                endGradientColor={!follow ? colors.themeColor : colors.whiteColor}
                textStyle={{ color: !follow ? colors.whiteColor : colors.themeColor, fontSize: 11, fontFamily: fonts.RBold }}
                style={{
                  borderRadius: 0,
                  height: '100%',
                  width: '100%',
                }} />}
          </View>
        </View>
      </View>
      <View style={styles.seperateContainer}/>
    </View>
  )
}

const styles = StyleSheet.create({
  seperateContainer: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: colors.grayBackgroundColor,
    marginVertical: hp(0.7),
  },
})
export default TCUserList;
