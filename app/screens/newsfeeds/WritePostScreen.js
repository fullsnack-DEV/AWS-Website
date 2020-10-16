import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import _ from 'lodash';
import constants from '../../config/constants';
const {PATH, colors, fonts} = constants;
import AuthContext from '../../auth/context';
import ImageButton from '../../components/WritePost/ImageButton';
import SelectedImageList from '../../components/WritePost/SelectedImageList';
import ImagePicker from 'react-native-image-crop-picker';
import {createPost, getPostDetails} from '../../api/NewsFeedapi';
import ActivityLoader from '../../components/loader/ActivityLoader';

export default function WritePostScreen({navigation, route: { params: {postDataItem}}}) {
  // const ImagesSelection = [
  //   {id: 0, image: PATH.club_ph},
  //   {id: 1, image: PATH.club_ph},
  //   {id: 2, image: PATH.club_ph},
  //   {id: 3, image: PATH.club_ph},
  //   {id: 4, image: PATH.club_ph},
  // ];
  const authContext = useContext(AuthContext);
  const [searchText, setSearchText] = useState('');
  const [selectImage, setSelectImage] = useState([]);
  const [loading, setloading] = useState(false);

  let userImage = '', userName = '';
  if (postDataItem && postDataItem.actor && postDataItem.actor.data) {
    userName = postDataItem.actor.data.full_name;
    userImage = postDataItem.actor.data.thumbnail;
  }
  
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ActivityLoader visible={loading} />
      <SafeAreaView>
        <View style={styles.containerStyle}>
          <View style={styles.backIconViewStyle}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={PATH.backArrow} style={styles.backImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.writePostViewStyle}>
            <Text style={styles.writePostTextStyle}>Write Post</Text>
          </View>
          <View style={styles.doneViewStyle}>
            <Text
              style={styles.doneTextStyle}
              onPress={() => {
                if (searchText.trim().length === 0 && selectImage.length === 0) {
                  alert('Please write some text or select any image.');
                } else {
                  setloading(true);
                let attachments = [];
                selectImage.map((imageItem) => {
                  let obj = {
                    type: 'image',
                    url: imageItem.path,
                    thumbnail: imageItem.path
                  };
                  attachments.push(obj);
                })

                let params = {
                  "text": searchText,
                  "attachments": attachments,
                };
                createPost(params).then((res) => {
                  if (res.status == true) {
                  getPostDetails().then((response) => {
                      if (response.status == true) {
                        navigation.goBack();
                      } else {
                      alert(response.messages);
                      }
                      setloading(false);
                  });
                  } else {
                  setloading(false);
                  alert(res.messages);
                  }
                }, (error) => setloading(false))
                }
              }}>
              Done
            </Text>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.sperateLine} />
      <View style={styles.userDetailView}>
        <Image style={styles.background} source={userImage ? {uri: userImage} : PATH.profilePlaceHolder} />
        <View style={styles.userTxtView}>
          <Text style={styles.userTxt}>{userName}</Text>
        </View>
      </View>

      <ScrollView bounces={false}>
        <TextInput
          placeholder="What's going on?"
          value={searchText}
          placeholderTextColor={colors.userPostTimeColor}
          onChangeText={(text) => setSearchText(text)}
          style={styles.textInputField}
          multiline={true}
        />
        {selectImage.length > 0 &&<FlatList
          data={selectImage}
          horizontal={true}
          // scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <SelectedImageList 
                data={item} 
                itemNumber={index + 1}
                totalItemNumber={selectImage.length} 
                onItemPress={() => {
                  let images = [...selectImage];
                  const index = images.indexOf(item);
                  if (index > -1) {
                    images.splice(index, 1);
                  }
                  setSelectImage(images);
                }} 
              />
            );
          }}
          ItemSeparatorComponent={() => {
            return(
              <View style={{width: wp('1%')}} />
            );
          }}
          style={{paddingTop: 10, marginHorizontal: wp('3%') }}
          keyExtractor={(item, index) => index.toString()}
        />}
      </ScrollView>

      <SafeAreaView style={styles.bottomSafeAreaStyle}>
        <View style={styles.bottomImgView}>
          <View style={styles.onlyMeViewStyle}>
            <ImageButton
              source={PATH.lock}
              imageStyle={{width: 18, height: 21}}
              onImagePress={() => {
              }}
            />
            <Text style={styles.onlyMeTextStyle}>Only me</Text>
          </View>
          <View style={[styles.onlyMeViewStyle, {justifyContent: 'flex-end'}]}>
            <ImageButton
              source={PATH.pickImage}
              imageStyle={{width: 19, height: 19, marginHorizontal: wp('2%')}}
              onImagePress={() => {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                  multiple: true,
                  maxFiles: 10
                }).then((image) => {
                  setSelectImage(image);
                });
              }}
            />
            <ImageButton
              source={PATH.tagImage}
              imageStyle={{width: 22, height: 22, marginLeft: wp('2%')}}
              onImagePress={() => {
              }}
            />
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
  background: {
    height: hp('6%'),
    width: hp('6%'),
    borderRadius: hp('3%'),
    resizeMode: 'stretch',
  },
  backIconViewStyle: {
    width: wp('17%'),
    justifyContent: 'center',
  },
  backImage: {
    height: hp('2%'),
    width: hp('1.5%'),
    tintColor: colors.lightBlackColor,
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
    marginVertical: hp('1%'),
    borderWidth: 0.5,
    borderColor: colors.writePostSepratorColor,
  },
  userDetailView: {
    margin: wp('3%'),
    flexDirection: 'row',
  },
  userTxtView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  userTxt: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    marginLeft: wp('4%'),
  },
  textInputField: {
    width: wp('92%'),
    height: hp('15%'),
    alignSelf: 'center',
    fontSize: 16,
  },
  bottomSperateLine: {
    borderWidth: 0.5,
    borderColor: colors.writePostSepratorColor,
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
    paddingVertical: hp('1%'),
  },
  onlyMeViewStyle: {
    flexDirection: 'row',
    width: wp('46%'),
    alignItems: 'center',
  },
  onlyMeTextStyle: {
    marginLeft: wp('2%'),
    fontSize: 15,
    fontFamily: fonts.RRegular,
    color: colors.googleColor
  }
});
