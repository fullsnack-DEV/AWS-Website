/* eslint-disable no-useless-escape */
import React, {
 useCallback, useEffect, useState, useContext,
} from 'react';
  import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Alert,
   SafeAreaView, TextInput,
   Keyboard,
} from 'react-native';

  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import { Text } from 'react-native-elements';

import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
  import { createReaction, getReactions } from '../../api/NewsFeeds';
  import images from '../../Constants/ImagePath';

  import colors from '../../Constants/Colors'
  import fonts from '../../Constants/Fonts'
  import AuthContext from '../../auth/context';
import WriteCommentItems from './WriteCommentItems';

  const CommentModal = ({
    item,
    updateCommentCount,
    commentModalRef,
    navigation,
  }) => {
    const authContext = useContext(AuthContext);

    const [commentTxt, setCommentText] = useState('');
    const [commentData, setCommentData] = useState([]);
    const [currentUserDetail, setCurrentUserDetail] = useState(null);

    useEffect(() => {
        const entity = authContext.entity;
    setCurrentUserDetail(entity.obj || entity.auth.user);
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
        ({ item: data }) => (
          <WriteCommentItems data={data} onProfilePress={onProfilePress}/>
        ), [],
);
      const listEmptyComponent = () => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Comments Yet</Text>
        </View>
      );

    const ModalHeader = () => (
      <View style={styles.headerStyle}>
        <View style={styles.handleStyle}/>
      </View>

    )

    const FooterComponent = () => (
      <SafeAreaView
            style={styles.bottomSafeAreaStyle}>
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
                    lineHeight: 20,
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
                              Keyboard.dismiss();
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
    )

    const flatListProps = {
      showsVerticalScrollIndicator: false,
      showsHorizontalScrollIndicator: false,
      keyboardShouldPersistTaps: 'never',
      bounces: false,
      data: commentData,
      renderItem: renderComments,
      keyExtractor: (index) => index.toString(),
      ListEmptyComponent: listEmptyComponent,
    }

    const onProfilePress = (data) => {
        if (commentModalRef?.current?.close()) commentModalRef.current.close();
        navigation.navigate('HomeScreen', {
            uid: data?.user?.id,
            backButtonVisible: true,
            role: data?.user?.entity_type === 'player'
                    ? 'user'
                    : data?.user?.entity_type,
        });
    }

    return (
      <Portal>
        <Modalize
              snapPoint={hp(50)}
              withHandle={false}
              overlayStyle={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              modalStyle={{
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
                shadowColor: colors.blackColor,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 10,
              }}
              ref={commentModalRef}
              HeaderComponent={ModalHeader}
              flatListProps={flatListProps}
              FooterComponent={FooterComponent}
          />
      </Portal>

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
        marginTop: '20%',
      },
    headerStyle: {
      borderTopRightRadius: 25,
      borderTopLeftRadius: 25,
      backgroundColor: colors.whiteColor,
    },
    handleStyle: {
      marginVertical: 15,
      alignSelf: 'center',
      height: 5,
      width: 40,
      borderRadius: 15,
      backgroundColor: '#DADBDA',
    },
  });

  export default CommentModal;
