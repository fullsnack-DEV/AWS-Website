import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';

import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCTextField from '../../../../components/TCTextField';
import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';

export default function CreateMemberProfileClubForm3({ navigation }) {
  const [note, setNote] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => navigation.navigate('MemberProfileCreatedScreen')}>Done</Text>
      ),
    });
  }, [navigation]);

  return (

    <ScrollView style={styles.mainContainer}>
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
      </View>

      <View>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginRight: 15, marginBottom: 15,
        }}>
          <View style={styles.profileView}>
            <Image source={ images.clubPlaceholder } style={ styles.profileImage } />
          </View>
          <TCGroupNameBadge groupType={'club'}/>
        </View>
        <TCTextField value={note} height={100} multiline={true} onChangeText={(text) => setNote(text)} placeholder={strings.writeNotesPlaceholder} keyboardType={'default'}/>
      </View>
      <View style={{ marginBottom: 20 }}/>
    </ScrollView>

  );
}
const styles = StyleSheet.create({

  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form3: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  profileView: {
    backgroundColor: colors.whiteColor,
    height: 26,
    width: 26,
    borderRadius: 54,
    marginRight: 5,

    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,

  },
  profileImage: {
    alignSelf: 'center',
    height: 25,
    resizeMode: 'contain',
    width: 25,
    borderRadius: 50,
  },

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

});
