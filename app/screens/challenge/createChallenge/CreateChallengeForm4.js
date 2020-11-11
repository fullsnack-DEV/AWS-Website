import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import * as Utility from '../../../utils/index';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoImageField from '../../../components/TCInfoImageField';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';

let entity = {};
export default function CreateChallengeForm4({ navigation, route }) {
  const isFocused = useIsFocused();
  const [homeTeam, setHomeTeam] = useState()
  const [awayTeam, setAwayTeam] = useState()
  const [bodyParams, setbodyParams] = useState()

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = await Utility.getStorage('loggedInEntity');
      if (route && route.params && route.params.teamData) {
        if (route.params.teamData[0].group_id === entity.uid) {
          console.log('TEams::', route.params.teamData);
          setHomeTeam(route.params.teamData[0])
          setAwayTeam(route.params.teamData[1])
        } else {
          setHomeTeam(route.params.teamData[1])
          setAwayTeam(route.params.teamData[0])
        }
      }
    };
    getAuthEntity()
    if (route && route.params && route.params.body) {
      console.log('BODY PARAMS:', route.params.body);
      setbodyParams(route.params.body)
    }
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
        <TCLabel title={'Please, review your match reservatoin request before you send it.'} style={{ color: colors.themeColor }}/>
        <TCThickDivider/>
      </View>
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,

      }} >
        <View style={styles.challengerView} >
          <View style={styles.teamView}>
            <Image source={images.requestOut} style={styles.reqOutImage}/>
            <Text style={styles.challengerText}>Challenger</Text>
          </View>
          {homeTeam && <View style={styles.teamView}>
            <Image source={images.teamPlaceholder} style={styles.teamImage}/>
            <Text style={styles.teamNameText}>{homeTeam.group_name}</Text>
          </View>}
        </View>
        <View style={styles.challengeeView} >
          <View style={styles.teamView}>
            <Image source={images.requestIn} style={styles.reqOutImage}/>
            <Text style={styles.challengeeText}>Challengee</Text>
          </View>
          {awayTeam && <View style={styles.teamView}>
            <Image source={images.teamPlaceholder} style={styles.teamImage}/>
            <Text style={{
              marginLeft: 5, fontFamily: fonts.RMedium, fontSize: 16, color: colors.lightBlackColor,
            }}>{awayTeam.group_name}</Text>
          </View>}
        </View>
      </View>
      <TCThinDivider />
      <View>
        <TCLabel title={`Match · ${bodyParams.sport}`}/>
        <TCInfoImageField title={'Home'} name={'Vancuver Whitecap FC'} marginLeft={30}/>
        <TCThinDivider />
        <TCInfoImageField title={'Away'} name={'Vancuver Whitecap FC'} marginLeft={30}/>
        <TCThinDivider />
        <TCInfoField title={'Time'} value={'Feb 15, 2020  12:00pm - \nFeb 15, 2020 \n3:30pm ( 3h 30m )'}
        marginLeft={30} titleStyle={{ fontSize: 16 }}/>
        <TCThinDivider />
        <TCInfoField title={'Venue'} value={'Scotiabank Saddledome'}
        marginLeft={30} titleStyle={{ fontSize: 16 }}/>
        <TCThinDivider />
        <TCInfoField title={'Address'} value={'555 Saddledome Rise SE,Calgary, AB T2G 2W1'}
        marginLeft={30} titleStyle={{ fontSize: 16 }}/>
        <EventMapView coordinate={{
          latitude: 37.78825,
          longitude: -122.4324,
        }}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style = {styles.map}/>
        <TCThickDivider marginTop={20}/>

      </View>
      <View>
        <TCLabel title={'Responsibility  to Secure Venue'} />
        <View style={styles.viewContainer}>
          <View style={styles.fieldValue}>
            <Image source={images.teamPlaceholder} style={styles.imageView}/>
            <Text style={styles.teamNameText} numberOfLines={1}>Vancuver Whitecap FC</Text>
          </View>
        </View>
        <TCThickDivider marginTop={8}/>
      </View>
      <View>
        <TCLabel title={'Rules'} />
        <Text style={styles.rulesText}>1. Tackle is not allowed {'\n'}2. 3 times of 30 minute game for 90 minutes
          {'\n'}3. A change of players is allowed…</Text>
      </View>
      <TCThickDivider marginTop={20}/>
      <View>
        <TCLabel title={'Responsibility to Secure Referees'} />
        <TCInfoImageField title={'Referee 1 (Chief)'} name={'Vancuver Whitecap FC'} marginLeft={30}/>
        <TCThinDivider />
        <TCInfoImageField title={'Referee 2'} name={'Vancuver Whitecap FC'} marginLeft={30}/>
        <TCThinDivider />
        <TCInfoImageField title={'Referee 3'} name={'Vancuver Whitecap FC'} marginLeft={30}/>
      </View>
      <TCThickDivider marginTop={10}/>
      <View>
        <TCLabel title={'Responsibility to Secure ScoreKeeper'} />
        <TCInfoImageField title={'Scorekeeper 1'} name={'Vancuver Whitecap FC'} marginLeft={30}/>
        <TCThinDivider />
        <TCInfoImageField title={'Scorekeeper 2'} name={'Vancuver Whitecap FC'} marginLeft={30}/>
        <TCThinDivider />
        <TCInfoImageField title={'Scorekeeper 3'} name={'Vancuver Whitecap FC'} marginLeft={30}/>
      </View>
      <TCGradientButton title={strings.nextTitle} onPress={() => navigation.navigate('CreateChallengeForm5')}/>
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
  form4: {
    backgroundColor: colors.themeColor,
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

  viewContainer: {
    marginLeft: 15,
    marginRight: 15,
  },

  map: {
    height: 150,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
  },
  rulesText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  fieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    flex: 0.7,
    marginRight: 15,
  },
  imageView: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reqOutImage: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
  challengeeText: {
    marginLeft: 5,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.themeColor,
  },
  challengerText: {
    marginLeft: 5,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.greenGradientStart,
  },
  teamImage: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
  teamNameText: {
    marginLeft: 5,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  challengerView: {
    marginRight: 15,
    flex: 0.5,
  },
  challengeeView: {

    flex: 0.5,
  },
});
