import React, {
  useEffect,
  memo,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {StyleSheet, View, Alert, Text, SafeAreaView, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import _ from 'lodash';
import {useIsFocused} from '@react-navigation/native';
import NewsFeedList from './NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import {
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
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import {getSportsList} from '../../api/Games'; // getRecentGameDetails
import TCAccountDeactivate from '../../components/TCAccountDeactivate';

const FeedsScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

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
  const [sports, setSports] = useState([]);
  const [sportArr, setSportArr] = useState([]);
  const [pointEvent] = useState('auto');

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: isFocused ? 'flex' : 'none',
      },
    });
  }, [navigation, isFocused]);

  const getFeeds = useCallback(
    (showLoader = true) => {
      if (showLoader) {
        setFirstTimeLoading(true);
      }
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
    },
    [authContext],
  );

  useEffect(() => {
    if (isFocused) {
      getFeeds();
    }
  }, [getFeeds, isFocused]);

  useEffect(() => {
    getSportsList(authContext).then((res) => {
      let sport = [];

      res.payload.map((item) => {
        sport = [...sport, ...item.format];
        return null;
      });
      setSportArr([...sport]);
      sport = [];
      res.payload.map((item) =>
        sport.push({
          label: item?.sport_name,
          value: item?.sport_name.toLowerCase(),
        }),
      );
      setSports([...sport]);
    });
  }, [authContext]);

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
    (
      data,
      postDesc,
      selectEditItem,
      tagData,
      who_can_see,
      format_tagged_data,
    ) => {
      const alreadyUrlDone = [];
      const createUrlData = [];

      if (postDesc.trim().length > 0 && data?.length === 0) {
        const dataParams = {
          activity_id: selectEditItem.id,
          text: postDesc,
          tagged: tagData ?? [],
          who_can_see,
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
          who_can_see,
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

  const renderNewsFeedList = () => (
    <NewsFeedList
      navigation={navigation}
      updateCommentCount={updateCommentCount}
      pullRefresh={pullRefresh}
      onDeletePost={onDeletePost}
      postData={postData}
      onEditPressDone={editPostDoneCall}
      onRefreshPress={onRefreshPress}
      footerLoading={footerLoading && isNextDataLoading}
      onLikePress={onLikePress}
      onEndReached={onEndReached}
      feedAPI={feedCalled}
      isNewsFeedScreen={true}
      entityDetails={currentUserDetail}
      fetchFeeds={() => getFeeds(false)}
    />
  );

  const RenderTopHeader = () => (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.headerTitle}>{strings.feedTitleText}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={[styles.headerIconContainer, {marginRight: 10}]}
          onPress={() => {
            navigation.navigate('WritePostScreen', {
              postData: currentUserDetail,
              selectedImageList: [],
            });
          }}>
          <Image source={images.feedPlusIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EntitySearchScreen', {
              sportsList: sports,
              sportsArray: sportArr,
            });
          }}
          style={styles.headerIconContainer}>
          <Image source={images.searchIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View
        style={{opacity: authContext.isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        <RenderTopHeader />
      </View>
      {authContext.isAccountDeactivated && <TCAccountDeactivate />}
      <View
        style={{flex: 1, opacity: authContext.isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        {firstTimeLoading ? <NewsFeedShimmer /> : renderNewsFeedList()}
        {renderImageProgress}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 11,
    paddingRight: 10,
    paddingLeft: 18,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1019,
    shadowRadius: 5,
    elevation: 5,

    top: 0,
    left: 0,
    right: 0,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  headerIconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default memo(FeedsScreen);
