import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
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
import ParsedText from 'react-native-parsed-text';
import _ from 'lodash';
import ImageButton from '../../components/WritePost/ImageButton';
import ActivityLoader from '../../components/loader/ActivityLoader';
import EditSelectedImages from '../../components/WritePost/EditSelectedImages';

import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {getTaggedEntityData} from '../../utils';
import {getPickedData, MAX_UPLOAD_POST_ASSETS} from '../../utils/imageAction';
import TCGameCard from '../../components/TCGameCard';
import {getGroupIndex, getUserIndex} from '../../api/elasticSearch';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import {
  whoCanDataSourceGroup,
  whoCanDataSourceUser,
} from '../../utils/constant';
import ScreenHeader from '../../components/ScreenHeader';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes, tagRegex, urlRegex} from '../../Constants/GeneralConstants';

const EditPostScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);

  const {
    params: {data, onPressDone},
  } = route;
  const textInputRef = useRef();
  let postText = '';
  let postAttachments = [];
  if (data && data.object) {
    postText = JSON.parse(data.object).text;
    if (JSON.parse(data.object).attachments) {
      postAttachments = JSON.parse(data.object).attachments;
    }
  }
  const [searchText, setSearchText] = useState(postText);
  const [selectImage, setSelectImage] = useState(postAttachments);
  const [lastTagStartIndex, setLastTagStartIndex] = useState(null);
  const [loading, setloading] = useState(false);
  const [letModalVisible, setLetModalVisible] = useState(false);
  const [searchFieldHeight, setSearchFieldHeight] = useState(0);

  const [tagsOfEntity, setTagsOfEntity] = useState(
    JSON.parse(route?.params?.data?.object)?.format_tagged_data || [],
  );
  const [searchTag, setSearchTag] = useState();
  const [searchUsers, setSearchUsers] = useState([]);
  const [currentTextInputIndex, setCurrentTextInputIndex] = useState(0);
  const [searchGroups, setSearchGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [visibleWhoModal, setVisibleWhoModal] = useState(false);
  const [privacySetting, setPrivacySetting] = useState(
    JSON.parse(route?.params?.data?.object)?.who_can_see ?? {
      text: strings.everyoneTitleText,
      value: 0,
    },
  );

  useEffect(() => {
    const userQuery = {
      size: 1000,
      query: {
        bool: {
          must: [],
        },
      },
    };

    const groupQuery = {
      size: 1000,
      query: {
        bool: {
          must: [],
        },
      },
    };

    getUserIndex(userQuery)
      .then((response) => {
        setUsers([...response]);
        setSearchUsers([...response]);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
      });

    getGroupIndex(groupQuery)
      .then((response) => {
        setGroups([...response]);
        setSearchGroups([...response]);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
      });
  }, []);

  useEffect(() => {
    if (searchText[currentTextInputIndex - 1] === '@')
      setLastTagStartIndex(currentTextInputIndex - 1);
    if (searchText[currentTextInputIndex - 1] === ' ')
      setLastTagStartIndex(null);
  }, [searchText, currentTextInputIndex]);

  useEffect(() => {
    if (searchText?.length === 0) {
      setTagsOfEntity([]);
      setUsers([]);
      setGroups([]);
      setLetModalVisible(false);
    }
    if (searchText) {
      if (
        currentTextInputIndex === 1 &&
        searchText[currentTextInputIndex - 2] === '@' &&
        searchText[currentTextInputIndex - 1] !== ' '
      )
        setLetModalVisible(true);
      else if (
        searchText[currentTextInputIndex - 2] === '@' &&
        searchText[currentTextInputIndex - 1] !== ' '
      )
        setLetModalVisible(true);

      const lastString = searchText.substr(0, currentTextInputIndex);
      if (lastString) setSearchTag(`@${lastString.split('@')?.reverse()?.[0]}`);
    }
  }, [currentTextInputIndex, searchText]);

  const searchFilterFunction = useCallback(
    (text) => {
      if (text?.length > 0) {
        let userData = searchUsers.filter(
          (a) => !tagsOfEntity.some((b) => a.user_id === b.entity_id),
        );
        let groupData = searchGroups.filter(
          (o1) => !tagsOfEntity.some((o2) => o1.group_id === o2?.entity_id),
        );

        userData = userData.filter((x) =>
          x?.full_name?.toLowerCase().includes(text?.toLowerCase()),
        );
        groupData = groupData.filter((x) =>
          x?.group_name?.toLowerCase().includes(text?.toLowerCase()),
        );
        setUsers([...userData]);
        setGroups([...groupData]);
      }
    },
    [searchGroups, searchUsers, tagsOfEntity],
  );

  useEffect(() => {
    if (letModalVisible) searchFilterFunction(searchTag?.replace('@', ''));
  }, [letModalVisible, searchTag, searchFilterFunction]);

  const removeStr = (str, fromIndex, toIndex) =>
    str.substring(0, fromIndex) + str.substring(toIndex, str.length);

  const addStringInCurrentText = useCallback(
    (str, fromIndex, toIndex, stringToAdd) => {
      let string = removeStr(str, fromIndex, toIndex);
      string = addStr(string, fromIndex, stringToAdd);
      return string;
    },
    [],
  );

  const onTagPress = useCallback(
    (item) => {
      const tagsArray = [];
      let joinedString = '@';
      let entity_data = {};
      let entity_name = '';
      const entity_text = ['player', 'user']?.includes(item.entity_type)
        ? 'user_id'
        : 'group_id';
      const jsonData = {entity_type: '', entity_data, entity_id: ''};
      jsonData.entity_type = ['player', 'user']?.includes(item.entity_type)
        ? 'player'
        : item?.entity_type;
      jsonData.entity_id = item?.[entity_text];
      if (item?.group_name) {
        entity_name = _.startCase(_.toLower(item?.group_name))?.replace(
          / /g,
          '',
        );
      } else {
        const fName = _.startCase(_.toLower(item?.first_name))?.replace(
          / /g,
          '',
        );
        const lName = _.startCase(_.toLower(item?.last_name))?.replace(
          / /g,
          '',
        );
        entity_name = `${fName}${lName}`;
      }
      joinedString += `${entity_name} `;
      entity_data.tagged_formatted_name = joinedString?.replace(/ /g, '');
      entity_data = getTaggedEntityData(entity_data, item);
      const str = addStringInCurrentText(
        searchText,
        lastTagStartIndex,
        currentTextInputIndex,
        joinedString,
      );
      setSearchText(`${str} `);

      const isExist = tagsOfEntity.some(
        (tagItem) => tagItem?.entity_id === item[entity_text],
      );
      if (!isExist)
        tagsArray.push({
          entity_data,
          entity_id: item?.[entity_text],
          entity_type: jsonData?.entity_type,
        });
      setTagsOfEntity([...tagsOfEntity, ...tagsArray]);
      setLetModalVisible(false);
      textInputRef.current.focus();
      setLastTagStartIndex(null);
    },
    [
      addStringInCurrentText,
      currentTextInputIndex,
      lastTagStartIndex,
      searchText,
      tagsOfEntity,
    ],
  );

  useEffect(() => {
    let tagName = '';
    const tagsArray = [];
    if (route?.params?.selectedTagList?.length > 0) {
      route.params.selectedTagList.map((tagItem) => {
        let joinedString = '@';
        const entity_text = ['player', 'user']?.includes(tagItem.entity_type)
          ? 'user_id'
          : 'group_id';
        let entity_data = {};
        let entity_name = '';
        const isExist = tagsOfEntity.some(
          (item) => item?.entity_id === tagItem[entity_text],
        );

        const jsonData = {entity_type: '', entity_data, entity_id: ''};
        jsonData.entity_type = ['player', 'user']?.includes(tagItem.entity_type)
          ? 'player'
          : tagItem?.entity_type;
        jsonData.entity_id = tagItem?.[entity_text];
        if (tagItem?.group_name) {
          entity_name = _.startCase(_.toLower(tagItem?.group_name))?.replace(
            / /g,
            '',
          );
        } else {
          const fName = _.startCase(_.toLower(tagItem?.first_name))?.replace(
            / /g,
            '',
          );
          const lName = _.startCase(_.toLower(tagItem?.last_name))?.replace(
            / /g,
            '',
          );
          entity_name = `${fName}${lName}`;
        }
        joinedString += `${entity_name} `;
        entity_data.tagged_formatted_name = joinedString?.replace(/ /g, '');
        entity_data = getTaggedEntityData(entity_data, tagItem);
        if (!isExist)
          tagsArray.push({
            entity_data,
            entity_id: jsonData?.entity_id,
            entity_type: jsonData?.entity_type,
          });
        tagName = `${tagName} ${joinedString}`;

        textInputRef.current.focus();
        return null;
      });
      setLetModalVisible(false);
      setTagsOfEntity([...tagsOfEntity, ...tagsArray]);
      const modifiedSearch = searchText;
      const output = [
        modifiedSearch.slice(0, currentTextInputIndex - 1),
        tagName,
        modifiedSearch.slice(currentTextInputIndex - 1),
      ].join('');
      setSearchText(output);
    }
  }, [route?.params, currentTextInputIndex, searchText, tagsOfEntity]);

  let userImage = '';
  let userName = '';
  if (data && data.actor && data.actor.data) {
    userName = data.actor.data.full_name;
    userImage = data.actor.data.thumbnail;
  }

  const renderTagText = useCallback(
    (matchingString) => (
      <Text
        style={{
          ...styles.username,
          color: colors.tagColor,
        }}>{`${matchingString}`}</Text>
    ),
    [],
  );

  const addStr = (str, index, stringToAdd) =>
    str.substring(0, index) + stringToAdd + str.substring(index, str.length);

  const renderUrlPreview = useMemo(() => {
    if (searchText?.length > 0) {
      let desc = searchText;
      const position = desc.search(urlRegex);
      if (position !== -1 && desc.substring(position)?.startsWith('www'))
        desc = addStr(desc, position, 'http://');
      return null;
      // return (
      //   <UrlPreview text={desc} containerStyle={styles.previewContainerStyle} />
      // );
    }
    return null;
  }, [searchText]);

  const renderTagUsersAndGroups = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => onTagPress(item)}
        style={styles.userListStyle}>
        <Image
          source={
            item?.thumbnail ? {uri: item?.thumbnail} : images.profilePlaceHolder
          }
          style={{borderRadius: 13, height: 25, width: 25}}
        />
        <Text style={styles.userTextStyle}>
          {item?.group_name
            ? item?.group_name
            : `${item.first_name} ${item.last_name}`}
        </Text>
        <Text
          style={
            styles.locationTextStyle
          }>{`${item.city}, ${item.state_abbr}`}</Text>
      </TouchableOpacity>
    ),
    [onTagPress],
  );

  const renderModalTagEntity = useMemo(
    () =>
      letModalVisible &&
      [...users, ...groups]?.length > 0 && (
        <View
          style={[
            styles.userListContainer,
            {marginTop: searchFieldHeight + 20},
          ]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[...users, ...groups]}
            keyboardShouldPersistTaps={'always'}
            style={{paddingTop: hp(1)}}
            ListFooterComponent={() => <View style={{height: hp(6)}} />}
            renderItem={renderTagUsersAndGroups}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ),
    [
      groups,
      letModalVisible,
      renderTagUsersAndGroups,
      searchFieldHeight,
      users,
    ],
  );

  const onKeyPress = useCallback(
    ({nativeEvent}) => {
      if (
        nativeEvent.key === 'Backspace' &&
        searchText[currentTextInputIndex - 1] === '@'
      ) {
        setLastTagStartIndex(null);
        setLetModalVisible(false);
      }
    },
    [currentTextInputIndex, searchText],
  );

  const onSelectionChange = useCallback((e) => {
    setCurrentTextInputIndex(e?.nativeEvent?.selection?.end);
  }, []);

  const onImagePress = useCallback(() => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true,
      maxFiles: MAX_UPLOAD_POST_ASSETS - (selectImage?.length ?? 0),
    }).then((image) => {
      const pickedData = getPickedData(image, selectImage?.length);
      let allSelectData = [];
      const secondData = [];
      if (selectImage.length > 0) {
        pickedData.filter((dataItem) => {
          // const filter_data = selectImage.filter((imageItem) => imageItem.filename === dataItem.filename);
          // if (filter_data.length === 0) {
          secondData.push(dataItem);
          // }
          return null;
        });
        allSelectData = [...selectImage, ...secondData];
        setSelectImage(allSelectData);
      } else {
        setSelectImage(pickedData);
      }
    });
  }, [selectImage]);

  const onSelectMatch = useCallback(
    (selectedMatch) => {
      const tagsArray = [];
      if (selectedMatch?.length > 0) {
        selectedMatch.map((gameTagItem) => {
          const entity_data = {};
          const jsonData = {
            entity_type: 'game',
            entity_id: gameTagItem?.game_id,
          };
          jsonData.entity_data = getTaggedEntityData(
            entity_data,
            gameTagItem,
            'game',
          );
          const isExist = tagsOfEntity.some(
            (item) => item?.entity_id === gameTagItem?.game_id,
          );
          if (!isExist) tagsArray.push(jsonData);
          textInputRef.current.focus();
          return null;
        });
        setLetModalVisible(false);
        setTagsOfEntity([...tagsOfEntity, ...tagsArray]);
      }
    },
    [tagsOfEntity],
  );

  const removeTaggedGame = useCallback(
    (taggedGame) => {
      const gData = _.cloneDeep(tagsOfEntity);
      const filterData = gData?.filter(
        (item) => item?.entity_id !== taggedGame?.entity_id,
      );
      setTagsOfEntity([...filterData]);
    },
    [tagsOfEntity],
  );

  const renderSelectedGame = useCallback(
    ({item}) => (
      <View style={{marginRight: 15}}>
        <TCGameCard
          onPress={() => removeTaggedGame(item)}
          isSelected={true}
          data={item?.entity_data}
          showSelectionCheckBox={true}
        />
      </View>
    ),
    [removeTaggedGame],
  );

  const renderGameTags = useMemo(
    () => (
      <FlatList
        style={{paddingVertical: 15}}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 15, marginVertical: 15}}
        pagingEnabled={true}
        horizontal={true}
        data={tagsOfEntity?.filter((item) => item?.entity_type === 'game')}
        renderItem={renderSelectedGame}
        keyExtractor={(item) => item?.entity_id}
      />
    ),
    [renderSelectedGame, tagsOfEntity],
  );

  const renderSelectedImageList = useMemo(
    () =>
      selectImage.length > 0 && (
        <FlatList
          data={selectImage}
          horizontal={true}
          // scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
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
          ItemSeparatorComponent={() => <View style={{width: wp('1%')}} />}
          style={{paddingVertical: 10, marginHorizontal: wp('3%')}}
          keyExtractor={(item, index) => index.toString()}
        />
      ),
    [selectImage],
  );
  const renderWhoCan = ({item}) => (
    <>
      <TouchableOpacity
        style={[
          styles.listItem,
          privacySetting.value === item.value
            ? {backgroundColor: colors.privacyBgColor}
            : {},
        ]}
        onPress={() => {
          setPrivacySetting(item);
          setTimeout(() => {
            setVisibleWhoModal(false);
          }, 300);
        }}>
        <View style={[styles.icon, {marginRight: 10}]}>
          <Image source={item.icon} style={styles.image} />
        </View>
        <Text style={styles.languageList}>{item.text}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.editPost}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() => {
          if (searchText.trim().length === 0 && selectImage.length === 0) {
            Alert.alert(strings.writeText);
          } else {
            setloading(false);

            const tagData = JSON.parse(JSON.stringify(tagsOfEntity));
            const format_tagged_data = JSON.parse(JSON.stringify(tagsOfEntity));
            format_tagged_data.map(async (item, index) => {
              const isThere =
                item?.entity_type !== 'game'
                  ? searchText.includes(
                      item?.entity_data?.tagged_formatted_name?.replace(
                        / /g,
                        '',
                      ),
                    )
                  : true;
              if (!isThere) format_tagged_data.splice(index, 1);
              return null;
            });
            // eslint-disable-next-line no-param-reassign
            tagData.forEach((tData) => delete tData.entity_data);
            navigation.goBack();

            const who_can_see = {...privacySetting};
            if (privacySetting.value === 2) {
              if (
                ['team', 'club', 'league'].includes(authContext.entity.role)
              ) {
                who_can_see.group_ids = [authContext.entity.uid];
              }
            }

            onPressDone(
              selectImage,
              searchText,
              data,
              tagData,
              who_can_see,
              format_tagged_data,
            );
          }
        }}
      />

      <ActivityLoader visible={loading} />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
        <View style={styles.userDetailView}>
          <Image
            style={styles.background}
            source={userImage ? {uri: userImage} : images.profilePlaceHolder}
          />
          <View style={styles.userTxtView}>
            <Text style={styles.userTxt}>{userName}</Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 15, marginBottom: 15, zIndex: 100}}>
          <TextInput
            ref={textInputRef}
            onLayout={(event) =>
              setSearchFieldHeight(event?.nativeEvent?.layout?.height)
            }
            placeholder={strings.whatsGoingText}
            placeholderTextColor={colors.userPostTimeColor}
            onSelectionChange={onSelectionChange}
            onKeyPress={onKeyPress}
            onChangeText={(text) => setSearchText(text)}
            style={styles.textInputField}
            multiline={true}
            autoCapitalize="none"
            textAlignVertical={'top'}>
            <ParsedText
              parse={[{pattern: tagRegex, renderText: renderTagText}]}
              childrenProps={{allowFontScaling: false}}>
              {searchText}
            </ParsedText>
          </TextInput>
        </View>

        {renderUrlPreview}
        {renderSelectedImageList}
        {renderGameTags}
        {renderModalTagEntity}

        <View style={styles.bottomSafeAreaStyle}>
          <View style={styles.bottomImgView}>
            <TouchableOpacity
              style={styles.onlyMeViewStyle}
              onPress={() => setVisibleWhoModal(true)}>
              <ImageButton
                source={images.lock}
                imageStyle={{width: 30, height: 30}}
                onImagePress={() => setVisibleWhoModal(true)}
              />
              <Text style={styles.onlyMeTextStyle}>{privacySetting.text}</Text>
            </TouchableOpacity>
            <View
              style={[
                styles.onlyMeViewStyle,
                {flex: 1, justifyContent: 'flex-end'},
              ]}>
              {selectImage?.length < MAX_UPLOAD_POST_ASSETS && (
                <ImageButton
                  source={images.pickImage}
                  imageStyle={{width: 30, height: 30}}
                  onImagePress={onImagePress}
                />
              )}
              <ImageButton
                source={images.tagImage}
                imageStyle={{width: 30, height: 30, marginLeft: 10}}
                onImagePress={() => {
                  navigation.navigate('UserTagSelectionListScreen', {
                    data,
                    onPressDone,
                    route,
                    comeFrom: 'EditPostScreen',
                    onSelectMatch,
                    taggedData: JSON.parse(JSON.stringify(tagsOfEntity)).map(
                      (obj) => ({
                        city: obj.entity_data.city,
                        full_name: obj.entity_data.full_name,
                        entity_id: obj.entity_id,
                        entity_type: obj.entity_type,
                      }),
                    ),
                  });
                }}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <CustomModalWrapper
        isVisible={visibleWhoModal}
        closeModal={() => setVisibleWhoModal(false)}
        modalType={ModalTypes.style2}
        containerStyle={{paddingTop: 15, paddingHorizontal: 30}}>
        <Text style={styles.modalTitile}>{strings.whoCanSeePost}</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={
            ['user', 'player'].includes(authContext.entity.role)
              ? whoCanDataSourceUser
              : whoCanDataSourceGroup
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderWhoCan}
        />
      </CustomModalWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 10,
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

  bottomSafeAreaStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteColor,
    elevation: 9,
    shadowColor: colors.blackColor,
    shadowOpacity: 0.1608,
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
    shadowOffset: {width: 0, height: 2},
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
  icon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalTitile: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginBottom: 15,
  },
  listItem: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  languageList: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
export default EditPostScreen;
