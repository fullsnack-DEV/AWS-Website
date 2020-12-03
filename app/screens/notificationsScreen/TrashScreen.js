import React, {
  useEffect, useState, useLayoutEffect, useContext,
} from 'react';
import {
  View, StyleSheet, FlatList, Alert, Text,
} from 'react-native';
import _ from 'lodash'
import PRNotificationDetailMessageItem from '../../components/notificationComponent/PRNotificationDetailMessageItem';
import NotificationItem from '../../components/notificationComponent/NotificationItem';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';
import AuthContext from '../../auth/context'
import { getTrash, restoreNotification } from '../../api/Notificaitons';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';
// import TCThinDivider from '../../components/TCThinDivider';
import AppleStyleSwipeableRow from '../../components/notificationComponent/AppleStyleSwipeableRow';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';

function TrashScreen({ navigation, route }) {
  const authContext = useContext(AuthContext)
  const [loading, setloading] = useState(true);
  const [mainNotificationsList, setMainNotificationsList] = useState();
  const [selectedEntity, setSelectedEntity] = useState();
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
    getTrash(params, authContext)
      .then((response) => {
        const requests = response.payload.requests.map((obj) => ({ ...obj, type: 'request', createdDate: new Date(`${obj.created_at}+0000`) }))
        const notifications = response.payload.notifications.map((obj) => ({ ...obj, type: 'notification', createdDate: new Date(`${obj.updated_at}+0000`) }))
        let trashNotifications = [...requests, ...notifications];
        trashNotifications = _.orderBy(trashNotifications, ['createdDate'], ['desc']);
        setMainNotificationsList(trashNotifications);
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
    restoreNotification(ids, item.type, authContext).then(() => {
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
        <PRNotificationInviteCell data={item} card={navigateFlatList} />
      )}
      {(item.activities[0].verb.includes(NotificationType.challengeOffered)
        || item.activities[0].verb.includes(
          NotificationType.challengeAltered,
        )) && (<PRNotificationDetailMessageItem
            data={item}
            selectedEntity={selectedEntity}
            cta1={navigateFlatList}
            cta2={navigateFlatList}
            card={navigateFlatList}
          />
      )}
      {(item.activities[0].verb.includes(NotificationType.refereeRequest)
        || item.activities[0].verb.includes(
          NotificationType.changeRefereeRequest,
        )
        || item.activities[0].verb.includes(
          NotificationType.scorekeeperRequest,
        )) && (
          <PRNotificationDetailMessageItem
            data={item}
            selectedEntity={selectedEntity}
            cta1={navigateFlatList}
            cta2={navigateFlatList}
            card={navigateFlatList}
          />
      )}
    </AppleStyleSwipeableRow>
  );

  const renderNotificationComponent = ({ item }) => (
    <AppleStyleSwipeableRow
      onPress={() => onRestore({ item })}
      color={colors.themeColor}
      image={images.roundArrow}>
      <NotificationItem
          data={item}
          cta1={navigateFlatList}
          cta2={navigateFlatList}
          card={navigateFlatList}
        />
    </AppleStyleSwipeableRow>
  );

  const renderTrashItem = ({ item }) => {
    if (item.type === 'request') {
      return renderPendingRequestComponent({ item });
    }
    if (item.type === 'notification') {
      return renderNotificationComponent({ item });
    }
    return null;
  };
  return (
    <View style={styles.containerStyle}>
      <ActivityLoader visible={loading} />
      <View style={styles.trashMessageContainerStyle}>
        <Text style={styles.trashMessageStyle}>{strings.trashmessage}</Text>
      </View>
      {mainNotificationsList && mainNotificationsList.length > 0 ? (
        <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={mainNotificationsList}
        renderItem={renderTrashItem}
        keyExtractor={(item, index) => index.toString()}
      />
      ) : (
        <TCNoDataView title={'No records found'} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  trashMessageContainerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.thinDividerColor,
  },
  trashMessageStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.darkGrayTrashColor,
  },
});

export default TrashScreen;
