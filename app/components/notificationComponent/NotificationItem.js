import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors'
import strings from '../../Constants/String'
import TCProfileImage from '../TCProfileImage'
import { parseNotification } from '../../screens/notificationsScreen/PRNotificationParser';

function NotificationItem({ data }) {
  const [dataDictionary, setDataDictionary] = useState()

  useEffect(() => {
    parseNotification(data).then((response) => {
      setDataDictionary(response)
    })
  }, []);

  return (
    <View style={{ backgroundColor: colors.whiteColor }}>
      {dataDictionary && <TouchableOpacity onPress={data.card}>
        <View style={styles.viewFirstStyle}>
          <TouchableOpacity onPress={() => {
            data.onPressFirstEntity({ entityType: dataDictionary.entityType, entityId: dataDictionary.entityId })
          }}>
            <TCProfileImage
              entityType={dataDictionary.entityType}
              source={ { uri: dataDictionary.imgName }}
              containerStyle={styles.imageContainer}
              intialChar={dataDictionary.firstTitle.charAt(0).toUpperCase()}
              />
          </TouchableOpacity>
          <View style={styles.textContentStyle}>
            <Text style={styles.textContainerStyle}>
              <TouchableWithoutFeedback onPress={data.onPressFirstEntity}>
                <Text style={styles.boldTextStyle}>
                  {`${dataDictionary.firstTitle} `}
                </Text>
              </TouchableWithoutFeedback>
              {dataDictionary.secondTitle && <Text>{`${strings.and} `}</Text>}

              {dataDictionary.secondTitle && <TouchableWithoutFeedback onPress={data.onPressSecondEntity}>
                <Text style={styles.boldTextStyle} onPress={data.onPressSecondEntity}>{`${dataDictionary.secondTitle} `}</Text>
              </TouchableWithoutFeedback>}
              <Text>{`${dataDictionary.text} `}</Text>
              <Text style={styles.timeStyle}>{dataDictionary.notificationTime}</Text>
            </Text>
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
});

export default NotificationItem;
