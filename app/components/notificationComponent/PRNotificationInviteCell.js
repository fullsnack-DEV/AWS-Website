import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import {parseInviteRequest} from '../../screens/notificationsScreen/PRNotificationParser';
import NotificationType from '../../Constants/NotificationType';
import GroupIcon from '../GroupIcon';

function PRNotificationInviteCell({
  item,
  selectedEntity,
  onPress,
  onAccept,
  onDecline,
  disabled = false,
  isTrash = false,
  entityType = 'user',
}) {
  const [dataDictionary, setDataDictionary] = useState();

  useEffect(() => {
    parseInviteRequest(item, selectedEntity).then((data) => {
      setDataDictionary(data);
    });
  }, []);

  return (
    <View style={{backgroundColor: colors.whiteColor, flex: 1}}>
      {dataDictionary && (
        <TouchableOpacity onPress={onPress} style={styles.viewFirstStyle}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <GroupIcon
              imageUrl={dataDictionary.imgName}
              entityType={dataDictionary.entityType}
              groupName={dataDictionary.firstTitle}
              textstyle={{fontSize: 12}}
              containerStyle={styles.imageContainer}
            />
            <View style={{flex: 1}}>
              <Text style={styles.textContainerStyle}>
                <Text style={styles.boldTextStyle}>
                  {`${dataDictionary.firstTitle} `}
                </Text>
                <Text>{`${dataDictionary.text} `}</Text>
                {!isTrash && (
                  <Text style={styles.timeStyle}>
                    {dataDictionary.notificationTime}
                  </Text>
                )}
              </Text>
              {isTrash && entityType === 'user' && (
                <Text style={styles.timeStyle}>
                  {(NotificationType.deleted ===
                    item.activities[0].action_type &&
                    'Deleted') ||
                    (NotificationType.accepted ===
                      item.activities[0].action_type &&
                      'Accepted') ||
                    (NotificationType.declined ===
                      item.activities[0].action_type &&
                      'Declined') ||
                    (NotificationType.cancelled ===
                      item.activities[0].action_type &&
                      'Cancelled')}
                  <Text> {dataDictionary.notificationTime}</Text>
                </Text>
              )}
              {isTrash && entityType === 'group' && (
                <Text style={styles.timeStyle}>
                  {(NotificationType.deleted ===
                    item.activities[0].action_type &&
                    'Deleted') ||
                    (NotificationType.accepted ===
                      item.activities[0].action_type &&
                      'Accepted') ||
                    (NotificationType.declined ===
                      item.activities[0].action_type &&
                      'Declined') ||
                    (NotificationType.cancelled ===
                      item.activities[0].action_type &&
                      'Cancelled')}
                  <Text>
                    {' '}
                    by {item.activities[0].remove_by?.data?.full_name}{' '}
                    {dataDictionary.notificationTime}
                  </Text>
                </Text>
              )}
            </View>
          </View>
          <View style={[styles.buttonView, disabled ? {opacity: 0.5} : {}]}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={onAccept}
              disabled={disabled}>
              <Text style={styles.buttonText}>{strings.accept}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonContainer,
                {
                  marginLeft: 5,
                  backgroundColor: colors.grayBackgroundColor,
                },
              ]}
              onPress={onDecline}
              disabled={disabled}>
              <Text
                style={[styles.buttonText, {color: colors.lightBlackColor}]}>
                {strings.decline}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  viewFirstStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
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
  buttonContainer: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: colors.themeColor,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
  },
});

export default PRNotificationInviteCell;
