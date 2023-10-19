import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import {parseInviteRequest} from '../../screens/notificationsScreen/PRNotificationParser';
import NotificationType from '../../Constants/NotificationType';
import GroupIcon from '../GroupIcon';

function PRNotificationTeamInvite({
  item,
  isTrash = false,
  entityType = 'user',
  selectedEntity,
  onPress,
  onRespond,
  disabled = false,
  isRepond = false,
}) {
  const [dataDictionary, setDataDictionary] = useState();

  useEffect(() => {
    parseInviteRequest(item, selectedEntity).then((data) => {
      setDataDictionary(data);
    });
  }, [item, selectedEntity]);

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
              <Text style={styles.boldTextStyle}>
                {`${dataDictionary.firstTitle}`}
              </Text>
              <Text style={styles.textContainerStyle}>
                {/* <Text style={styles.boldTextStyle}>
                    {`${dataDictionary.firstTitle} `}
                  </Text> */}
                <Text>{`${dataDictionary.text} `}</Text>
                {!isTrash && (
                  <Text style={styles.timeStyle}>
                    {dataDictionary.notificationTime}
                  </Text>
                )}
              </Text>

              {isTrash && (
                <Text style={styles.timeStyle}>
                  {(NotificationType.deleted && 'Deleted') ||
                    (NotificationType.accepted && 'Accepted') ||
                    (NotificationType.declined && 'Declined')}
                  {entityType === 'group' && (
                    <Text>
                      {' '}
                      by {item.activities[0].remove_by?.data?.full_name}{' '}
                      {dataDictionary.notificationTime}
                    </Text>
                  )}
                </Text>
              )}
            </View>
          </View>

          {!isRepond ? (
            <TouchableOpacity
              style={
                disabled
                  ? [styles.buttonContainer, {opacity: 0.5}]
                  : styles.buttonContainer
              }
              disabled={disabled}
              onPress={onRespond}>
              <Text style={styles.buttonText}>
                {strings.venueDetailsPlaceholder}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={
                disabled
                  ? [styles.respondbuttonContainer, {opacity: 0.5}]
                  : styles.respondbuttonContainer
              }
              disabled={disabled}
              onPress={onRespond}>
              <Text
                style={[
                  styles.buttonText,
                  {color: colors.whiteColor, textTransform: 'uppercase'},
                ]}>
                {strings.respond}
              </Text>
            </TouchableOpacity>
          )}
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
    marginVertical: 15,
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
    backgroundColor: colors.grayBackgroundColor,
  },
  respondbuttonContainer: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: colors.themeColor,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
});

export default PRNotificationTeamInvite;
