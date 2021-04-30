/* eslint-disable no-useless-escape */
import React, {
    useCallback, useEffect, useRef, useState, useContext,
  } from 'react';
  import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Alert,
   SafeAreaView, TextInput,
   Keyboard,
} from 'react-native';
  import SwipeUpDownModal from 'react-native-swipe-modal-up-down';

  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import { Text } from 'react-native-elements';

  import { createReaction, getReactions } from '../../api/NewsFeeds';
  import images from '../../Constants/ImagePath';

  import colors from '../../Constants/Colors'
  import fonts from '../../Constants/Fonts'
  import AuthContext from '../../auth/context';
  import TCThinDivider from '../TCThinDivider';
import WriteCommentItems from './WriteCommentItems';

  const CommentModal = ({
    item,
    showCommentModal,
    onClose,
    updateCommentCount,
  }) => {
    const authContext = useContext(AuthContext);

    const [commentTxt, setCommentText] = useState('');
    const [commentData, setCommentData] = useState([]);
    const [currentUserDetail, setCurrentUserDetail] = useState(null);

    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const onKeyboardShow = (event) => setKeyboardOffset(event.endCoordinates.height);
    const onKeyboardHide = () => setKeyboardOffset(0);
    const keyboardDidShowListener = useRef();
    const keyboardDidHideListener = useRef();

    useEffect(() => {
        const entity = authContext.entity;
    setCurrentUserDetail(entity.obj || entity.auth.user);
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
    }, [authContext.entity]);

    useEffect(() => {
        const entity = authContext.entity;
        setCurrentUserDetail(entity.obj || entity.auth.user);
        const params = {
          activity_id: item?.id,
          reaction_type: 'comment',
        };
        getReactions(params, authContext)
          .then((response) => {
            setCommentData(response?.payload?.reverse());
          })
          .catch((e) => {
            Alert.alert('', e.messages);
          });
      }, [authContext, item?.id]);

    let userImage = '';
    if (currentUserDetail && currentUserDetail.thumbnail) {
      userImage = currentUserDetail.thumbnail;
    }

    const renderComments = useCallback(
        ({ item: data }) => <WriteCommentItems data={data} />,
        [],
      );
      const listEmptyComponent = () => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Comments Yet</Text>
        </View>
      );

    return (

      <SwipeUpDownModal
            modalVisible={showCommentModal}
            PressToanimate={true}
            OpenModalDirection={'down'}
            PressToanimateDirection={'down'}
            // fade={true}
            ContentModal={
              <View style={{ flex: 1 }}>
                <TCThinDivider width={'100%'} height={1} />
                <FlatList
                  data={commentData}
                  renderItem={renderComments}
                  keyExtractor={(index) => index.toString()}
                  ListEmptyComponent={listEmptyComponent}
                  style={{ marginBottom: 100 }}
                />

                <SafeAreaView
                  style={[
                    styles.bottomSafeAreaStyle,
                    { bottom: keyboardOffset, position: 'absolute' },
                  ]}>
                  {/* <View style={styles.bottomSperateLine} /> */}
                  <View style={styles.bottomImgView}>
                    <View style={styles.commentReportView}>
                      <Image
                        source={
                          userImage ? { uri: userImage } : images.profilePlaceHolder
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
                        onChangeText={(text) => setCommentText(text)}
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
                              activity_id: item?.id,
                              data: {
                                text: commentTxt,
                              },
                            };
                            createReaction(bodyParams, authContext)
                              .then((response) => {
                                const dataOfComment = [...commentData];
                                dataOfComment.unshift(response.payload);
                                updateCommentCount({ id: item?.id, count: dataOfComment?.length });
                                setCommentData(dataOfComment);
                                setCommentText('');
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
                </SafeAreaView>
              </View>
            }
            HeaderStyle={styles.headerContent}
            ContentModalStyle={styles.Modal}
            HeaderContent={
              <View style={styles.containerHeader}>
                <TouchableOpacity
                  onPress={onClose}>
                  <Text>Comments</Text>
                </TouchableOpacity>
              </View>
            }
            onClose={onClose}
          />

    );
  }

  const styles = StyleSheet.create({

    containerHeader: {
      flex: 1,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      height: 55,
      backgroundColor: colors.whiteColor,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
    },
    headerContent: {
      marginTop: 55,
    },
    Modal: {
      backgroundColor: colors.whiteColor,
      marginTop: 110,
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
      backgroundColor: colors.grayBackgroundColor,
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
      emptyText: {
        fontSize: 18,
        fontFamily: fonts.RMedium,
        color: colors.grayColor,
      },
      emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '60%',
      },

  });

  export default CommentModal;
