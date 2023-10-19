import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  BackHandler,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';
import _ from 'lodash';
import ParsedText from 'react-native-parsed-text';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {displayLocation, getPostData, getTaggedEntityData} from '../../utils';
import {getPickedData, MAX_UPLOAD_POST_ASSETS} from '../../utils/imageAction';
import {getGroupIndex, getUserIndex} from '../../api/elasticSearch';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';
import {
  whoCanDataSourceGroup,
  whoCanDataSourceUser,
} from '../../utils/constant';
import ScreenHeader from '../../components/ScreenHeader';
import GroupIcon from '../../components/GroupIcon';
import Verbs from '../../Constants/Verbs';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {
  hashTagRegex,
  ModalTypes,
  tagRegex,
  urlRegex,
} from '../../Constants/GeneralConstants';
import {createRePost} from '../../api/NewsFeeds';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import FeedMedia from '../../components/newsFeed/feed/FeedMedia';
import FeedProfile from '../../components/newsFeed/feed/FeedProfile';
import NewsFeedDescription from '../../components/newsFeed/NewsFeedDescription';
import CustomURLPreview from '../../components/account/CustomURLPreview';
import MatchCard from './MatchCard';

const WritePostScreen = ({navigation, route}) => {
  const textInputRef = useRef();
  const videoPlayerRef = useRef();
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const {postData} = route.params;

  const [currentTextInputIndex, setCurrentTextInputIndex] = useState(0);
  const [lastTagStartIndex, setLastTagStartIndex] = useState(null);
  const [searchFieldHeight, setSearchFieldHeight] = useState();
  const [tagsOfEntity, setTagsOfEntity] = useState([]);
  const [tagsOfGame, setTagsOfGame] = useState([]);
  const [visibleWhoModal, setVisibleWhoModal] = useState(false);

  const [searchTag, setSearchTag] = useState();
  const [searchText, setSearchText] = useState('');
  const [selectImage, setSelectImage] = useState(
    route.params.selectedImageList ?? [],
  );
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchGroups, setSearchGroups] = useState([]);
  const [letModalVisible, setLetModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showPreviewForUrl, setShowPreviewForUrl] = useState(true);
  const [tagModalHeight, setTagModalHeight] = useState(0);
  const [privacySetting, setPrivacySetting] = useState({
    text: strings.everyoneTitleText,
    value: 0,
  });

  const flatListRef = useRef();

  const handleRepost = () => {
    const item = {...route.params.repostData};

    if (typeof item.object === 'string') {
      const body = {
        activity_id: item.id,
        post_type: Verbs.repostVerb,
        text: searchText,
      };

      createRePost(body, authContext)
        .then(() => {
          navigation.goBack();
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const handleDone = async () => {
    if (searchText.trim().length === 0 && selectImage.length === 0) {
      Alert.alert(strings.writeTextOrImage, '', [{text: strings.okTitleText}]);
    } else {
      const tagData = tagsOfEntity.map((tag) => ({
        entity_id: tag.entity_id,
        entity_type: 'privatetimeline',
      }));
      const format_tagged_data = [...tagsOfEntity];
      const who_can_see = {...privacySetting};

      if (privacySetting.value === 2) {
        if (
          [
            Verbs.entityTypeTeam,
            Verbs.entityTypeClub,
            Verbs.entityTypeLeague,
          ].includes(authContext.entity.role)
        ) {
          who_can_see.group_ids = [authContext.entity.uid];
        }
      }
      if (route.params?.sendCallBack) {
        route.params.onPressDone(
          selectImage,
          searchText,
          tagData,
          who_can_see,
          format_tagged_data,
        );
        if (route?.params?.comeFrom) {
          navigation.pop(2);
        } else {
          navigation.goBack();
        }
      }
      let dataParams = {};
      const entityID = postData.group_id ?? postData.user_id;
      if (entityID !== authContext.entity.uid) {
        if (
          postData.entity_type === Verbs.entityTypeTeam ||
          postData.entity_type === Verbs.entityTypeClub
        ) {
          dataParams.group_id = postData.group_id;
          dataParams.feed_type = postData.entity_type;
        }
        if (
          postData.entity_type === Verbs.entityTypeUser ||
          postData.entity_type === Verbs.entityTypePlayer
        ) {
          dataParams.user_id = postData.user_id;
        }
      }

      const imageArray = selectImage.length
        ? selectImage.map((dataItem) => dataItem)
        : [];
      dataParams = {
        ...dataParams,
        text: searchText,
        attachments: [],
        tagged: tagData ?? [],
        who_can_see,
        format_tagged_data,
      };

      if (route.params?.comeFrom === 'HomeScreen') {
        navigation.navigate('HomeStack', {
          screen: 'HomeScreen',
          params: {
            isCreatePost: true,
            dataParams,
            imageArray,
            ...route.params.routeParams,
          },
        });
      } else if (route.params?.comeFrom === 'UserGalleryScreen') {
        navigation.navigate('HomeStack', {
          screen: 'UserGalleryScreen',
          params: {
            isCreatePost: true,
            dataParams,
            imageArray,
            ...route.params.routeParams,
          },
        });
      } else if (route.params?.comeFrom) {
        navigation.navigate(route.params?.comeFrom, {
          isCreatePost: true,
          dataParams,
          imageArray,
          ...route.params.routeParams,
        });
      } else {
        navigation.navigate('App', {
          screen: 'NewsFeed',
          params: {
            isCreatePost: true,
            dataParams,
            imageArray,
          },
        });
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        textInputRef.current.focus();
      }, 100);
    }

    return () => {
      Keyboard.dismiss();
    };
  }, [isFocused]);

  useEffect(() => {
    if (searchText[currentTextInputIndex - 1] === '@') {
      setLastTagStartIndex(currentTextInputIndex - 1);
    }
    if (searchText[currentTextInputIndex - 1] === ' ') {
      setLastTagStartIndex(null);
    }
  }, [searchText, currentTextInputIndex]);

  useEffect(() => {
    if (route.params?.selectedTagList) {
      const modifiedSearch = searchText;
      const tagsArray = [...route.params.selectedTagList];

      if (tagsArray.length > 0) {
        let tagName = '';
        tagsArray.forEach((tag) => {
          const obj = tagsOfEntity.find(
            (item) => item.entity_id === tag.entity_id,
          );

          if (!obj) {
            tagName += `${tag.entity_data.tagged_formatted_name} `;
          }
        });

        const words = modifiedSearch.split(' ');

        const finalWords = [];
        words.forEach((word) => {
          if (!word) {
            return;
          }
          if (word.includes('@')) {
            const isExist = tagsArray.find(
              (ele) =>
                ele.entity_data.tagged_formatted_name?.trim() === word.trim(),
            );

            if (isExist) {
              finalWords.push(word);
            }
          } else {
            finalWords.push(word);
          }
        });

        if (tagName) {
          const tags = tagName.split(' ').filter((tag) => tag);

          tags.forEach((ele) => {
            const obj = tagsArray.find(
              (item) =>
                item.entity_data.tagged_formatted_name?.trim() === ele.trim(),
            );
            if (obj) {
              finalWords.push(obj.entity_data.tagged_formatted_name?.trim());
            }
          });
        }

        setSearchText(finalWords.join(' '));
      } else {
        const words = modifiedSearch.split(' ');
        const finalWords = words.filter((item) => item && !item.includes('@'));
        setSearchText(finalWords.join(' '));
      }

      setTagsOfEntity(tagsArray);
      setLetModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.selectedTagList]);

  useEffect(() => {
    if (searchText) {
      const tags = searchText.match(tagRegex);

      if (tags) {
        const list = [];
        if (tags?.length > 0) {
          tags.forEach((tagName) => {
            const obj = tagsOfEntity.find(
              (item) =>
                item.entity_data?.tagged_formatted_name?.trim() === tagName,
            );

            if (obj) {
              list.push(obj);
            }
          });
        }

        setTagsOfEntity(list);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    if (route.params?.selectedMatchTags?.length > 0) {
      const matchList = route.params.selectedMatchTags.map((match) => ({
        matchData: {...match},
        game_id: match.game_id,
        entity_type: Verbs.entityTypeGame,
      }));
      setTagsOfGame(matchList);
    }
  }, [route.params?.selectedMatchTags]);

  useEffect(() => {
    if (searchText.length > 0) {
      if (searchText[currentTextInputIndex - 1] === '@') {
        setLetModalVisible(true);
      }

      const lastString = searchText.substr(0, currentTextInputIndex);
      if (lastString) {
        let str = '';
        if (lastString.includes('#')) {
          str = `#${lastString.split('#').reverse()?.[0]}`;
        } else {
          str = `@${lastString.split('@').reverse()?.[0]}`;
        }
        setSearchTag(str);
      }
    } else {
      setTagsOfEntity([]);
      setLetModalVisible(false);
    }
  }, [currentTextInputIndex, searchText]);

  useEffect(() => {
    if (route?.params?.comeFrom === 'LocalHomeScreen') {
      Alert.alert(strings.verticalVideo);
    }
  }, [route?.params?.comeFrom]);

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
    if (letModalVisible) {
      const txt = searchTag.split('@');
      const searchValue = txt[txt.length - 1];
      searchFilterFunction(searchValue);
    }
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

  const onTagPress = (item = {}) => {
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
      entity_name = _.startCase(_.toLower(item?.group_name))?.replace(/ /g, '');
      entity_data.group_id = item.group_id;
    } else {
      const fName = _.startCase(_.toLower(item?.first_name))?.replace(/ /g, '');
      const lName = _.startCase(_.toLower(item?.last_name))?.replace(/ /g, '');
      entity_name = `${fName}${lName}`;
      entity_data.user_id = item.user_id;
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
    if (!isExist) {
      tagsArray.push({
        entity_data,
        entity_id: item?.[entity_text],
        entity_type: jsonData?.entity_type,
      });
    }

    setTagsOfEntity([...tagsOfEntity, ...tagsArray]);
    setLetModalVisible(false);
    textInputRef.current.focus();
    setLastTagStartIndex(null);
  };

  const renderTagText = useCallback(
    (matchingString) => (
      <Text style={styles.tagText}>{`${matchingString}`}</Text>
    ),
    [],
  );

  const renderTagUsersAndGroups = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        onTagPress(item);
      }}
      style={styles.userListStyle}>
      <Image
        source={
          item?.thumbnail ? {uri: item?.thumbnail} : images.profilePlaceHolder
        }
        style={{borderRadius: 13, height: 25, width: 25}}
      />
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={{maxWidth: '80%'}}>
          <Text style={styles.userTextStyle} numberOfLines={1}>
            {item?.group_name
              ? item?.group_name
              : `${item.first_name} ${item.last_name}`}{' '}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text numberOfLines={1} style={styles.locationTextStyle}>
            {displayLocation(item)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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

  const renderModalTagEntity = () => {
    const arr = [];
    const data = [...users, ...groups];
    data.forEach((obj) => {
      const id = obj.group_id ?? obj.user_id ?? obj.entity_id;
      const item = tagsOfEntity.find((temp) => temp.entity_id === id);
      if (!item && id !== authContext.entity.uid) {
        arr.push(obj);
      }
    });

    if (letModalVisible && arr.length > 0) {
      return (
        <View
          style={[
            styles.userListContainer,
            // {marginTop: searchFieldHeight + 5},
            {
              top:
                searchFieldHeight > Dimensions.get('window').height * 0.5
                  ? searchFieldHeight - (tagModalHeight - 50)
                  : searchFieldHeight + 90,
            },
          ]}
          onLayout={(event) =>
            setTagModalHeight(event?.nativeEvent?.layout?.height)
          }>
          <FlatList
            data={arr}
            keyboardShouldPersistTaps={'always'}
            renderItem={renderTagUsersAndGroups}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    }
    return null;
  };

  const addStr = (str, index, stringToAdd) =>
    str.substring(0, index) + stringToAdd + str.substring(index, str.length);

  const renderUrlPreview = () => {
    if (searchText.length > 0) {
      let desc = searchText;
      const position = desc.search(urlRegex);
      if (position !== -1 && desc.substring(position)?.startsWith('www')) {
        desc = addStr(desc, position, 'http://');
      }

      return desc &&
        showPreviewForUrl &&
        selectImage.length === 0 &&
        position !== -1 ? (
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <CustomURLPreview text={desc} />
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setShowPreviewForUrl(false)}>
            <Image source={images.roundCross} style={styles.image} />
          </TouchableOpacity>
        </View>
      ) : null;
    }
    return null;
  };

  const onImageItemPress = useCallback(
    (item) => {
      const imgs = [...selectImage];
      const idx = imgs.indexOf(item);
      if (idx > -1) {
        imgs.splice(idx, 1);
      }
      setSelectImage(imgs);
    },
    [selectImage],
  );

  const renderSelectedImageList = () =>
    selectImage.length > 0 ? (
      <FlatList
        data={selectImage}
        keyExtractor={(item, index) => index.toString()}
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{marginBottom: 15}}
        onContentSizeChange={() => {
          flatListRef.current.scrollToEnd({animated: true});
        }}
        renderItem={({item, index}) => {
          const type = item.type ?? item.mime;
          const mediaType = type.split('/')[0];
          if (mediaType === Verbs.mediaTypeImage) {
            return (
              <View
                style={[
                  styles.selectImage,
                  index === 0 ? {marginLeft: 15} : {},
                  index === selectImage.length - 1 ? {marginRight: 15} : {},
                ]}>
                <Image
                  style={[
                    styles.image,
                    {resizeMode: 'cover', borderRadius: 10},
                  ]}
                  source={{uri: item.path ?? item.thumbnail}}
                />
                <TouchableOpacity
                  style={[styles.closeIcon, {top: 5, right: 5}]}
                  onPress={() => onImageItemPress(item)}>
                  <Image source={images.roundCross} style={styles.image} />
                </TouchableOpacity>
              </View>
            );
          }
          if (mediaType === Verbs.mediaTypeVideo) {
            return (
              <View
                style={[
                  styles.selectImage,
                  index === 0 ? {marginLeft: 15} : {},
                ]}>
                <Video
                  ref={videoPlayerRef}
                  paused
                  muted
                  source={{uri: item.path || item.thumbnail}}
                  style={[
                    styles.image,
                    {resizeMode: 'cover', borderRadius: 10},
                  ]}
                  resizeMode={'cover'}
                  onLoad={() => {
                    videoPlayerRef.current.seek(0);
                  }}
                />
                <TouchableOpacity
                  style={[styles.closeIcon, {top: 5, right: 5, zIndex: 1}]}
                  onPress={() => onImageItemPress(item)}>
                  <Image source={images.roundCross} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.playPauseBtn}>
                  <Image source={images.videoPlayIcon} style={styles.image} />
                </TouchableOpacity>
              </View>
            );
          }
          return null;
        }}
      />
    ) : null;

  const onImagePress = () => {
    ImagePicker.openPicker({
      showsSelectedCount: true,
      multiple: true,
      maxFiles: MAX_UPLOAD_POST_ASSETS - (selectImage.length ?? 0),
    })
      .then((data) => {
        let temp = [];
        temp = data.map((obj) => {
          if (obj?.filename?.includes('.MOV') && Platform.OS === 'ios') {
            return {
              ...obj,
              width: obj.height,
              height: obj.width,
            };
          }
          return obj;
        });

        const pickedData = getPickedData(temp, selectImage.length);

        let allSelectData = [];
        const secondData = [];
        if (selectImage.length > 0) {
          pickedData.map((dataItem) => {
            // const filter_data = selectImage.filter((imageItem) => imageItem?.path === dataItem?.path);
            // if (filter_data?.length === 0) {
            secondData.push(dataItem);
            // }
            return null;
          });
          allSelectData = [...selectImage, ...secondData];
          setSelectImage(allSelectData);
        } else {
          setSelectImage(pickedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        }}>
        <View style={[styles.icon, {marginRight: 10}]}>
          <Image source={item.icon} style={styles.image} />
        </View>
        <Text style={styles.languageList}>{item.text}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </>
  );

  const renderImageProgress = useMemo(() => <ImageProgress />, []);

  const handleBackPress = useCallback(() => {
    if (route.params.isRepost) {
      Alert.alert('', strings.discardRepostText, [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {
          text: strings.remove,
          style: 'destructive',
          onPress: () =>
            navigation.navigate('App', {
              screen: 'NewsFeed',
            }),
        },
      ]);
    } else if (
      searchText ||
      selectImage.length > 0 ||
      tagsOfEntity.length > 0
    ) {
      Alert.alert('', strings.discardPost, [
        {
          text: strings.goBack,
          style: 'default',
        },
        {
          text: strings.discardText,
          style: 'destructive',
          onPress: () =>
            navigation.navigate('App', {
              screen: 'NewsFeed',
            }),
        },
      ]);
    } else if (route.params?.comeFrom === 'HomeScreen') {
      navigation.navigate('HomeStack', {
        screen: 'HomeScreen',
        params: {
          ...route.params.routeParams,
        },
      });
    } else if (route.params?.comeFrom === 'UserGalleryScreen') {
      navigation.navigate('HomeStack', {
        screen: 'UserGalleryScreen',
        params: {
          ...route.params.routeParams,
        },
      });
    } else {
      navigation.navigate('App', {
        screen: 'NewsFeed',
      });
    }
  }, [
    navigation,
    route.params.isRepost,
    searchText,
    selectImage,
    tagsOfEntity,
    route.params?.comeFrom,
    route.params.routeParams,
  ]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  const onCloseModal = () => {
    setVisibleWhoModal(false);
  };

  const renderPost = () => {
    const repostData = route.params.repostData;
    const objData = getPostData(repostData);

    return (
      <View style={{paddingHorizontal: 15}}>
        <FeedMedia data={objData} item={repostData} navigation={navigation} />
        <View style={styles.repostContainer}>
          <FeedProfile
            time={repostData.time}
            data={repostData.actor.data}
            isRepost
            showThreeDot={false}
          />
          <NewsFeedDescription
            descriptions={objData.text}
            numberOfLineDisplay={objData.attachments?.length > 0 ? 3 : 14}
            tagData={objData.format_tagged_data ?? []}
            navigation={navigation}
            isNewsFeedScreen
            descText={styles.repostText}
            descriptionTxt={styles.repostText}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.postTitle}
        leftIcon={images.backArrow}
        leftIconPress={handleBackPress}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() =>
          route.params.isRepost ? handleRepost() : handleDone()
        }
      />

      {renderImageProgress}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -25}
        style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.userDetailView}>
            <GroupIcon
              imageUrl={postData.thumbnail}
              entityType={postData.entity_type}
              groupName={postData.group_name}
              textstyle={{fontSize: 12}}
              containerStyle={styles.profileImage}
            />
            <View style={{flex: 0.9}}>
              <Text style={styles.userTxt}>
                {postData.full_name ?? postData.group_name}
              </Text>
            </View>
          </View>

          <View
            style={{paddingHorizontal: 15, marginBottom: 10, maxHeight: '70%'}}>
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
              textAlignVertical={'top'}
              maxLength={4000}
              scrollEnabled>
              <ParsedText
                parse={[
                  {pattern: tagRegex, renderText: renderTagText},
                  {pattern: hashTagRegex, renderText: renderTagText},
                  {pattern: urlRegex, renderText: renderTagText},
                ]}
                childrenProps={{allowFontScaling: false}}>
                {searchText}
              </ParsedText>
            </TextInput>
          </View>

          {route.params?.isRepost ? (
            renderPost()
          ) : (
            <View style={{marginTop: 15}}>
              {renderUrlPreview()}
              {renderSelectedImageList()}
              {tagsOfGame.length > 0 ? (
                <FlatList
                  data={tagsOfGame}
                  keyExtractor={(item, index) => index.toString()}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{paddingHorizontal: 15}}
                  horizontal
                  renderItem={({item}) => (
                    <View
                      style={{
                        width: Dimensions.get('window').width - 30,
                        flex: 1,
                        marginRight: 15,
                      }}>
                      <MatchCard item={item.matchData} />
                    </View>
                  )}
                />
              ) : null}
            </View>
          )}
        </View>
        {renderModalTagEntity()}
        <View style={styles.bottomSafeAreaStyle}>
          <TouchableOpacity
            style={styles.onlyMeViewStyle}
            onPress={() => setVisibleWhoModal(true)}>
            <View style={styles.icon}>
              <Image source={images.lock} style={styles.image} />
            </View>
            <Text style={styles.onlyMeTextStyle}>{privacySetting.text}</Text>
          </TouchableOpacity>

          <View
            style={[styles.onlyMeViewStyle, {justifyContent: 'space-between'}]}>
            {route.params.isRepost ? null : (
              <TouchableOpacity style={styles.icon}>
                <Image source={images.pollIcon} style={styles.image} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.icon, {marginHorizontal: 10}]}
              onPress={() => {
                navigation.navigate('UserTagSelectionListScreen', {
                  postData,
                  routeParams: route.params.isRepost ? {...route.params} : {},
                  gameTags: tagsOfGame,
                  tagsOfEntity,
                  comeFrom: 'WritePostScreen',
                });
              }}>
              <Image source={images.tagImage} style={styles.image} />
            </TouchableOpacity>

            {route.params.isRepost ? null : (
              <TouchableOpacity style={styles.icon} onPress={onImagePress}>
                <Image source={images.pickImage} style={styles.image} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
      <CustomModalWrapper
        isVisible={visibleWhoModal}
        closeModal={onCloseModal}
        modalType={ModalTypes.style1}
        title={strings.privacySettings}
        containerStyle={{
          paddingTop: 15,
          paddingHorizontal: 30,
        }}
        headerRightButtonText={strings.apply}
        onRightButtonPress={() => {
          setVisibleWhoModal(false);
          setPrivacySetting(privacySetting);
        }}
        ratio={1.7}>
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
  container: {
    flex: 1,
    paddingTop: 20,
  },
  userDetailView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  userTxt: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  tagText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.tagColor,
    fontFamily: fonts.RRegular,
  },
  textInputField: {
    padding: 0,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  onlyMeTextStyle: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.googleColor,
    fontFamily: fonts.RRegular,
    marginLeft: 5,
  },
  onlyMeViewStyle: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSafeAreaStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteColor,
    padding: 15,
    elevation: 9,
    shadowColor: colors.blackColor,
    shadowOpacity: 0.1608,
    shadowOffset: {
      height: -3,
      width: 0,
    },
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
  userTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 10,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationTextStyle: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    marginTop: 4,
    marginLeft: 5,
  },
  userListStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 15,
  },
  userListContainer: {
    zIndex: 100,
    backgroundColor: colors.lightGrayBackground,
    maxHeight: 280,
    width: Dimensions.get('window').width - 30,
    position: 'absolute',
    marginHorizontal: 15,
    top: 0,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1608,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 5,
    padding: 9,
  },
  languageList: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
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
  closeIcon: {
    width: 17,
    height: 17,
    position: 'absolute',
    right: 25,
    top: 10,
  },
  selectImage: {
    width: 111,
    height: 111,
    borderRadius: 10,

    marginLeft: 10,
  },
  repostContainer: {
    marginLeft: 5,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.grayBackgroundColor,
  },
  repostText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  playPauseBtn: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
  },
});
export default WritePostScreen;
