import React, { Fragment, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../utils';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import { QBgetFileURL } from '../utils/QuickBlox';

const TCMessage = ({
  body,
  type = 'sender',
  messageStyle,
  attachments = [],
}) => {
  const [fileUrls, setFileUrls] = useState([]);

  const GradiantContainer = ({
    style,
    startGradiantColor,
    endGradiantColor,
    ...props
  }) => (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style}
      colors={ [startGradiantColor, endGradiantColor] }>
      {props.children}
    </LinearGradient>
  )

  useEffect(() => {
    attachments.map((item) => QBgetFileURL(item.id).then((fileUrl) => {
      setFileUrls((urls) => [...urls, fileUrl])
    }))
  }, [])

  return (
    <Fragment>
      <GradiantContainer
            startGradiantColor={type === 'receiver' ? colors.whiteColor : colors.yellowColor}
            endGradiantColor={type === 'receiver' ? colors.whiteColor : colors.themeColor}
            style={{
              ...styles.messageContaienr,
              shadowColor: type === 'sender' ? colors.googleColor : '',
              shadowOffset: type === 'sender' ? { width: 0, height: -2 } : {},
              shadowOpacity: type === 'sender' ? 0.5 : 0,
              shadowRadius: type === 'sender' ? 4 : 0,
              elevation: type === 'sender' ? 10 : 0,
              borderTopLeftRadius: type === 'receiver' ? 0 : wp(2),
              borderBottomRightRadius: type === 'sender' ? 0 : wp(2),
              ...messageStyle,
            }}>
        {body === '[attachment]'
          || <View style={{ alignSelf: 'flex-start', padding: wp(2) }}>
            <Text
                  style={{
                    ...styles.messageText,
                    color: type === 'sender' ? colors.whiteColor : colors.lightBlackColor,
                  }}>
              {body}
            </Text>
          </View>}
      </GradiantContainer>
      {/*  Attachments */}
      {fileUrls.length > 0 && (
        <View style={{
          paddingLeft: type === 'receiver' ? wp(5) : wp(2),
        }}>
          {fileUrls.map((item) => (
            <FastImage
                source={{ uri: item }}
                key={item}
                resizeMode={'cover'}
                style={{
                  marginTop: hp(1),
                  overflow: 'hidden',
                  borderBottomRightRadius: type === 'receiver' ? wp(3) : wp(0),
                  borderBottomLeftRadius: wp(3),
                  borderTopRightRadius: wp(3),
                  borderTopLeftRadius: type === 'receiver' ? wp(0) : wp(3),
                  height: wp(50),
                  width: wp(50),
                }}/>
          ))}
        </View>
      )}
    </Fragment>
  )
}
const styles = StyleSheet.create({
  messageContaienr: {
    // marginVertical: wp(2),
    flex: 1,
    borderRadius: wp(2),
  },
  messageText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    flex: 1,
    maxWidth: wp(60),
    textAlign: 'left',
    color: colors.whiteColor,
  },
});

export default TCMessage;
