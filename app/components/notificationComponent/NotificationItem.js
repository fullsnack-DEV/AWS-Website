import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import TCProfileImage from '../TCProfileImage';
import {parseNotification} from '../../screens/notificationsScreen/PRNotificationParser';
import NotificationType from '../../Constants/NotificationType';

function NotificationItem({
  data,
  onPressFirstEntity,
  onPressSecondEntity,
  onPressCard,
  isTrash = false,
  entityType = 'user',
  onButtonPress = () => {},
}) {
  const [dataDictionary, setDataDictionary] = useState();
  // console.log('DATA-->>', dataDictionary)

  useEffect(() => {
    parseNotification(data).then((response) => {
      setDataDictionary(response);
    });
  }, []);

  return (
    <View style={{backgroundColor: colors.whiteColor}}>
      {dataDictionary && (
        <TouchableOpacity onPress={onPressCard}>
          <View style={styles.viewFirstStyle}>
            <TouchableOpacity
              onPress={() => {
                onPressFirstEntity({
                  entityType: dataDictionary.entityType,
                  entityId: dataDictionary.entityId,
                });
              }}>
              <TCProfileImage
                entityType={dataDictionary.entityType}
                source={{uri: dataDictionary.imgName}}
                containerStyle={styles.imageContainer}
                intialChar={dataDictionary?.firstTitle
                  ?.charAt(0)
                  ?.toUpperCase()}
              />
            </TouchableOpacity>
            <View style={styles.textContentStyle}>
              <Text style={styles.textContainerStyle}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    onPressFirstEntity({
                      entityType: dataDictionary.entityType,
                      entityId: dataDictionary.entityId,
                    });
                  }}>
                  <Text style={styles.boldTextStyle}>
                    {`${dataDictionary.firstTitle} `}
                  </Text>
                </TouchableWithoutFeedback>
                {dataDictionary.secondTitle && <Text>{`${strings.and} `}</Text>}
                {dataDictionary.secondTitle && (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      onPressSecondEntity({
                        entityType: dataDictionary.entityType1,
                        entityId: dataDictionary.entityId1,
                      });
                    }}>
                    <Text
                      style={
                        styles.boldTextStyle
                      }>{`${dataDictionary.secondTitle} `}</Text>
                  </TouchableWithoutFeedback>
                )}
                <Text>{`${dataDictionary.text} `}</Text>
                {!isTrash && (
                  <Text style={styles.timeStyle}>
                    {dataDictionary.notificationTime}
                  </Text>
                )}
              </Text>
              {isTrash && entityType === 'user' && (
                <Text style={styles.timeStyle}>
                  {(NotificationType.deleted && 'Deleted') ||
                    (NotificationType.accepted && 'Accepted') ||
                    (NotificationType.declined && 'declined')}{' '}
                  <Text>{dataDictionary.notificationTime}</Text>
                </Text>
              )}
              {isTrash && entityType === 'group' && (
                <Text style={styles.timeStyle}>
                  {(NotificationType.deleted && 'Deleted') ||
                    (NotificationType.accepted && 'Accepted') ||
                    (NotificationType.declined && 'Declined')}
                  <Text>
                    {' '}
                    by {data.activities[0].remove_by?.data?.full_name}{' '}
                    {dataDictionary.notificationTime}
                  </Text>
                </Text>
              )}
              {(data.activities[0].verb.includes(
                NotificationType.memberProfileChanged,
              ) ||
                data.activities[0].verb.includes(
                  NotificationType.userAddedProfile,
                )) && (
                <TouchableOpacity
                  onPress={() => onButtonPress(data.activities[0].foreign_id)}
                  style={styles.buttonStyles}>
                  <Text style={styles.textStyle}>
                    {strings.goToSportActivityText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    margin: 15,
  },
  textContentStyle: {
    flex: 1,
    marginVertical: 15,
    marginRight: 15,
    flexDirection: 'column',
  },
  viewFirstStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  textContainerStyle: {
    fontFamily: fonts.RLight,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  boldTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  timeStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.userPostTimeColor,
  },
  buttonStyles: {
    alignSelf: 'center',
    backgroundColor: colors.lightGrey,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 5,
  },
  textStyle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    textTransform: 'uppercase',
    lineHeight: 14,
  },
});

export default NotificationItem;
