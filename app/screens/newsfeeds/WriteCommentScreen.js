import React, { useEffect, useState } from 'react';
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
import constants from '../../config/constants';
import WriteCommentItems from '../../components/newsFeed/WriteCommentItems';

import { createReaction, getReactions } from '../../api/NewsFeedapi';
import ActivityLoader from '../../components/loader/ActivityLoader';

const { PATH, colors, fonts } = constants;

export default function WriteCommentScreen({
  navigation,
  route: {
    params: { data },
  },
}) {
  const [commentTxt, setCommentText] = useState('');
  const [commentData, setCommentData] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const params = {
      activity_id: data.id,
      reaction_type: 'comment',
    };
    getReactions(params)
      .then((response) => {
        setCommentData(response.payload);
        setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
        setloading(false);
      });
  }, []);

  let userImage = '';
  if (data && data.actor && data.actor.data) {
    userImage = data.actor.data.thumbnail;
  }

  return (
      <KeyboardAvoidingView
      style={ { flex: 1 } }
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
          <ActivityLoader visible={ loading } />
          <SafeAreaView>
              <View style={ styles.containerStyle }>
                  <View style={ styles.backIconViewStyle } />
                  <View style={ styles.writePostViewStyle }>
                      <Text style={ styles.writePostTextStyle }>{commentData.length > 0 ? ((commentData.length === 1 && `${commentData.length} Comment`) || (commentData.length > 1 && `${commentData.length} Comments`)) : 'Write Comments'}</Text>
                  </View>
                  <View style={ styles.doneViewStyle }>
                      <Text
              style={ styles.doneTextStyle }
              onPress={ () => {
                console.log('Done Pressed');
                navigation.goBack();
              } }>
                          Done
                      </Text>
                  </View>
              </View>
          </SafeAreaView>
          <View style={ styles.sperateLine } />

          {commentData ? (
              <FlatList
          data={ commentData }
          renderItem={ ({ item }) => <WriteCommentItems data={ item } /> }
          keyExtractor={ (item, index) => index.toString() }
        />
          ) : (
              <View style={ { flex: 1 } } />
          )}

          <SafeAreaView style={ styles.bottomSafeAreaStyle }>
              {/* <View style={styles.bottomSperateLine} /> */}
              <View style={ styles.bottomImgView }>
                  <View style={ styles.commentReportView }>
                      <Image
              source={ userImage ? { uri: userImage } : PATH.profilePlaceHolder }
              resizeMode={ 'cover' }
              style={ { width: 40, height: 40, borderRadius: 40 / 2 } }
            />
                  </View>
                  <View style={ styles.onlyMeViewStyle }>
                      <TextInput
                        placeholder={ 'Write a comment' }
                        placeholderTextColor={ colors.userPostTimeColor }
                        multiline={ true }
                        value={ commentTxt }
                        onChangeText={ (text) => setCommentText(text) }
                        style={ {
                          width: wp('66%'),
                          marginHorizontal: '2%',
                          fontSize: 14,
                          color: colors.lightBlackColor,
                          fontFamily: fonts.RRegular,
                          padding: 0,
                          paddingVertical: hp(1.5),
                          paddingLeft: 8,
                          alignSelf: 'center',
                          maxHeight: hp(20),
                        } }
                      />
                      {commentTxt.trim().length > 0 && <TouchableOpacity onPress={() => {
                        const bodyParams = {
                          reaction_type: 'comment',
                          activity_id: data.id,
                          data: {
                            text: commentTxt,
                          },
                        }
                        createReaction(bodyParams)
                          .then((response) => {
                            const dataOfComment = [...commentData];
                            dataOfComment.push(response.payload);
                            setCommentData(dataOfComment);
                            setCommentText('');
                          })
                          .catch((e) => Alert.alert('', e.messages));
                      }}>
                          <Text style={ styles.sendTextStyle }>SEND</Text>
                      </TouchableOpacity>}
                  </View>
              </View>
          </SafeAreaView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backIconViewStyle: {
    justifyContent: 'center',
    width: wp('17%'),
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
