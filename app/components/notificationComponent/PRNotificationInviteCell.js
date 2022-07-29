import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import strings from '../../Constants/String';
import TCProfileImage from '../TCProfileImage';
import TCGradientButton from '../TCGradientButton';
import {parseInviteRequest} from '../../screens/notificationsScreen/PRNotificationParser';
import NotificationType from '../../Constants/NotificationType';

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
        <TouchableOpacity onPress={onPress}>
          <View style={styles.viewFirstStyle}>
            <TCProfileImage
              entityType={dataDictionary.entityType}
              source={{uri: dataDictionary.imgName}}
              containerStyle={styles.imageContainer}
              intialChar={dataDictionary.firstTitle.charAt(0).toUpperCase()}
            />
            <View style={styles.textContentStyle}>
              <View style={{flex: 0.6}}>
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
              <View
                style={
                  disabled
                    ? [styles.viewSecondStyle, {opacity: 0.5}]
                    : styles.viewSecondStyle
                }>
                <TCGradientButton
                  textStyle={styles.btnTextStyle}
                  outerContainerStyle={styles.acceptBtnStyle}
                  style={styles.acceptButtonInnerStyle}
                  title={strings.accept}
                  disabled={disabled}
                  onPress={onAccept}
                />

                <TouchableOpacity
                  style={styles.declineBtnStyle}
                  onPress={onDecline}
                  disabled={disabled}>
                  <Text
                    style={[
                      styles.btnTextStyle,
                      {color: colors.lightBlackColor},
                    ]}>
                    {strings.decline}
                  </Text>
                </TouchableOpacity>
              </View>
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
    flexDirection: 'row',
  },
  viewFirstStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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

  viewSecondStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.4,
  },

  acceptBtnStyle: {
    margin: 0,
    width: '48%',
    height: 25,
  },
  acceptButtonInnerStyle: {
    height: 25,
    width: '100%',
    borderRadius: 5,
  },
  btnTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    textAlign: 'center',
  },

  declineBtnStyle: {
    width: '48%',
    height: 25,
    borderRadius: 5,
    justifyContent: 'center',
    marginLeft: 5,

    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
});

export default PRNotificationInviteCell;
