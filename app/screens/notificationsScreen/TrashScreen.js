import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,

  SectionList,
  Text,
  Alert,
} from 'react-native';

import Moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { toggleView } from '../../utils/index'
import PRNotificationDetailMessageItem from '../../components/notificationComponent/PRNotificationDetailMessageItem';
import NotificationItem from '../../components/notificationComponent/NotificationItem';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';
import {
  getTrash,
  restoreNotification,

} from '../../api/Notificaitons';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';
import AppleStyleSwipeableRow from '../../components/notificationComponent/AppleStyleSwipeableRow';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';

import NotificationListShimmer from '../../components/shimmer/account/NotificationListShimmer';

function TrashScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const [mainNotificationsList, setMainNotificationsList] = useState();
  const currentDate = new Date();
  const [selectedEntity, setSelectedEntity] = useState();
  const isFocused = useIsFocused();
const [showNoteToast, setShowNoteToast] = useState()
  const [loading, setloading] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);

  const onRestore = ({ item }) => {
    setloading(true)
    const ids = [];
    for (const temData of item.activities) {
      ids.push(temData.id);
    }
    restoreNotification(ids, item.type, authContext).then(() => {
      setloading(false)
      callNotificationList()
    })
      .catch((e) => {
        setloading(false)
        Alert.alert(e.messages);
      });
  };

  const openToast = () => {
    toggleView(() => setShowNoteToast(true), 500)
    setTimeout(() => { toggleView(() => setShowNoteToast(false), 500) }, 5000)
  }
  const isInvite = (verb) => verb.includes(NotificationType.inviteToJoinClub)
    || verb.includes(NotificationType.invitePlayerToJoinTeam)
    || verb.includes(NotificationType.invitePlayerToJoinClub)
    || verb.includes(NotificationType.inviteToConnectProfile)
    || verb.includes(NotificationType.invitePlayerToJoingame);

  const openHomePage = (item) => {
      if (item?.entityType && item?.entityId) {
        navigation.push('HomeScreen', {
          uid: item?.entityId,
          backButtonVisible: true,
          menuBtnVisible: false,
          role: item?.entityType,
        });
      }
  };

  const renderPendingRequestComponent = ({ item }) => (
    <AppleStyleSwipeableRow
      onPress={() => onRestore({ item })}
      color={colors.themeColor}
      image={images.roundArrow}>
      {isInvite(item.activities[0].verb) && (
        <PRNotificationInviteCell
          item={item}
          disabled={true}
          selectedEntity={selectedEntity}
          onPressFirstEntity={openHomePage}
        />
      )}

      {!isInvite(item.activities[0].verb) && (
        <PRNotificationDetailMessageItem
          item={item}
          disabled={true}
          selectedEntity={selectedEntity}
          onPressFirstEntity={openHomePage}
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
        onPressFirstEntity={openHomePage}
        onPressSecondEntity={openHomePage}
        onPressCard={() => {}}
      />
    </AppleStyleSwipeableRow>
  );

  const RenderSections = ({ item, section }) => {
    if (section.section === strings.pendingrequests) {
      return renderPendingRequestComponent({ item: { ...item, type: 'request' } });
    }
    if (
      section.section === strings.earlier
      || section.section === strings.today
    ) {
      return renderNotificationComponent({
        item: { ...item, type: 'notification' },
      });
    }
    return null;
  };

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        openToast()
      }, 1000)
      setFirstTimeLoading(true);
        callNotificationList()
          .then(() => setFirstTimeLoading(false))
          .catch(() => setFirstTimeLoading(false));
    }
  }, [isFocused]);

  const callNotificationList = () => new Promise((resolve, reject) => {
      const entity = route?.params?.selectedGroup;
      setSelectedEntity(entity);
      const params = {
        uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
      };
      getTrash(params, authContext)
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
            {
              data: [...pendingReqNotification],
              section: strings.pendingrequests,
              type: 'request',
            },
            {
              data: [...todayNotifications],
              section: strings.today,
              type: 'notification',
            },
            {
              data: [...erlierNotifications],
              section: strings.earlier,
              type: 'notification',
            },
          ];
          setMainNotificationsList([]);
          setMainNotificationsList([
            ...array.filter((item) => item.data.length !== 0),
          ]);
          resolve(true);
        })
        .catch((e) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('error');
          Alert.alert(e.messages);
        });
    });

  const itemSeparator = () => (
    // Item Separator
    <View style={styles.listItemSeparatorStyle} />
  );

  const renderSectionFooter = ({ section }) => {
    if (section.section === strings.pendingrequests) {
      return (
        <View
          style={[
            styles.listItemSeparatorStyle,
            { height: 7, backgroundColor: colors.grayBackgroundColor },
          ]}
        />
      );
    }
    return <View style={styles.listItemSeparatorStyle} />;
  };
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={styles.rowViewStyle}>
      <ActivityLoader visible={loading} />

      {showNoteToast && <View style={styles.trashMessageContainerStyle}>
        <Text style={styles.trashMessageStyle}>{strings.trashmessage}</Text>
      </View>}
      {/* eslint-disable-next-line no-nested-ternary */}
      {firstTimeLoading ? (
        <NotificationListShimmer />
      ) : mainNotificationsList?.length > 0 ? (
        <SectionList
          ItemSeparatorComponent={itemSeparator}
          sections={mainNotificationsList}
          keyExtractor={keyExtractor}
          renderItem={RenderSections}
          renderSectionHeader={({ section: { section } }) => (
            <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
              <View style={styles.listItemSeparatorStyle} />
              <Text style={styles.header}>{section}</Text>
            </View>
          )}
          renderSectionFooter={renderSectionFooter}
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
