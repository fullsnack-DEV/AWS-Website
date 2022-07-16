import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import PRNotificationDetailMessageItem from '../../components/notificationComponent/PRNotificationDetailMessageItem';
import NotificationItem from '../../components/notificationComponent/NotificationItem';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';
import {getTrash, getTrashNextList} from '../../api/Notificaitons';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';

import NotificationListShimmer from '../../components/shimmer/account/NotificationListShimmer';
import TCInnerLoader from '../../components/TCInnerLoader';

function TrashScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [notificationsList, setNotificationsList] = useState();
  const [selectedEntity, setSelectedEntity] = useState();
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);

  const isInvite = (verb) =>
    verb.includes(NotificationType.inviteToJoinClub) ||
    verb.includes(NotificationType.invitePlayerToJoinTeam) ||
    verb.includes(NotificationType.invitePlayerToJoinClub) ||
    verb.includes(NotificationType.inviteToConnectProfile) ||
    verb.includes(NotificationType.invitePlayerToJoingame);

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

  const RenderSections = ({item}) => {
    if (item.activities[0].is_request) {
      return (
        <View>
          {isInvite(item.activities[0].verb) && (
            <PRNotificationInviteCell
              item={item}
              isTrash={true}
              entityType={authContext.entity.role === 'user' || authContext.entity.role === 'player' ? 'user' : 'group'} // user or group
              disabled={true}
              selectedEntity={selectedEntity}
              onPressFirstEntity={openHomePage}
            />
          )}

          {!isInvite(item.activities[0].verb) && (
            <PRNotificationDetailMessageItem
              item={item}
              isTrash={true}
              entityType={authContext.entity.role === 'user' || authContext.entity.role === 'player' ? 'user' : 'group'} // user or group
              disabled={true}
              selectedEntity={selectedEntity}
              onPressFirstEntity={openHomePage}
            />
          )}
        </View>
      );
    }
    if (!item.activities[0].is_request) {
      return (
        <NotificationItem
          data={item}
          isTrash={true}
          entityType={authContext.entity.role === 'user' || authContext.entity.role === 'player' ? 'user' : 'group'} // user or group
          onPressFirstEntity={openHomePage}
          onPressSecondEntity={openHomePage}
          onPressCard={() => {}}
        />
      );
    }
    return null;
  };

  useEffect(() => {
    if (isFocused) {
      setFirstTimeLoading(true);
      getTrashData();
    }
  }, [isFocused]);

  const getTrashData = () => {
    const entity = route?.params?.selectedGroup;
    setSelectedEntity(entity);
    const params = {
      uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
    };
    getTrash(params, authContext)
      .then(async (response) => {
        setloading(false);
        setLoadMore(false);
        setFirstTimeLoading(false);
        setNotificationsList([...response.payload.notifications]);
      })
      .catch((e) => {
        Alert.alert(e.messages);
      });
  };

  const getNextTrashData = () => {
    const entity = route?.params?.selectedGroup;
    setSelectedEntity(entity);
    const params = {
      uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
    };
    const id_lt = notificationsList[notificationsList.length - 1].id;
    getTrashNextList(params, id_lt, authContext)
      .then(async (response) => {
        setloading(false);
        setLoadMore(false);
        setFirstTimeLoading(false);
        setNotificationsList([
          ...notificationsList,
          ...response.payload.notifications,
        ]);
      })
      .catch((e) => {
        Alert.alert(e.messages);
      });
  };

  const itemSeparator = () => (
    // Item Separator
    <View style={styles.listItemSeparatorStyle} />
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const onLoadMore = (e) => {
    let paddingToBottom = 10;
    paddingToBottom += e.nativeEvent.layoutMeasurement.height;
    const currentOffset = e.nativeEvent.contentOffset.y;
    const direction = currentOffset > 50 ? 'down' : 'up';
    if (direction === 'up') {
      if (
        e.nativeEvent.contentOffset.y >=
        e.nativeEvent.contentSize.height - paddingToBottom
      ) {
        if (!loadMore) {
          console.log('next page');
          setLoadMore(true);
          setTimeout(() => {
            getNextTrashData();
          }, 1000);
        }
      }
    }
  };

  return (
    <View style={styles.rowViewStyle}>
      <ActivityLoader visible={loading} />
      {/* eslint-disable-next-line no-nested-ternary */}
      {firstTimeLoading ? (
        <NotificationListShimmer />
      ) : notificationsList?.length > 0 ? (
        <FlatList
          ItemSeparatorComponent={itemSeparator}
          data={notificationsList}
          keyExtractor={keyExtractor}
          renderItem={RenderSections}
          onScroll={onLoadMore}
        />
      ) : (
        <TCNoDataView title={'No records found'} />
      )}
      {loadMore && (
        <TCInnerLoader allowMargin={false} size={60} visible={loadMore} />
      )}
      <SafeAreaView style={styles.trashMessageContainerStyle}>
        <Text style={styles.trashMessageStyle}>{strings.trashmessage}</Text>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  rowViewStyle: {
    flex: 1,
  },

  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: colors.linesepratorColor,
  },
  trashMessageContainerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    // backgroundColor: colors.thinDividerColor,
  },
  trashMessageStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    textAlign: 'center',
    margin: 15,
    marginBottom: 0,
  },
});

export default TrashScreen;
