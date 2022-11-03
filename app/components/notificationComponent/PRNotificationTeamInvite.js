import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import TCProfileImage from '../TCProfileImage';
import TCGradientButton from '../TCGradientButton';
import {parseInviteRequest} from '../../screens/notificationsScreen/PRNotificationParser';
import NotificationType from '../../Constants/NotificationType';

function PRNotificationTeamInvite({
  item,
  isTrash = false,
  entityType = 'user',
  selectedEntity,
  onPress,
  onRespond,
  disabled = false,
  accessibilityLabel,
}) {
  const [dataDictionary, setDataDictionary] = useState();

  useEffect(() => {
    parseInviteRequest(item, selectedEntity).then((data) => {
      console.log('Invite request component:=>', data);

      setDataDictionary(data);
    });
  }, [item, selectedEntity]);

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
              <View style={{flex: 0.7}}>
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
              <View
                style={
                  disabled
                    ? [styles.viewSecondStyle, {opacity: 0.5}]
                    : styles.viewSecondStyle
                }>
                <TCGradientButton
                  accessibilityLabel={`${accessibilityLabel}`}
                  textStyle={
                    isTrash
                      ? [styles.btnTextStyle, {color: colors.grayColor}]
                      : styles.btnTextStyle
                  }
                  style={styles.acceptButtonInnerStyle}
                  title={strings.respond}
                  disabled={disabled}
                  onPress={onRespond}
                />
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
    flex: 0.3,
    marginTop: 5,
  },

  acceptButtonInnerStyle: {
    height: 25,
    borderRadius: 5,
  },
  btnTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    textAlign: 'center',
  },
});

export default PRNotificationTeamInvite;
