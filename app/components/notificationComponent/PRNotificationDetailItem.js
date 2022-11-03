import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import TCProfileImage from '../TCProfileImage';
import colors from '../../Constants/Colors';
// import AuthContext from '../../auth/context'
import {parseInviteRequest} from '../../screens/notificationsScreen/PRNotificationParser';
import NotificationType from '../../Constants/NotificationType';

function PRNotificationDetailItem({
  item,
  selectedEntity,
  onPress,
  onDetailPress,
  onPressFirstEntity,
  disabled = false,
  accessibilityLabel,
  isTrash = false,
  entityType = 'user',
}) {
  //   const authContext = useContext(AuthContext)
  const [dataDictionary, setDataDictionary] = useState();

  useEffect(() => {
    parseInviteRequest(item, selectedEntity).then((data) => {
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
              {!dataDictionary.isExpired &&
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
              <View
                style={
                  disabled
                    ? [styles.viewSecondStyle, {opacity: 0.5}]
                    : styles.viewSecondStyle
                }>
                <TouchableOpacity
                  testID={`${accessibilityLabel}`}
                  style={
                    isTrash ? styles.disabledBtnStyle : styles.detailBtnStyle
                  }
                  onPress={onDetailPress}
                  disabled={disabled}>
                  <Text
                    style={
                      isTrash
                        ? styles.disableBtnTitleTextStyle
                        : styles.detailBtnTextStyle
                    }>
                    {strings.detailText}
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
    flexDirection: 'column',
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  detailBtnStyle: {
    width: '96%',
    height: 25,
    borderWidth: 1,
    borderColor: '#FF8A01',
    borderRadius: 5,
    justifyContent: 'center',
  },
  disabledBtnStyle: {
    width: '96%',
    height: 25,
    borderWidth: 1,
    borderColor: colors.grayColor,
    borderRadius: 5,
    justifyContent: 'center',
  },
  detailBtnTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: '#FF8A01',
    textAlign: 'center',
  },
  disableBtnTitleTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.grayColor,
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

export default PRNotificationDetailItem;
