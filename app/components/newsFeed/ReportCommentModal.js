/* eslint-disable no-useless-escape */
import React from 'react';
import {
    StyleSheet, Text, View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import FastImage from 'react-native-fast-image';
import { TouchableHighlight } from 'react-native-gesture-handler';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import { widthPercentageToDP as wp } from '../../utils';
import useRenderCount from '../../hooks/useRenderCount';

const optionSelectionColor = colors.optionSelectionColor
const ReportCommentModal = ({
    commentData,
    reportCommentModalRef,
  }) => {
    useRenderCount('Report Comment Modal')
    const menuList = [
        { key: 'report', title: 'Report This Comment' },
        { key: 'block', title: 'Block' },
        { key: 'cancelFollowing', title: ' Cancel Following' },
    ]

    const onOptionPress = (optionKey) => {
        console.log(optionKey)
    }
    let userName = '';
    let userProfile = '';
    if (commentData?.user?.data) {
        userName = commentData?.user?.data?.full_name;
        userProfile = commentData?.user?.data?.full_image;
        if (userProfile) userProfile = { uri: userProfile }
        else userProfile = images.profilePlaceHolder
    }

    return (
      <Portal>
        <Modalize
                withHandle={false}
                adjustToContentHeight={true}
                overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                modalStyle={{
                    backgroundColor: 'transparent',
                }}
                ref={reportCommentModalRef}
            >
          <View style={styles.mainContainer}>
            {/* Top Container */}
            <View style={styles.topContentContainer}>
              {/*  Profile Header */}
              <View style={{
                    backgroundColor: optionSelectionColor,
                    height: 125,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
              }}>
                <FastImage
                        source={userProfile}
                        style={styles.profileImage}
                />
                <Text style={styles.userName}>{userName}</Text>
              </View>

              {menuList.map((item) => (
                <TouchableHighlight
                    key={item?.key}
                    underlayColor={colors.underlayColor}
                    onPressOut={() => onOptionPress(item?.key)}
                    style={styles.optionContainer}>
                  <Text style={styles.textStyle}>{item.title}</Text>
                </TouchableHighlight>
                ))}
            </View>

            {/* Bottom Container */}
            <TouchableHighlight
                onPressOut={() => reportCommentModalRef?.current?.close()}
                underlayColor={colors.underlayColor}
                style={styles.bottomContentContainer}>
              <Text style={{ ...styles.textStyle, fontFamily: fonts.RMedium, color: colors.redColor }}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </Modalize>
      </Portal>

    )
}

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    optionContainer: {
        width: wp(100) - 30,
        borderTopColor: colors.ligherGray,
        borderTopWidth: 0.5,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topContentContainer: {
        overflow: 'hidden',
        width: wp(100) - 30,
        borderRadius: 12,
        backgroundColor: optionSelectionColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContentContainer: {
        marginTop: 10,
        width: wp(100) - 30,
        height: 57,
        borderRadius: 12,
        backgroundColor: colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: fonts.RRegular,
        color: colors.neonBlue,
    },
    profileImage: {
        height: 58,
        width: 58,
        borderRadius: 50,
    },
    userName: {
        fontSize: 12,
        fontFamily: fonts.RBold,
        color: colors.lightBlackColor,
        marginTop: 14,
    },
});

export default ReportCommentModal;
