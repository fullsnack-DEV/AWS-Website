import React, {
 useContext, useEffect, useRef, useState,
} from 'react';
import {
    View,
    StyleSheet, TouchableOpacity, Image, Text, TextInput, Keyboard,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import images from '../../Constants/ImagePath';
import Header from '../../components/Home/Header';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import { widthPercentageToDP as wp } from '../../utils';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';
import AuthContext from '../../auth/context';
import { createReaction } from '../../api/NewsFeeds';

function SingleNotificationScreen({ route, navigation }) {
    const postItem = route.params?.notificationItem?.activities?.[0];
    const [commentTxt, setCommentTxt] = useState('');
    const keyboardDidShowListener = useRef();
    const keyboardDidHideListener = useRef();
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const onKeyboardShow = (event) => setKeyboardOffset(event.endCoordinates.height);
    const onKeyboardHide = () => setKeyboardOffset(0);

    useEffect(() => {
        keyboardDidShowListener.current = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
        keyboardDidHideListener.current = Keyboard.addListener('keyboardWillHide', onKeyboardHide);
        return () => {
            keyboardDidShowListener.current.remove();
            keyboardDidHideListener.current.remove();
        };
    }, []);

  const authContext = useContext(AuthContext)
  return (
    <View style={{ flex: 1 }}>
      <Header
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack() }>
              <Image source={images.backArrow} style={styles.backImageStyle} />
            </TouchableOpacity>
          }
          centerComponent={<Text style={styles.eventTextStyle}>{'Naymar\'s Post'}</Text>}
      />
      <View style={ styles.sperateLine } />
      <View style={{ flex: 1 }}>
        <NewsFeedPostItems
            pullRefresh={false}
            item={postItem}
            navigation={navigation}
            caller_id={authContext?.entity?.uid}
            // onEditPressDone={onEditPressDone}
            // onImageProfilePress={() => onProfilePress(item)}
            // onLikePress={onLikeButtonPress}
            // onDeletePost={onDeleteButtonPress}
         />

      </View>
      <View
            style={[
                styles.bottomSafeAreaStyle,
                { bottom: keyboardOffset, position: 'absolute' },
            ]}>
        {/* <View style={styles.bottomSperateLine} /> */}
        <View style={styles.bottomImgView}>
          <View style={styles.commentReportView}>
            <Image
                        source={
                            postItem?.full_image ? { uri: postItem?.full_image } : images.profilePlaceHolder
                        }
                        resizeMode={'cover'}
                        style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                    />
          </View>
          <View style={styles.onlyMeViewStyle}>
            <TextInput
                        placeholder={'Write a comment'}
                        placeholderTextColor={colors.userPostTimeColor}
                        multiline={true}
                        textAlignVertical={'top'}
                        value={commentTxt}
                        onChangeText={setCommentTxt}
                        style={{
                            textAlignVertical: 'center',
                            fontSize: 14,
                            lineHeight: 14,
                            width: wp('66%'),
                            marginHorizontal: '2%',
                            color: colors.lightBlackColor,
                            fontFamily: fonts.RRegular,
                            paddingVertical: 0,
                            paddingLeft: 8,
                            alignSelf: 'center',
                            maxHeight: hp(20),
                        }}
                    />
            {commentTxt.trim().length > 0 && (
              <TouchableOpacity
                            onPress={() => {
                                const bodyParams = {
                                    reaction_type: 'comment',
                                    activity_id: postItem?.id,
                                    data: {
                                        text: commentTxt,
                                    },
                                };
                                createReaction(bodyParams, authContext)
                                    .then(() => {
                                        setCommentTxt('');
                                    })
                                    .catch((e) => {
                                        console.log(e);
                                    });
                            }}>
                <Text style={styles.sendTextStyle}>SEND</Text>
              </TouchableOpacity>
                    )}
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  sperateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
  },
    bottomImgView: {
        alignSelf: 'center',
        flexDirection: 'row',
        paddingVertical: hp('1.5%'),
        width: wp('92%'),
    },
    commentReportView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    onlyMeViewStyle: {
        alignItems: 'center',
        backgroundColor: colors.offwhite,
        borderRadius: 6,
        flexDirection: 'row',
        marginHorizontal: wp('2%'),
        shadowColor: colors.googleColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 0.5,
        width: wp('80%'),
    },
    sendTextStyle: {
        color: colors.themeColor,
        fontFamily: fonts.RBold,
        fontSize: 11,
    },
    bottomSafeAreaStyle: {
        backgroundColor: colors.whiteColor,
        shadowOpacity: 0.2,
        shadowOffset: {
            height: -3,
            width: 0,
        },
        width: '100%',
        elevation: 5,
    },
});

export default SingleNotificationScreen;
