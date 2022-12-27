/* eslint-disable no-useless-escape */
import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
  useMemo,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Text} from 'react-native-elements';

import Modal from 'react-native-modal';
import {Portal} from 'react-native-portalize';

import {useIsFocused} from '@react-navigation/native';
import {
  createReaction,
  getReactions,
  deleteReactions,
  EditReaction,
  createCommentReaction,
} from '../../api/NewsFeeds';
import images from '../../Constants/ImagePath';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import WriteCommentItems from './WriteCommentItems';
import SwipeableRow from '../gameRecordList/SwipeableRow';
import ReportCommentModal from './ReportCommentModal';
import Verbs from '../../Constants/Verbs';
import ActivityLoader from '../loader/ActivityLoader';

const CommentModal = ({
  item,
  updateCommentCount,
  commentModalRef,
  navigation,
  showCommentModal,
  onBackdropPress,
}) => {
  const reportCommentModalRef = useRef(null);
  const authContext = useContext(AuthContext);
  const isMyPost = useMemo(
    () => item?.actor?.id === authContext?.entity?.uid,
    [authContext?.entity?.uid, item?.actor?.id],
  );
  const isFocused = useIsFocused();
  const writeCommentTextInputRef = useRef(null);

  const [commentTxt, setCommentText] = useState('');
  const [commentData, setCommentData] = useState([]);
  const [editData, setEditData] = useState();

  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [selectedCommentData, setSelectedCommentData] = useState(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const entity = authContext.entity;
    setCurrentUserDetail(entity.obj || entity.auth.user);
  }, [authContext.entity]);

  useEffect(() => {
    if (isFocused) {
      const entity = authContext.entity;
      setCurrentUserDetail(entity.obj || entity.auth.user);
      const params = {
        activity_id: item?.id,
        reaction_type: Verbs.comment,
      };
      getReactions(params, authContext)
        .then((response) => {
          setCommentData(response?.payload?.reverse());
        })
        .catch((e) => {
          Alert.alert('', e.messages);
        });
    }
  }, [isFocused, authContext, item?.id]);

  let userImage = '';
  if (currentUserDetail && currentUserDetail.thumbnail) {
    userImage = currentUserDetail.thumbnail;
  }
  const onProfilePress = useCallback(
    (data) => {
      if (commentModalRef?.current?.close()) commentModalRef.current.close();
      navigation.navigate('HomeScreen', {
        uid: data?.user?.id,
        backButtonVisible: true,
        role:
          data?.user?.entity_type === Verbs.entityTypePlayer
            ? Verbs.entityTypeUser
            : data?.user?.entity_type,
      });
    },
    [commentModalRef, navigation],
  );

  const onLikePress = useCallback(
    ({data}) => {
      const bodyParams = {
        reaction_type: Verbs.like,
        activity_id: data?.activity_id,
        reaction_id: data?.id,
      };
      setloading(true);
      setCommentText('');
      createCommentReaction(bodyParams, authContext)
        .then(() => {
          const params = {
            activity_id: item?.id,
          };
          getReactions(params, authContext)
            .then((response) => {
              setCommentData(response?.payload?.reverse());
              setloading(false);
            })
            .catch((e) => {
              Alert.alert('', e.messages);
              setloading(false);
            });
        })
        .catch((e) => {
          Alert.alert('', e.messages);
          setloading(false);
        });
    },
    [authContext, item?.id],
  );

  const getButtons = useCallback(
    (data) => {
      const isMyComment = data.user_id === authContext.entity.uid;
      const buttons = [];
      if (isMyComment || isMyPost) {
        buttons.push({
          key: 'edit',
          label: 'Edit',
          fillColor: [colors.themeColor, colors.darkThemeColor],
          image: images.editPencil,
        });
      }
      if (isMyComment || isMyPost) {
        buttons.push({
          key: 'delete',
          label: 'Delete',
          fillColor: [colors.themeColor, colors.darkThemeColor],
          image: images.commentDeleteIcon,
        });
      }
      if (!isMyComment) {
        buttons.push({
          key: 'report',
          label: 'Report',
          fillColor: [colors.userPostTimeColor, colors.googleColor],
          image: images.commentReportIcon,
        });
      }

      return buttons;
    },
    [authContext.entity.uid, isMyPost],
  );

  const onCommentOptionsPress = useCallback(
    (key, data) => {
      if (key === 'report') {
        setSelectedCommentData(data);
        reportCommentModalRef.current.open();
      } else if (key === 'edit') {
        setCommentText(data.data.text);
        setEditData(data);
      } else {
        deleteReactions(data.id, authContext)
          .then(() => {
            const filtered = commentData.filter((e) => e.id !== data.id);
            setCommentData(filtered);
            updateCommentCount({
              id: item?.id,
              count: filtered?.length,
              data: filtered,
            });
          })
          .catch((e) => {
            Alert.alert('', e.messages);
          });
        // alert(key);
      }
    },
    [authContext, commentData, item?.id, updateCommentCount],
  );

  const renderComments = useCallback(
    ({item: data}) => (
      <SwipeableRow
        scaleEnabled={false}
        showLabel={true}
        buttons={getButtons(data)}
        onPress={(key) => onCommentOptionsPress(key, data)}>
        <WriteCommentItems
          data={data}
          onProfilePress={onProfilePress}
          onLikePress={() => onLikePress({data})}
        />
      </SwipeableRow>
    ),
    [
      getButtons,
      onCommentOptionsPress,
      onLikePress,
      onProfilePress,
      commentData,
    ],
  );
  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Comments Yet</Text>
    </View>
  );

  const ModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.handleStyle} />
    </View>
  );

  const onSendPress = () => {
    const bodyParams = {
      reaction_type: Verbs.comment,
      activity_id: item?.id,
      data: {
        text: commentTxt,
      },
    };
    setCommentText('');
    createReaction(bodyParams, authContext)
      .then((response) => {
        const dataOfComment = [...commentData];
        dataOfComment.unshift(response.payload);
        setCommentData([...dataOfComment]);
        updateCommentCount({
          id: item?.id,
          count: dataOfComment?.length,
          data: response?.payload,
        });
      })
      .catch((e) => {
        Alert.alert('', e.messages);
      });
  };

  const onSavePress = () => {
    const bodyParams = {
      reaction_type: Verbs.comment,
      activity_id: editData?.id,
      data: {
        text: commentTxt,
      },
    };
    setCommentText('');
    EditReaction(editData?.id, bodyParams, authContext)
      .then((response) => {
        setEditData();
        const arr = commentData;
        const foundIndex = arr.findIndex((x) => x.id === response?.payload?.id);
        arr[foundIndex] = response?.payload;
        setCommentData(arr);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
      });
  };

  const FooterComponent = () => (
    <SafeAreaView
      // pointerEvents={showBottomWriteCommentSection ? 'none' : 'auto'}
      style={styles.bottomSafeAreaStyle}>
      <View style={styles.bottomImgView}>
        <ActivityLoader visible={loading} />

        <View style={styles.commentReportView}>
          <Image
            source={userImage ? {uri: userImage} : images.profilePlaceHolder}
            resizeMode={'cover'}
            style={{width: 36, height: 36, borderRadius: 40 / 2}}
          />
        </View>
        <View style={styles.onlyMeViewStyle}>
          <TextInput
            ref={writeCommentTextInputRef}
            placeholder={'Write a comment'}
            placeholderTextColor={colors.userPostTimeColor}
            multiline={true}
            autoCorrect={false}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="none"
            value={commentTxt}
            keyboardType="visible-password"
            onChangeText={(text) => setCommentText(text)}
            style={styles.writeCommectStyle}
          />
          {commentTxt.trim().length > 0 &&
            (!editData ? (
              <TouchableOpacity onPress={onSendPress}>
                <Text style={styles.sendTextStyle}>SEND</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onSavePress}>
                <Text style={styles.sendTextStyle}>SAVE</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </SafeAreaView>
  );

  return (
    <View>
      <Portal>
        <Modal
          onBackdropPress={onBackdropPress}
          isVisible={showCommentModal}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={800}
          avoidKeyboard={true}
          style={{
            margin: 0,
          }}>
          <View
            style={[
              styles.bottomPopupContainer,
              {
                height:
                  Dimensions.get('window').height -
                  Dimensions.get('window').height / 10,
              },
            ]}>
            {ModalHeader()}
            <FlatList
              data={commentData}
              keyExtractor={(index) => index.toString()}
              renderItem={renderComments}
              ListEmptyComponent={listEmptyComponent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
            {FooterComponent()}
          </View>
        </Modal>
      </Portal>
      <ReportCommentModal
        commentData={selectedCommentData}
        reportCommentModalRef={reportCommentModalRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomImgView: {
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: hp('1.5%'),
    width: wp('92%'),
  },
  commentReportView: {
    backgroundColor: colors.whiteColor,
    height: 40,
    width: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 3,
  },
  onlyMeViewStyle: {
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 6,
    flexDirection: 'row',
    marginHorizontal: wp('2%'),
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 1,
    width: wp('80%'),
  },
  sendTextStyle: {
    color: colors.themeColor,
    fontFamily: fonts.RBold,
    fontSize: 11,
  },
  bottomSafeAreaStyle: {
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.16,
    shadowOffset: {height: 0, width: 0},
    shadowRadius: 3,
    shadowColor: colors.blackColor,
    width: '100%',
    elevation: 10,
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
  bottomPopupContainer: {
    marginTop: Platform.OS === 'ios' ? hp(12) : 80,
    flex: 1,
    // paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  writeCommectStyle: {
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
    maxHeight: hp(10),
  },
});

export default CommentModal;
