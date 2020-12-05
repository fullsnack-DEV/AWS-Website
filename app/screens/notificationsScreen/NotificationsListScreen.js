import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useContext,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  SectionList,
  Text,
  Alert,
} from 'react-native';
import {
  FlatList,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import Moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import PRNotificationDetailMessageItem from '../../components/notificationComponent/PRNotificationDetailMessageItem';
import NotificationProfileItem from '../../components/notificationComponent/NotificationProfileItem';
import NotificationItem from '../../components/notificationComponent/NotificationItem';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType'
import {
  getUnreadCount, getNotificationsList, acceptRequest, declineRequest, deleteNotification,
} from '../../api/Notificaitons';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';
import TCThinDivider from '../../components/TCThinDivider';
import AppleStyleSwipeableRow from '../../components/notificationComponent/AppleStyleSwipeableRow';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';

function NotificationsListScreen({ navigation }) {
  const actionSheet = useRef();
  const [currentTab, setCurrentTab] = useState();
  const [groupList, setGroupList] = useState();
  const [notifAPI, setNotifAPI] = useState();
  const refContainer = useRef();
  const authContext = useContext(AuthContext);
  const [mainNotificationsList, setMainNotificationsList] = useState();
  const currentDate = new Date();
  const [selectedEntity, setSelectedEntity] = useState();
  const [activeScreen, setActiveScreen] = useState(false);
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(true);
  const navigateFlatList = (item) => {
    console.log('cell selected', item.activities[0].object)
    navigation.navigate('AcceptDeclineChallengeScreen', { challengeID: JSON.parse(item.activities[0].object).challengeObject.challenge_id })
  };

  const onDelete = ({ item }) => {
    if (activeScreen) {
      setloading(true);
      const ids = item.activities.map((activity) => activity.id)
      deleteNotification(ids, item.type, authContext).then(() => {
        callNotificationList()
      }).catch(() => {
        setloading(false);
        Alert.alert('Failed to move to trash. Try again later')
      });
    } else {
      const name = selectedEntity.entity_type === 'player' ? `${selectedEntity.first_name} ${selectedEntity.last_name}` : selectedEntity.group_name
      Alert.alert(`Do you want to switch account to ${name}?`, '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => console.log('Yes Pressed') },
      ],
      { cancelable: true })
    }
  };

  const onAccept = (requestId) => {
    setloading(true)
    if (activeScreen) {
      acceptRequest(requestId, authContext).then(() => {
        callNotificationList();
      }).catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 0.3)
      })
    } else {
      const name = selectedEntity.entity_type === 'player' ? `${selectedEntity.first_name} ${selectedEntity.last_name}` : selectedEntity.group_name
      Alert.alert(`Do you want to switch account to ${name}?`, '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => console.log('Yes Pressed') },
      ],
      { cancelable: true })
    }
  }

  const onDecline = (requestId) => {
    if (activeScreen) {
      declineRequest(requestId, authContext).then(() => {
        callNotificationList();
      }).catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 0.3)
      })
    } else {
      const name = selectedEntity.entity_type === 'player' ? `${selectedEntity.first_name} ${selectedEntity.last_name}` : selectedEntity.group_name
      Alert.alert(`Do you want to switch account to ${name}?`, '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => console.log('Yes Pressed') },
      ],
      { cancelable: true })
    }
  };

  const isInvite = (verb) => verb.includes(NotificationType.inviteToJoinClub)
    || verb.includes(NotificationType.invitePlayerToJoinTeam)
    || verb.includes(NotificationType.invitePlayerToJoinClub)
    || verb.includes(NotificationType.inviteToConnectProfile)
    || verb.includes(NotificationType.invitePlayerToJoingame);

  const renderPendingRequestComponent = ({ item }) => (
    <AppleStyleSwipeableRow onPress={() => onDelete({ item })} color={colors.redDelColor} image={images.deleteIcon}>
      {isInvite(item.activities[0].verb) && (
        <PRNotificationInviteCell
            item={item}
            selectedEntity={selectedEntity}
            onAccept={() => onAccept(item.activities[0].id)}
            onDecline={() => onDecline(item.activities[0].id)}
            onPress={navigateFlatList}
          />
      )}

      {!isInvite(item.activities[0].verb) && (<PRNotificationDetailMessageItem
          item={item}
          selectedEntity={selectedEntity}
          onDetailPress={() => navigateFlatList(item)}
          onMessagePress={navigateFlatList}
          onPress={navigateFlatList}
        />
      )}
    </AppleStyleSwipeableRow>
  );

  const renderNotificationComponent = ({ item }) => (
    <AppleStyleSwipeableRow onPress={() => onDelete({ item })} color={colors.redDelColor} image={images.deleteIcon}>
      <NotificationItem
          data={item}
          cta1={navigateFlatList}
          cta2={navigateFlatList}
          card={navigateFlatList}
        />
    </AppleStyleSwipeableRow>
  )

  const RenderSections = ({ item, section }) => {
    if (section.section === strings.pendingrequests) {
      return renderPendingRequestComponent({ item: { ...item, type: 'request' } })
    }

    if (section.section === strings.earlier || section.section === strings.today) {
      return renderNotificationComponent({ item: { ...item, type: 'notification' } })
    }

    return null
  }
  const activeTab = async (index) => {
    setCurrentTab(index);
    checkActiveScreen(groupList[index])
    refContainer.current.scrollToIndex({
      animated: true,
      index,
      viewPosition: 0.5,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            actionSheet.current.show();
          }}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (notifAPI !== 1) {
      getUnreadCount(authContext).then((response) => {
        if (response.status === true) {
          const { teams } = response.payload;
          const { clubs } = response.payload;
          const groups = [authContext.entity.auth, ...clubs, ...teams]
          setGroupList(groups);
          setNotifAPI(1);
          setCurrentTab(0);
          checkActiveScreen(groups[0]);
        } else {
          // setloading(false)
        }
      });
    }
    if (notifAPI === 1) {
      checkActiveScreen(groupList[currentTab]);
      callNotificationList();
    }
  }, [currentTab, isFocused]);

  useEffect(() => {
  }, [mainNotificationsList]);

  const callNotificationList = () => {
    setloading(true)
    const entity = groupList[currentTab];
    setSelectedEntity({ ...entity });
    const params = {
      mark_read: 'true',
      mark_seen: 'true',
      uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
    };
    getNotificationsList(params, authContext)
      .then(async (response) => {
        const pendingReqNotification = response.payload.requests;
        const todayNotifications = response.payload.notifications.filter(
          (item) => Moment(item.created_at).format('yyyy-MM-DD')
            === Moment(currentDate).format('yyyy-MM-DD'),
        );
        const erlierNotifications = response.payload.notifications.filter(
          (item) => Moment(item.created_at).format('yyyy-MM-DD')
            !== Moment(currentDate).format('yyyy-MM-DD'),
        );

        const array = [
          { data: [...pendingReqNotification], section: strings.pendingrequests, type: 'request' },
          { data: [...todayNotifications], section: strings.today, type: 'notification' },
          { data: [...erlierNotifications], section: strings.earlier, type: 'notification' },
        ];

        setMainNotificationsList([...array.filter((item) => item.data.length !== 0)]);
        setloading(false)
      })
      .catch((e) => {
        setloading(false)
        Alert.alert(e.messages);
      });
  };

  const itemSeparator = () => (
    // Item Separator
    <View style={styles.listItemSeparatorStyle} />
  );

  const renderSectionFooter = ({ section }) => {
    if (section.section === strings.pendingrequests) {
      return <View style={[styles.listItemSeparatorStyle, { height: 7, backgroundColor: colors.grayBackgroundColor }]} />
    }
    return <View style={styles.listItemSeparatorStyle} />
  }

  const renderGroupItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => activeTab(index)} key={index}>
      <NotificationProfileItem
        data={item}
        indexNumber={index}
        selectedIndex={currentTab}
      />
    </TouchableOpacity>
  );

  const checkActiveScreen = async (entity) => {
    const loggedInEntity = authContext.entity
    const currentID = entity.entity_type === 'player' ? entity.user_id : entity.group_id
    if (loggedInEntity.uid === currentID) {
      setActiveScreen(true);
    } else {
      setActiveScreen(false);
    }
  }

  return (
    <View style={[styles.rowViewStyle, { opacity: activeScreen ? 1.0 : 0.5 }]}>
      <View>
        <FlatList
          ref={refContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={groupList}
          renderItem={renderGroupItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <TCThinDivider marginTop={0} width={'100%'} />
      </View>
      <ActivityLoader visible={loading} />
      {mainNotificationsList && mainNotificationsList.length > 0 ? (
        <SectionList
          ItemSeparatorComponent={itemSeparator}
          sections={mainNotificationsList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={RenderSections}
          renderSectionHeader={({ section: { section } }) => (
            <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
              <View style={styles.listItemSeparatorStyle}/>
              <Text style={styles.header}>{section}</Text>
            </View>
          )}
          renderSectionFooter={renderSectionFooter}
        />
      ) : (
        <TCNoDataView title={'No records found'} />
      )}
      <ActionSheet
        ref={actionSheet}
        options={['Trash', 'Cancel']}
        cancelButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('TrashScreen', {
              selectedGroup: groupList[currentTab],
              selectedEntity,
            });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rowViewStyle: {
    flex: 1,
  },
  headerRightImg: {
    height: 20,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 20,
  },
  header: {
    backgroundColor: '#fff',
    height: 53,
    fontFamily: fonts.RRegular,
    fontSize: 20,
    padding: 15,
    color: colors.lightBlackColor,
    alignContent: 'center',
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: colors.linesepratorColor,
  },
});

export default NotificationsListScreen;
