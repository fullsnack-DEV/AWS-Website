import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import constants from '../../config/constants';
import ImageButton from '../../components/WritePost/ImageButton';
import { updatePost, getPostDetails } from '../../api/NewsFeedapi';
import ActivityLoader from '../../components/loader/ActivityLoader';
import EditSelectedImages from '../../components/WritePost/EditSelectedImages';

const { PATH, colors, fonts } = constants;

export default function EditPostScreen({
  navigation,
  route: {
    params: { data },
  },
}) {
  let postText = '';
  let postAttachments = [];
  if (data && data.object) {
    postText = JSON.parse(data.object).text;
    postAttachments = JSON.parse(data.object).attachments;
  }

  const [searchText, setSearchText] = useState(postText);
  const [selectImage, setSelectImage] = useState(postAttachments);
  const [loading, setloading] = useState(false);

  let userImage = '';
  let userName = '';
  if (data && data.actor && data.actor.data) {
    userName = data.actor.data.full_name;
    userImage = data.actor.data.thumbnail;
  }

  return (
      <KeyboardAvoidingView
      style={{ flex: 1 }}
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
                      <Text style={styles.writePostTextStyle}>Edit Post</Text>
                  </View>
                  <View style={styles.doneViewStyle}>
                      <Text
                        style={styles.doneTextStyle}
                        onPress={() => {
                          if (
                            searchText.trim().length === 0
                            && selectImage.length === 0
                          ) {
                            Alert.alert('', 'Please write some text or select any image.');
                          } else {
                            //   setloading(true);
                            const attachments = [];
                            selectImage.forEach((imageItem) => {
                              const obj = {
                                type: 'image',
                                url: imageItem.url ? imageItem.url : imageItem.path,
                                thumbnail: imageItem.thumbnail
                                  ? imageItem.thumbnail
                                  : imageItem.path,
                              };
                              attachments.push(obj);
                            });

                            const params = {
                              activity_id: data.id,
                              text: searchText,
                              attachments,
                            };
                            updatePost(params)
                              .then(() => getPostDetails())
                              .then(() => {
                                navigation.goBack()
                                setloading(false);
                              })
                              .catch((e) => {
                                Alert.alert('', e.messages)
                                setloading(false);
                              });
                          }
                        }}>
                          Done
                      </Text>
                  </View>
              </View>
          </SafeAreaView>
          <View style={styles.sperateLine} />
          <View style={styles.userDetailView}>
              <Image
          style={styles.background}
          source={userImage ? { uri: userImage } : PATH.profilePlaceHolder}
        />
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
              {selectImage.length > 0 && (
              <FlatList
            data={selectImage}
            horizontal={true}
            // scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, key }) => (
                <EditSelectedImages
                  data={item}
                  itemNumber={key + 1}
                  totalItemNumber={selectImage.length}
                  onItemPress={() => {
                    const images = [...selectImage];
                    const index = images.indexOf(item);
                    if (index > -1) {
                      images.splice(index, 1);
                    }
                    setSelectImage(images);
                  }}
                />
            )}
            ItemSeparatorComponent={() => <View style={{ width: wp('1%') }} />}
            style={{ paddingTop: 10, marginHorizontal: wp('3%') }}
            keyExtractor={(item, index) => index.toString()}
          />
              )}
          </ScrollView>

          <SafeAreaView style={styles.bottomSafeAreaStyle}>
              <View style={styles.bottomImgView}>
                  <View style={styles.onlyMeViewStyle}>
                      <ImageButton
              source={PATH.lock}
              imageStyle={{ width: 18, height: 21 }}
              onImagePress={() => {}}
            />
                      <Text style={styles.onlyMeTextStyle}>Only me</Text>
                  </View>
                  <View style={[styles.onlyMeViewStyle, { justifyContent: 'flex-end' }]}>
                      <ImageButton
              source={PATH.pickImage}
              imageStyle={{ width: 19, height: 19, marginHorizontal: wp('2%') }}
              onImagePress={() => {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                  multiple: true,
                  maxFiles: 10,
                }).then((image) => {
                  setSelectImage(image);
                });
              }}
            />
                      <ImageButton
              source={PATH.tagImage}
              imageStyle={{ width: 22, height: 22, marginLeft: wp('2%') }}
              onImagePress={() => {}}
            />
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
  backImage: {
    height: hp('2%'),
    tintColor: colors.lightBlackColor,
    width: hp('1.5%'),
  },
  background: {
    borderRadius: hp('3%'),
    height: hp('6%'),
    resizeMode: 'stretch',
    width: hp('6%'),
  },
  bottomImgView: {
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    width: wp('92%'),
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
  onlyMeTextStyle: {
    color: colors.googleColor,
    fontFamily: fonts.RRegular,
    fontSize: 15,
    marginLeft: wp('2%'),
  },
  onlyMeViewStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    width: wp('46%'),
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('1%'),
  },
  textInputField: {
    alignSelf: 'center',
    fontSize: 16,
    height: hp('15%'),
    width: wp('92%'),
  },
  userDetailView: {
    flexDirection: 'row',
    margin: wp('3%'),
  },
  userTxt: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginLeft: wp('4%'),
  },
  userTxtView: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
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
});
