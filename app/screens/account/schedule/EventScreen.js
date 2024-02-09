import React, {useState, useContext, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
  Dimensions,
  Platform,
  BackHandler,
} from 'react-native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import Modal from 'react-native-modal';
import ReadMore from '@fawazahmed/react-native-read-more';
import _ from 'lodash';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import EventTimeItem from '../../../components/Schedule/EventTimeItem';
import EventMapView from '../../../components/Schedule/EventMapView';
import {strings} from '../../../../Localization/translation';
import EventBackgroundPhoto from '../../../components/Schedule/EventBackgroundPhoto';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {
  attendEvent,
  commentAllow,
  deleteEvent,
  hideEvent,
  likeEvent,
  removeAttendeeFromEvent,
} from '../../../api/Schedule';

import TCProfileButton from '../../../components/TCProfileButton';
import {getGroupIndex, getUserIndex} from '../../../api/elasticSearch';
import TCProfileView from '../../../components/TCProfileView';
import Verbs from '../../../Constants/Verbs';
import {
  getJSDate,
  ordinal_suffix_of,
  getDayFromDate,
  countNumberOfWeekFromDay,
  formatCurrency,
} from '../../../utils';
import {
  followUser,
  getUserFollowerFollowing,
  unfollowUser,
} from '../../../api/Users';
import {getGroupMembers} from '../../../api/Groups';
import ScreenHeader from '../../../components/ScreenHeader';
import SendNewInvoiceModal from '../Invoice/SendNewInvoiceModal';
import {InvoiceType, ModalTypes} from '../../../Constants/GeneralConstants';
import BottomSheet from '../../../components/modals/BottomSheet';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import GoingUsersModal from './GoingUsersModal';
import WritePost from '../../../components/newsFeed/WritePost';
import {ImageUploadContext} from '../../../context/ImageUploadContext';
import {
  createPost,
  createReaction,
  deletePost,
  getTimeline,
} from '../../../api/NewsFeeds';
import NewsFeedList from '../../newsfeeds/NewsFeedList';
import LikersModal from '../../../components/modals/LikersModal';
import CommentModal from '../../../components/newsFeed/CommentModal';
import FeedsShimmer from '../../../components/shimmer/newsFeed/FeedsShimmer';
import EventLikersModal from './EventLikersModal';
import ImageProgress from '../../../components/newsFeed/ImageProgress';
import ShareEventPostModal from './ShareEventPostModal';
import usePrivacySettings from '../../../hooks/usePrivacySettings';
import {WhoCanJoinEventUserEnum} from '../../../Constants/PrivacyOptionsConstant';

export default function EventScreen({navigation, route}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [sendNewInvoice, setSendNewInvoice] = useState(false);

  const [loading, setloading] = useState(false);
  const [organizer, setOrganizer] = useState({});
  const [going, setGoing] = useState([]);
  const [eventData, setEventData] = useState(route.params.data ?? {});
  const [activeTab, setActiveTab] = useState(strings.infoTitle);
  const [infoModal, setInfoModal] = useState(false);
  const [infoType, setInfoType] = useState('');
  const [recurringEditModal, setRecurringEditModal] = useState(false);
  const [moreOptions, setMoreOptions] = useState([]);
  const [postData, setPostData] = useState([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [pullRefresh, setPullRefresh] = useState(false);
  const [isNextDataLoading, setIsNextDataLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [feedCalled, setFeedCalled] = useState(false);
  const THISEVENT = 0;
  const FUTUREEVENT = 1;
  const ALLEVENT = 2;
  const [firstTimeLoading, setFirstTimeLoading] = useState(false);
  const imageUploadContext = useContext(ImageUploadContext);
  const [showGoingModal, setShowGoingModal] = useState(false);
  const [snapPoints, setSnapPoints] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [visiblesharEventPostModal, setVisibleshareEventPostModal] =
    useState(false);
  const [canComment, setCanComment] = useState(false);
  const [isGoing, setIsGoing] = useState(false);

  const {getPrivacyStatus} = usePrivacySettings();

  useEffect(() => {
    if (route.params?.isCreatePost) {
      const {dataParams, imageArray} = route.params;
      if (imageArray.length > 0) {
        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
      } else {
        navigation.setParams({isCreatePost: undefined});
        createPostAfterUpload(dataParams);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.isCreatePost]);

  const getFeeds = useCallback(() => {
    getTimeline(organizer.entity_type, eventData.cal_id, authContext)
      .then((response) => {
        setFeedCalled(true);
        setFirstTimeLoading(false);
        setPostData([...response.payload.results]);
      })
      .catch((e) => {
        setFirstTimeLoading(false);
        setTimeout(() => Alert.alert('', e.message), 100);
      });
  }, [authContext, eventData.cal_id, organizer.entity_type]);

  const commentPrivacyStatus = () => {
    setloading(true);
    commentAllow(eventData.cal_id, authContext)
      .then((res) => {
        setCanComment(res.payload);
        setloading(false);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => {
    if (isFocused) {
      commentPrivacyStatus();
      getFeeds();
    }
  }, [getFeeds, isFocused, route.params.isCreatePost]);

  const recurringEditList = [
    {
      text: strings.recuringoptionOne,
      value: THISEVENT,
    },
    {
      text: strings.recurringOptionTwo,
      value: FUTUREEVENT,
    },
    {
      text: strings.recurringOptionThree,
      value: ALLEVENT,
    },
  ];

  let titleValue = strings.gameSingular;
  let description = strings.gameWith;
  let description2 = '';
  let startTime = '';
  let endTime = '';
  let untilTime = '';
  let gameDataLati = null;
  let gameDataLongi = null;

  // let blocked = false;

  let repeatString = strings.never;
  const isOrganizer = eventData.owner_id === authContext.entity.uid;
  if (eventData) {
    if (eventData.title) {
      titleValue = eventData.title;
    }
    if (eventData.descriptions) {
      description = eventData.descriptions;
    }

    if (eventData.start_datetime) {
      startTime = getJSDate(eventData.start_datetime);
    }
    if (eventData.end_datetime) {
      endTime = getJSDate(eventData.end_datetime);
    }
    if (eventData.untilDate) {
      untilTime = getJSDate(eventData.untilDate);
    }
    if (eventData.repeat === Verbs.eventRecurringEnum.Daily) {
      repeatString = strings.daily;
    } else if (eventData.repeat === Verbs.eventRecurringEnum.Weekly) {
      repeatString = strings.weekly;
    } else if (eventData.repeat === Verbs.eventRecurringEnum.WeekOfMonth) {
      repeatString = format(
        strings.monthlyOnText,
        `${countNumberOfWeekFromDay(startTime)} ${getDayFromDate(startTime)}`,
      );
    } else if (eventData.repeat === Verbs.eventRecurringEnum.DayOfMonth) {
      repeatString = format(
        strings.monthlyOnDayText,
        ordinal_suffix_of(startTime.getDate()),
      );
    } else if (eventData.repeat === Verbs.eventRecurringEnum.WeekOfYear) {
      repeatString = format(
        strings.yearlyOnText,
        `${countNumberOfWeekFromDay(startTime)} ${getDayFromDate(startTime)}`,
      );
    } else if (eventData.repeat === Verbs.eventRecurringEnum.DayOfYear) {
      repeatString = format(
        strings.yearlyOnDayText,
        ordinal_suffix_of(startTime.getDate()),
      );
    }

    if (eventData.repeat !== Verbs.eventRecurringEnum.Never) {
      if (untilTime) {
        repeatString = format(
          strings.repeatTime,
          repeatString,
          moment(untilTime).format('MMM DD, YYYY hh:mm a'),
        );
      }
    }

    // if (eventData.blocked) {
    //   blocked = eventData.blocked;
    // }
  }
  if (route && route.params && route.params.gameData) {
    if (route.params.gameData.game && route.params.gameData.game.away_team) {
      description2 = route.params.gameData.game.away_team.group_name;
    }

    if (route.params.gameData.game && route.params.gameData.game.venue) {
      gameDataLati = route.params.gameData.game.venue.lat;
    }
    if (route.params.gameData.game && route.params.gameData.game.venue) {
      gameDataLongi = route.params.gameData.game.venue.long;
    }
  }

  const createPostAfterUpload = (dataParams) => {
    let body = dataParams;
    body.cal_id = eventData.cal_id;

    setloading(true);

    if (
      authContext.entity.role === Verbs.entityTypeClub ||
      authContext.entity.role === Verbs.entityTypeTeam
    ) {
      body = {
        ...dataParams,
        group_id: authContext.entity.uid,
        showPreviewForUrl: true,
        cal_id: eventData.cal_id,
      };
    }

    createPost(body, authContext)
      .then(() => {
        setloading(false);
        getFeeds();
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setloading(false);
      });
  };

  useEffect(() => {
    if (isFocused && route.params?.event) {
      setEventData(route.params.event);
    }
  }, [isFocused, route.params]);

  useEffect(() => {
    const goingData = eventData.going ?? [];

    const getUserDetailQuery = {
      size: 1000,
      from: 0,
      query: {
        bool: {
          must: [{match: {user_id: eventData.created_by.uid}}],
        },
      },
    };

    const getUserGoingQuery = {
      size: 1000,
      from: 0,
      query: {
        terms: {
          'user_id.keyword': [...goingData],
        },
      },
    };

    const getGroupDetailQuery = {
      size: 1000,
      from: 0,
      query: {
        bool: {
          must: [{match: {group_id: eventData.created_by.group_id}}],
        },
      },
    };

    if (eventData.created_by.group_id) {
      getGroupIndex(getGroupDetailQuery)
        .then((res) => {
          setOrganizer(res[0]);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      getUserIndex(getUserDetailQuery)
        .then((res) => {
          const org = res.filter(
            (obj) => obj.user_id === eventData.created_by.uid,
          )?.[0];
          setOrganizer(org);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }

    getUserIndex(getUserGoingQuery)
      .then((res) => {
        setGoing(res);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });

    getUserFollowerFollowing(
      eventData.created_by.group_id ?? eventData.owner_id,
      eventData.created_by?.group_id
        ? Verbs.entityTypeGroups
        : Verbs.entityTypePlayers,
      'followers',
      authContext,
    )
      .then((res) => {
        if (res.payload.length) {
          const tempArr = [];
          res.payload.forEach((item) => {
            tempArr.push(item.user_id);
          });
          // setMyFollowers(tempArr);
        }
      })
      .catch(() => {});

    if (eventData.created_by?.group_id) {
      getGroupMembers(eventData.created_by.group_id, authContext)
        .then((res) => {
          const tempArr = [];
          res.payload.forEach((item) => {
            tempArr.push(item.user_id);
          });
          // setMyMembers(tempArr);
        })
        .catch(() => {});
    }
  }, [eventData, authContext]);

  useEffect(() => {
    if (isFocused) {
      const joinPrivacy = getPrivacyStatus(
        WhoCanJoinEventUserEnum[eventData.who_can_join.value],
        authContext.entity.obj,
        true,
        eventData.created_by?.uid,
      );

      if (eventData?.who_can_join.value === 1 && route?.params.requestID) {
        setIsGoing(true);
      } else {
        setIsGoing(joinPrivacy);
      }
    }
  }, [isFocused]);

  const checkIsInvite = () => {
    if (['user', 'player'].includes(authContext.entity.role)) {
      if (eventData.who_can_invite?.value === 0) {
        const tempArr = [];
        going.forEach((item) => {
          tempArr.push(item.user_id);
        });
        if (tempArr.includes(authContext.entity.auth.user_id)) {
          return true;
        }
      }
      if (eventData.owner_id === authContext.entity.auth.user_id) {
        return true;
      }
    }
    if (
      authContext.entity.role === Verbs.entityTypeClub ||
      authContext.entity.role === Verbs.entityTypeTeam
    ) {
      if (eventData.who_can_invite?.value === 0) {
        return false;
      }
      if (eventData.who_can_invite?.value === 1) {
        if (eventData.owner_id === authContext.entity.uid) {
          return true;
        }
      }
    }

    return false;
  };

  const attendAPICall = () => {
    setloading(true);
    const data = {
      start_datetime: eventData.start_datetime,
      end_datetime: eventData.end_datetime,
    };
    attendEvent(eventData.cal_id, data, authContext)
      .then((response) => {
        setEventData(response.payload[0]);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.townsCupTitle, e.message);
      });
  };

  const renderGoingView = ({item}) => (
    <TouchableOpacity
      onPress={() => setShowGoingModal(true)}
      style={styles.goingContainer}>
      <Image
        source={
          item?.thumbnail ? {uri: item.thumbnail} : images.profilePlaceHolder
        }
        style={styles.image}
      />
    </TouchableOpacity>
  );

  const clickInfoIcon = (type) => {
    setInfoType(type);
    setInfoModal(true);
  };

  const handleDeleteEvent = (recurringOption = '') => {
    const data = {
      recurring_modification_type: recurringOption,
      start_datetime: eventData.start_datetime,
      end_datetime: eventData.end_datetime,
    };

    setloading(true);
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole =
      entity.role === Verbs.entityTypeUser ? 'users' : 'groups';
    deleteEvent(entityRole, uid, eventData.cal_id, authContext, data)
      .then(() => {
        setTimeout(() => {
          setloading(false);
          navigation.navigate('App', {
            screen: 'Schedule',
          });
        }, 1000);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert('', e.messages);
      });
  };

  const onHideEvent = () => {
    setloading(true);

    const data = {
      hide_event: !eventData?.event_hide_groups?.includes(
        authContext.entity.uid,
      ),
    };
    hideEvent(eventData.cal_id, data, authContext)
      .then(() => {
        setloading(false);
        const UpdatedEventData = eventData;
        if (eventData?.event_hide_groups?.includes(authContext.entity.uid)) {
          const newHidegroups = eventData.event_hide_groups.filter(
            (item) => item !== authContext.entity.uid,
          );

          UpdatedEventData.event_hide_groups = newHidegroups;
        } else {
          UpdatedEventData.event_hide_groups.push(authContext.entity.uid);
        }

        setEventData(UpdatedEventData);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert('', e.messages);
      });
  };

  const renderDeleteRecurringOptions = ({item}) => (
    <>
      <View
        style={{
          paddingVertical: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={styles.filterTitle}
          onPress={() => {
            setRecurringEditModal(false);
            setTimeout(() => {
              handleDeleteEvent(item.value);
            }, 1000);
          }}>
          {item.text}
        </Text>
      </View>
      <View style={styles.separator} />
    </>
  );

  const handleActions = (option) => {
    setShowActionSheet(false);
    switch (option) {
      case strings.sendInvoice:
        setShowActionSheet(false);
        setSendNewInvoice(true);
        break;

      case strings.sendMessage:
        break;

      case strings.editEvent:
        if (route && route.params && eventData) {
          setShowActionSheet(false);
          navigation.navigate('EditEventScreen', {
            data: eventData,
            gameData: route.params.gameData,
          });
        }
        break;

      case strings.deleteEvent:
        if (eventData.rrule) {
          Alert.alert(strings.alertMessageDeleteEvent, '', [
            {
              text: strings.cancel,
              style: 'cancel',
            },
            {
              text: strings.delete,
              style: 'destructive',
              onPress: () => {
                setShowActionSheet(false);

                setRecurringEditModal(true);
              },
            },
          ]);
        } else {
          handleDeleteEvent();
        }

        break;

      case strings.shareEventPostText:
        setShowActionSheet(false);
        setTimeout(() => {
          setVisibleshareEventPostModal(true);
        }, 100);

        break;
      case format(strings.hideeventPostText, getPostText()):
        // call the Hide event function here
        // setShowActionSheet(false);
        setTimeout(() => {
          onHideEvent();
        }, 200);

        break;

      case format(strings.unhideeventPostText, getPostText()):
        // setShowActionSheet(false);
        setTimeout(() => {
          onHideEvent();
        }, 200);
        break;

      case strings.reportText:
        break;

      case strings.blockEventOrganiser:
        break;

      default:
        break;
    }
  };

  const removeAttendee = (userData = {}) => {
    setloading(true);
    removeAttendeeFromEvent(eventData.cal_id, [userData.user_id], authContext)
      .then(() => {
        setloading(false);
        setShowGoingModal(false);

        navigation.navigate('App', {
          screen: 'Schedule',
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  // feed fucntions

  const handleFollowUnfollow = (
    userId,
    isFollowing = false,
    entityType = Verbs.entityTypePlayer,
  ) => {
    const params = {
      entity_type: entityType,
    };
    if (!isFollowing) {
      followUser(params, userId, authContext)
        .then(() => {
          getFeeds(false);
        })
        .catch((error) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    } else {
      unfollowUser(params, userId, authContext)
        .then(() => {
          getFeeds(false);
        })
        .catch((error) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    }
  };

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
    setIsNextDataLoading(true);
    setFooterLoading(false);
    setPullRefresh(true);
    getTimeline(organizer.entity_type, eventData.cal_id, authContext)
      .then((response) => {
        setPostData([...response.payload.results]);
        setPullRefresh(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
        setPullRefresh(false);
      });
  }, [authContext, eventData.cal_id, organizer.entity_type]);

  const onLikePress = useCallback(
    (item) => {
      const bodyParams = {
        reaction_type: Verbs.clap,
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

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('App', {
        screen: 'Schedule',
      });
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  const getOrganizerProfile = (data = {}) => {
    if (data?.thumbnail) {
      return {uri: data.thumbnail};
    }
    if (data.entity_type === Verbs.entityTypeTeam) {
      return images.teamPH;
    }
    if (data.entity_type === Verbs.entityTypeClub) {
      return images.newClubLogo;
    }
    return images.profilePlaceHolder;
  };

  const isWritePostVisible = (who_can_post) => {
    if (who_can_post?.value === Verbs.EVERYONE_EVENT) {
      return true;
    }
    if (who_can_post?.value === Verbs.ATTENDEE_EVENT) {
      const userExists = going.some(
        (item) => item.user_id === authContext.entity.uid,
      );
      return userExists;
    }
    if (who_can_post?.value === Verbs.ORGANIZER_EVENT) {
      return eventData.created_by.uid === authContext.entity.uid;
    }
    return false;
  };

  const onLikeEvent = () => {
    setloading(true);
    likeEvent(eventData.cal_id, authContext)
      .then(() => {
        if (eventData?.likes?.includes(authContext.entity.uid)) {
          const {likes: likedUsers} = eventData;

          const updatedLikes = likedUsers.filter(
            (item) => item !== authContext.entity.uid,
          );

          const updatedData = {...eventData, likes: updatedLikes};

          setEventData(updatedData);
        } else {
          let updatedLikes;

          if (eventData?.likes) {
            updatedLikes = [...eventData.likes, authContext.entity.uid];
          } else {
            updatedLikes = [authContext.entity.uid];
          }

          const updatedEventData = {
            ...eventData,
            likes: updatedLikes,
          };

          setEventData(updatedEventData);
        }

        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        console.log(e.message);
      });
  };

  const getPostText = () => {
    if (authContext.entity.role === Verbs.entityTypeClub) {
      return strings.clubsTextHide;
    }

    if (authContext.entity.role === Verbs.entityTypeTeam) {
      return strings.teamsTextHide;
    }

    return strings.profileHide;
  };

  return (
    <SafeAreaView style={styles.mainContainerStyle}>
      <ScreenHeader
        title={strings.event}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          if (route.params?.comeFrom) {
            if (route.params?.comeFrom === 'HomeScheduleScreen') {
              navigation.goBack();
              return;
            }
            navigation.navigate(route.params.comeFrom, {
              ...route.params,
            });
          } else {
            navigation.navigate('App', {
              screen: 'Schedule',
            });
          }
        }}
        rightIcon1={
          eventData?.likes?.includes(authContext.entity.uid)
            ? images.likeImage
            : images.unlikeImage
        }
        rightIcon2={images.vertical3Dot}
        rightIcon1Press={() => {
          onLikeEvent();
        }}
        rightIcon2Press={() => {
          if (isOrganizer) {
            if (eventData?.activity_id) {
              setMoreOptions([
                strings.sendInvoice,
                strings.sendMessage,
                strings.shareEventPostText,
                eventData?.event_hide_groups?.includes(authContext.entity.uid)
                  ? format(strings.unhideeventPostText, getPostText())
                  : format(strings.hideeventPostText, getPostText()),
                strings.editEvent,
                strings.deleteEvent,
              ]);
            } else {
              setMoreOptions([
                strings.sendInvoice,
                strings.sendMessage,
                strings.editEvent,
                strings.deleteEvent,
              ]);
            }
          } else {
            setMoreOptions([strings.reportText, strings.blockEventOrganiser]);
          }
          setShowActionSheet(true);
        }}
        containerStyle={{marginLeft: 8}}
      />
      <View style={{position: 'absolute', bottom: 32, zIndex: 100}}>
        <ImageProgress />
      </View>

      <ActivityLoader visible={loading} />

      <ScrollView stickyHeaderIndices={[2]}>
        <EventBackgroundPhoto
          isEdit={!!eventData.background_thumbnail}
          isPreview={true}
          isImage={!!eventData.background_thumbnail}
          imageURL={{uri: eventData?.background_thumbnail}}
        />
        <View style={{paddingHorizontal: 15}}>
          <Text style={styles.eventTitleStyle}>{titleValue}</Text>

          <View style={styles.row}>
            <Text style={styles.sportTitleStyle}>
              {eventData.selected_sport && eventData.selected_sport.sport_name}
            </Text>
            {!eventData.is_Offline && (
              <Text style={styles.onlineText}>{strings.onlineText}</Text>
            )}
            {eventData?.likes?.length > 0 && (
              <TouchableOpacity
                onPress={() => setOpenLikesModal(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  justifyContent: 'center',
                }}>
                <Image
                  source={images.likeImage}
                  style={{
                    height: 15,
                    width: 15,
                  }}
                  tintColor={colors.blackColor}
                />
                <Text
                  style={{
                    marginTop: 1,
                    fontFamily: fonts.RBold,
                    marginLeft: 5,
                  }}>
                  {eventData?.likes?.length ?? 0}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <EventTimeItem
            from={strings.from}
            fromTime={moment(startTime).format('ddd, MMM DD, YYYY')}
            to={strings.to}
            toTime={`${moment(startTime).format('hh:mm a')} - ${moment(
              endTime,
            ).format('hh:mm a')}`}
            repeat={strings.repeat}
            repeatTime={repeatString}
            location={eventData.location?.location_name}
            eventOnlineUrl={eventData.online_url}
            is_Offline={eventData.is_Offline}
          />

          {/* Join and Invite button wrapper */}
          <View style={styles.buttonContainer}>
            {isGoing && (
              <TCProfileButton
                title={
                  (eventData.going ?? []).filter(
                    (entity) => entity === authContext.entity.uid,
                  ).length > 0
                    ? strings.going
                    : strings.join
                }
                style={
                  (eventData.going ?? []).filter(
                    (entity) => entity === authContext.entity.uid,
                  ).length > 0
                    ? [
                        styles.firstButtonStyle,
                        {width: checkIsInvite() ? '48%' : '100%'},
                      ]
                    : [
                        styles.firstButtonStyle,
                        {
                          width: checkIsInvite() ? '48%' : '100%',
                          backgroundColor: colors.themeColor,
                        },
                      ]
                }
                showArrow={false}
                tickImage={
                  (eventData.going ?? []).filter(
                    (entity) => entity === authContext.entity.uid,
                  ).length > 0
                }
                imageStyle={styles.checkMarkStyle}
                textStyle={
                  (eventData.going ?? []).filter(
                    (entity) => entity === authContext.entity.uid,
                  ).length > 0
                    ? [styles.attendTextStyle, {color: colors.lightBlackColor}]
                    : [styles.attendTextStyle, {color: colors.whiteColor}]
                }
                onPressProfile={() => {
                  if (
                    (eventData.going ?? []).filter(
                      (entity) => entity === authContext.entity.uid,
                    ).length > 0
                  ) {
                    //
                  } else {
                    attendAPICall();
                  }
                }}
              />
            )}

            {checkIsInvite() && (
              <TCProfileButton
                title={strings.invite}
                style={[
                  styles.firstButtonStyle,
                  {width: isGoing ? '48%' : '100%'},
                ]}
                showArrow={false}
                imageStyle={styles.checkMarkStyle}
                textStyle={styles.inviteTextStyle}
                onPressProfile={() =>
                  navigation.navigate('InviteToEventScreen', {
                    eventId: eventData.cal_id,
                    start_datetime: eventData.start_datetime,
                    end_datetime: eventData.end_datetime,
                  })
                }
              />
            )}
          </View>
        </View>
        <View style={styles.tabContainerStyle}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === strings.infoTitle ? styles.activeTabItem : {},
              ]}
              onPress={() => setActiveTab(strings.infoTitle)}>
              <Text
                style={[
                  styles.tabItemText,
                  activeTab === strings.infoTitle
                    ? styles.activeTabItemText
                    : {},
                ]}>
                {strings.infoTitle}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === strings.postsTitleText
                  ? styles.activeTabItem
                  : {},
              ]}
              onPress={() => setActiveTab(strings.postsTitleText)}>
              <Text
                style={[
                  styles.tabItemText,
                  activeTab === strings.postsTitleText
                    ? styles.activeTabItemText
                    : {},
                ]}>
                {strings.postsTitleText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === strings.infoTitle ? (
          <>
            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.describeText}</Text>
              <ReadMore
                numberOfLines={3}
                style={styles.longTextStyle}
                seeMoreText={strings.moreText}
                seeLessText={strings.lessText}
                seeLessStyle={styles.moreLessText}
                seeMoreStyle={styles.moreLessText}>
                {description} {description2}
              </ReadMore>
            </View>
            <View style={[styles.divider, {marginHorizontal: 15}]} />

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.eventFilterOrganiserTitle}
              </Text>
              {organizer && !loading && (
                <View>
                  <TCProfileView
                    type="medium"
                    name={organizer.group_name ?? organizer.full_name ?? ''}
                    location={`${organizer.city ?? ''}, ${
                      organizer.state_abbr ? organizer.state_abbr : ''
                    }${organizer.state_abbr ? ',' : ''} ${
                      organizer.country ?? ''
                    }`}
                    image={getOrganizerProfile(organizer)}
                    alignSelf={'flex-start'}
                    marginTop={10}
                    profileImageStyle={{width: 40, height: 40}}
                    profileContainerStyle={{
                      marginRight: 10,
                    }}
                  />

                  <Image
                    source={images.starProfile}
                    style={styles.starProfile}
                  />
                </View>
              )}
            </View>

            {/* dummy comment modal */}

            {eventData?.activity_id ? (
              <View
                style={{
                  paddingVertical: 13,
                  marginTop: 5,
                }}>
                <TouchableOpacity
                  disabled={!canComment}
                  onPress={() => setShowCommentModal(true)}
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    borderRadius: 8,
                    paddingHorizontal: 25,
                    paddingVertical: 10,
                    backgroundColor: canComment
                      ? colors.availabilityBarColor
                      : 'red',
                    opacity: canComment ? 1 : 0.3,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.RBold,
                      color: colors.whiteColor,
                    }}>
                    Comment Modal
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={[styles.divider, {marginHorizontal: 15}]} />

            {eventData.going?.length > 0 && (
              <>
                <View style={styles.containerStyle}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 15,
                    }}>
                    <Text style={[styles.headerTextStyle, {marginBottom: 0}]}>
                      {`${strings.going} (${going?.length})`}
                    </Text>

                    <Text
                      onPress={() => {
                        setShowGoingModal(true);
                      }}
                      style={styles.seeAllText}>
                      {`${strings.seeAllText}`}
                    </Text>
                  </View>

                  <FlatList
                    data={going}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderGoingView}
                  />
                </View>
                <View style={[styles.divider, {marginHorizontal: 15}]} />
              </>
            )}

            <EventItemRender title={strings.venue}>
              {eventData.is_Offline ? (
                <>
                  <Text
                    style={[styles.textValueStyle, {fontFamily: fonts.RBold}]}>
                    {eventData.location?.venue_name}
                  </Text>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {eventData.location?.location_name}
                  </Text>
                  <EventMapView
                    region={{
                      latitude:
                        eventData.location?.latitude ?? Number(gameDataLati),
                      longitude:
                        eventData.location?.longitude ?? Number(gameDataLongi),
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    coordinate={{
                      latitude:
                        eventData.location?.latitude ?? Number(gameDataLati),
                      longitude:
                        eventData.location?.longitude ?? Number(gameDataLongi),
                    }}
                  />
                  <Text style={[styles.textValueStyle, {marginTop: 10}]}>
                    {eventData.location?.venue_detail}
                  </Text>
                </>
              ) : (
                <Text
                  style={[
                    styles.textValueStyle,
                    eventData.online_url && styles.textUrl,
                  ]}>
                  {eventData.online_url
                    ? eventData.online_url
                    : strings.emptyEventUrl}
                </Text>
              )}
            </EventItemRender>

            <View style={styles.sepratorViewStyle} />

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.timeText}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 15,
                }}>
                <View>
                  <Text style={styles.textValueStyle}>{strings.starts}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {`${moment(startTime).format('MMM DD, YYYY')}`}
                  </Text>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular, marginLeft: 25},
                    ]}>{`${moment(startTime).format('hh:mm a')}`}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 15,
                }}>
                <View>
                  <Text style={styles.textValueStyle}>{strings.ends}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {`${moment(endTime).format('MMM DD, YYYY')}`}
                  </Text>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular, marginLeft: 25},
                    ]}>{`${moment(endTime).format('hh:mm a')}`}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 21,
                    color: colors.lightBlackColor,
                    fontFamily: fonts.RLight,
                  }}>
                  {strings.timezone} &nbsp;
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(strings.timezoneAvailability);
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 21,
                      color: colors.lightBlackColor,
                      fontFamily: fonts.RRegular,
                      textDecorationLine: 'underline',
                    }}>
                    {Intl.DateTimeFormat()
                      ?.resolvedOptions()
                      .timeZone.split('/')
                      .pop()}
                  </Text>
                </TouchableOpacity>
              </View>

              {isOrganizer && (
                <>
                  <View style={[styles.divider, {marginVertical: 15}]} />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.textValueStyle}>{strings.repeat}</Text>
                    <Text
                      style={[
                        styles.textValueStyle,
                        {fontFamily: fonts.RRegular, textAlign: 'right'},
                      ]}>
                      {repeatString}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                      marginTop: 25,
                    }}>
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        marginRight: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          !eventData.blocked
                            ? images.roundTick
                            : images.roundCross
                        }
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <Text
                      style={[
                        styles.textValueStyle,
                        {
                          color: !eventData.blocked
                            ? colors.greeColor
                            : colors.veryLightBlack,
                          fontFamily: fonts.RRegular,
                        },
                      ]}>
                      {!eventData.blocked
                        ? strings.available
                        : strings.blockedForChallenge}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.sepratorViewStyle} />
            <EventItemRender
              title={strings.eventFee}
              icon={images.infoIcon}
              clickInfoIcon={clickInfoIcon}
              type={'fee'}>
              <Text
                style={[styles.textValueStyle, {fontFamily: fonts.RRegular}]}>
                {`${formatCurrency(
                  parseFloat(eventData.event_fee?.value).toFixed(2),
                  eventData.event_fee?.currency_type,
                )} ${eventData.event_fee?.currency_type}`}
              </Text>
            </EventItemRender>

            <View style={styles.sepratorViewStyle} />
            <EventItemRender title={strings.refundpolicy}>
              <ReadMore
                numberOfLines={2}
                style={styles.longTextStyle}
                seeMoreText={strings.moreText}
                seeLessStyle={styles.moreLessText}
                seeMoreStyle={styles.moreLessText}
                seeLessText={strings.lessText}>
                {eventData.refund_policy}
              </ReadMore>
            </EventItemRender>

            <View style={styles.sepratorViewStyle} />
            <EventItemRender
              title={strings.numberAttend}
              icon={images.infoIcon}
              clickInfoIcon={clickInfoIcon}
              type={'attendee'}>
              <Text
                style={[styles.textValueStyle, {fontFamily: fonts.RRegular}]}>
                {format(
                  strings.minMaxText_dy,
                  `${
                    eventData.min_attendees === 0
                      ? '-'
                      : eventData.min_attendees
                  }   `,
                  `${
                    eventData.max_attendees === 0
                      ? '-'
                      : eventData.max_attendees
                  }`,
                )}
              </Text>
            </EventItemRender>

            {isOrganizer && (
              <>
                <View style={styles.sepratorViewStyle} />
                <EventItemRender title={strings.whoCanSeeTitle}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {eventData.who_can_see?.text}
                  </Text>
                </EventItemRender>

                <View style={styles.sepratorViewStyle} />
                <EventItemRender title={strings.whoCanJoinTitle}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {eventData.who_can_join?.text}
                  </Text>
                </EventItemRender>

                <View style={styles.sepratorViewStyle} />
                <EventItemRender title={strings.whoCanInviteTitle}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {eventData.who_can_invite?.text}
                  </Text>
                </EventItemRender>
                <View style={styles.sepratorViewStyle} />
                <EventItemRender title={strings.whoCanWritePostoneventHome}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {eventData?.who_can_post?.text}
                  </Text>
                </EventItemRender>
              </>
            )}

            {/* <View marginBottom={70} /> */}
          </>
        ) : (
          <View style={{marginTop: -20}}>
            {isWritePostVisible(eventData.who_can_post) && (
              <WritePost
                onWritePostPress={() => {
                  navigation.navigate('NewsFeedStack', {
                    screen: 'WritePostScreen',
                    params: {
                      postData: authContext.entity.obj,
                      selectedImageList: [],
                      comeFrom: 'EventScreen',
                      routeParams: {
                        uid: authContext.entity.uid,
                        role: authContext.entity.obj.entity_type,
                        eventID: eventData.cal_id,
                        ...route.params,
                      },
                    },
                  });
                }}
              />
            )}
            {firstTimeLoading ? (
              <FeedsShimmer />
            ) : (
              <NewsFeedList
                navigation={navigation}
                updateCommentCount={updateCommentCount}
                pullRefresh={pullRefresh}
                onDeletePost={onDeletePost}
                postData={postData}
                onRefreshPress={onRefreshPress}
                footerLoading={footerLoading && isNextDataLoading}
                onLikePress={onLikePress}
                onEndReached={() => {}}
                feedAPI={feedCalled}
                isNewsFeedScreen={true}
                entityDetails={authContext.entity.obj}
                openLikeModal={(postItem = {}) => {
                  setSelectedPost(postItem);
                  setShowCommentModal(false);
                  setShowLikeModal(true);
                }}
                openCommentModal={(postItem = {}) => {
                  setSelectedPost(postItem);
                  setShowLikeModal(false);
                  setShowCommentModal(true);
                }}
                fromEvent={true}
                routeData={route.params}
              />
            )}
          </View>
        )}
      </ScrollView>
      <BottomSheet
        type={Platform.OS}
        textStyle={{textAlign: 'center'}}
        isVisible={showActionSheet}
        closeModal={() => setShowActionSheet(false)}
        optionList={moreOptions}
        onSelect={handleActions}
        cardStyle={
          isOrganizer ? {backgroundColor: colors.bottomSheetBgColor} : {}
        }
        cancelButtonTextStyle={isOrganizer ? {fontFamily: fonts.RBold} : {}}
      />

      <Modal
        isVisible={recurringEditModal}
        backdropColor="black"
        onBackdropPress={() => setRecurringEditModal(false)}
        onRequestClose={() => setRecurringEditModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={10}
        backdropTransitionOutTiming={10}
        style={{
          margin: 0,
          flex: 1,
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>
              {strings.updateRecurringEvent}
            </Text>
          </View>
          <View style={styles.separator} />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={recurringEditList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderDeleteRecurringOptions}
          />
        </View>
      </Modal>

      <CustomModalWrapper
        isVisible={infoModal}
        modalType={ModalTypes.style2}
        closeModal={() => {
          setInfoModal(false);
        }}
        externalSnapPoints={snapPoints}>
        <View
          onLayout={(event) => {
            const contentHeight = event.nativeEvent.layout.height + 80;

            setSnapPoints([
              // '50%',
              contentHeight,
              contentHeight,
              // Dimensions.get('window').height - 40,
            ]);
          }}>
          {infoType === Verbs.attendeeVerb ? (
            <View>
              <Text style={styles.titleText}>{strings.numberOfAttend}</Text>
              <Text style={styles.contentText}>{strings.attendyText}</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.titleText}>{strings.eventFeeTitle}</Text>
              <Text style={styles.contentText}>{strings.feeText}</Text>
            </View>
          )}
        </View>
      </CustomModalWrapper>

      <GoingUsersModal
        isVisible={showGoingModal}
        closeModal={() => setShowGoingModal(false)}
        goingList={going}
        ownerId={eventData.owner_id}
        authContext={authContext}
        onProfilePress={(obj) => {
          navigation.push('HomeStack', {
            screen: 'HomeScreen',
            params: {
              role: obj.entity_type,
              uid: obj.user_id ?? obj.group_id,
            },
          });
        }}
        onRemovePress={(item) => {
          Alert.alert(
            format(
              strings.areYouSureToRemove,
              item.full_name ?? item.group_name,
            ),
            strings.removeGoingModalText,
            [
              {text: strings.cancel},
              {
                text: strings.remove,
                style: 'destructive',
                onPress: () => {
                  removeAttendee(item);
                },
              },
            ],
            {cancelable: true},
          );
        }}
        onPressChat={() => {
          Alert.alert(strings.creatChatRoomForEvent, '', [
            {text: strings.cancel},
            {
              text: strings.createAndInvite,
              onPress: () => {},
            },
          ]);
        }}
        onPressInvoice={() => {
          setSendNewInvoice(true);
        }}
      />

      <SendNewInvoiceModal
        isVisible={sendNewInvoice}
        invoiceType={InvoiceType.Event}
        eventID={eventData.cal_id}
        member={going}
        onClose={() => {
          setShowActionSheet(false);
          setSendNewInvoice(false);
        }}
      />

      <EventLikersModal
        isVisible={openLikesModal}
        eventId={eventData.cal_id}
        authContext={authContext}
        closeModal={() => setOpenLikesModal(false)}
      />

      <LikersModal
        data={selectedPost}
        showLikeModal={showLikeModal}
        closeModal={() => setShowLikeModal(false)}
        onClickProfile={(obj = {}) => {
          navigation.push('HomeStack', {
            screen: 'HomeScreen',
            params: {
              uid: obj?.user_id,
              role: obj.user.data.entity_type,
            },
          });
        }}
        handleFollowUnfollow={handleFollowUnfollow}
      />

      <CommentModal
        postId={eventData.activity_id}
        showCommentModal={showCommentModal}
        updateCommentCount={(updatedCommentData) => {
          updateCommentCount(updatedCommentData);
          // setCommentCount(updatedCommentData?.count);
        }}
        closeModal={() => setShowCommentModal(false)}
        onProfilePress={(data = {}) => {
          setShowCommentModal(false);
          navigation.navigate('HomeStack', {
            screen: 'HomeScreen',
            params: {
              uid: data.userId,
              role: data.entityType,
            },
          });
        }}
        postOwnerId={selectedPost.actor?.id}
      />

      <ShareEventPostModal
        visible={visiblesharEventPostModal}
        onClose={() => setVisibleshareEventPostModal(false)}
        eventData={eventData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  onlineText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.themeColor,
    fontFamily: fonts.RBold,
    marginLeft: 10,
  },
  mainContainerStyle: {
    flex: 1,
  },
  sepratorViewStyle: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
  textValueStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  eventTitleStyle: {
    fontSize: 25,
    lineHeight: 35,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportTitleStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  firstButtonStyle: {
    margin: 0,
    height: 27,
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
  },
  attendTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    color: colors.themeColor,
  },
  inviteTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
  },
  containerStyle: {
    paddingHorizontal: 15,
  },
  divider: {
    height: 1,
    marginVertical: 25,
    backgroundColor: colors.grayBackgroundColor,
  },
  headerTextStyle: {
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 15,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  goingContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.thinDividerColor,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: colors.blackColor,
    fontFamily: fonts.RBold,
  },
  contentText: {
    color: colors.blackColor,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
  },
  filterTitle: {
    fontSize: 20,
    lineHeight: 25,
    color: colors.eventBlueColor,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
  moreLessText: {
    fontSize: 12,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  starProfile: {
    width: 15,
    height: 15,
    position: 'absolute',
    left: 26,
    bottom: 0,
  },
  seeAllText: {
    color: colors.themeColor,
  },
  textUrl: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
  },
  buttonContainer: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  tabContainerStyle: {
    backgroundColor: colors.whiteColor,
    marginVertical: 25,
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
    paddingBottom: 9,
  },
  tabItemText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  activeTabItem: {
    paddingBottom: 7,
    borderBottomWidth: 3,
    borderBottomColor: colors.tabFontColor,
  },
  activeTabItemText: {
    fontFamily: fonts.RBlack,
    color: colors.tabFontColor,
  },
  longTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  modalContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.35,
    backgroundColor: colors.lightWhite,
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
    paddingHorizontal: 15,
  },
  modalHeader: {
    paddingTop: 17,
    paddingBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  separator: {
    height: 1,
    backgroundColor: colors.bgColor,
  },
});
