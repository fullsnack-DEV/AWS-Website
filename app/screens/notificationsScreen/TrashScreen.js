import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View, StyleSheet, SectionList, Text, Alert,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
// import ActionSheet from 'react-native-actionsheet';
import Moment from 'moment';
// import { color } from 'react-native-reanimated';
import NotificationListComponent from '../../components/notificationComponent/NotificationListComponent';
// import NotificationProfileItem from '../../components/notificationComponent/NotificationProfileItem';
import TodayNotificationItem from '../../components/notificationComponent/TodayNotificationItem';
import NotificationInviteCell from '../../components/notificationComponent/NotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';

import { getTrash, restoreNotification } from '../../api/Notificaitons';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';
// import TCThinDivider from '../../components/TCThinDivider';
import AppleStyleSwipeableRow from '../../components/notificationComponent/AppleStyleSwipeableRow';
import ActivityLoader from '../../components/loader/ActivityLoader';

function TrashScreen({ navigation, route }) {
  const [loading, setloading] = useState(true);
  const [mainNotificationsList, setMainNotificationsList] = useState();
  const [selectedEntity, setSelectedEntity] = useState();
  const currentDate = new Date();
  useLayoutEffect(() => {
    setSelectedEntity({ ...route.selectedGroup });

    navigation.setOptions({});
  }, [navigation]);
  const navigateFlatList = () => {};
  useEffect(() => {
    callTrashApi();
  }, []);
  const callTrashApi = () => {
    const params = {
      uid:
        route.params.selectedGroup.entity_type === 'player'
          ? route.params.selectedGroup.user_id
          : route.params.selectedGroup.group_id,
    };
    getTrash(params)
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
          { data: [...pendingReqNotification], section: 'PENDING REQUESTS' },
          { data: [...todayNotifications], section: 'TODAY' },
          { data: [...erlierNotifications], section: 'EARLIER' },
        ];
        setMainNotificationsList([
          ...array.filter((item) => item.data.length !== 0),
        ]);

        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(e.messages);
      });
  };
  const onRestore = ({ item }) => {
    setloading(true);
    const ids = [];
    for (const temData of item.activities) {
      ids.push(temData.id);
    }
    restoreNotification(ids, item.type).then(() => {
      callTrashApi()
    })
      .catch((e) => {
        setloading(false);
        Alert.alert(e.messages);
      });
  };

  const isInvite = (verb) => verb.includes(NotificationType.inviteToJoinClub)
    || verb.includes(NotificationType.invitePlayerToJoinTeam)
    || verb.includes(NotificationType.invitePlayerToJoinClub)
    || verb.includes(NotificationType.inviteToConnectProfile)
    || verb.includes(NotificationType.invitePlayerToJoingame);

  const renderPendingRequestComponent = ({ item }) => (
    <AppleStyleSwipeableRow
      onPress={() => onRestore({ item })}
      color={colors.themeColor}
      image={images.roundArrow}>
      {isInvite(item.activities[0].verb) && (
        <RectButton style={styles.rectButton}>
          <NotificationInviteCell data={item} card={navigateFlatList} />
        </RectButton>
      )}
      {(item.activities[0].verb.includes(NotificationType.challengeOffered)
        || item.activities[0].verb.includes(
          NotificationType.challengeAltered,
        )) && (
          <RectButton style={styles.rectButton}>
            <NotificationListComponent
            data={item}
            selectedEntity={selectedEntity}
            cta1={navigateFlatList}
            cta2={navigateFlatList}
            card={navigateFlatList}
          />
          </RectButton>
      )}
      {(item.activities[0].verb.includes(NotificationType.refereeRequest)
        || item.activities[0].verb.includes(
          NotificationType.changeRefereeRequest,
        )
        || item.activities[0].verb.includes(
          NotificationType.scorekeeperRequest,
        )) && (
          <RectButton style={styles.rectButton}>
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
    <AppleStyleSwipeableRow
      onPress={() => onRestore({ item })}
      color={colors.themeColor}
      image={images.roundArrow}>
      <RectButton style={styles.rectButton}>
        <TodayNotificationItem
          data={item}
          cta1={navigateFlatList}
          cta2={navigateFlatList}
          card={navigateFlatList}
        />
      </RectButton>
    </AppleStyleSwipeableRow>
  );

  const RenderSections = ({ item, section }) => {
    if (section.section === 'PENDING REQUESTS') {
      return renderPendingRequestComponent({ item: { ...item, type: 'request' } });
    }

    if (section.section === 'EARLIER' || section.section === 'TODAY') {
      return renderNotificationComponent({ item: { ...item, type: 'notification' } });
    }
    return null;
  };
  return (
    <View style={styles.rowViewStyle}>
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
    </View>
  );
}
const styles = StyleSheet.create({
  rowViewStyle: {
    flex: 1,
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

export default TrashScreen;
