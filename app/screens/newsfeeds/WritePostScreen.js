/* eslint-disable no-useless-escape */
import React, {
  useState, useEffect, useContext, useRef, useMemo, useCallback,
} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
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
import UrlPreview from 'react-native-url-preview';
import _ from 'lodash';
import ParsedText from 'react-native-parsed-text';
import ImageButton from '../../components/WritePost/ImageButton';
import SelectedImageList from '../../components/WritePost/SelectedImageList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import fonts from '../../Constants/Fonts'
import colors from '../../Constants/Colors'
import images from '../../Constants/ImagePath';
import { getUserList } from '../../api/Users';
import { getMyGroups } from '../../api/Groups';
import AuthContext from '../../auth/context';
import { getSearchData } from '../../utils';
import { getPickedData, MAX_UPLOAD_POST_ASSETS } from '../../utils/imageAction';

const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gmi
const tagRegex = /(?<![\w@])@([\w@]+(?:[.!][\w@]+)*)/gmi
// const tagRegex = /(?!\w)@\w+/gmi

export default function WritePostScreen({ navigation, route }) {
  const textInputRef = useRef();
  const [currentTextInputIndex, setCurrentTextInputIndex] = useState(0);
  const [lastTagStartIndex, setLastTagStartIndex] = useState(null);
  const authContext = useContext(AuthContext);
  const [searchFieldHeight, setSearchFieldHeight] = useState();
  const [tagsOfEntity, setTagsOfEntity] = useState(route.params.taggedData || []);
  const [searchTag, setSearchTag] = useState();
  const [searchText, setSearchText] = useState('');
  const [selectImage, setSelectImage] = useState(route.params.selectedImageList);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchGroups, setSearchGroups] = useState([]);
  const [loading, setloading] = useState(false);
  const [letModalVisible, setLetModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const { params: { postData, onPressDone } } = route;
  let userImage = '';
  let userName = '';
  if (postData && postData.thumbnail) {
    userImage = postData.thumbnail;
  }
  if (postData && postData.full_name) {
    userName = postData.full_name;
  }
  if (postData && postData.group_name) {
    userName = postData.group_name;
  }

  useEffect(() => {
    if (searchText[currentTextInputIndex - 1] === '@') setLastTagStartIndex(currentTextInputIndex - 1);
    if (searchText[currentTextInputIndex - 1] === ' ') setLastTagStartIndex(null);
  }, [searchText])

  useEffect(() => {
    let tagName = '';
    const tagsArray = [];
    if (route.params && route.params.selectedTagList) {
      if (route.params.selectedTagList?.length > 0) {
        route.params.selectedTagList.map((tagItem) => {
          let joinedString = '@';
          const entity_text = ['player', 'user']?.includes(tagItem.entity_type) ? 'user_id' : 'group_id'
          const isExist = tagsOfEntity.some((item) => item?.entity_id === tagItem[entity_text])

          const jsonData = { entity_type: '', entity_data: '', entity_id: '' }
          jsonData.entity_type = ['player', 'user']?.includes(tagItem.entity_type) ? 'user' : tagItem?.entity_type;
          jsonData.entity_id = tagItem?.[entity_text];
          if (tagItem?.group_name) {
            jsonData.entity_data = _.startCase(_.toLower(tagItem?.group_name))?.replace(/ /g, '');
          } else {
            const fName = _.startCase(_.toLower(tagItem?.first_name))?.replace(/ /g, '');
            const lName = _.startCase(_.toLower(tagItem?.last_name))?.replace(/ /g, '');
            jsonData.entity_data = `${fName}${lName}`;
          }
          joinedString += `${jsonData.entity_data } `;
          if (!isExist) tagsArray.push({ entity_data: joinedString.replace(/ /g, ''), entity_id: jsonData?.entity_id, entity_type: jsonData?.entity_type })
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
  }, [route?.params]);

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

  useEffect(() => {
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
  }, []);

  const searchFilterFunction = useCallback((text) => {
    if (text?.length > 0) {
      const userData = getSearchData(searchUsers, ['full_name', 'first_name', 'last_name', 'group_name'], text);
      const groupData = getSearchData(searchGroups, ['full_name', 'first_name', 'last_name', 'group_name'], text);
      setUsers([...userData]);
      setGroups([...groupData])
    }
  }, [searchGroups, searchUsers]);

  const removeStr = (str, fromIndex, toIndex) => str.substring(0, fromIndex) + str.substring(toIndex, str.length)

  const addStringInCurrentText = useCallback((str, fromIndex, toIndex, stringToAdd) => {
    let string = removeStr(str, fromIndex, toIndex);
    string = addStr(string, fromIndex, stringToAdd);
    return string;
  }, [])

  const onTagPress = useCallback((item) => {
    const tagsArray = [];
    let joinedString = '@';
    const entity_text = ['player', 'user']?.includes(item.entity_type) ? 'user_id' : 'group_id'
    const jsonData = { entity_type: '', entity_data: '', entity_id: '' }
    jsonData.entity_type = ['player', 'user']?.includes(item.entity_type) ? 'user' : item?.entity_type;
    jsonData.entity_id = item?.[entity_text];
    if (item?.group_name) {
      jsonData.entity_data = _.startCase(_.toLower(item?.group_name))?.replace(/ /g, '');
    } else {
      const fName = _.startCase(_.toLower(item?.first_name))?.replace(/ /g, '');
      const lName = _.startCase(_.toLower(item?.last_name))?.replace(/ /g, '');
      jsonData.entity_data = `${fName}${lName}`;
    }
    joinedString += `${jsonData.entity_data } `;
    const str = addStringInCurrentText(searchText, lastTagStartIndex, currentTextInputIndex, joinedString);
    setSearchText(`${str} `)

    const isExist = tagsOfEntity.some((tagItem) => tagItem?.entity_id === item[entity_text])
    if (!isExist) tagsArray.push({ entity_data: joinedString.replace(/ /g, ''), entity_id: item?.[entity_text], entity_type: jsonData?.entity_type })
    setTagsOfEntity([...tagsOfEntity, ...tagsArray])
    setLetModalVisible(false)
    textInputRef.current.focus();
    setLastTagStartIndex(null);
  }, [addStringInCurrentText, currentTextInputIndex, lastTagStartIndex, searchText, tagsOfEntity])

  const renderTagText = useCallback((matchingString) => <Text style={{ ...styles.username, color: colors.greeColor }}>{`${matchingString}`}</Text>, [])

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

  const renderHeader = useMemo(() => (
    <SafeAreaView>
      <View style={ styles.containerStyle }>
        <View style={ styles.backIconViewStyle }>
          <TouchableOpacity onPress={ () => navigation.goBack() }>
            <Image source={ images.backArrow } style={ styles.backImage } />
          </TouchableOpacity>
        </View>
        <View style={ styles.writePostViewStyle }>
          <Text style={ styles.writePostTextStyle }>Write Post</Text>
        </View>
        <TouchableOpacity
              style={styles.doneViewStyle}
              onPress={async () => {
                const uploadTimeout = selectImage?.length * 300;
                if (searchText.trim()?.length === 0 && selectImage?.length === 0) {
                  Alert.alert('Please write some text or select any image.');
                } else {
                  setloading(true);
                  const tagData = JSON.parse(JSON.stringify(tagsOfEntity));
                  tagsOfEntity.map(async (item, index) => {
                    const isThere = searchText.includes(item?.entity_data?.replace(/ /g, ''))
                    if (!isThere) tagData.splice(index, 1);
                    return null;
                  })
                   onPressDone(selectImage, searchText, tagData);
                  navigation.goBack()
                  setTimeout(() => {
                    setloading(false);
                  }, uploadTimeout());
                }
              }}
          >
          <Text style={styles.doneTextStyle}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  ), [navigation, onPressDone, searchText, selectImage, tagsOfEntity])

  const renderCurrentUseProfile = useMemo(() => (
    <View style={ styles.userDetailView }>
      <Image style={ styles.background } source={ userImage ? { uri: userImage } : images.profilePlaceHolder } />
      <View style={ styles.userTxtView }>
        <Text style={ styles.userTxt }>{userName}</Text>
      </View>
    </View>
  ), [userImage, userName])

  const onKeyPress = useCallback(({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace' && searchText[currentTextInputIndex - 1] === '@') {
      setLastTagStartIndex(null);
      setLetModalVisible(false);
    }
  }, [currentTextInputIndex, searchText])

  const onSelectionChange = useCallback((e) => {
    setCurrentTextInputIndex(e?.nativeEvent?.selection?.end)
  }, [])

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

  const onImageItemPress = useCallback((item) => {
    const imgs = [...selectImage];
    const idx = imgs.indexOf(item);
    if (idx > -1) {
      imgs.splice(idx, 1);
    }
    setSelectImage(imgs);
  }, [selectImage]);

  const renderSelectedImage = useCallback(({ item, index }) => (
    <SelectedImageList
          data={ item }
          itemNumber={ index + 1 }
          totalItemNumber={ selectImage?.length }
          onItemPress={() => onImageItemPress(item)}
      />
  ), [onImageItemPress, selectImage?.length])

  const ItemSeparatorComponent = useCallback(() => (
    <View style={ { width: wp('1%') } } />
  ), [])
  const renderSelectedImageList = useMemo(() => selectImage?.length > 0 && (
    <FlatList
          data={ selectImage }
          horizontal={ true }
          showsHorizontalScrollIndicator={ false }
          renderItem={renderSelectedImage}
          ItemSeparatorComponent={ItemSeparatorComponent}
          style={ { paddingTop: 10, marginHorizontal: wp('3%') } }
          keyExtractor={ (item, index) => index.toString() }
      />
  ), [ItemSeparatorComponent, renderSelectedImage, selectImage])

  const onImagePress = useCallback(() => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        multiple: true,
        maxFiles: MAX_UPLOAD_POST_ASSETS - (selectImage?.length ?? 0),
      }).then((data) => {
        const pickedData = getPickedData(data, selectImage?.length);
        let allSelectData = [];
        const secondData = [];
        if (selectImage?.length > 0) {
          pickedData.filter((dataItem) => {
            const filter_data = selectImage.filter((imageItem) => imageItem.filename === dataItem.filename);
            if (filter_data?.length === 0) {
              secondData.push(dataItem)
            }
            return null;
          })
          allSelectData = [...selectImage, ...secondData];
          setSelectImage(allSelectData);
        } else {
          setSelectImage(pickedData);
        }
      }).catch((error) => {
        console.log(error);
      });
  }, [selectImage])

  const onSelectTagButtonPress = useCallback(() => {
    navigation.navigate('UserTagSelectionListScreen', { comeFrom: 'WritePostScreen' });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={ { flex: 1 } }
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
      <ActivityLoader visible={ loading } />
      {renderHeader}
      <View style={ styles.sperateLine } />
      {renderCurrentUseProfile}

      <View
          bounces={ false }
          style={{ flex: 1, overflow: 'visible' }}
          // onTouchEnd={() => !isKeyboardOpen && textInputFocus.current.focus()}
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
        {renderSelectedImageList}
        {renderModalTagEntity}
      </View>
      <SafeAreaView style={ styles.bottomSafeAreaStyle }>
        <View style={ styles.bottomImgView }>
          <View style={ styles.onlyMeViewStyle }>
            <ImageButton
              source={ images.lock }
              imageStyle={ { width: 30, height: 30 } }
              onImagePress={ () => {}}
            />
            <Text style={ styles.onlyMeTextStyle }>Only me</Text>
          </View>
          <View style={ [styles.onlyMeViewStyle, { justifyContent: 'flex-end' }] }>
            {selectImage?.length < MAX_UPLOAD_POST_ASSETS
            && <ImageButton
              source={ images.pickImage }
              imageStyle={ { width: 30, height: 30, marginHorizontal: wp('2%') } }
              onImagePress={onImagePress}
            />}
            <ImageButton
              source={ images.tagImage }
              imageStyle={{ width: 30, height: 30, marginLeft: wp('2%') }}
              onImagePress={onSelectTagButtonPress}
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
    width: 30,
  },
  backImage: {
    height: 20,
    tintColor: colors.lightBlackColor,
    width: 10,
  },
  background: {
    borderRadius: hp('3%'),
    height: hp('6%'),
    resizeMode: 'cover',
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
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  doneViewStyle: {

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

  },
  bottomSafeAreaStyle: {
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: -3,
      width: 0,
    },
  },
  previewContainerStyle: {
    margin: 5,
    borderWidth: 1,
    borderColor: colors.grayBackgroundColor,
    padding: 8,
    borderRadius: 10,
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
});
