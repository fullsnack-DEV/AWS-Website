import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCTextField from '../../../components/TCTextField';

export default function CreateChallengeForm1({ navigation }) {
  const isFocused = useIsFocused();

  useEffect(() => {

  }, [isFocused]);

  return (

    <TCKeyboardView>
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
        <View style={styles.form4}></View>
        <View style={styles.form5}></View>
      </View>
      <View>

        <TCLabel title={'Match - Soccer'}/>
        <TCThickDivider/>
      </View>
      <View>
        <TCLabel title={'Home & Away'}/>
        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>HOME</Text>
          <View style={styles.teamViewStyle}>
            <View style={styles.imageShadowView}>
              <Image source={images.team_ph} style={styles.imageView}/>
            </View>
            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>Vancuer Whitecap FC</Text>
              <Text style={styles.locationLable}>Vancouver, BC</Text>
            </View>
          </View>
        </View>
        <View style={styles.swapContainer}>
          <Image source={images.swapTeam} style={styles.swapImageStyle}/>
        </View>
        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>AWAY</Text>
          <View style={styles.teamViewStyle}>
            <View style={styles.imageShadowView}>
              <Image source={images.team_ph} style={styles.imageView}/>
            </View>
            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>Vancuer Whitecap FC</Text>
              <Text style={styles.locationLable}>Vancouver, BC</Text>
            </View>
          </View>
        </View>
        <TCThickDivider marginTop={20}/>
      </View>
      <View>
        <TCLabel title={'Date & Time'} required={true}/>
        <View style={styles.viewContainer}>
          <TCTouchableLabel title={'Choose Date & Time'} showNextArrow={true}/>
        </View>
        <TCThickDivider marginTop={20}/>
      </View>
      <View>
        <TCLabel title={'Venue'} required={true}/>
        <View style={styles.viewContainer}>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>Vancouver Whitecaps FC’s home</Text>
            <Image source={images.radioUnselect} style={styles.radioSelectStyle}/>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>New York City FC’s home</Text>
            <Image source={images.radioUnselect} style={styles.radioSelectStyle}/>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>Other place</Text>
            <Image source={images.radioCheckGreenBG} style={styles.radioSelectStyle}/>
          </View>
          <TCTextField placeholder={'Venue name'} />
          <TCTextField placeholder={'Address'} style={{ marginTop: 12, marginBottom: 12 }}/>
        </View>
        <View style={styles.venueContainer}>
          <Text style={styles.venueTitle}>Calgary stampede</Text>
          <Text style={styles.venueAddress}>555 Saddledome Rise SE, Calgary, AB T2G 2W1</Text>
          <MapView
                style = {styles.map}
                minZoomLevel={5}
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
            <Marker
                    key={'1'}
                    coordinate={{
                      latitude: 37.78825,
                      longitude: -122.4324,
                    }}
                    title={'TownsCup'}
                    description={'This is townscup location'}/>
          </MapView>
        </View>
        <TCThickDivider marginTop={8}/>
      </View>
      <View>
        <TCLabel title={'Responsibility To Secure Venue'} required={true}/>
        <Text style={styles.responsibilityText}>Which team ought to secure and pay for the
          above venue for this game? </Text>
        <View style={styles.viewContainer}>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>Vancouver Whitecaps FC’s home</Text>
            <Image source={images.radioUnselect} style={styles.radioSelectStyle}/>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>New York City FC’s home</Text>
            <Image source={images.radioCheckGreenBG} style={styles.radioSelectStyle}/>
          </View>
        </View>
        <Text style={styles.responsibilityNote}>
          The match fee doesn’t include the <Text style = {styles.responsibilityNoteMedium}>Match Place Fee, Referee Fee
          </Text> and <Text style = {styles.responsibilityNoteMedium}>Scorekeeper Fee.</Text> The match place, referees and
          scorekeepers should be secured by the team who has charge of
          them at its own expense.
        </Text>
      </View>
      <Text style={styles.smallTxt}>
        {' ('}<Text style={styles.mendatory}>{strings.star} </Text>
        {strings.requiredText}{')'}
      </Text>

      <TCGradientButton title={strings.nextTitle} onPress={() => navigation.navigate('CreateChallengeForm2')}/>
    </TCKeyboardView>

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
    backgroundColor: colors.lightgrayColor,
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
  form4: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form5: {
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

  smallTxt: {
    color: colors.grayColor,
    fontSize: 12,
    fontFamily: fonts.RLight,
    marginLeft: 15,
    marginTop: 10,
  },
  mendatory: {
    color: colors.redColor,
  },

  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  homeLableStyle: {
    margin: 15,
    marginRight: 20,
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageShadowView: {
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  imageView: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  swapImageStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginLeft: 20,
  },
  teamNameLable: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  locationLable: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamTextContainer: {
    marginLeft: 20,
  },
  swapContainer: {
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  viewContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  radioSelectStyle: {
    resizeMode: 'cover',
    height: 22,
    width: 22,
    marginRight: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  radioText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  venueTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  venueAddress: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginTop: 5,
  },
  venueContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  map: {
    height: 150,
    marginTop: 15,
    marginBottom: 15,
  },
  responsibilityText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },
  responsibilityNote: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.orangeNotesColor,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  responsibilityNoteMedium: {
    fontFamily: fonts.RMedium,
  },
});
