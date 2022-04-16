/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  memo,
  useState,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {StyleSheet, View, Alert, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import NewsFeedList from './NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import {
  createPost,
  createReaction,
  deletePost,
  getNewsFeed,
  getNewsFeedNextList,
  updatePost,
} from '../../api/NewsFeeds';
import colors from '../../Constants/Colors';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import AuthContext from '../../auth/context';
import NewsFeedShimmer from '../../components/shimmer/newsFeed/NewsFeedShimmer';
import {ImageUploadContext} from '../../context/GetContexts';
import Header from '../../components/Home/Header';
import fonts from '../../Constants/Fonts';
import {widthPercentageToDP as wp} from '../../utils';
import strings from '../../Constants/String';
import {getShortsList, getSportsList} from '../../api/Games'; // getRecentGameDetails

const FeedsScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const imageUploadContext = useContext(ImageUploadContext);
  const [postData, setPostData] = useState([]);
  const [firstTimeLoading, setFirstTimeLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [isNextDataLoading, setIsNextDataLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [pullRefresh, setPullRefresh] = useState(false);
  const [feedCalled, setFeedCalled] = useState(false);
  const galleryRef = useRef();
  const [isAdmin, setIsAdmin] = useState(true);
  const [sports, setSports] = useState([]);

  useEffect(() => {
    setFirstTimeLoading(true);
    const entity = authContext.entity;
    setCurrentUserDetail(entity.obj || entity.auth.user);
    getNewsFeed(authContext)
      .then((response) => {
        setFeedCalled(true);
        setFirstTimeLoading(false);
        setPostData([...response.payload.results]);
      })
      .catch((e) => {
        setFirstTimeLoading(false);
        setTimeout(() => Alert.alert('', e.message), 100);
      });
  }, [authContext, authContext.entity]);
  useEffect(() => {
    getSportsList(authContext).then((res) => {
      const sport = [];
      res.payload.map((item) =>
        sport.push({
          label: item?.sport_name,
          value: item?.sport_name.toLowerCase(),
        }),
      );
      setSports([...sport]);
    });
  }, [authContext]);

  const onThreeDotPress = useCallback(() => {
    navigation.navigate('EntitySearchScreen', {
      sportsList: sports,
    });
  }, [navigation]);

  const createPostAfterUpload = useCallback(
    (dataParams) => {
      console.log('create post -> feedsScreen');
      createPost(dataParams, authContext)
        .then((response) => {
          setPostData((pData) => [response.payload, ...pData]);
        })
        .catch((e) => {
          Alert.alert('', e.messages);
        });
    },
    [authContext],
  );

  const onPressDone = useCallback(
    (data, postDesc, tagsOfEntity, format_tagged_data = []) => {
      let dataParams = {};
      const entityID = currentUserDetail?.group_id  ?? currentUserDetail?.user_id;
      if (entityID !== authContext.entity.uid) {
        if (
          currentUserDetail?.entity_type === 'team' ||
          currentUserDetail?.entity_type === 'club'
        ) {
          dataParams.group_id = currentUserDetail?.group_id;
          dataParams.feed_type = currentUserDetail?.entity_type;
        }
        if (
          currentUserDetail?.entity_type === 'user' ||
          currentUserDetail?.entity_type === 'player'
        ) {
          dataParams.user_id = currentUserDetail?.user_id;
        }
      }
      if (postDesc.trim().length > 0 && data?.length === 0) {
         dataParams = {
           ...dataParams,
          text: postDesc,
          tagged: tagsOfEntity ?? [],
          format_tagged_data,
        };
       
        createPostAfterUpload(dataParams);
      } else if (data) {
        const imageArray = data.map((dataItem) => dataItem);
         dataParams = {
           ...dataParams,
          text: postDesc && postDesc,
          attachments: [],
          tagged: tagsOfEntity ?? [],
          format_tagged_data,
        };
        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
      }
    },
    [authContext, createPostAfterUpload, imageUploadContext],
  );

  const onFeedPlusPress = useCallback(() => {
    navigation.navigate('WritePostScreen', {
      postData: currentUserDetail,
      onPressDone,
      selectedImageList: [],
    });
  }, [currentUserDetail, navigation, onPressDone]);

  const topRightButton = useMemo(
    () => (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={{marginRight: 10}} onPress={onFeedPlusPress}>
          <FastImage
            source={images.feedPlusIcon}
            resizeMode={'contain'}
            style={styles.rightImageStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onThreeDotPress}>
          <FastImage
            source={images.messageSearchButton2}
            resizeMode={'contain'}
            style={styles.rightImageStyle}
          />
        </TouchableOpacity>
      </View>
    ),
    [onFeedPlusPress, onThreeDotPress],
  );

  const updatePostAfterUpload = useCallback(
    (dataParams) => {
      updatePost(dataParams, authContext)
        .then((response) => {
          const pData = [...postData];
          const pDataIndex = postData?.findIndex(
            (item) => item?.id === dataParams?.activity_id,
          );
          pData[pDataIndex] = response?.payload;
          setPostData([...pData]);
        })
        .catch((e) => {
          Alert.alert(strings.alertmessagetitle, e.messages);
        });
    },
    [authContext, postData],
  );

  const editPostDoneCall = useCallback(
    (data, postDesc, selectEditItem, tagData, format_tagged_data) => {
      const alreadyUrlDone = [];
      const createUrlData = [];
      console.log('editPostDoneCall', editPostDoneCall);
      if (postDesc.trim().length > 0 && data?.length === 0) {
        const dataParams = {
          activity_id: selectEditItem.id,
          text: postDesc,
          tagged: tagData ?? [],
          format_tagged_data,
        };
        updatePostAfterUpload(dataParams);
      } else if (data) {
        if (data.length > 0) {
          data.map((dataItem) => {
            if (dataItem.thumbnail) {
              alreadyUrlDone.push(dataItem);
            } else {
              createUrlData.push(dataItem);
            }
            return null;
          });
        }
        const dataParams = {
          activity_id: selectEditItem.id,
          text: postDesc,
          tagged: tagData ?? [],
          format_tagged_data,
          attachments: [...alreadyUrlDone],
        };
        if (createUrlData?.length > 0) {
          const imageArray = createUrlData.map((dataItem) => dataItem);
          imageUploadContext.uploadData(
            authContext,
            dataParams,
            imageArray,
            updatePostAfterUpload,
          );
        } else {
          updatePostAfterUpload(dataParams);
        }
      }
    },
    [authContext, imageUploadContext, updatePostAfterUpload],
  );

  const onDeletePost = useCallback(
    (item) => {
      setloading(true);
      const params = {
        activity_id: item.id,
      };
      if (
        ['team', 'club', 'league'].includes(
          authContext?.entity?.obj?.entity_type,
        )
      ) {
        params.entity_type = authContext?.entity?.obj?.entity_type;
        params.entity_id = authContext?.entity?.uid;
      }
      deletePost(params, authContext)
        .then((response) => {
          if (response.status) {
            const pData = postData.filter(
              (postItem) => postItem?.id !== params?.activity_id,
            );
            setPostData([...pData]);
          }
          setloading(false);
        })
        .catch(() => {
          setloading(false);
        });
    },
    [authContext, postData],
  );

  const onRefreshPress = useCallback(() => {
    setIsMoreLoading(false);
    setIsNextDataLoading(true);
    setFooterLoading(false);
    setPullRefresh(true);
    getNewsFeed(authContext)
      .then((response) => {
        setPostData([...response.payload.results]);
        setPullRefresh(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setPullRefresh(false);
      });
  }, [authContext]);

  const onLikePress = useCallback(
    (item) => {
      const bodyParams = {
        reaction_type: 'clap',
        activity_id: item.id,
      };
      createReaction(bodyParams, authContext)
        .then((res) => {
          const pData = _.cloneDeep(postData);
          const pIndex = pData.findIndex((pItem) => pItem?.id === item?.id);
          const likeIndex =
            pData[pIndex].own_reactions?.clap?.findIndex(
              (likeItem) => likeItem?.user_id === authContext?.entity?.uid,
            ) ?? -1;
          if (likeIndex === -1) {
            pData[pIndex].own_reactions = {...pData?.[pIndex]?.own_reactions};
            pData[pIndex].own_reactions.clap = [
              ...pData?.[pIndex]?.own_reactions?.clap,
            ];
            pData[pIndex].own_reactions.clap.push(res?.payload);
            pData[pIndex].reaction_counts = {
              ...pData?.[pIndex]?.reaction_counts,
            };
            pData[pIndex].reaction_counts.clap =
              pData?.[pIndex]?.reaction_counts?.clap + 1 ?? 0;
          } else {
            pData[pIndex].own_reactions = {...pData?.[pIndex]?.own_reactions};
            pData[pIndex].own_reactions.clap = [
              ...pData?.[pIndex]?.own_reactions?.clap,
            ];
            pData[pIndex].own_reactions.clap = pData?.[
              pIndex
            ]?.own_reactions?.clap?.filter(
              (likeItem) => likeItem?.user_id !== authContext?.entity?.uid,
            );
            pData[pIndex].reaction_counts = {
              ...pData?.[pIndex]?.reaction_counts,
            };
            pData[pIndex].reaction_counts.clap =
              pData?.[pIndex]?.reaction_counts?.clap - 1 ?? 0;
          }
          setPostData([...pData]);
        })
        .catch((e) => {
          console.log('Townsucp', e.message);
        });
    },
    [authContext, postData],
  );

  const onEndReached = useCallback(() => {
    setIsMoreLoading(true);
    setFooterLoading(true);
    const id_lt = postData?.[postData.length - 1]?.id;
    if (id_lt && isMoreLoading && isNextDataLoading) {
      getNewsFeedNextList(id_lt, authContext)
        .then((response) => {
          if (response) {
            if (response.payload.next === '') {
              setIsNextDataLoading(false);
            }
            setIsMoreLoading(false);
            setFooterLoading(false);
            setPostData([...postData, ...response.payload.results]);
          }
        })
        .catch(() => {
          setFooterLoading(false);
        });
    }
  }, [authContext, isMoreLoading, isNextDataLoading, postData]);

  const updateCommentCount = useCallback(
    (updatedComment) => {
      const pData = _.cloneDeep(postData);
      const pIndex = pData?.findIndex(
        (item) => item?.id === updatedComment?.id,
      );
      if (pIndex !== -1) {
        pData[pIndex].reaction_counts = {...pData?.[pIndex]?.reaction_counts};
        pData[pIndex].reaction_counts.comment = updatedComment?.count;
        setPostData([...pData]);
      }
    },
    [postData],
  );

  const renderImageProgress = useMemo(() => <ImageProgress />, []);

  const renderNewsFeedList = useMemo(
    () => (
      <NewsFeedList
        updateCommentCount={updateCommentCount}
        pullRefresh={pullRefresh}
        onDeletePost={onDeletePost}
        navigation={navigation}
        postData={postData}
        onEditPressDone={editPostDoneCall}
        onRefreshPress={onRefreshPress}
        footerLoading={footerLoading && isNextDataLoading}
        onLikePress={onLikePress}
        onEndReached={onEndReached}
        feedAPI={feedCalled}
      />
    ),
    [
      editPostDoneCall,
      feedCalled,
      footerLoading,
      isNextDataLoading,
      navigation,
      onDeletePost,
      onEndReached,
      onLikePress,
      onRefreshPress,
      postData,
      pullRefresh,
      updateCommentCount,
    ],
  );

  const renderTopHeader = useMemo(
    () => (
      <>
        <Header
          showBackgroundColor={true}
          leftComponent={
            <View>
              <FastImage
                source={images.tc_message_top_icon}
                resizeMode={'contain'}
                style={styles.backImageStyle}
              />
            </View>
          }
          centerComponent={<Text style={styles.eventTitleTextStyle}>Feed</Text>}
          rightComponent={topRightButton}
        />
        <View style={styles.separateLine} />
      </>
    ),
    [topRightButton],
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {renderTopHeader}
      {firstTimeLoading ? <NewsFeedShimmer /> : renderNewsFeedList}
      {renderImageProgress}
    </View>
  );
};

// const SingleSidedShadowBox = ({ children, style }) => (
//   <View style={[styles.shadowContainer, style]}>
//     { children }
//   </View>
// );

const styles = StyleSheet.create({
  // shadowContainer: {
  //   overflow: 'hidden',
  //   paddingBottom: 5,
  // },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  separateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    width: wp(100),
  },
  eventTitleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  rightImageStyle: {
    height: 25,
    width: 25,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  backImageStyle: {
    height: 35,
    width: 35,
  },
});

export default memo(FeedsScreen);
