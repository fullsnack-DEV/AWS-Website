import React, { useEffect, useState, useContext } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import fonts from '../../Constants/Fonts';
import strings from '../../Constants/String'
import TCProfileImage from '../TCProfileImage'
import colors from '../../Constants/Colors'
import AuthContext from '../../auth/context'
import { parseRequest } from '../../screens/notificationsScreen/PRNotificationParser';

function PRNotificationDetailMessageItem({
  item, selectedEntity, onPress, onDetailPress, onMessagePress,
}) {
  const authContext = useContext(AuthContext)
  const [dataDictionary, setDataDictionary] = useState()

  useEffect(() => {
    parseRequest(item, selectedEntity, authContext.entity).then((data) => {
      setDataDictionary(data)
    })
  }, []);

  return (
    <View style={{ backgroundColor: colors.whiteColor }}>
      {dataDictionary && <TouchableOpacity onPress={onPress}>
        <View style={styles.viewFirstStyle}>
          <TCProfileImage
            entityType={dataDictionary.entityType}
            source={ { uri: dataDictionary.imgName }}
            containerStyle={styles.imageContainer}
            intialChar={dataDictionary.firstTitle.charAt(0).toUpperCase()}
            />
          <View style={styles.textContentStyle}>
            <Text style={styles.textContainerStyle}>
              {dataDictionary.preText && <Text>{`${dataDictionary.preText}`}</Text>}
              <Text style={styles.boldTextStyle}>
                {dataDictionary.preText ? `${dataDictionary.firstTitle}` : `${dataDictionary.firstTitle} `}
              </Text>
              <Text>{`${dataDictionary.text} `}</Text>
              {dataDictionary.doneByText && <Text style={styles.timeStyle}>{dataDictionary.doneByText} </Text>}
              {dataDictionary.doneByTitle && <Text style={styles.smallBoldStyle}>{dataDictionary.doneByTitle} </Text>}
              <Text style={styles.timeStyle}>{dataDictionary.notificationTime}</Text>
            </Text>
            {(dataDictionary.isExpired || dataDictionary.isGameTimePassed) && <Text style={[{ marginTop: 8 },
              styles.smallBoldStyle] }>{strings.responsetimeexpired}</Text>}
            {(!dataDictionary.isExpired && !dataDictionary.isGameTimePassed && dataDictionary.expiryText) && <Text
              style={styles.respnseTimeStyle}>{`${strings.responsetime} `}
              <Text style={styles.respnseTimeBoldStyle}>{dataDictionary.expiryText}</Text>
              {` ${strings.left}`}
            </Text>}
            <View style={styles.viewSecondStyle}>
              <TouchableOpacity style={styles.detailBtnStyle} onPress={onDetailPress}>
                <Text style={styles.detailBtnTextStyle}>{strings.detailText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageBtnStyle} onPress={onMessagePress}>
                <Text style={[styles.detailBtnTextStyle, { color: colors.kHexColor45C1C0 }]}>{strings.message.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>}
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
    width: '48%',
    height: 25,
    borderWidth: 1,
    borderColor: '#FF8A01',
    borderRadius: 5,
    justifyContent: 'center',
  },
  detailBtnTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: '#FF8A01',
    textAlign: 'center',
  },
  messageBtnStyle: {
    width: '48%',
    height: 25,
    borderWidth: 1,
    borderColor: '#45C1C0',
    borderRadius: 5,
    justifyContent: 'center',
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
