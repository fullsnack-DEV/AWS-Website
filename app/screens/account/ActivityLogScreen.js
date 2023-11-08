// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {format} from 'react-string-format';
import {useIsFocused} from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import {getActivityLogs, getNextActivityLogs} from '../../api/ActivityLog';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {getUserSettings, saveUserSettings} from '../../api/Users';
import Verbs from '../../Constants/Verbs';
import {getJSDate} from '../../utils';
import {toShortTimeFromString} from '../../utils/Time';

const ActivityLogScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFooterLoader, setShowFooterLoader] = useState(false);
  const [isMoreRecordsAvailable, setIsMoreRecordsAvailable] = useState(true);

  const fetchList = useCallback(() => {
    getActivityLogs(authContext)
      .then(async (response) => {
        setList(response.payload);
        const settingResponse = await getUserSettings(authContext);
        const obj = {
          ...settingResponse.payload.user?.last_activity_log_timestamp,
        };
        obj[authContext.entity.uid] = response.payload[0]?.timestamp;
        const params = {
          last_activity_log_timestamp: {...obj},
        };

        await saveUserSettings(params, authContext);
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch((err) => {
        setTimeout(() => Alert.alert('', err.message), 100);
        setLoading(false);
        setIsRefreshing(false);
      });
  }, [authContext]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchList();
    }
  }, [isFocused, fetchList]);

  const onEndReached = async () => {
    if (list.length === 0) return;

    const timestamp = list[list.length - 1].timestamp;

    if (timestamp && isMoreRecordsAvailable) {
      setShowFooterLoader(true);
      getNextActivityLogs(timestamp, authContext)
        .then((response) => {
          if (response.payload.length > 0) {
            setList([...list, ...response.payload]);
          } else {
            setIsMoreRecordsAvailable(false);
          }
          setShowFooterLoader(false);
        })
        .catch((err) => {
          setTimeout(() => Alert.alert('', err.message), 100);
          setShowFooterLoader(false);
        });
    }
  };

  const handleRefreshing = () => {
    setIsRefreshing(true);
    setIsMoreRecordsAvailable(true);
    fetchList();
  };

  const getLogText = (item = {}) => {
    const entityName = item.group_name ?? item.user_name ?? item.following_name;
    const entityNameWordArray = entityName.split(' ');
    const senderNameWordArray = item.sender_name
      ? item.sender_name.split(' ')
      : [];

    const textArray = item.text.split('.');

    const logTextArray =
      textArray.length > 2
        ? textArray
            .slice(0, textArray.length - 1)
            .join('.')
            .split(' ')
        : textArray[0].split(' ');

    const wordSpecifications = logTextArray.map((word) => {
      const obj = {
        word,
        isBold:
          entityNameWordArray.includes(word) ||
          (item.invite_by === Verbs.member &&
            senderNameWordArray.includes(word)),
        routeData: {},
      };
      if (obj.isBold) {
        if (
          item.invite_by === Verbs.member &&
          senderNameWordArray.includes(word)
        ) {
          obj.routeData = {
            uid: item.sender_id,
            role: Verbs.entityTypePlayer,
          };
        } else if (entityNameWordArray.includes(word)) {
          obj.routeData = {
            uid: item.group_id ?? item.user_id ?? item.following_id,
            role:
              item.group_type ?? item.following_type ?? Verbs.entityTypePlayer,
          };
        }
      }

      return obj;
    });

    const result = wordSpecifications.map((obj, index) => {
      if (obj.isBold) {
        return (
          <Text
            key={index}
            style={[styles.textStyle, {fontFamily: fonts.RBold}]}
            onPress={() => handleNavigation(obj.routeData)}>
            {obj.word}{' '}
          </Text>
        );
      }
      return `${obj.word} `;
    });

    return result;
  };

  const handleNavigation = (activityObj = {}) => {
    if (activityObj.uid) {
      navigation.navigate('HomeStack', {
        screen: 'HomeScreen',
        params: {
          ...activityObj,
          comeFrom: 'AccountStack',
          routeParams: {
            screen: 'ActivityLogScreen',
          },
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        leftIcon={images.backArrow}
        leftIconPress={() =>
          navigation.navigate('App', {
            screen: 'Account',
          })
        }
        title={strings.activityLog}
      />
      <ActivityLoader visible={loading} />
      <View style={styles.container}>
        <FlatList
          data={list}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={handleRefreshing}
          onEndReachedThreshold={0.6}
          onEndReached={onEndReached}
          renderItem={({item}) => (
            <>
              <Text style={styles.textStyle}>
                {getLogText(item)}.{' '}
                {item?.invite_by === Verbs.admin ? (
                  <Text style={styles.adminText}>
                    {format(
                      strings.byUser,
                      `${item.sender_name}  ${toShortTimeFromString(
                        getJSDate(item.timestamp),
                      )}`,
                    )}
                  </Text>
                ) : (
                  <Text style={styles.adminText}>
                    {' '}
                    {toShortTimeFromString(getJSDate(item.timestamp))}
                  </Text>
                )}
              </Text>
              <View style={styles.divider} />
            </>
          )}
          ListFooterComponent={() => {
            if (showFooterLoader) {
              return (
                <View>
                  <ActivityIndicator size={'small'} />
                </View>
              );
            }
            return null;
          }}
          ListEmptyComponent={() => (
            <View style={{alignItems: 'center'}}>
              <Text style={styles.emptyText}>{strings.noActivityLog}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  divider: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
  textStyle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  adminText: {
    fontFamily: fonts.RLight,
    color: colors.userPostTimeColor,
    fontSize: 12,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
});
export default ActivityLogScreen;
