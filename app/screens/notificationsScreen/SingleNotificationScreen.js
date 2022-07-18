/* eslint-disable no-unsafe-optional-chaining */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import _ from 'lodash';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {widthPercentageToDP as wp} from '../../utils';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';
import AuthContext from '../../auth/context';
import {createReaction} from '../../api/NewsFeeds';

function SingleNotificationScreen({route, navigation}) {
  const postItem = route.params?.notificationItem?.activities?.[0];
  console.log('Post Item:=>', postItem);
  const [commentTxt, setCommentTxt] = useState('');
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const onKeyboardShow = (event) =>
    setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${postItem?.actor?.data?.full_name}'s Post`,
    });
  }, [navigation, postItem?.actor?.data?.full_name]);
  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener(
      'keyboardWillShow',
      onKeyboardShow,
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      'keyboardWillHide',
      onKeyboardHide,
    );
    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);

  const authContext = useContext(AuthContext);
  const onLikePress = (item) => {
    console.log('ITEM 123:=>', item);
    const bodyParams = {
      reaction_type: 'clap',
      activity_id: item.id,
    };
    createReaction(bodyParams, authContext)
      .then((res) => {
        const pData = _.cloneDeep(postItem);
        const pIndex = pData.findIndex((pItem) => pItem?.id === item?.id);
        const likeIndex =
          pData[pIndex].own_reactions?.clap?.findIndex(
            (likeItem) => likeItem?.user_id === authContext?.entity?.uid,
          ) ?? -1;
        if (likeIndex === -1) {
          pData[pIndex].own_reactions = {...pData?.[pIndex]?.own_reactions};
          pData[pIndex].own_reactions.clap = [
            ...pData?.[pIndex]?.own_reactions?.clap,
          ];
          pData[pIndex].own_reactions.clap.push(res?.payload);
          pData[pIndex].reaction_counts = {...pData?.[pIndex]?.reaction_counts};
          pData[pIndex].reaction_counts.clap =
            pData?.[pIndex]?.reaction_counts?.clap + 1 ?? 0;
        } else {
          pData[pIndex].own_reactions = {...pData?.[pIndex]?.own_reactions};
          pData[pIndex].own_reactions.clap = [
            ...pData?.[pIndex]?.own_reactions?.clap,
          ];
          pData[pIndex].own_reactions.clap = pData?.[
            pIndex
          ]?.own_reactions?.clap?.filter(
            (likeItem) => likeItem?.user_id !== authContext?.entity?.uid,
          );
          pData[pIndex].reaction_counts = {...pData?.[pIndex]?.reaction_counts};
          pData[pIndex].reaction_counts.clap =
            pData?.[pIndex]?.reaction_counts?.clap - 1 ?? 0;
        }
        console.log('pData[pIndex]', pData[pIndex]);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <View style={{flex: 1, marginTop: 15}}>
            <NewsFeedPostItems
              pullRefresh={false}
              item={postItem}
              navigation={navigation}
              caller_id={authContext?.entity?.uid}
              // onEditPressDone={onEditPressDone}
              // onImageProfilePress={() => onProfilePress(item)}
              onLikePress={() => onLikePress(postItem)}
              // onDeletePost={onDeleteButtonPress}
            />
          </View>
          <View style={[styles.bottomSafeAreaStyle, {bottom: keyboardOffset}]}>
            {/* <View style={styles.bottomSperateLine} /> */}
            <View style={styles.bottomImgView}>
              <View style={styles.commentReportView}>
                <Image
                  source={
                    postItem?.full_image
                      ? {uri: postItem?.full_image}
                      : images.profilePlaceHolder
                  }
                  resizeMode={'cover'}
                  style={{width: 40, height: 40, borderRadius: 40 / 2}}
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
                    }}
                  >
                    <Text style={styles.sendTextStyle}>SEND</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
    shadowOffset: {width: 0, height: 1},
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
      height: -5,
      width: 0,
    },
    width: '100%',
    elevation: 5,
  },
});

export default SingleNotificationScreen;
