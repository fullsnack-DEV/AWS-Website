import React, { useState } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity, Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../Constants/ImagePath';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';
import TCGradientButton from './TCGradientButton';
import { heightPercentageToDP as hp } from '../utils';
import TCInnerLoader from './TCInnerLoader';

const TCUserFollowUnfollowList = ({
  followSoccerUser,
  unFollowSoccerUser,
  isShowThreeDots = false,
  title,
  subTitle,
  is_following = false,
  profileImage,
  onFollowUnfollowPress = () => {},
  onThreeDotPress = () => {},
  userRole,
  myUserId,
  userID,
  statusTitle,
  statusColor,
}) => {
  const [loading, setLoading] = useState(false);

  const onFollowPress = async () => {
    setLoading(true);
    const params = {
      entity_type: 'player',
    };
    if (!is_following) {
      followSoccerUser(params, userID).then(() => {
        onFollowUnfollowPress(userID, true)
      }).catch((error) => {
        setTimeout(() => {
          Alert.alert('Towns Cup', error.messages);
        }, 0.1)
      }).finally(() => setLoading(false));
    } else {
      unFollowSoccerUser(params, userID).then(() => {
        onFollowUnfollowPress(userID, false);
      }).finally(() => setLoading(false));
    }
  };

  return (
    <View>
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ flex: 0.15, alignItems: 'center' }}>
          <FastImage
                resizeMode={'cover'}
                source={profileImage ? { uri: profileImage } : images.profilePlaceHolder}
                style={{ width: 30, height: 30, borderRadius: 25 }}
            />
        </View>
        <View style={{ flex: 0.60, paddingVertical: 10, justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, fontFamily: fonts.RMedium }}>{title}</Text>
          <View style={{ flexDirection: 'row' }}>
            {subTitle !== '' && (
              <Text style={{ fontSize: 14, fontFamily: fonts.RRegular, color: colors.userPostTimeColor }}>
                {`${subTitle} `}
                {statusTitle !== '' && <Text style={{ color: statusColor ?? colors.userPostTimeColor, fontFamily: fonts.RBold }}>{`${statusTitle} `}</Text>}
              </Text>
            )}

          </View>
        </View>
        <View style={{ flex: 0.25, alignItems: 'center' }}>
          {isShowThreeDots ? (
            <TouchableOpacity onPress={onThreeDotPress} style={{ alignSelf: 'flex-end', right: 10 }}>
              <Image source={ images.vertical3Dot } style={ styles.threedot } />
            </TouchableOpacity>
          ) : (
            <View>
              {!loading && userRole === 'user' && (<TCGradientButton
                      onPress={onFollowPress}
                      title={is_following ? 'Following' : 'Follow'}
                      startGradientColor={is_following ? colors.yellowColor : colors.whiteColor}
                      endGradientColor={is_following ? colors.themeColor : colors.whiteColor}
                      textStyle={{ color: is_following ? colors.whiteColor : colors.themeColor, fontSize: 11, fontFamily: fonts.RBold }}
                      style={{
                        display: myUserId === userID ? 'none' : 'flex',
                        borderRadius: 5,
                        height: 25,
                        width: 75,
                        borderWidth: 1,
                        borderColor: colors.yellowColor,
                      }} />
              )}
              {loading && userRole === 'user' && (
                <View style={{
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 25,
                  width: 75,
                  borderWidth: 1,
                  borderColor: colors.yellowColor,
                }}>
                  <TCInnerLoader allowMargin={true} size={20} visible={loading}/>
                </View>
              )}
            </View>
          )}

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
  threedot: {
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 12,
  },
})
export default TCUserFollowUnfollowList;
