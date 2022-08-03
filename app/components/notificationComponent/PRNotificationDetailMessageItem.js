import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../Constants/Fonts';
import strings from '../../Constants/String';
import TCProfileImage from '../TCProfileImage';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import {parseRequest} from '../../screens/notificationsScreen/PRNotificationParser';
import NotificationType from '../../Constants/NotificationType';

function PRNotificationDetailMessageItem({
  item,
  selectedEntity,
  onPress,
  onDetailPress,
  onPressFirstEntity,
  disabled = false,
  isTrash = false,
  entityType = 'user',
}) {
  const authContext = useContext(AuthContext);
  const [dataDictionary, setDataDictionary] = useState();

  useEffect(() => {
    parseRequest(item, selectedEntity, authContext.entity).then((data) => {
      setDataDictionary(data);
    });
  }, []);

  return (
    <View style={{backgroundColor: colors.whiteColor}}>
      {dataDictionary && (
        <TouchableOpacity onPress={onPress}>
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
                intialChar={dataDictionary.firstTitle?.charAt(0).toUpperCase()}
              />
            </TouchableOpacity>
            <View style={styles.textContentStyle}>
              <View style={{flex: 0.7}}>
                <Text style={styles.textContainerStyle}>
                  {dataDictionary.preText && (
                    <Text>{`${dataDictionary.preText}`}</Text>
                  )}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      onPressFirstEntity({
                        entityType: dataDictionary.entityType,
                        entityId: dataDictionary.entityId,
                      });
                    }}>
                    <Text style={styles.boldTextStyle}>
                      {dataDictionary.preText
                        ? `${dataDictionary.firstTitle}`
                        : `${dataDictionary.firstTitle} `}
                    </Text>
                  </TouchableWithoutFeedback>
                  <Text>{`${dataDictionary.text} `}</Text>
                  {dataDictionary.doneByText && (
                    <Text style={styles.timeStyle}>
                      {dataDictionary.doneByText}{' '}
                    </Text>
                  )}
                  {dataDictionary.doneByTitle && (
                    <Text style={styles.smallBoldStyle}>
                      {dataDictionary.doneByTitle}{' '}
                    </Text>
                  )}
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

                {(dataDictionary.isExpired ||
                  dataDictionary.isGameTimePassed) && (
                  <Text style={[{marginTop: 8}, styles.smallBoldStyle]}>
                    {strings.responsetimeexpired}
                  </Text>
                )}
                {!isTrash &&
                  !dataDictionary.isExpired &&
                  !dataDictionary.isGameTimePassed &&
                  dataDictionary.expiryText && (
                    <Text style={styles.respnseTimeStyle}>
                      {`${strings.responsetime} `}
                      <Text style={styles.respnseTimeBoldStyle}>
                        {dataDictionary.expiryText}
                      </Text>
                      {` ${strings.left}`}
                    </Text>
                  )}
              </View>
              <View style={styles.viewSecondStyle}>
                <LinearGradient
                  colors={
                    disabled
                      ? [colors.grayBackgroundColor, colors.grayBackgroundColor]
                      : [colors.themeColor1, colors.localHomeGradientEnd]
                  }
                  style={styles.detailBtnStyle}>
                  <TouchableOpacity onPress={onDetailPress}>
                    <Text
                      style={[
                        styles.detailBtnTextStyle,
                        {
                          color: disabled
                            ? colors.userPostTimeColor
                            : colors.whiteColor,
                        },
                      ]}>
                      {strings.respondWithinText}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
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
    // width: Dimensions.get('window').width,
    marginVertical: 15,
    marginRight: 15,
    flexDirection: 'row',
  },
  viewFirstStyle: {
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
  smallBoldStyle: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.userPostTimeColor,
  },

  viewSecondStyle: {
    flex: 0.3,
    alignItems: 'flex-end',
  },
  detailBtnStyle: {
    width: 75,
    height: 25,
    borderRadius: 5,
    justifyContent: 'center',
  },
  detailBtnTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  respnseTimeStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    marginTop: 8,
    color: '#FF8A01',
  },
  respnseTimeBoldStyle: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: '#FF8A01',
  },
});

export default PRNotificationDetailMessageItem;
