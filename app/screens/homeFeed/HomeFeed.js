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
import TCInnerLoader from '../../components/TCInnerLoader';

const HomeFeed = ({
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
                  }) => {
    const [loading, setLoading] = useState(true);
    const [fullScreenLoading, setFullScreenLoading] = useState(false);
    const authContext = useContext(AuthContext)
    const [postData, setPostData] = useState([]);

    useEffect(() => {
        const params = { uid: userID };
        setLoading(true);
        getUserPosts(params, authContext).then((res) => {
            setPostData([...res?.payload?.results])
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        })
    }, [userID])

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

    const editPostDoneCall = (data, postDesc, selectEditItem, tagData) => {
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
    }

    const onDeletePost = (item) => {
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
    }

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
            .then(() => {
                setProgressBar(false);
                setDoneUploadCount(0);
                setTotalUploadCount(0);
                getGallery(userID, authContext).then((res) => {
                    setGalleryData(res.payload);
                });
            })
            .catch((error) => {
                setLoading(false)
                console.log('error coming', error)
                setTimeout(() => {
                    Alert.alert(strings.alertmessagetitle, error.message)
                }, 10)
            })
    }, [authContext, userID])

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
    }, [authContext, cancelRequest])
    return (
      <>
        {useMemo(() => (isAdmin
          && <View>
            <WritePost
                  navigation={navigation}
                  postDataItem={currentUserData}
                  onWritePostPress={() => {
                      navigation.navigate('WritePostScreen', { postData: currentUserData, onPressDone, selectedImageList: [] })
                  }}
              />
            <View style={styles.sepratorView} />
          </View>
          ), [currentUserData, navigation, isAdmin])}

        <View style={styles.sepratorView} />
        <ActivityLoader visible={fullScreenLoading}/>
        <TCInnerLoader visible={loading}/>
        <NewsFeedList
            onDeletePost={onDeletePost}
            navigation={navigation}
            postData={postData.slice(0, 5)}
            onEditPressDone={editPostDoneCall}
            onLikePress={onLikePress}
        />
      </>
    )
}

const styles = StyleSheet.create({
    sepratorView: {
        height: 1,
        backgroundColor: colors.grayBackgroundColor,
    },
})
export default memo(HomeFeed);
