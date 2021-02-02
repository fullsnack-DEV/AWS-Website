import React, { useState, useContext, useEffect } from 'react';
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
import RNUrlPreview from 'react-native-url-preview';
import ImageButton from '../../../../WritePost/ImageButton';
import SelectedImageList from '../../../../WritePost/SelectedImageList';
import { getUserList } from '../../../../../api/Users';
import { getMyGroups } from '../../../../../api/Groups';
import fonts from '../../../../../Constants/Fonts'
import colors from '../../../../../Constants/Colors'
import images from '../../../../../Constants/ImagePath';
import AuthContext from '../../../../../auth/context'
import Header from '../../../../Home/Header';

const tagsArray = []
export default function WriteReviewScreen({ navigation, route }) {
  const authContext = useContext(AuthContext)
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState(route?.params?.searchText ?? '');
  const [selectImage, setSelectImage] = useState(route.params.selectedImageList || []);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchGroups, setSearchGroups] = useState([]);
  const [tagsOfEntity, setTagsOfEntity] = useState(route.params.taggedData || []);

  const [searchFieldHeight, setSearchFieldHeight] = useState();
  const [searchTag, setSearchTag] = useState();

  useEffect(() => {
    getUserList(authContext)
      .then((response) => {
        setUsers(response.payload);
        setSearchUsers(response.payload)
      })
      .catch((e) => {
        console.log('eeeee Get Users :-', e.response);
        Alert.alert('', e.messages)
      });
  }, []);

  useEffect(() => {
    getMyGroups(authContext)
      .then((response) => {
        setGroups(response.payload);
        setSearchGroups(response.payload)
      })
      .catch((e) => {
        console.log('eeeee Get Group Users :-', e.response);
        Alert.alert('', e.messages)
      });
  }, []);

  useEffect(() => {
    let tagName = '';
    if (route.params && route.params.selectedTagList) {
      if (route.params.selectedTagList.length > 0) {
        route.params.selectedTagList.map((tagItem) => {
          tagName = `${tagName} @${tagItem.title.replace(/\s/g, '')}`;
          return null;
        })
        setSearchText(searchText + tagName);
      }
    }
  }, [route.params]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const searchFilterFunction = (text) => {
    console.log('TEXT::=>', text);
    if (text.length > 0) {
      setUsers(searchUsers.filter((x) => x?.first_name?.includes(text) || x?.last_name?.includes(text) || x?.group_name?.includes(text)));
      setGroups(searchGroups.filter(
        (x) => x?.first_name?.includes(text) || x?.last_name?.includes(text) || x?.group_name?.includes(text),
      ));
    }
  };

  return (
    <KeyboardAvoidingView
      style={ { flex: 1 } }
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>

      <Header
          leftComponent={
            <TouchableOpacity onPress={ () => navigation.goBack() }>
              <Image source={ images.backArrow } style={ styles.backImage } />
            </TouchableOpacity>
          }
          centerComponent={
            <View style={ styles.writePostViewStyle }>
              <Text style={ styles.writePostTextStyle }>Write review</Text>
            </View>
          }
          rightComponent={
            <TouchableOpacity
            style={styles.doneViewStyle}
            onPress={() => {
              if (searchText.trim().length === 0 && selectImage.length === 0) {
                Alert.alert('Please write some text or select any image.');
              } else {
                // setloading(false);
                navigation.navigate(route?.params?.comeFrom, { selectedImageList: selectImage, searchText, entityTags: tagsOfEntity });

                // onPressDone(selectImage, searchText);
              }
            }}
          >
              <Text style={styles.doneTextStyle}>Done</Text>
            </TouchableOpacity>
          }

      />

      <View style={ styles.sperateLine } />

      <Text style={ styles.userTxt }>Leave a review</Text>
      <ScrollView bounces={ false }>

        <View style={{ zIndex: 1 }}>

          <TextInput
          onLayout={(event) => {
            const {
              height,
            } = event.nativeEvent.layout;
            setSearchFieldHeight(height)
          }}
          placeholder="What's going on?"
          value={ searchText }
          placeholderTextColor={ colors.userPostTimeColor }

          onKeyPress={({ nativeEvent }) => {
            console.log(nativeEvent.key)
            if (nativeEvent.key === 'Backspace') {
              setModalVisible(false);
            }
          }}
          onChangeText={ (text) => {
            setSearchText(text);

            setSearchTag(text.split('@')?.reverse()?.[0])
            if (text.split('@')?.reverse()?.[0] !== '' || text.split('@')?.reverse()?.[0] !== ' ') {
              searchFilterFunction(text.split('@')?.reverse()?.[0])
            }

            const lastChar = text.slice(text.length - 1, text.length);
            if (lastChar === '@') {
              toggleModal()
            }
          }}
          style={ styles.textInputField }
          multiline={ true }
          textAlignVertical={'top'}
        />
          {isModalVisible
        && <View style={[styles.userListContainer, { marginTop: searchFieldHeight + 20 }]}>
          <FlatList
          showsVerticalScrollIndicator={false}
          data={[...users, ...groups]}
          keyboardShouldPersistTaps={'always'}
          style={{ paddingTop: hp(1) }}
          ListFooterComponent={() => <View style={{ height: hp(6) }} />}
          renderItem={ ({ item }) => {
            if (item && item.full_name) {
              return (<View style={styles.userListStyle}>
                <Image source={item?.thumbnail ? { uri: item?.thumbnail } : images.profilePlaceHolder} style={{ borderRadius: 13, height: 25, width: 25 }}/>
                <Text style={styles.userTextStyle} onPress={() => {
                  const str = searchText.replace(new RegExp(`${searchTag}$`), `${item.first_name} ${item.last_name}` || item.group_name)
                  setSearchText(`${str} `)

                  if (!tagsArray.includes((e) => `${e.first_name} ${e.last_name}` === `${item.first_name} ${item.last_name}` || e.group_name === item.group_name)) {
                    tagsArray.push(item)
                  }
                  setTagsOfEntity([...tagsOfEntity, ...tagsArray])
                  setModalVisible(false)
                }}>{`${item.first_name} ${item.last_name}` || item.group_name}</Text>
                <Text style={styles.locationTextStyle}>{`${item.city}, ${item.state_abbr}` || item.group_name}</Text>
              </View>)
            }
            return <View />
          } }
          keyExtractor={ (item, index) => index.toString() }
        />
        </View>}
        </View>

        {searchText.length > 0 && <RNUrlPreview
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
            {/* <ImageButton
              source={ images.lock }
              imageStyle={ { width: 18, height: 21 } }
              onImagePress={ () => {
              } }
            />
            <Text style={ styles.onlyMeTextStyle }>Only me</Text> */}
          </View>
          <View style={ [styles.onlyMeViewStyle, { justifyContent: 'flex-end' }] }>
            <ImageButton
              source={ images.pickImage }
              imageStyle={ { width: 19, height: 19, marginHorizontal: wp('2%') } }
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
                  // setSelectImage(data);
                  // uploadImage({ data: data[0] }).then((res) => {
                  //   console.log('uploadImage :-', res);
                  // }).catch((e) => {
                  //   console.log('EEEE :-', e);
                  // })
                });
              } }
            />
            <ImageButton
              source={ images.tagImage }
              imageStyle={{ width: 22, height: 22, marginLeft: wp('2%') }}
              onImagePress={() => {
                navigation.navigate('UserTagSelectionListScreen');
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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

  doneTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
  },
  doneViewStyle: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  // onlyMeTextStyle: {
  //   color: colors.googleColor,
  //   fontFamily: fonts.RRegular,
  //   fontSize: 15,
  //   marginLeft: wp('2%'),
  // },
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
  userTxt: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    marginLeft: 15,
    marginBottom: 20,
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
    backgroundColor: 'white',
    height: 300,
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
