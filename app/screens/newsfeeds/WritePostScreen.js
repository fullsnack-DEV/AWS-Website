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
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import constants from '../../config/constants';
import ImageButton from '../../components/WritePost/ImageButton';
import SelectedImageList from '../../components/WritePost/SelectedImageList';
import { createPost, getPostDetails } from '../../api/NewsFeedapi';
import ActivityLoader from '../../components/loader/ActivityLoader';
import TagUserScreen from './TagUserScreen';

const { PATH, colors, fonts } = constants;

export default function WritePostScreen({ navigation, route: { params: { postDataItem } } }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectImage, setSelectImage] = useState([]);
  const [loading, setloading] = useState(false);
  const [letModalVisible, setLetModalVisible] = useState(true);

  let userImage = '';
  let userName = '';
  if (postDataItem && postDataItem.actor && postDataItem.actor.data) {
    userName = postDataItem.actor.data.full_name;
    userImage = postDataItem.actor.data.thumbnail;
  }

  // let playerID = '';
  // if (postDataItem) {
  //   playerID = postDataItem.id;
  // }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
      <KeyboardAvoidingView
      style={ { flex: 1 } }
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
          <ActivityLoader visible={ loading } />
          <SafeAreaView>
              <View style={ styles.containerStyle }>
                  <View style={ styles.backIconViewStyle }>
                      <TouchableOpacity onPress={ () => navigation.goBack() }>
                          <Image source={ PATH.backArrow } style={ styles.backImage } />
                      </TouchableOpacity>
                  </View>
                  <View style={ styles.writePostViewStyle }>
                      <Text style={ styles.writePostTextStyle }>Write Post</Text>
                  </View>
                  <View style={ styles.doneViewStyle }>
                      <Text
              style={ styles.doneTextStyle }
              onPress={ () => {
                if (searchText.trim().length === 0 && selectImage.length === 0) {
                  Alert.alert('Please write some text or select any image.');
                } else {
                  setloading(true);
                  const attachments = [];
                  selectImage.map((imageItem) => {
                    const obj = {
                      type: 'image',
                      url: imageItem.path,
                      thumbnail: imageItem.path,
                    };
                    return attachments.push(obj);
                  })

                  const params = {
                    text: searchText,
                    attachments,
                  };
                  createPost(params)
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
              } }>
                          Done
                      </Text>
                  </View>
              </View>
          </SafeAreaView>
          <View style={ styles.sperateLine } />
          <View style={ styles.userDetailView }>
              <Image style={ styles.background } source={ userImage ? { uri: userImage } : PATH.profilePlaceHolder } />
              <View style={ styles.userTxtView }>
                  <Text style={ styles.userTxt }>{userName}</Text>
              </View>
          </View>

          <Modal
        isVisible={ isModalVisible }
        backdropColor="black"
        style={{ margin: 0 }}
        backdropOpacity={ 0 }>
              <TagUserScreen
                backBtnPress={() => setModalVisible(false)}
                onItemPress={(name) => {
                  if (name) {
                    setSearchText(searchText + name);
                    setModalVisible(false);
                  }
                }}
              />
          </Modal>

          <ScrollView bounces={ false }>
              <TextInput
          placeholder="What's going on?"
          value={ searchText }
          placeholderTextColor={ colors.userPostTimeColor }
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace') {
              setLetModalVisible(false);
            } else {
              setLetModalVisible(true);
            }
          }}
          onChangeText={ (text) => {
            setSearchText(text);
            const lastChar = text.slice(text.length - 1, text.length);
            if (lastChar === '@' && letModalVisible) {
              toggleModal()
            }
          }}
          style={ styles.textInputField }
          multiline={ true }
        />
              {selectImage.length > 0 && <FlatList
          data={ selectImage }
          horizontal={ true }
          // scrollEnabled={true}
          showsHorizontalScrollIndicator={ false }
          renderItem={ ({ item, index }) => (
              <SelectedImageList
                data={ item }
                itemNumber={ index + 1 }
                totalItemNumber={ selectImage.length }
                onItemPress={ () => {
                  const images = [...selectImage];
                  const idx = images.indexOf(item);
                  if (idx > -1) {
                    images.splice(idx, 1);
                  }
                  setSelectImage(images);
                } }
              />
          ) }
          ItemSeparatorComponent={ () => (
              <View style={ { width: wp('1%') } } />
          ) }
          style={ { paddingTop: 10, marginHorizontal: wp('3%') } }
          keyExtractor={ (item, index) => index.toString() }
        />}
          </ScrollView>

          <SafeAreaView style={ styles.bottomSafeAreaStyle }>
              <View style={ styles.bottomImgView }>
                  <View style={ styles.onlyMeViewStyle }>
                      <ImageButton
              source={ PATH.lock }
              imageStyle={ { width: 18, height: 21 } }
              onImagePress={ () => {
              } }
            />
                      <Text style={ styles.onlyMeTextStyle }>Only me</Text>
                  </View>
                  <View style={ [styles.onlyMeViewStyle, { justifyContent: 'flex-end' }] }>
                      <ImageButton
              source={ PATH.pickImage }
              imageStyle={ { width: 19, height: 19, marginHorizontal: wp('2%') } }
              onImagePress={ () => {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                  multiple: true,
                  maxFiles: 10,
                }).then((image) => {
                  setSelectImage(image);
                  // const imageCount = image.length;
                  // const params = {
                  //   count: imageCount,
                  // }
                  // getImagePreSignedURL(playerID, params)
                  //   .then((response) => {
                  //     console.log('Response of Signed URL :-', response);
                  //   })
                  //   .catch((e) => {
                  //     Alert.alert('', e.messages)
                  //     console.log('Error :-', e.response);
                  //   });
                });
              } }
            />
                      <ImageButton
              source={ PATH.tagImage }
              imageStyle={ { width: 22, height: 22, marginLeft: wp('2%') } }
              onImagePress={ () => {
              } }
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
  bottomSafeAreaStyle: {
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: -3,
      width: 0,
    },
  },
});
