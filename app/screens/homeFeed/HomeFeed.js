import React, {
    memo, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import {
    createPost,
    createReaction, deletePost, getUserPosts, updatePost,
} from '../../api/NewsFeeds';
import NewsFeedList from '../newsfeeds/NewsFeedList';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import uploadImages from '../../utils/imageAction';
import { getGallery } from '../../api/Users';
import WritePost from '../../components/newsFeed/WritePost';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';

const HomeFeed = ({
  onFeedScroll,
  refs,
  userID,
  setProgressBar,
  setDoneUploadCount,
  setTotalUploadCount,
  setGalleryData,
  navigation,
  progressStatus,
  cancelRequest,
  currentUserData,
  isAdmin,
  homeFeedHeaderComponent,
  currentTab,
}) => {
    const [fullScreenLoading, setFullScreenLoading] = useState(false);
    const authContext = useContext(AuthContext)
    const [totalUserPostCount, setTotalUserPostCount] = useState(0);
    const [postData, setPostData] = useState([]);
    const [isNextDataLoading, setIsNextDataLoading] = useState(true);
    const [footerLoading, setFooterLoading] = useState(false);

    useEffect(() => {
        const params = { uid: userID };
        getUserPosts(params, authContext).then((res) => {
            setPostData([...res?.payload?.results])
        }).catch((e) => {
            console.log(e)
        })
    }, [authContext, userID])

    useEffect(() => {
        if (postData?.length > 0 && totalUserPostCount > 0) {
            if (postData?.length === totalUserPostCount && isNextDataLoading) setIsNextDataLoading(false);
            else if (!isNextDataLoading) setIsNextDataLoading(true);
        }
    }, [postData]);

    const updatePostAfterUpload = useCallback((dataParams) => {
        updatePost(dataParams, authContext)
            .then((response) => {
                setProgressBar(false);
                const pData = [...postData];
                const pDataIndex = postData?.findIndex((item) => item?.id === dataParams?.activity_id)
                pData[pDataIndex] = response?.payload;
                setPostData([...pData]);
                setDoneUploadCount(0);
                setTotalUploadCount(0);
                getGallery(userID, authContext).then((res) => {
                    setGalleryData(res.payload);
                });
            })
            .catch((e) => {
                Alert.alert('', e.messages)
            });
    }, [authContext, postData, userID])

    const editPostDoneCall = useCallback((data, postDesc, selectEditItem, tagData) => {
        let attachmentsData = [];
        const alreadyUrlDone = [];
        const createUrlData = [];

        if (postDesc.trim().length > 0 && data?.length === 0) {
            const dataParams = {
                activity_id: selectEditItem.id,
                text: postDesc,
                taggedData: tagData ?? [],
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
                })
            }
            if (createUrlData?.length > 0) {
                setTotalUploadCount(createUrlData.length || 1);
                setProgressBar(true);
            }

            const imageArray = createUrlData.map((dataItem) => (dataItem))
            uploadImages(imageArray, authContext, progressStatus, cancelRequest).then((responses) => {
                const attachments = responses.map((item) => ({
                    type: item.type,
                    url: item.fullImage,
                    thumbnail: item.thumbnail,
                    media_height: item.height,
                    media_width: item.width,
                }))
                attachmentsData = [...alreadyUrlDone, ...attachments];
                const dataParams = {
                    activity_id: selectEditItem.id,
                    text: postDesc,
                    attachments: attachmentsData,
                    taggedData: tagData ?? [],
                };
                updatePostAfterUpload(dataParams)
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [authContext, cancelRequest, progressStatus, setProgressBar, setTotalUploadCount, updatePostAfterUpload])

    const onDeletePost = useCallback((item) => {
        setFullScreenLoading(true);
        const params = {
            activity_id: item.id,
        };
        if (['team', 'club', 'league'].includes(authContext?.entity?.obj?.entity_type)) {
            params.entity_type = authContext?.entity?.obj?.entity_type;
            params.entity_id = authContext?.entity?.uid;
        }
        deletePost(params, authContext)
            .then((response) => {
                setFullScreenLoading(false);
                if (response.status) {
                    const pData = postData.filter((postItem) => postItem?.id !== params?.activity_id)
                    setPostData([...pData]);
                }
            })
            .catch((e) => {
                setFullScreenLoading(false);
                Alert.alert('', e.messages)
            });
    }, [authContext, postData])

    const onLikePress = useCallback((item) => {
        const bodyParams = {
            reaction_type: 'clap',
            activity_id: item.id,
        };
        createReaction(bodyParams, authContext)
            .then((response) => {
                const pData = [...postData];
                const pDataIndex = postData?.findIndex((postItem) => postItem?.id === bodyParams?.activity_id)
                pData[pDataIndex] = response?.payload;
                setPostData([...pData]);
            })
            .catch((e) => {
                Alert.alert('', e.messages)
            });
    }, [authContext, postData])

    const createPostAfterUpload = useCallback((dataParams) => {
        createPost(dataParams, authContext)
            .then(() => getUserPosts({ uid: userID }, authContext))
            .then((response) => {
                setTotalUserPostCount(response?.payload?.total_count)
                setPostData([...response.payload.results]);
                setProgressBar(false);
                setDoneUploadCount(0);
                setTotalUploadCount(0);
                getGallery(userID, authContext).then((res) => {
                    setGalleryData(res.payload);
                });
            })
            .catch((error) => {
                console.log('error coming', error)
                setTimeout(() => {
                    Alert.alert(strings.alertmessagetitle, error.message)
                }, 10)
            })
    }, [authContext, setDoneUploadCount, setGalleryData, setProgressBar, setTotalUploadCount, userID])

    const onPressDone = useCallback((data, postDesc, tagsOfEntity) => {
        if (postDesc.trim().length > 0 && data?.length === 0) {
            const dataParams = {
                text: postDesc,
                taggedData: tagsOfEntity ?? [],
            };
            createPostAfterUpload(dataParams);
        } else if (data) {
            setTotalUploadCount(data.length || 1);
            setProgressBar(true);
            const imageArray = data.map((dataItem) => (dataItem))
            uploadImages(imageArray, authContext, progressStatus, cancelRequest).then((responses) => {
                const attachments = responses.map((item) => ({
                    type: item.type,
                    url: item.fullImage,
                    thumbnail: item.thumbnail,
                    media_height: item.height,
                    media_width: item.width,
                }))
                const dataParams = {
                    text: postDesc && postDesc,
                    attachments,
                    taggedData: tagsOfEntity ?? [],
                };
                createPostAfterUpload(dataParams)
            })
        }
    }, [authContext, cancelRequest, createPostAfterUpload, progressStatus, setProgressBar, setTotalUploadCount])

    const onEndReached = useCallback(() => {
        setFooterLoading(true);
        const id_lt = postData?.[postData.length - 1]?.id;
        if (id_lt && isNextDataLoading) {
            getUserPosts({ last_activity_id: id_lt }, authContext).then((response) => {
                if (response) {
                    setFooterLoading(false)
                    setTotalUserPostCount(response?.payload?.total_count)
                    setPostData([...postData, ...response.payload.results]);
                }
            })
            .catch(() => {
                setFooterLoading(false)
            })
        }
    }, [authContext, isNextDataLoading, postData])

    const StickyHeaderComponent = useMemo(() => (
      <View>
        <WritePost
                    navigation={navigation}
                    postDataItem={currentUserData}
                    onWritePostPress={() => {
                        navigation.navigate('WritePostScreen', { postData: currentUserData, onPressDone, selectedImageList: [] })
                    }}
                />
        <View style={styles.sepratorView} />
      </View>
        ), [currentUserData])

    const ListHeaderComponent = useMemo(() => (
      <>
        {homeFeedHeaderComponent()}
        {(isAdmin && currentTab === 0) ? StickyHeaderComponent : null}
      </>
    ), [StickyHeaderComponent, currentTab, homeFeedHeaderComponent, isAdmin])

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.sepratorView} />
        <ActivityLoader visible={fullScreenLoading}/>
        <NewsFeedList
                  onFeedScroll={onFeedScroll}
                  refs={refs}
                  ListHeaderComponent={ListHeaderComponent}
                  scrollEnabled={true}
                  onDeletePost={onDeletePost}
                  navigation={navigation}
                  postData={currentTab === 0 ? postData : []}
                  onEditPressDone={editPostDoneCall}
                  onLikePress={onLikePress}
                  onEndReached={onEndReached}
                  footerLoading={footerLoading && isNextDataLoading}
              />
      </View>
    )
}

const styles = StyleSheet.create({
    sepratorView: {
        height: 1,
        backgroundColor: colors.grayBackgroundColor,
    },
})
export default memo(HomeFeed);
