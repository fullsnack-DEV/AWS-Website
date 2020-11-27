import React, { useState } from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import TCLabel from '../../../../TCLabel';
import TCMessageButton from '../../../../TCMessageButton';
import TCSwitcher from '../../../../TCSwitcher'
import TCThickDivider from '../../../../TCThickDivider';
import LineUpPlayerView from './LineUpPlayerView';

export default function LineUp({ navigation }) {
  const [selected, setSelected] = useState(1)

  return (
    <View>
      <TCSwitcher
      tabs={['Vancouver Whitecaps FC', 'Newyork City FC']}
      selectedTab={selected}
      onTabPress={(index) => {
        if (index === 0) setSelected(1)
        else setSelected(2);
      }}
      // style={{ marginBottom: 5, marginTop: 20 }}
    />
      <Text style = {styles.reviewText}>Review period: <Text style = {styles.reviewTime}>4d 23h 59m left</Text></Text>
      <View>
        <View style={styles.editableView}>
          <TCLabel title={'Roster'} />
          <TouchableOpacity style={styles.editTouchArea} hitSlop={{
            top: 15, bottom: 15, left: 15, right: 15,
          }} onPress={() => navigation.navigate('EditRosterNonRosterScreen', { screen: 'EditRosterNonRosterScreen' })}>
            <Image source={images.editSection} style={styles.editButton}/>
          </TouchableOpacity>
        </View>
        <Text style={{
          fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 25,
        }}>Starting</Text>

        <LineUpPlayerView buttonType={'message'}/>
        <LineUpPlayerView buttonType={'message'}/>
        {/* <Text style={{
          fontFamily: fonts.RRegular, fontSize: 14, color: colors.grayColor, marginLeft: 35, marginTop: 10,
          }}>No Player</Text> */}
        {/* <TCThinDivider marginTop={20}/> */}
        <Text style={{
          fontFamily: fonts.RRegular, fontSize: 16, color: colors.lightBlackColor, marginLeft: 25, marginTop: 20,
        }}>Subs</Text>
        <LineUpPlayerView buttonType={'message'}/>
        <LineUpPlayerView buttonType={'message'}/>
        {/* <Text style={{
          fontFamily: fonts.RRegular, fontSize: 14, color: colors.grayColor, marginLeft: 35, marginTop: 10,
          }}>No Player</Text> */}
        <TCMessageButton
        title={'Invite Temporary Player'}
        width={167}
        alignSelf={'center'}
        marginTop={10}/>

        <TCThickDivider marginTop={25}/>
        <View style={styles.editableView}>
          <TCLabel title={'Coaches'}/>
          <TouchableOpacity style={styles.editTouchArea} hitSlop={{
            top: 15, bottom: 15, left: 15, right: 15,
          }} onPress={() => navigation.navigate('EditRosterCoacheScreen', { screen: 'EditRosterCoacheScreen' })}>
            <Image source={images.editSection} style={styles.editButton}/>
          </TouchableOpacity>
        </View>

        <LineUpPlayerView buttonType={'message'}/>
        <LineUpPlayerView buttonType={'message'}/>
        <TCMessageButton
        title={'Invite Temporary Coach'}
        width={167}
        alignSelf={'center'}
        marginTop={10}/>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  reviewText: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.themeColor,
    marginLeft: 15,
  },
  reviewTime: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.themeColor,
  },
  editButton: {
    height: 16,
    width: 16,
    resizeMode: 'center',
    alignSelf: 'center',
  },
  editableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
  },
  editTouchArea: {
    alignSelf: 'center',
  },
})
