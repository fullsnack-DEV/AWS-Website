import React, { useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,

} from 'react-native';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';
import TCThinDivider from '../../../../components/TCThinDivider';

export default function CreateMemberProfileClubForm2({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => navigation.navigate('CreateMemberProfileClubForm3')}>Next</Text>
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

      <Text style={styles.checkBoxTitle}>Team Membership {'&'} Admin Authority</Text>
      <View style={styles.mainCheckBoxContainer}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 15,
        }}>
          <View style={styles.profileView}>
            <Image source={ images.clubPlaceholder } style={ styles.profileImage } />
          </View>
          <TCGroupNameBadge groupType={'club'}/>
        </View>
        <View style={styles.checkBoxContainer}>
          <Image source={images.checkGreenBG} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          <Text style={styles.checkBoxItemText}>Admin</Text>
        </View>

      </View>
      <TCThinDivider/>
      <View style={styles.mainCheckBoxContainer}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 15,
        }}>
          <View style={styles.profileView}>
            <Image source={ images.teamPlaceholder } style={ styles.profileImage } />
          </View>
          <TCGroupNameBadge />
        </View>
        <View style={styles.checkBoxContainer}>
          <Image source={images.checkGreenBG} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          <Text style={styles.checkBoxItemText}>Member</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <Image source={images.checkGreenBG} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          <Text style={styles.checkBoxItemText}>Admin</Text>
        </View>
      </View>
      <TCThinDivider/>
      <View style={styles.mainCheckBoxContainer}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 15,
        }}>
          <View style={styles.profileView}>
            <Image source={ images.teamPlaceholder } style={ styles.profileImage } />
          </View>
          <TCGroupNameBadge />
        </View>
        <View style={styles.checkBoxContainer}>
          <Image source={images.checkGreenBG} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          <Text style={styles.checkBoxItemText}>Member</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <Image source={images.checkGreenBG} style={{ height: 22, width: 22, resizeMode: 'contain' }}/>
          <Text style={styles.checkBoxItemText}>Admin</Text>
        </View>
      </View>
      <TCThinDivider/>
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
    backgroundColor: colors.lightgrayColor,
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
  checkBoxContainer: {
    flexDirection: 'row', alignItems: 'center', height: 25, marginBottom: 10,
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 20,
  },
  checkBoxTitle: {
    fontFamily: fonts.RRegular, fontSize: 20, color: colors.lightBlackColor, marginLeft: 20, marginBottom: 10,
  },
  checkBoxItemText: {
    fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 10,
  },
});
