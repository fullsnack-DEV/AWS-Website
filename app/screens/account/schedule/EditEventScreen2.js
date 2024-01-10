/* eslint-disable no-unused-vars */
import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Alert,
  Platform,
  BackHandler,
  Dimensions,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TCKeyboardView from '../../../components/TCKeyboardView';
import {getDayFromDate, countNumberOfWeeks, getTCDate} from '../../../utils';
import {getGroups} from '../../../api/Groups';
import GroupEventItems from '../../../components/Schedule/GroupEvent/GroupEventItems';
import uploadImages from '../../../utils/imageAction';
import {editEvent} from '../../../api/Schedule';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import CurrencyModal from '../../../components/CurrencyModal/CurrencyModal';
import TCFormProgress from '../../../components/TCFormProgress';
import TCThinDivider from '../../../components/TCThinDivider';

export default function EditEventScreen2({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [eventData, setEventData] = useState({});
  const [eventPosted, setEventPosted] = useState({});
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    strings.defaultCurrency,
  );
  const THISEVENT = 0;
  const FUTUREEVENT = 1;
  const ALLEVENT = 2;
  const recurringEditList = [
    {text: strings.thisEventOnly, value: THISEVENT},
    {
      text: strings.thisAndAllEvent,
      value: FUTUREEVENT,
    },
    {text: strings.allEvents, value: ALLEVENT},
  ];
  const [eventStartDateTime] = useState(route.params?.eventStartDateTimeflag);
  const [eventUntilDateTime] = useState(route.params?.eventUntilDateTimeflag);

  const [loading, setloading] = useState(false);

  const [visibleWhoModal, setVisibleWhoModal] = useState(false);
  const [visibleWhoCanPostModal, setVisibleWhoCanPostModal] = useState(false);

  const [recurringEditModal, setRecurringEditModal] = useState(false);

  const [whoOption, setWhoOption] = useState();
  const [whoCanJoinOption, setWhoCanJoinOption] = useState({
    ...route?.params.createEventData?.who_can_join,
  });

  const [whoCanSeeOption, setWhoCanSeeOption] = useState({
    ...route?.params.createEventData?.who_can_see,
  });

  const [whoCanPost, setWhoCanPost] = useState({
    ...route?.params.createEventData?.who_can_post,
  });

  const [whoCanInviteOption, setWhoCanInviteOption] = useState({
    ...route?.params.createEventData?.who_can_invite,
  });

  const [groupsSeeList, setGroupsSeeList] = useState([]);
  const [groupsJoinList, setGroupsJoinList] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const [selectWeekMonth] = useState(route.params?.selectWeekMonthFlag);

  const [snapPoints, setSnapPoints] = useState([]);

  useEffect(() => {
    // setloading(true);

    getGroups(authContext)
      .then((response) => {
        const {teams, clubs} = response.payload;

        const groups = [...teams, ...clubs].map((obj) => ({
          ...obj,
          isSelected: false,
        }));
        setGroupsSeeList([...groups]);
        setGroupsJoinList([...groups]);

        setloading(false);
      })
      .catch(() => {
        setloading(false);
      });
  }, [authContext]);

  const renderWhoCan = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
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
        setVisibleWhoCanPostModal(false);
        setVisibleWhoModal(false);
      }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 15,
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

  const getImage = (item) => {
    if (item.thumbnail) {
      return {uri: item.thumbnail};
    }
    if (item.entity_type === Verbs.entityTypeTeam) {
      return images.teamPlaceholder;
    }
    return images.clubPlaceholder;
  };

  const renderSeeGroups = ({item, index}) => (
    <GroupEventItems
      eventImageSource={
        item.entity_type === Verbs.entityTypeTeam
          ? images.teamPatch
          : images.clubPatch
      }
      eventText={item.group_name}
      groupImageSource={getImage(item)}
      checkBoxImage={
        item.isSelected ? images.orangeCheckBox : images.uncheckWhite
      }
      onCheckBoxPress={() => {
        groupsSeeList[index].isSelected = !groupsSeeList[index].isSelected;
        setGroupsSeeList([...groupsSeeList]);
        setIsAll(false);
      }}
    />
  );

  const renderJoinGroups = ({item, index}) => (
    <GroupEventItems
      eventImageSource={
        item.entity_type === Verbs.entityTypeTeam
          ? images.teamPatch
          : images.clubPatch
      }
      eventText={item.group_name}
      groupImageSource={getImage(item)}
      checkBoxImage={
        item.isSelected ? images.orangeCheckBox : images.uncheckWhite
      }
      onCheckBoxPress={() => {
        groupsJoinList[index].isSelected = !groupsJoinList[index].isSelected;
        setGroupsJoinList([...groupsJoinList]);
        setIsAll(false);
      }}
    />
  );

  const createEventDone = (data, recurrringOption) => {
    setloading(true);
    const obj = {...data};
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole = entity.role === 'user' ? 'users' : 'groups';

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
      obj.untilDate = getTCDate(eventUntilDateTime);
      obj.rrule = rule;
      if (recurrringOption === '') {
        setEventData({...obj});
        setRecurringEditModal(true);
        setloading(false);
        return true;
      }

      obj.recurring_modification_type = recurrringOption;
    }

    editEvent(entityRole, uid, obj, authContext)
      .then(() => {
        setloading(false);
        obj.start_datetime = obj.new_start_datetime;
        obj.end_datetime = obj.new_end_datetime;

        navigation.navigate('EventScreen', {
          event: obj,
        });
      })
      .catch((e) => {
        setloading(false);

        Alert.alert(e.messages);
      });
    return true;
  };

  const handleBackPress = useCallback(() => {
    Alert.alert(
      strings.areYouWantToUnsavedChanges,
      '',
      [
        {
          text: strings.cancel,
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: strings.discardText,
          onPress: () => {
            if (route.params?.comeName === 'EventScreen') {
              navigation.navigate('EventScreen', {
                screen: 'EventScreen',
              });
            } else {
              navigation.goBack();
            }
          },
        },
      ],
      {cancelable: false},
    );
  });
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

  const onDonePress = (recurrringOption = '') => {
    setloading(true);
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

          createEventDone(routeData, recurrringOption);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.appName, e.messages);
          }, 0.1);
        });
    } else {
      createEventDone(routeData, recurrringOption);
    }
  };

  const see = 'see';
  const join = 'join';
  const posted = 'posted';
  const invite = 'invite';
  const post = 'post';

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
          // strings.,
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
          // strings.attendeeRadioText,
          // strings.onlymeTitleText
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

  const renderEditRecurringOptions = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 15,
      }}>
      <View>
        <Text
          style={styles.filterTitle}
          onPress={() => {
            setRecurringEditModal(false);
            setTimeout(() => {
              onDonePress(item.value);
            }, 1000);
          }}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
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
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 4,
            backgroundColor: 'white',
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
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 10,
                fontSize: 16,
                fontFamily: fonts.RRegular,
              }}>
              {strings.updateRecurringEvent}
            </Text>
          </View>
          <TCThinDivider width="92%" />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider width="92%" />}
            showsVerticalScrollIndicator={false}
            data={recurringEditList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderEditRecurringOptions}
          />
        </View>
      </Modal>

      <ScreenHeader
        title={strings.editEvent}
        leftIcon={images.backArrow}
        leftIconPress={handleBackPress}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() => {
          onDonePress();
        }}
      />

      <TCFormProgress totalSteps={2} curruentStep={1} />
      <ActivityLoader visible={loading} />

      <TCKeyboardView>
        <ScrollView bounces={false} nestedScrollEnabled={true}>
          <View style={{paddingHorizontal: 10}}>
            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanSee}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption('see');
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
            {whoCanSeeOption.value === 2 &&
              authContext.entity.role === 'user' && (
                <View>
                  <View style={styles.allStyle}>
                    <Text style={styles.titleTextStyle}>{strings.all}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsAll(!isAll);
                        const groups = groupsSeeList.map((obj) => ({
                          ...obj,
                          isSelected: !isAll,
                        }));
                        setGroupsSeeList([...groups]);
                      }}>
                      <Image
                        source={
                          isAll ? images.orangeCheckBox : images.uncheckWhite
                        }
                        style={styles.imageStyle}
                      />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    scrollEnabled={false}
                    data={[...groupsSeeList]}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                      <View style={{height: wp('4%')}} />
                    )}
                    renderItem={renderSeeGroups}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.listStyle}
                  />
                </View>
              )}

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanJoin}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption('join');
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
            {whoCanJoinOption.value === 2 &&
              authContext.entity.role === Verbs.entityTypeUser && (
                <View>
                  <View style={styles.allStyle}>
                    <Text style={styles.titleTextStyle}>{strings.all}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsAll(!isAll);
                        const groups = groupsJoinList.map((obj) => ({
                          ...obj,
                          isSelected: !isAll,
                        }));
                        setGroupsJoinList([...groups]);
                      }}>
                      <Image
                        source={
                          isAll ? images.orangeCheckBox : images.uncheckWhite
                        }
                        style={styles.imageStyle}
                      />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    scrollEnabled={false}
                    data={[...groupsJoinList]}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                      <View style={{height: wp('4%')}} />
                    )}
                    renderItem={renderJoinGroups}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.listStyle}
                  />
                </View>
              )}

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanInvite}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption('invite');
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
            </View>

            <View style={styles.containerStyle}>
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

            {whoCanInviteOption.value === 2 &&
              authContext.entity.role === Verbs.entityTypeUser && (
                <View>
                  <View style={styles.allStyle}>
                    <Text style={styles.titleTextStyle}>{strings.all}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsAll(!isAll);
                        const groups = groupsSeeList.map((obj) => ({
                          ...obj,
                          isSelected: !isAll,
                        }));
                        setGroupsSeeList([...groups]);
                      }}>
                      <Image
                        source={
                          isAll ? images.orangeCheckBox : images.uncheckWhite
                        }
                        style={styles.imageStyle}
                      />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    scrollEnabled={false}
                    data={[...groupsSeeList]}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                      <View style={{height: wp('4%')}} />
                    )}
                    renderItem={renderSeeGroups}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.listStyle}
                  />
                </View>
              )}
          </View>
        </ScrollView>
      </TCKeyboardView>

      <CustomModalWrapper
        isVisible={visibleWhoModal}
        closeModal={() => setVisibleWhoModal(false)}
        modalType={ModalTypes.style2}
        title={whoOption === 'join' ? strings.whoCanJoin : strings.whoCanSee}
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
          <FlatList
            data={getOptions()}
            renderItem={renderWhoCan}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </CustomModalWrapper>

      <CurrencyModal
        isVisible={showCurrencyModal}
        closeList={() => setShowCurrencyModal(false)}
        currency={selectedCurrency}
        onNext={(item) => {
          setSelectedCurrency(item);
          setShowCurrencyModal(false);
        }}
      />

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
  checkboxImg: {
    width: wp('5.5%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp(0),
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
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },

  downArrowWhoCan: {
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
    right: 15,
  },

  allStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
    marginTop: 0,
    marginBottom: 0,
  },
  titleTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  imageStyle: {
    width: wp('5.5%'),
    resizeMode: 'contain',
    marginRight: 10,
  },
  listStyle: {
    marginBottom: 15,
    marginTop: 15,
    paddingBottom: 10,
  },
});
