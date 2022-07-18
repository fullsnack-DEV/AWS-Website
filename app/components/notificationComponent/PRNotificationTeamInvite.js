import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import strings from '../../Constants/String';
import TCProfileImage from '../TCProfileImage';
import TCGradientButton from '../TCGradientButton';
import {parseInviteRequest} from '../../screens/notificationsScreen/PRNotificationParser';

function PRNotificationTeamInvite({
  item,
  selectedEntity,
  onPress,
  onRespond,
  disabled = false,
}) {
  const [dataDictionary, setDataDictionary] = useState();

  console.log('Invite request component:=>', item);
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
              <View style={{flex: 0.7}}>
                <Text style={styles.textContainerStyle}>
                  <Text style={styles.boldTextStyle}>
                    {`${dataDictionary.firstTitle} `}
                  </Text>
                  <Text>{`${dataDictionary.text} `}</Text>
                  <Text style={styles.timeStyle}>
                    {dataDictionary.notificationTime}
                  </Text>
                </Text>
              </View>
              <View
                style={
                  disabled
                    ? [styles.viewSecondStyle, {opacity: 0.5}]
                    : styles.viewSecondStyle
                }
              >
                <TCGradientButton
                  textStyle={styles.btnTextStyle}
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
