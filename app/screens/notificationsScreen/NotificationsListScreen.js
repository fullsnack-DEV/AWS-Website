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
  RectButton,
} from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import Moment from 'moment';
import NotificationListComponent from '../../components/notificationComponent/NotificationListComponent';
import NotificationProfileItem from '../../components/notificationComponent/NotificationProfileItem';
import TodayNotificationItem from '../../components/notificationComponent/TodayNotificationItem';
import NotificationInviteCell from '../../components/notificationComponent/NotificationInviteCell';
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

function NotificationsListScreen({ navigation }) {
  const [loading, setloading] = useState(true);
  const navigateFlatList = () => {
  };

  const onDelete = ({ item }) => {
    setloading(true);
    const ids = item.activities.map((activity) => activity.id)
    deleteNotification(ids, item.type).then(() => {
      callNotificationList()
    }).catch(() => {
      setloading(false);
      Alert.alert('Failed to move to trash. Try again later')
    });
  };

  const onAccept = (requestId) => {
    acceptRequest(requestId).catch(Alert.alert('Failed to accept request. Try again later'))
  }

  const onDecline = ({ requestId }) => {
    declineRequest(requestId).catch(Alert.alert('Failed to decline request. Try again later'))
  };

  const actionSheet = useRef();
  const [currentTab, setCurrentTab] = useState();
  const [groupList, setGroupList] = useState();
  const [notifAPI, setNotifAPI] = useState();
  const refContainer = useRef();
  const authContext = useContext(AuthContext);
  const [mainNotificationsList, setMainNotificationsList] = useState();
  const currentDate = new Date();
  const [selectedEntity, setSelectedEntity] = useState();
  const isInvite = (verb) => verb.includes(NotificationType.inviteToJoinClub)
    || verb.includes(NotificationType.invitePlayerToJoinTeam)
    || verb.includes(NotificationType.invitePlayerToJoinClub)
    || verb.includes(NotificationType.inviteToConnectProfile)
    || verb.includes(NotificationType.invitePlayerToJoingame);

  const renderPendingRequestComponent = ({ item }) => (
    <AppleStyleSwipeableRow onPress={() => onDelete({ item })} color={colors.redDelColor} image={images.deleteIcon}>
      {isInvite(item.activities[0].verb) && (
        <RectButton
          style={styles.rectButton}>
          <NotificationInviteCell
            data={item}
            onAccept={() => onAccept(item.activities[0].id)}
            onDecline={() => onDecline(item.activities[0].id)}
            card={navigateFlatList}
          />
        </RectButton>
      )}

      {
      (item.activities[0].verb.includes(NotificationType.challengeOffered)
      || item.activities[0].verb.includes(NotificationType.challengeAltered))
      && (<RectButton
          style={styles.rectButton}>
        <NotificationListComponent
            data={item}
            selectedEntity={selectedEntity}
            cta1={navigateFlatList}
            cta2={navigateFlatList}
            card={navigateFlatList}
          />
      </RectButton>
      )}

      {
      (item.activities[0].verb.includes(NotificationType.refereeRequest)
      || item.activities[0].verb.includes(NotificationType.changeRefereeRequest)
      || item.activities[0].verb.includes(NotificationType.scorekeeperRequest))
      && (<RectButton
          style={styles.rectButton}>
        <NotificationListComponent
            data={item}
            selectedEntity={selectedEntity}
            cta1={navigateFlatList}
            cta2={navigateFlatList}
            card={navigateFlatList}
          />
      </RectButton>
      )}
    </AppleStyleSwipeableRow>
  );

  const renderNotificationComponent = ({ item }) => (
    <AppleStyleSwipeableRow onPress={() => onDelete({ item })} color={colors.redDelColor} image={images.deleteIcon}>
      <RectButton
              style={styles.rectButton}>
        <TodayNotificationItem
                data={item}
                cta1={navigateFlatList}
                cta2={navigateFlatList}
                card={navigateFlatList}
              />
      </RectButton>
    </AppleStyleSwipeableRow>
  )

  const RenderSections = ({ item, section }) => {
    if (section.section === 'PENDING REQUESTS') {
      return renderPendingRequestComponent({ item: { ...item, type: 'request' } })
    }

    if (section.section === 'EARLIER' || section.section === 'TODAY') {
      return renderNotificationComponent({ item: { ...item, type: 'notification' } })
    }

    return null
  }
  const activeTab = async (index) => {
    setCurrentTab(index);
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
      getUnreadCount().then((response) => {
        if (response.status === true) {
          const { teams } = response.payload;
          const { clubs } = response.payload;
          setGroupList([authContext.user, ...clubs, ...teams]);
          setNotifAPI(1);
          setCurrentTab(0);
        } else {
          // setloading(false)
        }
      });
    }
    if (notifAPI === 1) {
      callNotificationList();
    }
  }, [currentTab]);

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
    getNotificationsList(params)
      .then((response) => {
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
          { data: [...pendingReqNotification], section: 'PENDING REQUESTS', type: 'request' },
          { data: [...todayNotifications], section: 'TODAY', type: 'notification' },
          { data: [...erlierNotifications], section: 'EARLIER', type: 'notification' },
        ];
        setMainNotificationsList([...array.filter((item) => item.data.length !== 0)]);
        setloading(false)
      })
      .catch((e) => {
        setloading(false)
        Alert.alert(e.messages);
      });
  };

  const renderGroupItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => activeTab(index)} key={index}>
      <NotificationProfileItem
        data={item}
        indexNumber={index}
        selectedIndex={currentTab}
      />
    </TouchableOpacity>
  );
  return (
    <View style={styles.rowViewStyle}>
      <View>
        <FlatList
          ref={refContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={groupList}
          renderItem={renderGroupItem}
        />
        <TCThinDivider marginTop={0} width={'100%'} />
      </View>
      <ActivityLoader visible={loading} />
      {mainNotificationsList && mainNotificationsList.length > 0 ? (
        <SectionList
          sections={mainNotificationsList}
          keyExtractor={(item, index) => index}
          renderItem={RenderSections}
          renderSectionHeader={({ section: { section } }) => (
            <Text style={styles.header}>{section}</Text>
          )}
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
    fontFamily: fonts.RLight,
    fontSize: 20,

    padding: 15,
    alignContent: 'center',
  },
  rectButton: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: colors.whiteColor,
  },
});

export default NotificationsListScreen;
