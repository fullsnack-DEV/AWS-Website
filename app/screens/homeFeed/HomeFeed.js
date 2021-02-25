import React, {
    memo, useCallback, useContext, useEffect, useState,
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
import useRenderCount from '../../hooks/useRenderCount';

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
    useEffect(() => {
        console.log('CT : ', currentTab);
    }, [currentTab]);
    useRenderCount('Home Feed')
    const [fullScreenLoading, setFullScreenLoading] = useState(false);
    const authContext = useContext(AuthContext)
    const [postData, setPostData] = useState([]);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
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

    const updatePostAfterUpload = useCallback((dataParams) => {
        updatePost(dataParams, authContext)
            .then(() => getUserPosts({ uid: userID }, authContext))
            .then((response) => {
                setProgressBar(false);
                setPostData([...response.payload.results])
                setDoneUploadCount(0);
                setTotalUploadCount(0);
                getGallery(userID, authContext).then((res) => {
                    setGalleryData(res.payload);
                });
            })
            .catch((e) => {
                Alert.alert('', e.messages)
            });
    }, [authContext, userID])

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
            .then(() => getUserPosts({ uid: userID }, authContext))
            .then((response) => {
                setFullScreenLoading(false);
                setPostData([...response.payload.results]);
            })
            .catch((e) => {
                setFullScreenLoading(false);
                Alert.alert('', e.messages)
            });
    }, [authContext, userID])

    const onLikePress = useCallback((item) => {
        const bodyParams = {
            reaction_type: 'clap',
            activity_id: item.id,
        };
        createReaction(bodyParams, authContext)
            .then(() => getUserPosts({ uid: userID }, authContext))
            .then((response) => {
                setPostData([...response.payload.results]);
            })
            .catch((e) => {
                Alert.alert('', e.messages)
            });
    }, [authContext, userID])

    const createPostAfterUpload = useCallback((dataParams) => {
        createPost(dataParams, authContext)
            .then(() => getUserPosts({ uid: userID }, authContext))
            .then((response) => {
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
        const id_lt = postData?.[postData.length - 1]?.id;
        if (!isMoreLoading && id_lt && isNextDataLoading) {
            setIsMoreLoading(true);
            setFooterLoading(true);
            getUserPosts({ last_activity_id: id_lt }, authContext).then((response) => {
                if (response) {
                    if (response.payload.next === '') {
                        setIsNextDataLoading(false);
                    }
                    setIsMoreLoading(false);
                    setFooterLoading(false)
                    setPostData([...postData, ...response.payload.results]);
                }
            })
            .catch(() => {
                setFooterLoading(false)
                setIsMoreLoading(false);
            })
        }
    }, [authContext, isMoreLoading, isNextDataLoading, postData])

    const StickyHeaderComponent = () => (isAdmin && currentTab === 0) && (
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
    )

    const ListHeaderComponent = useCallback(() => (
      <>
        {homeFeedHeaderComponent()}
        {StickyHeaderComponent()}
      </>
    ), [homeFeedHeaderComponent, StickyHeaderComponent])
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
