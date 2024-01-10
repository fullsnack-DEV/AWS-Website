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

  // Dimensions,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import {createEvent} from '../../../api/Schedule';
// import TCProfileView from '../../../components/TCProfileView';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import EventVenueTogglebtn from '../../../components/Schedule/EventVenueTogglebtn';
import TCKeyboardView from '../../../components/TCKeyboardView';
import {getDayFromDate} from '../../../utils';
import uploadImages from '../../../utils/imageAction';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import GroupList from '../../../components/Schedule/GroupEvent/GroupList';
import TCThinDivider from '../../../components/TCThinDivider';
import {getGroupIndex} from '../../../api/elasticSearch';
import GroupIcon from '../../../components/GroupIcon';
import {getTeamsOfClub} from '../../../api/Groups';
import TCFormProgress from '../../../components/TCFormProgress';

export default function CreateEventScreen2({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [eventPosted, setEventPosted] = useState({
    value: 1,
    text: strings.scheduleAndPostText,
  });
  const [eventStartDateTime] = useState(route.params?.eventStartDateTimeflag);

  const [is_Create, setIsCreate] = useState(true);

  const [loading, setloading] = useState(false);

  const [visibleWhoModal, setVisibleWhoModal] = useState(false);
  const [visibleWhoCanPostModal, setVisibleWhoCanPostModal] = useState(false);
  const [groupIDs] = useState(authContext.entity.obj.parent_groups ?? []);
  const [groups, setGroups] = useState([]);

  const [snapPoints, setSnapPoints] = useState([]);

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
    value: 0,
  });

  const [whoCanSeeOption, setWhoCanSeeOption] = useState({
    text: strings.everyoneRadio,
    value: 0,
  });

  const [whoCanInviteOption, setWhoCanInviteOption] = useState({
    text: strings.attendeeRadioText,
    value: 0,
  });

  const [whoCanPost, setWhoCanPost] = useState({
    text: strings.everyoneRadio,
    value: 0,
  });

  const [groupsSeeList, setGroupsSeeList] = useState(
    route.params?.groupsSeeListFlag ?? [],
  );
  const [groupsJoinList, setGroupsJoinList] = useState(
    route.params?.groupsJoinListFlag ?? [],
  );

  const [selectWeekMonth] = useState(route.params?.selectWeekMonthFlag);

  const renderWhoCan = ({item}) => (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
      }}
      onPress={() => {
        if (whoOption === see) {
          setWhoCanSeeOption(item);
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
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 15,
          flex: 1,
        }}>
        <Text style={styles.languageList}>{item.text}</Text>
        <View style={styles.checkbox}>
          {(whoOption === see && whoCanSeeOption.value === item?.value) ||
          (whoOption === join && whoCanJoinOption.value === item?.value) ||
          (whoOption === posted && eventPosted.value === item?.value) ||
          (whoOption === invite && whoCanInviteOption.value === item?.value) ||
          (whoOption === post && whoCanPost.value === item?.value) ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const createEventDone = (data) => {
    setloading(true);
    const arr = {...data};
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole =
      entity.role === Verbs.entityTypeUser ? 'users' : 'groups';

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
          console.log(response, 'from after creating event');
        }, 1000);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.alertmessagetitle, e.messages);
      });
  };

  // get team of clubs

  const getTeamsforClubs = () => {
    getTeamsOfClub(authContext.entity.obj.group_id, authContext)
      .then((res) => {
        setGroups(res.payload);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  // get clubs for Team

  useEffect(() => {
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      const groupQuery = {
        query: {
          terms: {
            _id: groupIDs,
          },
        },
      };

      getGroupIndex(groupQuery)
        .then((response) => {
          setGroups(response);
        })
        .catch((e) => {
          Alert.alert('', e.messages);
        });
    } else {
      getTeamsforClubs();
    }
  }, []);

  const generateRandomImage = () => {
    const image1 = 'backgroundFullImage.png';
    const image2 = 'backgroundFullImage1.png';
    const imageUrls = [image1, image2];
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
  };

  const onDonePress = () => {
    const routeData = route.params?.createEventData;
    routeData.event_posted_at = eventPosted;

    routeData.who_can_invite = {...whoCanInviteOption};
    routeData.who_can_see = {...whoCanPost};
    routeData.who_can_join = {...whoCanJoinOption};
    routeData.who_can_post = {...whoCanPost};

    if (whoCanSeeOption.value === 2) {
      const checkedGroup = groupsSeeList.filter((obj) => obj.isSelected);
      const resultOfIds = checkedGroup.map((obj) => obj.group_id);
      if (authContext.entity.role === Verbs.entityTypeUser) {
        routeData.who_can_see.group_ids = resultOfIds;
      } else {
        routeData.who_can_see.group_ids = [authContext.entity.uid];
      }
    }

    if (whoCanJoinOption.value === 2) {
      const checkedGroup = groupsJoinList.filter((obj) => obj.isSelected);
      const resultOfIds = checkedGroup.map((obj) => obj.group_id);
      if (authContext.entity.role === Verbs.entityTypeUser) {
        routeData.who_can_join.group_ids = resultOfIds;
      } else {
        routeData.who_can_join.group_ids = [authContext.entity.uid];
      }
    }

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

  const getOptions = () => {
    if (
      authContext.entity.role === Verbs.entityTypeUser ||
      authContext.entity.role === Verbs.entityTypePlayer
    ) {
      if (whoOption === see) {
        return [
          {
            text: strings.everyoneTitleText,
            value: 0,
          },
          {
            text: strings.followerTitleText,
            value: 2,
          },

          {
            text: strings.oraganizerOnly,
            value: 1,
          },
        ];
      }

      if (whoOption === join) {
        return [
          {
            text: strings.everyoneTitleText,
            value: 0,
          },
          {
            text: strings.followingAndFollowers,
            value: 2,
          },
          {
            text: strings.followersRadio,
            value: 3,
          },
          {
            text: strings.invited,
            value: 4,
          },
          {
            text: strings.oraganizerOnly,
            value: 1,
          },
          // strings.everyoneTitleText,
          // strings.followingAndFollowers,
          // strings.following,
          // strings.inviteOnly,
          // strings.onlymeTitleText,
        ];
      }

      if (whoOption === invite) {
        return [
          {
            text: strings.attendeeRadioText,
            value: 0,
          },
          {
            text: strings.oraganizerOnly,
            value: 1,
          },
        ];
      }
      if (whoOption === post) {
        return [
          {
            text: strings.everyoneRadio,
            value: 0,
          },
          {
            text: strings.attendeeRadioText,
            value: 1,
          },
          {
            text: strings.oraganizerOnly,
            value: 2,
          },
        ];
      }
    }
    if (
      authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub
    ) {
      if (whoOption === see) {
        return [
          {text: strings.everyoneTitleText, value: 0},
          {text: strings.followerTitleText, value: 3},
          {text: strings.membersTitle, value: 2},
          {text: strings.oraganizerOnly, value: 1},
        ];
      }

      if (whoOption === join) {
        return [
          {text: strings.everyoneTitleText, value: 0},
          {text: strings.followerTitleText, value: 3},
          {text: strings.membersTitle, value: 2},
          {text: strings.invited, value: 4},
          {text: strings.oraganizerOnly, value: 1},
        ];
      }

      if (whoOption === invite) {
        return [
          {text: strings.attendeeRadioText, value: 0},
          {text: strings.oraganizerOnly, value: 1},
        ];
      }
    }
    return [];
  };

  const getShowEventPostRenderCondition = () => {
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      if (
        authContext.entity.obj?.parent_groups?.length > 0 &&
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
        // loading={loading}
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
              Add a few more details before you complete creating an event.
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

              {whoCanSeeOption.value === indexThree &&
              authContext.entity.role === Verbs.entityTypeUser ? (
                <GroupList
                  list={groupsSeeList}
                  onCheck={(index) => {
                    groupsSeeList[index].isSelected =
                      !groupsSeeList[index].isSelected;
                    setGroupsSeeList([...groupsSeeList]);
                  }}
                  onAllPress={(isAllSelected) => {
                    const newList = groupsSeeList.map((item) => ({
                      ...item,
                      isSelected: !isAllSelected,
                    }));
                    setGroupsSeeList([...newList]);
                  }}
                  containerStyle={{marginTop: 20}}
                />
              ) : null}
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

              {whoCanJoinOption.value === 2 &&
              authContext.entity.role === Verbs.entityTypeUser ? (
                <GroupList
                  list={groupsJoinList}
                  onCheck={(index) => {
                    groupsJoinList[index].isSelected =
                      !groupsJoinList[index].isSelected;
                    setGroupsJoinList([...groupsJoinList]);
                  }}
                  onAllPress={(isAllSelected) => {
                    const newList = groupsJoinList.map((item) => ({
                      ...item,
                      isSelected: !isAllSelected,
                    }));
                    setGroupsJoinList([...newList]);
                  }}
                  containerStyle={{marginTop: 20}}
                />
              ) : null}
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
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>

              {whoCanInviteOption.value === 2 &&
              authContext.entity.role === Verbs.entityTypeUser ? (
                <GroupList
                  list={groupsSeeList}
                  onCheck={(index) => {
                    groupsSeeList[index].isSelected =
                      !groupsSeeList[index].isSelected;
                    setGroupsSeeList([...groupsSeeList]);
                  }}
                  onAllPress={(isAllSelected) => {
                    const newList = groupsSeeList.map((item) => ({
                      ...item,
                      isSelected: !isAllSelected,
                    }));
                    setGroupsSeeList([...newList]);
                  }}
                  containerStyle={{marginTop: 20}}
                />
              ) : null}
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

              {/* {whoCanInviteOption.value === 2 &&
              authContext.entity.role === Verbs.entityTypeUser ? (
                <GroupList
                  list={groupsSeeList}
                  onCheck={(index) => {
                    groupsSeeList[index].isSelected =
                      !groupsSeeList[index].isSelected;
                    setGroupsSeeList([...groupsSeeList]);
                  }}
                  onAllPress={(isAllSelected) => {
                    const newList = groupsSeeList.map((item) => ({
                      ...item,
                      isSelected: !isAllSelected,
                    }));
                    setGroupsSeeList([...newList]);
                  }}
                  containerStyle={{marginTop: 20}}
                />
              ) : null} */}
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
                    offline={is_Create}
                    firstTabTitle={strings.doNotCreateText}
                    secondTabTitle={strings.createText}
                    onFirstTabPress={() => setIsCreate(true)}
                    onSecondTabPress={() => setIsCreate(false)}
                    activeEventPrivacyText={{fontSize: 11}}
                    inactiveEventPrivacyText={{fontSize: 11}}
                  />

                  {!is_Create ? (
                    <>
                      <Text
                        style={{
                          fontFamily: fonts.RRegular,
                          fontSize: 16,
                          lineHeight: 24,
                        }}>
                        A post about this event will be created in posts of your
                        team.
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
                            Share Event Post
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: fonts.RRegular,
                              lineHeight: 24,
                              marginTop: 10,
                            }}>
                            Select affiliated clubs in whose posts you want to
                            display the post about this event.
                          </Text>

                          <FlatList
                            data={groups}
                            keyExtractor={(item) => item.group_id}
                            style={{marginTop: 24}}
                            bounces={false}
                            renderItem={({item, index}) => (
                              <View
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

                                <Image
                                  source={images.whiteUncheck}
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
                              </View>
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
                        No post about this event will be created in your posts.
                      </Text>
                    </>
                  )}
                </EventItemRender>

                <View style={styles.containerStyle}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={styles.checkboxPost}
                      onPress={() => {
                        if (eventPosted.value === indexTwo) {
                          setEventPosted({
                            value: 0,
                            text: strings.scheduleOnlyText,
                          });
                        } else {
                          setEventPosted({
                            value: 1,
                            text: strings.scheduleAndPostText,
                          });
                        }
                      }}>
                      <Image
                        source={
                          eventPosted.value === 1
                            ? images.yellowCheckBox
                            : images.uncheckWhite
                        }
                        style={styles.checkboxPostImg}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[styles.allDayText, {flex: 1, flexWrap: 'wrap'}]}>
                      {strings.eventPostCreate}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </TCKeyboardView>

      <CustomModalWrapper
        isVisible={visibleWhoModal}
        closeModal={() => setVisibleWhoModal(false)}
        modalType={ModalTypes.style2}
        title={whoOption === join ? strings.whoCanJoin : strings.whoCanSee}
        containerStyle={{
          padding: 15,
          marginBottom: Platform.OS === 'ios' ? 35 : 0,
        }}
        externalSnapPoints={snapPoints}>
        <View
          onLayout={(event) => {
            const contentHeight = event.nativeEvent.layout.height + 80;

            setSnapPoints([contentHeight, contentHeight]);
          }}>
          {getOptions().map((item, index) => renderWhoCan({item, index}))}
        </View>
      </CustomModalWrapper>
      <CustomModalWrapper
        isVisible={visibleWhoCanPostModal}
        closeModal={() => setVisibleWhoCanPostModal(false)}
        modalType={ModalTypes.style2}
        title={whoOption === join ? strings.whoCanJoin : strings.whoCanSee}
        containerStyle={{
          padding: 15,
          marginBottom: Platform.OS === 'ios' ? 35 : 0,
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
          <FlatList
            data={getOptions()}
            renderItem={renderWhoCan}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </CustomModalWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  checkboxPostImg: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    marginTop: 5,
  },
  checkboxPost: {
    left: wp(0),
    marginRight: 10,
  },
  allDayText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  checkboxImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    // alignSelf: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
  },

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
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
    right: 15,
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
});
