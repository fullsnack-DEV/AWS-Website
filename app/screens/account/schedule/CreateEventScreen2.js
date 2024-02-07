/* eslint-disable no-sparse-arrays */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import {createEvent} from '../../../api/Schedule';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import EventVenueTogglebtn from '../../../components/Schedule/EventVenueTogglebtn';
import TCKeyboardView from '../../../components/TCKeyboardView';
import {getDayFromDate} from '../../../utils';
import uploadImages from '../../../utils/imageAction';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';

import TCThinDivider from '../../../components/TCThinDivider';
import {getGroupIndex} from '../../../api/elasticSearch';
import GroupIcon from '../../../components/GroupIcon';
import {getGroupDetails, getGroups, getTeamsOfClub} from '../../../api/Groups';
import TCFormProgress from '../../../components/TCFormProgress';
import BottomSheet from '../../../components/modals/BottomSheet';
import {
  singleEventPostPrivacy,
  singleEventPrivacy,
} from '../../../Constants/GeneralConstants';

export default function CreateEventScreen2({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [eventPosted, setEventPosted] = useState({
    value: 0,
    text: strings.scheduleOnlyText,
  });
  const isFocused = useIsFocused();
  const [eventStartDateTime] = useState(route.params?.eventStartDateTimeflag);

  const [is_Create, setIsCreate] = useState(false);

  const [loading, setloading] = useState(false);

  const [visibleWhoModal, setVisibleWhoModal] = useState(false);
  const [visibleWhoCanPostModal, setVisibleWhoCanPostModal] = useState(false);

  const [groupIDs] = useState(authContext.entity.obj.parent_groups ?? []);
  const [groups, setGroups] = useState([]);

  const [snapPoints, setSnapPoints] = useState([]);
  const [teamsClubsArray, setTeamsClubsArray] = useState([]);
  const [updatedJoin, setUpdatedJoin] = useState([]);
  const [updateWrite, setUpdateWrite] = useState([]);
  const see = 'see';
  const join = 'join';
  const posted = 'posted';
  const invite = 'invite';
  const post = 'post';

  const indexTwo = 1;
  const indexThree = 2;

  const [whoOption, setWhoOption] = useState();
  const [whoCanJoinOption, setWhoCanJoinOption] = useState({
    text: strings.everyoneRadio,
    value: singleEventPrivacy.everyone,
  });

  const [whoCanSeeOption, setWhoCanSeeOption] = useState({
    text: strings.everyoneRadio,
    value: singleEventPrivacy.everyone,
  });

  const [whoCanInviteOption, setWhoCanInviteOption] = useState({
    text: strings.attendeeRadioText,
    value: singleEventPrivacy.everyone,
  });

  const [whoCanPost, setWhoCanPost] = useState({
    text: strings.everyoneRadio,
    value: singleEventPrivacy.everyone,
  });

  const [groupsSeeList, setGroupsSeeList] = useState(
    route.params?.groupsSeeListFlag ?? [],
  );
  const [groupsJoinList, setGroupsJoinList] = useState(
    route.params?.groupsJoinListFlag ?? [],
  );

  const [selectWeekMonth] = useState(route.params?.selectWeekMonthFlag);
  const [teamData, setTeamData] = useState({});

  const automatePrivacyOptions = (item) => {
    if (
      authContext.entity.role === Verbs.entityTypeUser ||
      authContext.entity.role === Verbs.entityTypePlayer
    ) {
      if (item.text === strings.everyoneTitleText) {
        setWhoCanJoinOption({
          text: strings.everyoneTitleText,
          value: singleEventPrivacy.everyone,
        });

        setWhoCanPost({
          text: strings.everyoneTitleText,
          value: singleEventPrivacy.everyone,
        });

        const updateJoin = [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followersRadio,
            value: singleEventPrivacy.followers,
            disable: false,
          },
          {
            text: strings.invitedOnly,
            value: singleEventPrivacy.invitedOnly,
            disable: false,
          },
        ];

        const updatePost = [
          {
            text: strings.everyoneRadio,
            value: singleEventPostPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followersMyTeamClub,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.attendeesAndInvited,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
        ];
        getOptions(true);

        setUpdatedJoin(updateJoin);
        setUpdateWrite(updatePost);
      } else if (item.text === strings.followersMyTeamClub) {
        setWhoCanJoinOption({
          text: strings.followersRadio,
          value: singleEventPostPrivacy.followersMyTeamClub,
        });

        setWhoCanPost({
          text: strings.followersMyTeamClub,
          value: singleEventPostPrivacy.followersMyTeamClub,
        });

        const updateJoin = [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: true,
          },
          {
            text: strings.followersRadio,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.invitedOnly,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
        ];

        const updatePost = [
          {
            text: strings.everyoneRadio,
            value: singleEventPostPrivacy.everyone,
            disable: true,
          },
          {
            text: strings.followersMyTeamClub,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.attendeesAndInvited,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
        ];
        getOptions(true);

        setUpdatedJoin(updateJoin);
        setUpdateWrite(updatePost);
      } else if (item.text === strings.myTeamClub) {
        setWhoCanJoinOption({
          text: strings.invitedOnly,
          value: singleEventPostPrivacy.attendesAndInvites,
        });

        setWhoCanPost({
          text: strings.attendeesAndInvited,
          value: singleEventPostPrivacy.attendesAndInvites,
        });

        const updateJoin = [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: true,
          },
          {
            text: strings.followersRadio,
            value: singleEventPrivacy.followers,
            disable: true,
          },
          {
            text: strings.invitedOnly,
            value: singleEventPrivacy.invitedOnly,
            disable: false,
          },
        ];

        const updatePost = [
          {
            text: strings.everyoneRadio,
            value: singleEventPostPrivacy.everyone,
            disable: true,
          },
          {
            text: strings.followersMyTeamClub,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: true,
          },
          {
            text: strings.attendeesAndInvited,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
        ];
        getOptions(true);

        setUpdatedJoin(updateJoin);
        setUpdateWrite(updatePost);
      }
    }
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      if (authContext.entity.obj.sport_type === authContext.entity.obj.sport) {
        if (item.text === strings.everyoneTitleText) {
          setWhoCanJoinOption({
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
          });

          // for Update
          const UpdatedJoin = [
            {text: strings.everyoneTitleText, value: 0, disable: false},
            {text: strings.followersRadio, value: 3, disable: false},
            {text: strings.teamAndMembersText, value: 2, disable: false},
            {text: strings.inviteOnly, value: 1, disable: false},
          ];

          setWhoCanPost({
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
          });

          const UpdatedPost = [
            {
              text: strings.everyoneRadio,
              value: singleEventPostPrivacy.everyone,
              disable: false,
            },
            {
              text: strings.followersAndClub,
              value: singleEventPostPrivacy.followersAndClubs,
              disable: false,
            },
            {
              text: strings.teamMembersAndClub,
              value: singleEventPostPrivacy.teamMembersAndClubs,
              disable: false,
            },
            {
              text: strings.attendeeRadioText,
              value: singleEventPostPrivacy.attendes,
              disable: false,
            },
          ];
          setUpdatedJoin(UpdatedJoin);
          setUpdateWrite(UpdatedPost);
          getOptions(true);
        } else if (item.text === strings.followersAndClub) {
          setWhoCanJoinOption({
            text: strings.followersRadio,
            value: singleEventPostPrivacy.attendesAndInvites,
          });

          setWhoCanPost({
            text: strings.followersAndClub,
            value: singleEventPostPrivacy.followersAndClubs,
          });

          const UpdatedJoin = [
            {
              text: strings.everyoneTitleText,
              value: singleEventPrivacy.everyone,
              disable: true,
            },
            {
              text: strings.followersRadio,
              value: singleEventPostPrivacy.attendesAndInvites,
              disable: false,
            },
            {
              text: strings.teamAndMembersText,
              value: singleEventPostPrivacy.followersAndClubs,
              disable: false,
            },
            {
              text: strings.inviteOnly,
              value: singleEventPostPrivacy.everyone,
              disable: false,
            },
          ];

          const UpdatedPost = [
            {
              text: strings.everyoneRadio,
              value: singleEventPostPrivacy.everyone,
              disable: true,
            },
            {
              text: strings.followersAndClub,
              value: singleEventPostPrivacy.followersAndClubs,
              disable: false,
            },
            {
              text: strings.teamMembersAndClub,
              value: singleEventPostPrivacy.teamMembersAndClubs,
              disable: false,
            },
            {
              text: strings.attendeeRadioText,
              value: singleEventPostPrivacy.attendes,
              disable: false,
            },
          ];

          setUpdateWrite(UpdatedPost);
          setUpdatedJoin(UpdatedJoin);
          getOptions(true);
        } else if (item.text === strings.teamMembersAndClub) {
          setWhoCanJoinOption({
            text: strings.teamAndMembersText,
            value: singleEventPostPrivacy.followersMyTeamClub,
          });

          const UpdatedJoin = [
            {
              text: strings.everyoneTitleText,
              value: singleEventPrivacy.everyone,
              disable: true,
            },
            {
              text: strings.followersRadio,
              value: singleEventPostPrivacy.attendesAndInvites,
              disable: true,
            },
            {
              text: strings.teamAndMembersText,
              value: singleEventPostPrivacy.followersMyTeamClub,
              disable: false,
            },
            {
              text: strings.inviteOnly,
              value: singleEventPostPrivacy.everyone,
              disable: false,
            },
          ];

          setWhoCanPost({
            text: strings.teamMembersAndClub,
            value: singleEventPostPrivacy.teamMembersAndClubs,
          });

          const UpdatedPost = [
            {
              text: strings.everyoneRadio,
              value: singleEventPostPrivacy.everyone,
              disable: true,
            },
            {
              text: strings.followersAndClub,
              value: singleEventPostPrivacy.followersAndClubs,
              disable: true,
            },
            {
              text: strings.teamMembersAndClub,
              value: singleEventPostPrivacy.teamMembersAndClubs,
              disable: false,
            },
            {
              text: strings.attendeeRadioText,
              value: singleEventPostPrivacy.attendes,
              disable: false,
            },
          ];
          setUpdatedJoin(UpdatedJoin);
          getOptions(true);
          setUpdateWrite(UpdatedPost);
        } else if (item.text === strings.attendeesAndInvited) {
          setWhoCanJoinOption({
            text: strings.inviteOnly,
            value: singleEventPostPrivacy.everyone,
          });

          const UpdatedJoin = [
            {
              text: strings.everyoneTitleText,
              value: singleEventPrivacy.everyone,
              disable: true,
            },
            {
              text: strings.followersRadio,
              value: singleEventPostPrivacy.attendesAndInvites,
              disable: true,
            },
            {
              text: strings.teamAndMembersText,
              value: singleEventPostPrivacy.followersMyTeamClub,
              disable: true,
            },
            {
              text: strings.inviteOnly,
              value: singleEventPostPrivacy.everyone,
              disable: false,
            },
          ];

          setWhoCanPost({
            text: strings.attendeeRadioText,
            value: singleEventPrivacy.everyone,
          });

          const UpdatedPost = [
            {
              text: strings.everyoneRadio,
              value: singleEventPostPrivacy.everyone,
              disable: true,
            },
            {
              text: strings.followersAndClub,
              value: singleEventPostPrivacy.followersAndClubs,
              disable: true,
            },
            {
              text: strings.teamMembersAndClub,
              value: singleEventPostPrivacy.teamMembersAndClubs,
              disable: true,
            },
            {
              text: strings.attendeeRadioText,
              value: singleEventPostPrivacy.attendes,
              disable: false,
            },
          ];
          setUpdatedJoin(UpdatedJoin);
          getOptions(true);
          setUpdateWrite(UpdatedPost);
        }
      }
      if (item.text === strings.everyoneTitleText) {
        setWhoCanJoinOption({
          text: strings.everyoneTitleText,
          value: singleEventPrivacy.everyone,
        });

        setWhoCanPost({
          text: strings.everyoneTitleText,
          value: singleEventPrivacy.everyone,
        });
      } else if (item.text === strings.followersAndClub) {
        setWhoCanJoinOption({
          text: strings.followersRadio,
          value: singleEventPostPrivacy.attendesAndInvites,
        });

        setWhoCanPost({
          text: strings.followersAndClub,
          value: singleEventPostPrivacy.followersAndClubs,
        });
      } else if (item.text === strings.teamMembersAndClub) {
        setWhoCanJoinOption({
          text: strings.teamAndMembersText,
          value: singleEventPostPrivacy.followersMyTeamClub,
        });

        setWhoCanPost({
          text: strings.teamMembersAndClub,
          value: singleEventPostPrivacy.teamMembersAndClubs,
        });
      } else if (item.text === strings.attendeesAndInvited) {
        setWhoCanJoinOption({
          text: strings.inviteOnly,
          value: singleEventPostPrivacy.everyone,
        });

        setWhoCanPost({
          text: strings.attendeeRadioText,
          value: singleEventPrivacy.everyone,
        });
      }
    }

    if (authContext.entity.role === Verbs.entityTypeClub) {
      if (item.text === strings.everyoneTitleText) {
        setWhoCanJoinOption({
          text: strings.everyoneTitleText,
          value: singleEventPrivacy.everyone,
        });

        setWhoCanPost({
          text: strings.everyoneTitleText,
          value: singleEventPostPrivacy.everyone,
        });

        const updateJoin = [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followerTitleText,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
          {
            text: strings.clubAndTheirMembers,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
          {
            text: strings.invitedOnly,
            value: singleEventPostPrivacy.everyone,
            disable: false,
          },
        ];

        const UpdatedPost = [
          {
            text: strings.everyoneRadio,
            value: singleEventPostPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followersRadio,
            value: singleEventPostPrivacy.allFollowers,
            disable: false,
          },
          {
            text: strings.clubMembersRadio,
            value: singleEventPostPrivacy.allClubs,
            disable: false,
          },
          {
            text: strings.attendeeRadioText,
            value: singleEventPostPrivacy.allAttended,
            disable: false,
          },
          ,
        ];
        setUpdatedJoin(updateJoin);
        setUpdateWrite(UpdatedPost);
      } else if (item.text === strings.followersRadio) {
        setWhoCanJoinOption({
          text: strings.followersRadio,
          value: singleEventPostPrivacy.attendesAndInvites,
        });

        setWhoCanPost({
          text: strings.followersRadio,
          value: singleEventPostPrivacy.attendesAndInvites,
        });

        const updateJoin = [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: true,
          },
          {
            text: strings.followerTitleText,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
          {
            text: strings.clubAndTheirMembers,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.invitedOnly,
            value: singleEventPostPrivacy.everyone,
            disable: false,
          },
        ];

        const UpdatedPost = [
          {
            text: strings.everyoneRadio,
            value: singleEventPostPrivacy.everyone,
            disable: true,
          },
          {
            text: strings.followersRadio,
            value: singleEventPostPrivacy.allFollowers,
            disable: false,
          },
          {
            text: strings.clubMembersRadio,
            value: singleEventPostPrivacy.allClubs,
            disable: false,
          },
          {
            text: strings.attendeeRadioText,
            value: singleEventPostPrivacy.allAttended,
            disable: false,
          },
          ,
        ];
        setUpdatedJoin(updateJoin);
        setUpdateWrite(UpdatedPost);
      } else if (item.text === strings.clubAndTheirMembers) {
        setWhoCanJoinOption({
          text: strings.clubAndTheirMembers,
          value: singleEventPostPrivacy.followersMyTeamClub,
        });

        setWhoCanPost({
          text: strings.clubMembersRadio,
          value: singleEventPostPrivacy.allClubs,
        });

        const updateJoin = [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.followersMyTeamClub,
            disable: true,
          },
          {
            text: strings.followerTitleText,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: true,
          },
          {
            text: strings.clubAndTheirMembers,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.invitedOnly,
            value: singleEventPostPrivacy.everyone,
            disable: false,
          },
        ];

        const UpdatedPost = [
          {
            text: strings.everyoneRadio,
            value: singleEventPostPrivacy.everyone,
            disable: true,
          },
          {
            text: strings.followersRadio,
            value: singleEventPostPrivacy.allFollowers,
            disable: true,
          },
          {
            text: strings.clubMembersRadio,
            value: singleEventPostPrivacy.allClubs,
            disable: false,
          },
          {
            text: strings.attendeeRadioText,
            value: singleEventPostPrivacy.allAttended,
            disable: false,
          },
          ,
        ];
        setUpdatedJoin(updateJoin);
        setUpdateWrite(UpdatedPost);
      } else if (item.text === strings.attendeesAndInvited) {
        setWhoCanJoinOption({
          text: strings.inviteOnly,
          value: singleEventPostPrivacy.everyone,
        });

        setWhoCanPost({
          text: strings.attendeeRadioText,
          value: singleEventPrivacy.followersMyTeamClub,
        });

        const updateJoin = [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: true,
          },
          {
            text: strings.followerTitleText,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: true,
          },
          {
            text: strings.clubAndTheirMembers,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: true,
          },
          {
            text: strings.invitedOnly,
            value: singleEventPostPrivacy.everyone,
            disable: false,
          },
        ];

        const UpdatedPost = [
          {
            text: strings.everyoneRadio,
            value: singleEventPostPrivacy.everyone,
            disable: true,
          },
          {
            text: strings.followersRadio,
            value: singleEventPostPrivacy.allFollowers,
            disable: true,
          },
          {
            text: strings.clubMembersRadio,
            value: singleEventPostPrivacy.allClubs,
            disable: true,
          },
          {
            text: strings.attendeeRadioText,
            value: singleEventPostPrivacy.allAttended,
            disable: false,
          },
          ,
        ];
        setUpdatedJoin(updateJoin);
        setUpdateWrite(UpdatedPost);
      }
    }
  };

  const createEventDone = (data) => {
    // setloading(true);
    const arr = {...data};
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole =
      entity.role === Verbs.entityTypeUser ? 'users' : 'groups';

    if (authContext.entity.role === Verbs.entityTypeClub) {
      arr.owner_sub_type = Verbs.entityTypeClub;
    }
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      if (authContext.entity.obj.sport_type === authContext.entity.obj.sport) {
        arr.owner_sub_type = Verbs.entityTypeTeam;
      } else {
        arr.owner_sub_type = Verbs.entityTypeDoubleTeam;
      }
    }

    if (
      authContext.entity.role === Verbs.entityTypeUser ||
      authContext.entity.role === Verbs.entityTypePlayer
    ) {
      arr.owner_sub_type = Verbs.entityTypeUser;
    }
    if (is_Create) {
      arr.event_share_groups = teamsClubsArray;
    }

    let rule;
    if (selectWeekMonth === Verbs.eventRecurringEnum.Daily) {
      rule = 'FREQ=DAILY';
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.Weekly) {
      rule = 'FREQ=WEEKLY';
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.WeekOfMonth) {
      rule = `FREQ=MONTHLY;BYDAY=${getDayFromDate(eventStartDateTime)
        .substring(0, 2)
        .toUpperCase()};BYSETPOS=${countNumberOfWeeks(eventStartDateTime)}`;
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.DayOfMonth) {
      rule = `FREQ=MONTHLY;BYMONTHDAY=${eventStartDateTime.getDate()}`;
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.WeekOfYear) {
      rule = `FREQ=YEARLY;BYDAY=${getDayFromDate(eventStartDateTime)
        .substring(0, 2)
        .toUpperCase()};BYSETPOS=${countNumberOfWeeks(eventStartDateTime)}`;
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.DayOfYear) {
      rule = `FREQ=YEARLY;BYMONTHDAY=${eventStartDateTime.getDate()};BYMONTH=${eventStartDateTime.getMonth()}`;
    }

    if (rule) {
      arr.rrule = rule;
    }

    createEvent(entityRole, uid, arr, authContext)
      .then((response) => {
        setTimeout(() => {
          setloading(false);
          navigation.navigate('App', {
            screen: 'Schedule',
            params: {
              event: response?.payload[0],
            },
          });
        }, 1000);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.alertmessagetitle, e.messages);
      });
  };

  const getTeamsforClubs = () => {
    getTeamsOfClub(authContext.entity.obj.group_id, authContext)
      .then((res) => {
        setGroups(res.payload);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => {
    automatePrivacyOptions({
      text: strings.everyoneRadio,
      value: 0,
    });
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      getGroupDetails(authContext.entity.uid, authContext)
        .then((res) => {
          const groupID = res.payload?.parent_groups ?? [];

          setTeamData(res?.payload);

          const groupQuery = {
            query: {
              terms: {
                _id: groupID,
              },
            },
          };

          getGroupIndex(groupQuery)
            .then((response) => {
              setGroups(response);

              setTeamsClubsArray(response.map((item) => item.group_id));
            })
            .catch((e) => {
              Alert.alert('', e.messages);
            });
        })
        .catch((e) => {
          console.log(e.message);
        });
    } else {
      getTeamsforClubs();
    }
  }, [isFocused]);

  const generateRandomImage = () => {
    const image1 = 'backgroundFullImage.png';
    const image2 = 'backgroundFullImage1.png';
    const imageUrls = [image1, image2];
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
  };

  const onDonePress = () => {
    setloading(true);
    const routeData = route.params?.createEventData;
    routeData.event_posted_at = eventPosted;

    routeData.who_can_invite = {...whoCanInviteOption};
    routeData.who_can_see = {...whoCanSeeOption};
    routeData.who_can_join = {...whoCanJoinOption};

    routeData.who_can_post = {...whoCanPost};

    if (route.params?.backgroundImageChangedFlag) {
      const imageArray = [];
      imageArray.push({path: route.params?.backgroundThumbnailFlag});
      uploadImages(imageArray, authContext)
        .then((responses) => {
          const attachments = responses.map((item) => ({
            type: 'image',
            url: item.fullImage,
            thumbnail: item.thumbnail,
          }));

          let bgInfo = attachments[0];
          if (attachments.length > 1) {
            bgInfo = attachments[1];
          }
          routeData.background_thumbnail = bgInfo.thumbnail;
          routeData.background_full_image = bgInfo.url;

          createEventDone(routeData);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.appName, e.messages);
          }, 0.1);
        });
    } else {
      const image = `${authContext.baseUrlEventImages}${generateRandomImage()}`;

      routeData.background_thumbnail = image;
      routeData.background_full_image = image;
      createEventDone(routeData);
    }
  };

  const getOptions = (UpdateJoin) => {
    if (
      authContext.entity.role === Verbs.entityTypeUser ||
      authContext.entity.role === Verbs.entityTypePlayer
    ) {
      if (whoOption === see) {
        return [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followersMyTeamClub,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.myTeamClub,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },

          {
            text: strings.attendeesAndInvited,
            value: singleEventPostPrivacy.allClubs,
            disable: false,
          },
        ];
      }

      if (whoOption === join) {
        if (UpdateJoin === undefined) {
          return updatedJoin;
        }
        return [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followersRadio,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.invitedOnly,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
        ];
      }

      if (whoOption === invite) {
        return [
          {
            text: strings.attendeeRadioText,
            value: singleEventPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.onlymeTitleText,
            value: singleEventPostPrivacy.followersAndClubs,
            disable: false,
          },
        ];
      }
      if (whoOption === post) {
        if (UpdateJoin === undefined) {
          return updateWrite;
        }
        return [
          {
            text: strings.everyoneRadio,
            value: singleEventPostPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followersMyTeamClub,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.attendeesAndInvited,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
        ];
      }
    }

    if (authContext.entity.role === Verbs.entityTypeTeam) {
      if (authContext.entity.obj.sport_type === authContext.entity.obj.sport) {
        if (whoOption === see) {
          return [
            {
              text: strings.everyoneTitleText,
              value: singleEventPrivacy.everyone,
              disable: false,
            },
            {
              text: strings.followersAndClub,
              value: singleEventPostPrivacy.attendesAndInvites,
              disable: false,
            },
            {
              text: strings.teamMembersAndClub,
              value: singleEventPostPrivacy.followersMyTeamClub,
              disable: false,
            },
            {
              text: strings.attendeesAndInvited,
              value: singleEventPostPrivacy.onlyInvited,
              disable: false,
            },
          ];
        }

        if (whoOption === join) {
          if (UpdateJoin === undefined) {
            return updatedJoin;
          }
          return [
            {
              text: strings.everyoneTitleText,
              value: singleEventPrivacy.everyone,
              disable: false,
            },
            {
              text: strings.followersRadio,
              value: singleEventPostPrivacy.attendesAndInvites,
              disable: false,
            },
            {
              text: strings.teamAndMembersText,
              value: singleEventPostPrivacy.followersMyTeamClub,
              disable: false,
            },
            {
              text: strings.inviteOnly,
              value: singleEventPostPrivacy.everyone,
              disable: false,
            },
          ];
        }

        if (whoOption === invite) {
          return [
            {
              text: strings.attendeeRadioText,
              value: singleEventPrivacy.everyone,
              disable: false,
            },
            {
              text: strings.onlyTeam,
              value: singleEventPostPrivacy.everyone,
              disable: false,
            },
          ];
        }

        if (whoOption === post) {
          if (UpdateJoin === undefined) {
            return updateWrite;
          }
          return [
            {
              text: strings.everyoneRadio,
              value: singleEventPostPrivacy.everyone,
              disable: false,
            },
            {
              text: strings.followersAndClub,
              value: singleEventPostPrivacy.followersAndClubs,
              disable: false,
            },
            {
              text: strings.teamMembersAndClub,
              value: singleEventPostPrivacy.teamMembersAndClubs,
              disable: false,
            },
            {
              text: strings.attendeeRadioText,
              value: singleEventPostPrivacy.attendes,
              disable: false,
            },
          ];
        }
      } else {
        if (whoOption === see) {
          return [
            {
              text: strings.everyoneTitleText,
              value: singleEventPrivacy.everyone,
            },
            {
              text: strings.followersAndClub,
              value: singleEventPostPrivacy.attendesAndInvites,
            },
            {
              text: strings.teamMembersAndClub,
              value: singleEventPostPrivacy.followersMyTeamClub,
            },
            {
              text: strings.attendeesAndInvited,
              value: singleEventPostPrivacy.onlyInvited,
            },
          ];
        }

        if (whoOption === join) {
          return [
            {
              text: strings.everyoneTitleText,
              value: singleEventPrivacy.everyone,
            },
            {
              text: strings.followersRadio,
              value: singleEventPostPrivacy.attendesAndInvites,
            },
            {
              text: strings.teamMembers,
              value: singleEventPostPrivacy.followersMyTeamClub,
            },
            {
              text: strings.invitedOnly,
              value: singleEventPostPrivacy.everyone,
            },
          ];
        }

        if (whoOption === invite) {
          return [
            {
              text: strings.attendeeRadioText,
              value: singleEventPrivacy.everyone,
            },
            {
              text: strings.onlyTeam,
              value: singleEventPostPrivacy.everyone,
            },
          ];
        }

        if (whoOption === post) {
          return [
            {
              text: strings.everyoneRadio,
              value: singleEventPostPrivacy.everyone,
            },
            {
              text: strings.followersAndClub,
              value: singleEventPostPrivacy.followersAndClubs,
            },
            {
              text: strings.teamMembersAndClub,
              value: singleEventPostPrivacy.teamMembersAndClubs,
            },
            {
              text: strings.attendeeRadioText,
              value: singleEventPostPrivacy.onlyInvited,
            },
          ];
        }
      }
    }
    if (authContext.entity.role === Verbs.entityTypeClub) {
      if (whoOption === see) {
        return [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followerTitleText,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
          {
            text: strings.clubAndTheirMembers,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.attendeesAndInvited,
            value: singleEventPostPrivacy.onlyInvited,
            disable: false,
          },
        ];
      }

      if (whoOption === join) {
        if (UpdateJoin === undefined) {
          return updatedJoin;
        }
        return [
          {
            text: strings.everyoneTitleText,
            value: singleEventPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followerTitleText,
            value: singleEventPostPrivacy.attendesAndInvites,
            disable: false,
          },
          {
            text: strings.clubAndTheirMembers,
            value: singleEventPostPrivacy.followersMyTeamClub,
            disable: false,
          },
          {
            text: strings.invitedOnly,
            value: singleEventPostPrivacy.onlyInvited,
            disable: false,
          },
        ];
      }

      if (whoOption === invite) {
        return [
          {
            text: strings.attendeeRadioText,
            value: singleEventPrivacy.everyone,
          },
          {
            text: strings.onlyClub,
            value: singleEventPostPrivacy.everyone,
          },
        ];
      }

      if (whoOption === post) {
        if (UpdateJoin === undefined) {
          return updateWrite;
        }
        return [
          {
            text: strings.everyoneRadio,
            value: singleEventPostPrivacy.everyone,
            disable: false,
          },
          {
            text: strings.followersRadio,
            value: singleEventPostPrivacy.allFollowers,
            disable: false,
          },
          {
            text: strings.clubMembersRadio,
            value: singleEventPostPrivacy.allClubs,
            disable: false,
          },
          {
            text: strings.attendeeRadioText,
            value: singleEventPostPrivacy.allAttended,
            disable: false,
          },
        ];
      }
    }
    return [];
  };

  const getShowEventPostRenderCondition = () => {
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      if (
        teamData?.parent_groups?.length > 0 &&
        authContext.entity.obj.sport_type === authContext.entity.obj.sport
      ) {
        return true;
      }
    } else if (
      authContext.entity.role === Verbs.entityTypeClub &&
      groups.length > 0
    ) {
      return true;
    }
    return false;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.createAnEvent}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() => {
          onDonePress();
        }}
      />

      <TCFormProgress totalSteps={2} curruentStep={2} />
      <ActivityLoader visible={loading} />

      <TCKeyboardView>
        <ScrollView bounces={false} nestedScrollEnabled={true}>
          <View
            style={[
              styles.containerStyle,
              {marginHorizontal: 15, marginTop: 15},
            ]}>
            {/* Second Screen Content */}

            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,

                lineHeight: 24,
                marginBottom: 15,
              }}>
              {strings.addMoreDetailText}
            </Text>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanSee}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption(see);

                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanSeeOption.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanJoin}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption(join);
                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanJoinOption.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanInvite}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption(invite);
                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanInviteOption.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow2}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* who Can write post on Event Home */}

            <View style={[styles.containerStyle, {marginBottom: 0}]}>
              <Text
                style={[styles.headerTextStyle, {textTransform: 'uppercase'}]}>
                {strings.whoCanWritePostoneventHome}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption(post);
                  setVisibleWhoCanPostModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanPost.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <TCThinDivider
              height={7}
              width="130%"
              marginTop={25}
              marginBottom={15}
            />

            {(authContext.entity.role !== Verbs.entityTypePlayer ||
              authContext.entity.role !== Verbs.entityTypeUser) && (
              <>
                <EventItemRender
                  containerStyle={{position: 'relative', marginBottom: 35}}
                  headerTextStyle={{
                    fontSize: 16,
                    fontFamily: fonts.RBold,
                    color: colors.lightBlackColor,
                  }}
                  title={strings.createEventPostTitle}
                  isRequired={true}>
                  <EventVenueTogglebtn
                    offline={!is_Create}
                    firstTabTitle={strings.doNotCreateText}
                    secondTabTitle={strings.createText}
                    onFirstTabPress={() => {
                      setIsCreate(false);
                      setEventPosted({
                        value: 0,
                        text: strings.scheduleOnlyText,
                      });
                    }}
                    onSecondTabPress={() => {
                      setIsCreate(true);

                      setEventPosted({
                        value: 1,
                        text: strings.scheduleAndPostText,
                      });
                    }}
                    activeEventPrivacyText={{fontSize: 11}}
                    inactiveEventPrivacyText={{fontSize: 11}}
                  />

                  {is_Create ? (
                    <>
                      <Text
                        style={{
                          fontFamily: fonts.RRegular,
                          fontSize: 16,
                          lineHeight: 24,
                        }}>
                        {authContext.entity.role === Verbs.entityTypePlayer ||
                        authContext.entity.role === Verbs.entityTypeUser
                          ? strings.shareEventUserText
                          : format(
                              strings.shareEventsubText,

                              authContext.entity.role,
                            )}
                      </Text>

                      {getShowEventPostRenderCondition() && (
                        <View
                          style={{
                            marginTop: 40,
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: fonts.RBold,
                              textTransform: 'uppercase',
                              lineHeight: 24,
                            }}>
                            {strings.shareEventPostText}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: fonts.RRegular,
                              lineHeight: 24,
                              marginTop: 10,
                            }}>
                            {format(
                              strings.selectClubText,
                              authContext.entity.role === Verbs.entityTypeClub
                                ? strings.teamsText
                                : strings.clubsText,
                            )}
                          </Text>

                          <FlatList
                            data={groups}
                            keyExtractor={(item) => item.group_id}
                            style={{marginTop: 24}}
                            bounces={false}
                            renderItem={({item}) => (
                              <TouchableOpacity
                                onPress={() => {
                                  const i = teamsClubsArray.indexOf(
                                    item.group_id,
                                  );

                                  if (i !== -1) {
                                    const newArray = [...teamsClubsArray];
                                    newArray.splice(i, 1);
                                    setTeamsClubsArray(newArray);
                                  } else {
                                    setTeamsClubsArray((prevArray) => [
                                      ...prevArray,
                                      item.group_id,
                                    ]);
                                  }
                                }}
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginHorizontal: 15,
                                  marginVertical: 10,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <GroupIcon
                                    imageUrl={item?.thumbnail}
                                    groupName={
                                      item?.group_name ?? item?.full_name
                                    }
                                    entityType={item.entity_type}
                                    containerStyle={{
                                      width: 30,
                                      height: 30,
                                      borderWidth: 1,
                                    }}
                                    textstyle={{
                                      fontSize: 10,
                                      marginTop: 1,
                                    }}
                                    placeHolderStyle={{
                                      width: 12,
                                      height: 12,
                                      bottom: -2,
                                      right: -2,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      lineHeight: 24,
                                      fontFamily: fonts.RRegular,
                                      marginLeft: 8,
                                      marginTop: 2,
                                    }}>
                                    {item?.group_name}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    const i = teamsClubsArray.indexOf(
                                      item.group_id,
                                    );

                                    if (i !== -1) {
                                      const newArray = [...teamsClubsArray];
                                      newArray.splice(i, 1);
                                      setTeamsClubsArray(newArray);
                                    } else {
                                      setTeamsClubsArray((prevArray) => [
                                        ...prevArray,
                                        item.group_id,
                                      ]);
                                    }
                                  }}>
                                  <Image
                                    source={
                                      teamsClubsArray.includes(item.group_id)
                                        ? images.orangeCheckBox
                                        : images.whiteUncheck
                                    }
                                    style={{
                                      height: 22,
                                      width: 22,
                                      resizeMode: 'contain',
                                      alignSelf: 'center',
                                      borderWidth: 1,
                                      borderColor: colors.veryLightGray,
                                      borderRadius: 7,
                                    }}
                                  />
                                </TouchableOpacity>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      )}
                    </>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontFamily: fonts.RRegular,
                          fontSize: 16,
                          lineHeight: 24,
                        }}>
                        {strings.noShareEventText}
                      </Text>
                    </>
                  )}
                </EventItemRender>
              </>
            )}
          </View>
        </ScrollView>
      </TCKeyboardView>

      <BottomSheet
        isVisible={visibleWhoCanPostModal || visibleWhoModal}
        closeModal={() => {
          setVisibleWhoCanPostModal(false);

          setVisibleWhoModal(false);
        }}
        forObjArray={true}
        optionList={getOptions()}
        onSelect={(item) => {
          if (whoOption === see) {
            setWhoCanSeeOption(item);

            automatePrivacyOptions(item);
          } else if (whoOption === join) {
            setWhoCanJoinOption(item);
          } else if (whoOption === invite) {
            setWhoCanInviteOption(item);
          } else if (whoOption === post) {
            setWhoCanPost(item);
          } else {
            setEventPosted(item);
          }

          setVisibleWhoModal(false);
          setVisibleWhoCanPostModal(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInputDropStyle: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  dropContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 5,
    width: wp('94%'),
    height: 40,
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    alignItems: 'center',
  },

  containerStyle: {
    marginBottom: 35,
  },
  headerTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    marginVertical: 3,
  },
  downArrowWhoCan: {
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 10,
    right: 15,
  },
});
