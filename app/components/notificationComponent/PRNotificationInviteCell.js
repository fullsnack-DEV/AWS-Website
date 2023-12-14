import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import {parseInviteRequest} from '../../screens/notificationsScreen/PRNotificationParser';
import NotificationType from '../../Constants/NotificationType';
import GroupIcon from '../GroupIcon';
import TCThinDivider from '../TCThinDivider';

function PRNotificationInviteCell({
  item,
  selectedEntity,
  onPress,
  onAccept,
  onDecline,
  disabled = false,
  isTrash = false,
  entityType = 'user',
  isRespond = false,
}) {
  const [dataDictionary, setDataDictionary] = useState();

  useEffect(() => {
    const parsedObject = JSON.parse(item.activities[0].object);

    const invitedByMember = parsedObject.invitedByMember;

    parseInviteRequest(item, selectedEntity).then((data) => {
      if (invitedByMember) {
        const parsedObjectForGroupName = JSON.parse(item.activities[0].object);

        const grpName = parsedObjectForGroupName.groupName;

        const newObj = {
          ...data,
          text: `${data.text} ${grpName}`,
        };
        setDataDictionary(newObj);
        return;
      }

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

          <>
            {isRespond ? (
              <TouchableOpacity
                style={[styles.buttonContainer, {opacity: disabled ? 0.5 : 1}]}
                onPress={onAccept}
                disabled={disabled}>
                <Text style={[styles.buttonText, {textTransform: 'uppercase'}]}>
                  {strings.respond}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.buttonView, disabled ? {opacity: 0.5} : {}]}>
                <TouchableOpacity
                  style={[
                    styles.buttonContainer,
                    {
                      marginRight: 5,
                      backgroundColor: colors.grayBackgroundColor,
                    },
                  ]}
                  onPress={onDecline}
                  disabled={disabled}>
                  <Text
                    style={[
                      styles.buttonText,
                      {color: colors.lightBlackColor},
                    ]}>
                    {strings.decline}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={onAccept}
                  disabled={disabled}>
                  <Text style={styles.buttonText}>{strings.accept}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        </TouchableOpacity>
      )}
      <TCThinDivider />
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

    paddingVertical: 15,
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
    padding: 6,
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
