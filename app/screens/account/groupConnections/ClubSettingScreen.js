/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import React, {
  useState,
} from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert,
} from 'react-native';

import { syncClubSetting } from '../../../api/Accountapi';
import * as Utility from '../../../utils/index';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import strings from '../../../Constants/String';
import TCGradientButton from '../../../components/TCGradientButton';

export default function ClubSettingScreen({ navigation }) {
  const [selected, setSelected] = useState(0);
  const [loading, setloading] = useState(false);

  const sendClubSetting = async () => {
    setloading(true)
    const entity = await Utility.getStorage('loggedInEntity');
    const bodyParams = {
      allclubmembermannually_sync: selected === 0,
      allclubmemberautomatically_sync: selected === 1,
    }
    syncClubSetting(entity.uid, bodyParams).then((response) => {
      if (response.status) {
        setloading(false)
        console.log('Response :', response.payload);
        navigation.goBack()
      }
    })
      .catch((e) => {
        Alert.alert('Towns Cup', e.messages)
        setloading(false);
      });
  }
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <ScrollView>
        <Text style={styles.titleStyle}>Sync Info</Text>
        <View style={styles.privacyCell}>
          <Text style={styles.privacyNameStyle}>How do you like to update a member’s profile by
            Importing member’s account info?</Text>
          <View style={styles.radioMainView}>
            <TouchableOpacity style={styles.radioButtonView} onPress={() => setSelected(0)}>
              <Image source={ selected === 0 ? images.radioSelect : images.radioUnselect} style={styles.radioImage} />
              <Text style={styles.radioText}>Mannually {'\n'}<Text style={styles.noteText}>A member’s profile is updated when you click the
                “sync Info” button in each member’s profile.</Text></Text>
            </TouchableOpacity>
          </View>
          <View style={styles.radioMainView}>
            <TouchableOpacity style={styles.radioButtonView} onPress={() => setSelected(1)}>
              <Image source={ selected === 1 ? images.radioSelect : images.radioUnselect} style={styles.radioImage} />
              <Text style={styles.radioText}>Automatically{'\n'}<Text style={styles.noteText}>A member’s profile is updated every time a member
                changes his or her account info.</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={{ flex: 1 }}/>
      <Text style={styles.warning}>* Each team settings prevails over the club settings.</Text>
      <TCGradientButton style={{ marginBottom: 0 }} title={strings.saveTitle} onPress={() => sendClubSetting()}/>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  titleStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    padding: 15,
    color: colors.lightBlackColor,
  },
  privacyCell: {
    flexDirection: 'column',
    margin: 15,
  },
  privacyNameStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  radioButtonView: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 15,
  },
  radioMainView: {
    flexDirection: 'column',
  },
  radioText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    alignSelf: 'center',
    marginRight: 15,
    color: colors.lightBlackColor,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
  noteText: {

    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.lightBlackColor,
  },
  warning: {
    marginLeft: 20,
    marginBottom: -20,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.grayColor,
  },
})
