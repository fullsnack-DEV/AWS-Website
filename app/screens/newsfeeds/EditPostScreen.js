import React, {
  useState, useContext, useRef, useEffect,
} from 'react';
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
  // Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import ParsedText from 'react-native-parsed-text';
import _ from 'lodash';
import UrlPreview from 'react-native-url-preview';
import AuthContext from '../../auth/context'
import ImageButton from '../../components/WritePost/ImageButton';
import ActivityLoader from '../../components/loader/ActivityLoader';
import EditSelectedImages from '../../components/WritePost/EditSelectedImages';

import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import { getUserList } from '../../api/Users';
import { getMyGroups } from '../../api/Groups';
import { getSearchData } from '../../utils';

const EditPostScreen = ({
  navigation,
  route,
}) => {
  const { params: { data, onPressDone } } = route;
  const textInputFocus = useRef();
  // const keyboardDidShowListener = null;
  // const keyboardDidHideListener = null;
  let postText = '';
  let postAttachments = [];
  if (data && data.object) {
    postText = JSON.parse(data.object).text;
    if (JSON.parse(data.object).attachments) {
      postAttachments = JSON.parse(data.object).attachments;
    }
  }
  const authContext = useContext(AuthContext)
  const [searchText, setSearchText] = useState(postText);
  const [selectImage, setSelectImage] = useState(postAttachments);
  const [loading, setloading] = useState(false);
  const [letModalVisible, setLetModalVisible] = useState(true);
  const [searchFieldHeight, setSearchFieldHeight] = useState();
  const editObject = JSON.parse(route?.params?.data?.object);
  const [tagsOfEntity, setTagsOfEntity] = useState(editObject?.taggedData || []);
  const [searchTag, setSearchTag] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchGroups, setSearchGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  // const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    // keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));

    getUserList(authContext)
      .then((response) => {
        setUsers([...response.payload]);
        setSearchUsers([...response.payload])
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });

    getMyGroups(authContext)
      .then((response) => {
        setGroups([...response.payload]);
        setSearchGroups([...response.payload])
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
    // return () => {
    //   keyboardDidShowListener.remove();
    //   keyboardDidHideListener.remove();
    // }
  }, [])

  const onTagPress = (item) => {
    const tagsArray = [];
    const joinedString = item?.group_name
      ? _.startCase(item?.group_name.toLowerCase())
      : `${_.startCase(item?.first_name?.toLowerCase())}${_.startCase(item?.last_name?.toLowerCase())}`;
    const str = searchText.replace(new RegExp(`${searchTag}$`), joinedString.replace(/ /g, ''));
    setSearchText(`${str} `)
    const entity_text = ['player', 'user']?.includes(item.entity_type) ? 'user_id' : 'group_id'
    const isExist = tagsOfEntity.some((tagItem) => tagItem[entity_text] === item[entity_text])
    if (!isExist) tagsArray.push(item)
    setTagsOfEntity([...tagsOfEntity, ...tagsArray])
    setModalVisible(false)
  }

  useEffect(() => {
    let tagName = '';
    const tagsArray = [];
    if (route?.params?.selectedTagList?.length > 0) {
      route.params.selectedTagList.map((tagItem) => {
        const entity_text = ['player', 'user']?.includes(tagItem.entity_type) ? 'user_id' : 'group_id'
        const isExist = tagsOfEntity.some((item) => item[entity_text] === tagItem[entity_text])
        if (!isExist) tagsArray.push(tagItem)
        tagName = `${tagName} @${tagItem.title.replace(/\s/g, '')}`;
        return null;
      })
      setTagsOfEntity([...tagsOfEntity, ...tagsArray])
      setSearchText(searchText + tagName);
    }
  }, [route?.params?.selectedTagList]);

  const searchFilterFunction = (text) => {
    if (text.length > 0) {
      const userData = getSearchData(searchUsers, ['first_name', 'last_name', 'group_name'], text);
      const groupData = getSearchData(searchGroups, ['first_name', 'last_name', 'group_name'], text);
      setUsers([...userData]);
      setGroups([...groupData])
    }
  };

  let userImage = '';
  let userName = '';
  if (data && data.actor && data.actor.data) {
    userName = data.actor.data.full_name;
    userImage = data.actor.data.thumbnail;
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderTagText = (matchingString) => {
    const pattern = /\B@\w+/g;
    const match = matchingString.match(pattern);
    return <Text style={{ ...styles.username, color: colors.greeColor }}>{match[0]}</Text>;
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
              <Image source={images.backArrow} style={styles.backImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.writePostViewStyle}>
            <Text style={styles.writePostTextStyle}>Edit Post</Text>
          </View>
          <TouchableOpacity
            style={styles.doneViewStyle}
            onPress={() => {
              if (searchText.trim().length === 0 && selectImage.length === 0) {
                Alert.alert('Please write some text or select any image.');
              } else {
                setloading(false);
                const tagData = JSON.parse(JSON.stringify(tagsOfEntity));
                const nameArray = []
                tagsOfEntity.map((item) => {
                  let joinedString = '@';
                  if (item?.group_name) {
                    joinedString += _.startCase(item?.group_name.toLowerCase())
                  } else {
                    const fName = _.startCase(item?.first_name?.toLowerCase());
                    const lName = _.startCase(item?.last_name?.toLowerCase());
                    joinedString += fName + lName;
                  }
                  nameArray.push(joinedString.replace(/ /g, ''))
                  return null;
                })
                nameArray.map((item, index) => {
                  if (!searchText.includes(item)) tagData.splice(index, 1);
                  return null;
                })
                navigation.goBack();
                onPressDone(selectImage, searchText, data, tagData);
              }
            }}
          >
            <Text style={styles.doneTextStyle}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.sperateLine} />
      <View style={styles.userDetailView}>
        <Image
          style={styles.background}
          source={userImage ? { uri: userImage } : images.profilePlaceHolder}
        />
        <View style={styles.userTxtView}>
          <Text style={styles.userTxt}>{userName}</Text>
        </View>
      </View>

      <ScrollView
          bounces={ false }
          style={{ flex: 1 }}
          // onTouchEnd={() => !isKeyboardOpen && textInputFocus.current.focus()}
      >
        <TextInput
            ref={textInputFocus}
            onLayout={(event) => setSearchFieldHeight(event?.nativeEvent?.layout?.height)}
            placeholder="What's going on?"
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
              setSearchTag(text.split('@')?.reverse()?.[0])
              if (text.split('@')?.reverse()?.[0] !== '' || text.split('@')?.reverse()?.[0] !== ' ') {
                searchFilterFunction(text.split('@')?.reverse()?.[0])
              }
              const lastChar = text.slice(text.length - 1, text.length);
              if (lastChar === '@' && letModalVisible) {
                toggleModal()
              }
            }}
            style={ styles.textInputField }
            multiline={ true }
            textAlignVertical={'top'}
        >
          <ParsedText
              parse={[{ pattern: /\B@\w+/g, renderText: renderTagText }]}
              childrenProps={{ allowFontScaling: false }}
          >
            {searchText}
          </ParsedText>
        </TextInput>
        {isModalVisible && [...users, ...groups]?.length > 0
        && <View style={[styles.userListContainer, { marginTop: searchFieldHeight + 20 }]}>
          <FlatList
              showsVerticalScrollIndicator={false}
              data={[...users, ...groups]}
              keyboardShouldPersistTaps={'always'}
              style={{ paddingTop: hp(1) }}
              ListFooterComponent={() => <View style={{ height: hp(6) }} />}
              renderItem={ ({ item }) => (
                <TouchableOpacity
                        onPress={() => onTagPress(item)}
                        style={styles.userListStyle}>
                  <Image source={item?.thumbnail ? { uri: item?.thumbnail } : images.profilePlaceHolder} style={{ borderRadius: 13, height: 25, width: 25 }}/>
                  <Text style={styles.userTextStyle}>
                    {item?.group_name ? item?.group_name : `${item.first_name} ${item.last_name}`}
                  </Text>
                  <Text style={styles.locationTextStyle}>{`${item.city}, ${item.state_abbr}`}</Text>
                </TouchableOpacity>)}
              keyExtractor={ (item, index) => index.toString() }
          />
        </View>}
        {searchText.length > 0 && <UrlPreview
            text={searchText}
            containerStyle={styles.previewContainerStyle}
        />}

        {selectImage.length > 0 && (
          <FlatList
            data={selectImage}
            horizontal={true}
            // scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <EditSelectedImages
                data={item}
                itemNumber={index + 1}
                totalItemNumber={selectImage.length}
                onItemPress={() => {
                  const imgs = [...selectImage];
                  const idx = imgs.indexOf(item);
                  if (idx > -1) {
                    imgs.splice(idx, 1);
                  }
                  setSelectImage(imgs);
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
              source={images.lock}
              imageStyle={ { width: 30, height: 30 } }
              onImagePress={() => {}}
            />
            <Text style={styles.onlyMeTextStyle}>Only me</Text>
          </View>
          <View style={[styles.onlyMeViewStyle, { justifyContent: 'flex-end' }]}>
            <ImageButton
              source={images.pickImage}
              imageStyle={{ width: 30, height: 30, marginHorizontal: wp('2%') }}
              onImagePress={() => {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  // cropping: true,
                  multiple: true,
                  maxFiles: 10,
                }).then((image) => {
                  let allSelectData = [];
                  const secondData = [];
                  if (selectImage.length > 0) {
                    image.filter((dataItem) => {
                      const filter_data = selectImage.filter((imageItem) => imageItem.filename === dataItem.filename);
                      if (filter_data.length === 0) {
                        secondData.push(dataItem)
                      }
                      return null;
                    })
                    allSelectData = [...selectImage, ...secondData];
                    setSelectImage(allSelectData);
                  } else {
                    setSelectImage(image);
                  }
                });
              }}
            />
            <ImageButton
              source={images.tagImage}
              imageStyle={{ width: 30, height: 30, marginLeft: wp('2%') }}
              onImagePress={() => {
                navigation.navigate('UserTagSelectionListScreen', { comeFrom: 'EditPostScreen' });
              }}
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
    maxHeight: hp('15%'),
    width: wp('92%'),
    marginBottom: 10,
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
  userListStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,

  },
  userListContainer: {
    zIndex: 1,
    backgroundColor: 'white',
    maxHeight: 300,
    width: 300,
    alignSelf: 'center',
    position: 'absolute',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 5,
  },
  userTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 10,
    paddingVertical: hp(1),
  },
  locationTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
    marginLeft: 10,
    paddingVertical: hp(1),
  },
  previewContainerStyle: {
    margin: 5,
    borderWidth: 1,
    borderColor: colors.grayBackgroundColor,
    padding: 8,
    borderRadius: 10,
  },
});
export default EditPostScreen;
