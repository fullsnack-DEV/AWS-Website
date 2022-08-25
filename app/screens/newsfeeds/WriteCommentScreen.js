import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import WriteCommentItems from '../../components/newsFeed/WriteCommentItems';

import {createReaction, getReactions} from '../../api/NewsFeeds';
import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

export default function WriteCommentScreen({
  navigation,
  route: {
    params: {data, onDonePress = () => {}, onSuccessSent = () => {}},
  },
}) {
  const [commentTxt, setCommentText] = useState('');
  const [commentData, setCommentData] = useState([]);
  const [loading, setloading] = useState(true);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const authContext = useContext(AuthContext);
  useEffect(() => {
    const entity = authContext.entity;
    setCurrentUserDetail(entity.obj || entity.auth.user);
    const params = {
      activity_id: data.id,
      reaction_type: 'comment',
    };
    getReactions(params, authContext)
      .then((response) => {
        setCommentData(response.payload);
        setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setloading(false);
      });
  }, []);

  let userImage = '';
  if (currentUserDetail && currentUserDetail.thumbnail) {
    userImage = currentUserDetail.thumbnail;
  }

  const renderComments = useCallback(
    ({item}) => <WriteCommentItems data={item} />,
    [],
  );
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ActivityLoader visible={loading} />
      <SafeAreaView>
        <View style={styles.containerStyle}>
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}
            onPress={() => {
              navigation.goBack();
              if (onDonePress)
                onDonePress({count: commentData?.length ?? 0, id: data?.id});
            }}>
            <Image style={styles.backButtonImage} source={images.backArrow} />
          </TouchableOpacity>
          <View style={styles.writePostViewStyle}>
            <Text style={styles.writePostTextStyle}>
              {commentData.length > 0
                ? (commentData.length === 1 &&
                    `${commentData.length} Comment`) ||
                  (commentData.length > 1 && `${commentData.length} Comments`)
                : 'Write Comments'}
            </Text>
          </View>
          <View style={styles.doneViewStyle}>
            <Text
              style={styles.doneTextStyle}
              onPress={() => {
                navigation.goBack();
                if (onDonePress)
                  onDonePress({count: commentData?.length ?? 0, id: data?.id});
              }}>
              Done
            </Text>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.sperateLine} />

      {commentData ? (
        <FlatList
          data={commentData}
          renderItem={renderComments}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={{flex: 1}} />
      )}

      <SafeAreaView style={styles.bottomSafeAreaStyle}>
        {/* <View style={styles.bottomSperateLine} /> */}
        <View style={styles.bottomImgView}>
          <View style={styles.commentReportView}>
            <Image
              source={userImage ? {uri: userImage} : images.profilePlaceHolder}
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
                    activity_id: data.id,
                    data: {
                      text: commentTxt,
                    },
                  };
                  createReaction(bodyParams, authContext)
                    .then((response) => {
                      const dataOfComment = [...commentData];
                      dataOfComment.push(response.payload);
                      setCommentData(dataOfComment);
                      setCommentText('');
                      if (onSuccessSent)
                        onSuccessSent({
                          count: dataOfComment?.length ?? 0,
                          id: data?.id,
                        });
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backButtonImage: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 20,
    height: 20,
    resizeMode: 'contain',
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
  containerStyle: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    width: wp('92%'),
  },
  doneTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
  },
  doneViewStyle: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: wp('17%'),
  },
  onlyMeViewStyle: {
    alignItems: 'center',
    backgroundColor: colors.grayBackgroundColor,
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
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
  },
  writePostTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  writePostViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('58%'),
  },
  bottomSafeAreaStyle: {
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: -3,
      width: 0,
    },
  },
});
