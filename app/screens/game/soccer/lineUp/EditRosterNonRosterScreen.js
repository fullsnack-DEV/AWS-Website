import React, { useLayoutEffect, useState } from 'react';
import {
  View, StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, Image,
} from 'react-native';

import Modal from 'react-native-modal';

import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../../Constants/Colors'
import fonts from '../../../../Constants/Fonts'

import TCSearchBox from '../../../../components/TCSearchBox';
import TCGreenSwitcher from '../../../../components/TCGreenSwitcher';
import TCLabel from '../../../../components/TCLabel';
import MovePlayer from '../../../../components/game/soccer/home/lineUp/MovePlayer';
import images from '../../../../Constants/ImagePath';

export default function EditRosterNonRosterScreen({ navigation }) {
  const [selected, setSelected] = useState(1)
  const [isModalVisible, setModalVisible] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.saveButtonStyle} onPress={() => console.log('SAVE')}>Save</Text>
      ),
    });
  }, []);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <TCSearchBox style={{ alignSelf: 'center', marginTop: 15 }}/>
        <TCGreenSwitcher
        firstTabText={'Single selection'}
        secondTabText={'Multi Selection'}
        selectedTab={selected}
        onFirstTabPress={() => setSelected(1)}
        onSecondTabPress={() => setSelected(2)}/>
        <TCLabel title={'Roster'}/>
        <Text style={{
          fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 25,
        }}>Starting</Text>
        <MovePlayer onMovePress={toggleModal}/>
        <MovePlayer/>
        {/* <Text style={{
          fontFamily: fonts.RRegular, fontSize: 14, color: colors.grayColor, marginLeft: 35, marginTop: 10,
        }}>No Player</Text> */}
        {/* <TCThinDivider marginTop={20}/> */}
        <Text style={{
          fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 25, marginTop: 20,
        }}>Subs</Text>
        <MovePlayer/>
        <MovePlayer/>
        {/* <Text style={{
          fontFamily: fonts.RRegular, fontSize: 14, color: colors.grayColor, marginLeft: 35, marginTop: 10,
        }}>No Player</Text> */}

        <TCLabel title={'Non-Roster'}/>
        <MovePlayer/>
        <MovePlayer/>
        <MovePlayer/>
      </View>
      <Modal
        isVisible={ isModalVisible }
        backdropColor="black"
        backdropOpacity={ 0 }
        style={ { marginLeft: 0, marginRight: 0, marginBottom: 0 } }>
        <View
          style={ styles.modelViewContainer }>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginRight: 10,
          }}>
            <Text
            onPress={toggleModal}
            style={ styles.cancelTitle}>
              Cancel
            </Text>
            <Text
            style={ styles.modelTitle}>
              Move To
            </Text>
            <Text
            onPress={toggleModal}
            style={ styles.doneTitle}>
              Done
            </Text>
          </View>
          <View style={ styles.separatorLine }></View>

          <TouchableOpacity>
            <LinearGradient
                colors={[colors.greenGradientStart, colors.greenGradientEnd]}
                style={styles.topViewContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.radioText} numberOfLines={1}>{'Starting'}</Text>
              </View>
              <Image source={images.checkGreen} style={styles.checkGreenImage}/>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity>
            <LinearGradient
                colors={[colors.greenGradientStart, colors.greenGradientEnd]}
                style={styles.topViewContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.radioText} numberOfLines={1}>{'Starting'}</Text>
              </View>
              <Image source={images.checkGreen} style={styles.checkGreenImage}/>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity>
            <LinearGradient
                colors={[colors.greenGradientStart, colors.greenGradientEnd]}
                style={styles.topViewContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.radioText} numberOfLines={1}>{'Starting'}</Text>
              </View>
              <Image source={images.checkGreen} style={styles.checkGreenImage}/>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  saveButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 8,
    width: '100%',
  },
  modelTitle: {
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  doneTitle: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  cancelTitle: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.medianGrayColor,
  },
  modelViewContainer: {
    width: '100%',
    height: Dimensions.get('window').height / 3.5,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
  },
  topViewContainer: {
    flexDirection: 'row',
    backgroundColor: colors.offwhite,
    height: 40,
    width: ('90%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 20,

    marginTop: 10,

    borderRadius: 10,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },

  radioText: {
    fontSize: 16,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },

  checkGreenImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
})
