/* eslint-disable no-unused-vars */
import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import {
  View,
  // Keyboard,
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
import UrlPreview from 'react-native-url-preview';
import _ from 'lodash';
import ParsedText from 'react-native-parsed-text';
import SelectedImageList from '../../../../WritePost/SelectedImageList';
import ActivityLoader from '../../../../loader/ActivityLoader';

import { getUserList } from '../../../../../api/Users';
import { getMyGroups } from '../../../../../api/Groups';
import AuthContext from '../../../../../auth/context';
import { getSearchData } from '../../../../../utils';
import ImageButton from '../../../../WritePost/ImageButton';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

export default function WriteReviewScreen({ navigation, route }) {
  const textInputFocus = useRef();
  // let currentTextInputIndex = 0;
  // const keyboardDidShowListener = null;
  // const keyboardDidHideListener = null;
  const authContext = useContext(AuthContext);
  const [searchFieldHeight, setSearchFieldHeight] = useState();
  const [tagsOfEntity, setTagsOfEntity] = useState(route.params.taggedData || []);
  const [searchTag, setSearchTag] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState(route?.params?.searchText ?? '');
  const [selectImage, setSelectImage] = useState(route.params.selectedImageList);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchGroups, setSearchGroups] = useState([]);
  const [loading, setloading] = useState(false);
  const [letModalVisible, setLetModalVisible] = useState(true);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  // const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const { params: { postData } } = route;
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

  // useEffect(() => {
  //   keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
  //   keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));
  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   }
  // }, [])
  useEffect(() => {
    let tagName = '';
    const tagsArray = [];
    if (route.params && route.params.selectedTagList) {
      if (route.params.selectedTagList.length > 0) {
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
    }
  }, [route.params]);

  useEffect(() => {
    if (searchText?.length === 0) {
      setTagsOfEntity([])
      setUsers([]);
      setGroups([]);
      setModalVisible(false);
    }
  }, [searchText])
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const searchFilterFunction = (text) => {
    if (text.length > 0) {
      const userData = getSearchData(searchUsers, ['first_name', 'last_name', 'group_name'], text);
      const groupData = getSearchData(searchGroups, ['first_name', 'last_name', 'group_name'], text);
      setUsers([...userData]);
      setGroups([...groupData])
    }
  };

  const onTagPress = (item) => {
    const tagsArray = [];
    let joinedString = '';
    if (item?.group_name) {
      joinedString = _.startCase(item?.group_name.toLowerCase())
    } else {
      const fName = _.startCase(item?.first_name?.toLowerCase());
      const lName = _.startCase(item?.last_name?.toLowerCase());
      joinedString = fName + lName;
    }
    const str = searchText.replace(new RegExp(`${searchTag}$`), joinedString.replace(/ /g, ''));
    setSearchText(`${str} `)
    const entity_text = ['player', 'user']?.includes(item.entity_type) ? 'user_id' : 'group_id'
    const isExist = tagsOfEntity.some((tagItem) => tagItem[entity_text] === item[entity_text])
    if (!isExist) tagsArray.push(item)
    setTagsOfEntity([...tagsOfEntity, ...tagsArray])
    setModalVisible(false)
  }

  const renderTagText = (matchingString) => {
    const pattern = /\B@\w+/gm;
    const match = matchingString.match(pattern);
    return <Text style={{ ...styles.username, color: colors.greeColor }}>{match[0]}</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={ { flex: 1 } }
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
      <ActivityLoader visible={ loading } />
      <SafeAreaView>
        <View style={ styles.containerStyle }>
          <View style={ styles.backIconViewStyle }>
            <TouchableOpacity onPress={ () => navigation.goBack() }>
              <Image source={ images.backArrow } style={ styles.backImage } />
            </TouchableOpacity>
          </View>
          <View style={ styles.writePostViewStyle }>
            <Text style={ styles.writePostTextStyle }>Write Review</Text>
          </View>
          <TouchableOpacity
            style={styles.doneViewStyle}
            onPress={() => {
              if (searchText.trim().length === 0 && selectImage.length === 0) {
                Alert.alert(strings.writeText);
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
                navigation.navigate(route?.params?.comeFrom, { selectedImageList: selectImage, searchText, entityTags: tagsOfEntity });
                // navigation.goBack();
                // onPressDone(selectImage, searchText, tagData);
              }
            }}
          >
            <Text style={styles.doneTextStyle}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={ styles.sperateLine } />
      <View style={ styles.userDetailView }>
        <Text style={ styles.userTxt }>Leave a review</Text>
      </View>

      <ScrollView
          bounces={ false }
          style={{ flex: 1 }}
          // onTouchEnd={() => !isKeyboardOpen && textInputFocus.current.focus()}
      >
        <TextInput
            ref={textInputFocus}
            onLayout={(event) => setSearchFieldHeight(event?.nativeEvent?.layout?.height)}
            placeholder={strings.whatsGoingText}
            placeholderTextColor={ colors.userPostTimeColor }
            onSelectionChange={() => {
              // currentTextInputIndex = e?.nativeEvent?.selection?.end;
            }}
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
              parse={[{ pattern: /\B@\w+/gm, renderText: renderTagText }]}
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
                  const imgs = [...selectImage];
                  const idx = imgs.indexOf(item);
                  if (idx > -1) {
                    imgs.splice(idx, 1);
                  }
                  setSelectImage(imgs);
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

          </View>
          <View style={ [styles.onlyMeViewStyle, { justifyContent: 'flex-end' }] }>
            <ImageButton
              source={ images.pickImage }
              imageStyle={ { width: 30, height: 30, marginHorizontal: wp('2%') } }
              onImagePress={ () => {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  // cropping: true,
                  multiple: true,
                  maxFiles: 10,
                }).then((data) => {
                  let allSelectData = [];
                  const secondData = [];
                  if (selectImage.length > 0) {
                    data.filter((dataItem) => {
                      const filter_data = selectImage.filter((imageItem) => imageItem.filename === dataItem.filename);
                      if (filter_data.length === 0) {
                        secondData.push(dataItem)
                      }
                      return null;
                    })
                    allSelectData = [...selectImage, ...secondData];
                    setSelectImage(allSelectData);
                  } else {
                    setSelectImage(data);
                  }
                });
              } }
            />
            <ImageButton
              source={ images.tagImage }
              imageStyle={{ width: 30, height: 30, marginLeft: wp('2%') }}
              onImagePress={() => {
                navigation.navigate('UserTagSelectionListScreen', { comeFrom: 'WriteReviewScreen' });
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
    justifyContent: 'center',
    alignSelf: 'flex-end',
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
    fontFamily: fonts.RRegular,
    fontSize: 20,

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
