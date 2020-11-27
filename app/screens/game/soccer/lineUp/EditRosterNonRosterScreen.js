import React, { useLayoutEffect, useState, useRef } from 'react';
import {
  View, StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, Image,
} from 'react-native';

import Modal from 'react-native-modal';

import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import colors from '../../../../Constants/Colors'
import fonts from '../../../../Constants/Fonts'
import TCSearchBox from '../../../../components/TCSearchBox';
import TCGreenSwitcher from '../../../../components/TCGreenSwitcher';
import TCLabel from '../../../../components/TCLabel';
import TCGradientButton from '../../../../components/TCGradientButton'
import LineUpPlayerView from '../../../../components/game/soccer/home/lineUp/LineUpPlayerView';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import LineUpPlayerMultiSelectionView from '../../../../components/game/soccer/home/lineUp/LineUpPlayerMultiSelectionView';

export default function EditRosterNonRosterScreen({ navigation }) {
  const actionSheet = useRef();
  const [selected, setSelected] = useState(1)
  const [selectedPosition, setSelectedPosition] = useState()
  const [isModalVisible, setModalVisible] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={ () => actionSheet.current.show() }>
          <Image source={ images.vertical3Dot } style={ styles.navigationRightItem } />
        </TouchableOpacity>

      ),
    });
  }, [navigation]);
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
        {selected === 1 ? <View>
          <TCLabel title={'Roster'}/>
          <Text style={{
            fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 25,
          }}>Starting</Text>
          <LineUpPlayerView onMovePress={toggleModal}/>
          <LineUpPlayerView />
          <LineUpPlayerView buttonType={'move'}/>
          {/* <Text style={{
          fontFamily: fonts.RRegular, fontSize: 14, color: colors.grayColor, marginLeft: 35, marginTop: 10,
          }}>No Player</Text> */}
          {/* <TCThinDivider marginTop={20}/> */}
          <Text style={{
            fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 25, marginTop: 20,
          }}>Subs</Text>
          <LineUpPlayerView/>
          <LineUpPlayerView/>
          {/* <Text style={{
          fontFamily: fonts.RRegular, fontSize: 14, color: colors.grayColor, marginLeft: 35, marginTop: 10,
          }}>No Player</Text> */}

          <TCLabel title={'Non-Roster'}/>
          <LineUpPlayerView/>
          <LineUpPlayerView/>
          <LineUpPlayerView/>
        </View> : <View>
          <TCLabel title={'Roster'}/>
          <Text style={{
            fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 25,
          }}>Starting</Text>

          <LineUpPlayerMultiSelectionView/>

          {/* <Text style={{
          fontFamily: fonts.RRegular, fontSize: 14, color: colors.grayColor, marginLeft: 35, marginTop: 10,
          }}>No Player</Text> */}
          {/* <TCThinDivider marginTop={20}/> */}
          <Text style={{
            fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 25, marginTop: 20,
          }}>Subs</Text>
          <LineUpPlayerMultiSelectionView/>

          {/* <Text style={{
          fontFamily: fonts.RRegular, fontSize: 14, color: colors.grayColor, marginLeft: 35, marginTop: 10,
          }}>No Player</Text> */}

          <TCLabel title={'Non-Roster'}/>
          <LineUpPlayerMultiSelectionView/>

        </View>}
        {selected === 1 ? <TCGradientButton title={strings.saveTitle}/> : <TCGradientButton title={strings.moveTitle}/>}
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

          <TouchableOpacity onPress={() => setSelectedPosition(1)}>
            {selectedPosition === 1 ? <LinearGradient
                colors={[colors.greenGradientStart, colors.greenGradientEnd]}
                style={styles.topViewContainer}>
              <Text style={styles.radioText} numberOfLines={1}>{'Starting'}</Text>
              <Image source={images.radioSelectGreen} style={styles.checkGreenImage}/>
            </LinearGradient> : <View
                style={styles.topViewContainer}>
              <Text style={[styles.radioText, { color: colors.lightBlackColor }]} numberOfLines={1}>{'Starting'}</Text>
              <Image source={images.radioUnSelectGreen} style={styles.checkGreenImage}/>
            </View>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedPosition(2)}>
            {selectedPosition === 2 ? <LinearGradient
                colors={[colors.greenGradientStart, colors.greenGradientEnd]}
                style={styles.topViewContainer}>
              <Text style={styles.radioText} numberOfLines={1}>{'Subs'}</Text>
              <Image source={images.radioSelectGreen} style={styles.checkGreenImage}/>
            </LinearGradient> : <View
                style={styles.topViewContainer}>
              <Text style={[styles.radioText, { color: colors.lightBlackColor }]} numberOfLines={1}>{'Subs'}</Text>
              <Image source={images.radioUnSelectGreen} style={styles.checkGreenImage}/>
            </View>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedPosition(3)}>
            {selectedPosition === 3 ? <LinearGradient
                colors={[colors.greenGradientStart, colors.greenGradientEnd]}
                style={styles.topViewContainer}>
              <Text style={styles.radioText} numberOfLines={1}>{'Non-roster'}</Text>
              <Image source={images.radioSelectGreen} style={styles.checkGreenImage}/>
            </LinearGradient> : <View
                style={styles.topViewContainer}>
              <Text style={[styles.radioText, { color: colors.lightBlackColor }]} numberOfLines={1}>{'Non-roster'}</Text>
              <Image source={images.radioUnSelectGreen} style={styles.checkGreenImage}/>
            </View>}
          </TouchableOpacity>

        </View>
      </Modal>
      <ActionSheet
                ref={actionSheet}
                // title={'News Feed Post'}
                options={ ['Clear all starting', 'Clear all subs', 'Cancel']}
                cancelButtonIndex={2}
                // destructiveButtonIndex={1}
                onPress={(index) => {
                  if (index === 0) {
                    // navigation.navigate('InvitationSentScreen');
                  } else if (index === 1) {
                    // navigation.navigate('InvitationSentScreen');
                  }
                }}
              />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
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
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  doneTitle: {
    marginTop: 20,

    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  cancelTitle: {
    marginTop: 20,
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

    borderRadius: 5,
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
  navigationRightItem: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
})
