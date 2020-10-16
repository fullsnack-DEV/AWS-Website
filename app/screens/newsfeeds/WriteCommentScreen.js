import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
import WriteCommentItems from '../../components/newsFeed/WriteCommentItems';
import ImageButton from '../../components/WritePost/ImageButton';
import { createReaction, getReactions } from '../../api/NewsFeedapi';
import ActivityLoader from '../../components/loader/ActivityLoader';
const {PATH, colors, fonts} = constants;

export default function WriteCommentScreen({
  navigation,
  route: {
    params: {data},
  },
}) {
  const [commentTxt, setCommentText] = useState('');
  const [commentData, setCommentData] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    let params = {
      "activity_id": data.id,
      "reaction_type": "comment"
    };
    getReactions(params).then((response) => {
      if (response.status == true) {
        setCommentData(response.payload);
      } else {
        alert(response.messages);
      }
      setloading(false);
    }, (error) => setloading(false));
  }, []);

  let userImage = '';
  if (data && data.actor && data.actor.data) {
    userImage = data.actor.data.thumbnail;
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ActivityLoader visible={loading} />
      <SafeAreaView>
        <View style={styles.containerStyle}>
          <View style={styles.backIconViewStyle} />
          <View style={styles.writePostViewStyle}>
            <Text style={styles.writePostTextStyle}>{commentData.length > 0 ? (commentData.length === 1 ? commentData.length + ' Comment' : commentData.length + ' Comments') : 'Write Comments'}</Text>
          </View>
          <View style={styles.doneViewStyle}>
            <Text
              style={styles.doneTextStyle}
              onPress={() =>{
                console.log('Done Pressed');
                navigation.goBack();
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
          renderItem={({item, index}) => {
            return <WriteCommentItems data={item} />;
          }}
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
              source={userImage ? {uri: userImage} : PATH.profilePlaceHolder}
              resizeMode={'cover'}
              style={{width: 40, height: 40, borderRadius: 40/2}}
            />
          </View>
          <View style={styles.onlyMeViewStyle}>
            <TextInput
              placeholder={'Write a comment'}
              placeholderTextColor={colors.userPostTimeColor}
              multiline={true}
              value={commentTxt}
              onChangeText={(text) => setCommentText(text)}
              style={{
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
              }}
            />
            {commentTxt.trim().length > 0 &&<TouchableOpacity onPress={() => {
              // setloading(true);
              console.log('On Send Pressed!');
              let bodyParams = {
                "reaction_type": "comment",
                "activity_id": data.id,
                "data": {
                  "text": commentTxt
                }
              }
              createReaction(bodyParams).then((res) => {
                console.log('Create Reaction :-', res);
                if (res.status == true) {
                  let data = [...commentData];
                  data.push(res.payload);
                  setCommentData(data);
                  setCommentText('');
                } else {
                  alert(response.messages);
                }
              }, (error) => setloading(false))
            }}>
              <Text style={styles.sendTextStyle}>SEND</Text>
            </TouchableOpacity>}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: wp('92%'),
    paddingVertical: hp('1%'),
  },
  backIconViewStyle: {
    width: wp('17%'),
    justifyContent: 'center',
  },
  writePostViewStyle: {
    width: wp('58%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  writePostTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  doneViewStyle: {
    width: wp('17%'),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  doneTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  sperateLine: {
    marginVertical: hp('0.5%'),
    borderWidth: 0.5,
    borderColor: colors.writePostSepratorColor,
  },
  bottomSperateLine: {
    borderWidth: 0.5,
    borderColor: colors.disableColor,
  },
  bottomSafeAreaStyle: {
    backgroundColor: '#fff',
    shadowOpacity: 0.3,
    shadowOffset: {
      height: -3,
      width: 0
    }
  },
  bottomImgView: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp('92%'),
    paddingVertical: hp('1.5%'),
  },
  onlyMeViewStyle: {
    width: wp('80%'),
    borderRadius: 6,
    backgroundColor: colors.grayBackgroundColor,
    marginHorizontal: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    shadowRadius: 0.5,
    shadowOffset: {width: 0, height: 1},
    shadowColor: colors.googleColor,
    shadowOpacity: 0.5,
  },
  commentReportView: {
    // height: 40,
    // width: 40,
    // borderRadius: 6,
    // backgroundColor: colors.grayBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  sendTextStyle: {
    fontSize: 11,
    fontFamily: fonts.RBold,
    color: colors.themeColor
  }
});
