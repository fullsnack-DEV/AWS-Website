/* eslint-disable no-useless-escape */

import React, {
  useState, useContext, useRef, useEffect, useMemo, useCallback,
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
import { MAX_UPLOAD_POST_ASSETS } from '../../utils/imageAction';

const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gmi

// const tagRegex = /(?<![\w@])@([\w@]+(?:[.!][\w@]+)*)/gmi
// const tagRegex = /(?<![\w@])@([\w@]+(?:[.!][\w@]+)*)/gmi
const tagRegex = /(?!\w)@\w+/gmi
const EditPostScreen = ({
  navigation,
  route,
}) => {
  const { params: { data, onPressDone } } = route;
  const textInputRef = useRef();
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
  const [letModalVisible, setLetModalVisible] = useState(false);
  const [searchFieldHeight, setSearchFieldHeight] = useState();
  const editObject = JSON.parse(route?.params?.data?.object);
  const [tagsOfEntity, setTagsOfEntity] = useState(editObject?.taggedData || []);
  const [searchTag, setSearchTag] = useState();
  const [searchUsers, setSearchUsers] = useState([]);
  const [currentTextInputIndex, setCurrentTextInputIndex] = useState(0);
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

  useEffect(() => {
    if (searchText?.length === 0) {
      setTagsOfEntity([])
      setUsers([]);
      setGroups([]);
      setLetModalVisible(false);
    }
    if (searchText) {
      if (currentTextInputIndex === 1 && searchText[currentTextInputIndex - 2] === '@' && searchText[currentTextInputIndex - 1] !== ' ') setLetModalVisible(true);
      else if (searchText[currentTextInputIndex - 2] === '@' && searchText[currentTextInputIndex - 1] !== ' ') setLetModalVisible(true)

      const lastString = searchText.substr(0, currentTextInputIndex);
      if (lastString) setSearchTag(`@${lastString.split('@')?.reverse()?.[0]}`)
    }
  }, [currentTextInputIndex, searchText])

  useEffect(() => {
    if (letModalVisible) searchFilterFunction(searchTag?.replace('@', ''))
  }, [letModalVisible, searchTag])

  const onTagPress = useCallback((item) => {
    const tagsArray = [];
    let joinedString = '@';
    const entity_text = ['player', 'user']?.includes(item.entity_type) ? 'user_id' : 'group_id'
    const jsonData = { entity_type: '', entity_name: '', entity_id: '' }
    jsonData.entity_type = ['player', 'user']?.includes(item.entity_type) ? 'user' : item?.entity_type;
    jsonData.entity_id = item?.[entity_text];
    if (item?.group_name) {
      jsonData.entity_name = _.startCase(_.toLower(item?.group_name));
    } else {
      const fName = _.startCase(_.toLower(item?.first_name));
      const lName = _.startCase(_.toLower(item?.last_name));
      jsonData.entity_name = `${fName} ${lName}`;
    }
    // joinedString += `${tagPrefix}${JSON.stringify(jsonData)}${tagSuffix} `;
    joinedString += `${jsonData.entity_name } `;
    const str = searchText?.replace(`${searchTag}`, joinedString.replace(/ /g, ''));
    setSearchText(`${str} `)

    const isExist = tagsOfEntity.some((tagItem) => tagItem[entity_text] === item[entity_text])
    if (!isExist) tagsArray.push(item)
    setTagsOfEntity([...tagsOfEntity, ...tagsArray])
    setLetModalVisible(false)
    textInputRef.current.focus();
  }, [searchTag, searchText, tagsOfEntity])

  useEffect(() => {
    let tagName = '';
    const tagsArray = [];
    if (route?.params?.selectedTagList) {
      if (route?.params?.selectedTagList?.length > 0) {
        route.params.selectedTagList.map((tagItem) => {
          let joinedString = '@';
          const entity_text = ['player', 'user']?.includes(tagItem.entity_type) ? 'user_id' : 'group_id'
          const isExist = tagsOfEntity.some((item) => item[entity_text] === tagItem[entity_text])

          const jsonData = { entity_type: '', entity_name: '', entity_id: '' }
          jsonData.entity_type = ['player', 'user']?.includes(tagItem.entity_type) ? 'user' : tagItem?.entity_type;
          jsonData.entity_id = tagItem?.[entity_text];
          if (tagItem?.group_name) {
            jsonData.entity_name = _.startCase(_.toLower(tagItem?.group_name));
          } else {
            const fName = _.startCase(_.toLower(tagItem?.first_name));
            const lName = _.startCase(_.toLower(tagItem?.last_name));
            jsonData.entity_name = `${fName}${lName}`;
          }
          // joinedString = `@${tagPrefix}${JSON.stringify(jsonData)}${tagSuffix} `;
          joinedString += `${jsonData.entity_name } `;
          if (!isExist) tagsArray.push(tagItem)
          tagName = `${tagName} ${joinedString}`;
          textInputRef.current.focus();
          return null;
        })
        setLetModalVisible(false)
        setTagsOfEntity([...tagsOfEntity, ...tagsArray])
        const modifiedSearch = searchText;
        const output = [modifiedSearch.slice(0, currentTextInputIndex - 1), tagName, modifiedSearch.slice(currentTextInputIndex - 1)].join('');
        setSearchText(output);
      }
    }
  }, [route?.params?.selectedTagList]);

  const searchFilterFunction = useCallback((text) => {
    if (text?.length > 0) {
      const userData = getSearchData(searchUsers, ['full_name', 'first_name', 'last_name', 'group_name'], text);
      const groupData = getSearchData(searchGroups, ['full_name', 'first_name', 'last_name', 'group_name'], text);
      setUsers([...userData]);
      setGroups([...groupData])
    }
  }, [searchGroups, searchUsers]);

  let userImage = '';
  let userName = '';
  if (data && data.actor && data.actor.data) {
    userName = data.actor.data.full_name;
    userImage = data.actor.data.thumbnail;
  }

  const renderTagText = (matchingString) => {
    const pattern = /\B@\w+/g;
    const match = matchingString.match(pattern);
    return <Text style={{ ...styles.username, color: colors.greeColor }}>{match[0]}</Text>;
  }

  const addStr = (str, index, stringToAdd) => str.substring(0, index) + stringToAdd + str.substring(index, str.length)
  const renderUrlPreview = useMemo(() => {
    if (searchText?.length > 0) {
      let desc = searchText
      const position = desc.search(urlRegex)
      if (position !== -1 && desc.substring(position)?.startsWith('www')) desc = addStr(desc, position, 'http://')
      return (<UrlPreview
              text={desc}
              containerStyle={styles.previewContainerStyle}
          />
      )
    }
    return null;
  }, [searchText]);

  const renderTagUsersAndGroups = useCallback(({ item }) => (
    <TouchableOpacity
          onPress={() => onTagPress(item)}
          style={styles.userListStyle}>
      <Image source={item?.thumbnail ? { uri: item?.thumbnail } : images.profilePlaceHolder} style={{ borderRadius: 13, height: 25, width: 25 }}/>
      <Text style={styles.userTextStyle}>
        {item?.group_name ? item?.group_name : `${item.first_name} ${item.last_name}`}
      </Text>
      <Text style={styles.locationTextStyle}>{`${item.city}, ${item.state_abbr}`}</Text>
    </TouchableOpacity>
  ), [onTagPress]);

  const renderModalTagEntity = useMemo(() => (letModalVisible && [...users, ...groups]?.length > 0)
      && (<View style={[styles.userListContainer, { marginTop: searchFieldHeight + 20 }]}>
        <FlatList
                showsVerticalScrollIndicator={false}
                data={[...users, ...groups]}
                keyboardShouldPersistTaps={'always'}
                style={{ paddingTop: hp(1) }}
                ListFooterComponent={() => <View style={{ height: hp(6) }} />}
                renderItem={renderTagUsersAndGroups}
                keyExtractor={ (item, index) => index.toString() }
            />
      </View>
      ), [groups, letModalVisible, renderTagUsersAndGroups, searchFieldHeight, users])

  const onKeyPress = useCallback(({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace' && searchText[currentTextInputIndex - 1] === '@') {
      setLetModalVisible(false);
    }
  }, [currentTextInputIndex, searchText])

  const onSelectionChange = useCallback((e) => {
    setCurrentTextInputIndex(e?.nativeEvent?.selection?.end)
  }, [])

  const onImagePress = useCallback(() => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true,
      maxFiles: MAX_UPLOAD_POST_ASSETS - (selectImage?.length ?? 0),
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
  }, [selectImage]);

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
          // onTouchEnd={() => !isKeyboardOpen && textInputRef.current.focus()}
      >
        <TextInput
            ref={textInputRef}
            onLayout={(event) => setSearchFieldHeight(event?.nativeEvent?.layout?.height)}
            placeholder="What's going on?"
            placeholderTextColor={ colors.userPostTimeColor }
            onSelectionChange={onSelectionChange}
            onKeyPress={onKeyPress}
            onChangeText={setSearchText}
            style={styles.textInputField}
            multiline={ true }
            textAlignVertical={'top'}
        >
          <ParsedText
              parse={[{ pattern: tagRegex, renderText: renderTagText }]}
              childrenProps={{ allowFontScaling: false }}
          >
            {searchText}
          </ParsedText>
        </TextInput>
        {renderUrlPreview}
        {renderModalTagEntity}

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
            {selectImage?.length < MAX_UPLOAD_POST_ASSETS
            && <ImageButton
              source={images.pickImage}
              imageStyle={{ width: 30, height: 30, marginHorizontal: wp('2%') }}
              onImagePress={onImagePress}
            />}
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
