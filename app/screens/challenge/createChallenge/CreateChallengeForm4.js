import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, View, Text, Image, FlatList, TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
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
import AuthContext from '../../../auth/context'

let entity = {};
export default function CreateChallengeForm4({ navigation, route }) {
  const authContext = useContext(AuthContext)
  const isFocused = useIsFocused();
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [bodyParams, setbodyParams] = useState();

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity
      if (route && route.params && route.params.teamData) {
        if (route.params.teamData[0].group_id === entity.uid) {
          console.log('TEams::', route.params.teamData);
          setHomeTeam(route.params.teamData[0]);
          setAwayTeam(route.params.teamData[1]);
        } else {
          setHomeTeam(route.params.teamData[1]);
          setAwayTeam(route.params.teamData[0]);
        }
      }
    };
    getAuthEntity();
    if (route && route.params && route.params.body) {
      console.log('BODY PARAMS of FORM 4:', route.params.body);
      setbodyParams(route.params.body);
    }
  }, [isFocused]);

  const getTimeDifForReservation = (sDate, eDate) => {
    let delta = Math.abs(parseFloat((sDate / 1000).toFixed(0)) - parseFloat((eDate / 1000).toFixed(0)));

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    let time = ''

    if (hours > 0) {
      if (hours === 1) {
        time = `${hours} hour `
      } else {
        time = `${hours} hours `
      }
    }

    if (minutes > 0) {
      if (minutes === 1) {
        time = `${time}${minutes} minute`
      } else {
        time = `${time}${minutes} minutes`
      }
    }

    return time;
  };

  const renderSecureReferee = ({ item, index }) => (
    <TCInfoImageField
      title={index === 0 ? `Referee ${index + 1} (Chief)` : `Referee ${index + 1}`}
      name={(homeTeam && awayTeam && ((item.responsible_team_id === 'none' && 'None') || (item.responsible_team_id === homeTeam?.group_id || (item.responsible_team_id === homeTeam?.user_id) ? homeTeam?.group_name || `${homeTeam?.first_name} ${homeTeam?.last_name}` : awayTeam?.group_name || `${awayTeam?.first_name} ${awayTeam?.last_name}`)))}
      marginLeft={30}
    />
  );
  const getDateFormat = (dateValue) => moment(new Date(dateValue * 1000)).format('MMM DD, yy  HH:MM a');
  const renderSecureScorekeeper = ({ item, index }) => (
    <TCInfoImageField
      title={`Scorekeeper ${index + 1}`}
      name={(homeTeam && awayTeam && ((item.responsible_team_id === 'none' && 'None') || (item.responsible_team_id === homeTeam?.group_id || (item.responsible_team_id === homeTeam?.user_id) ? homeTeam?.group_name || `${homeTeam?.first_name} ${homeTeam?.last_name}` : awayTeam?.group_name || `${awayTeam?.first_name} ${awayTeam?.last_name}`)))}
      marginLeft={30}
    />
  );

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
        <TCLabel
          title={
          'Please, review your match reservatoin request before you send it.'
          }
          style={{ color: colors.themeColor }}
        />
        <TCThickDivider />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 15,
        }}>
        <View style={styles.challengerView}>
          <View style={styles.teamView}>
            <Image source={images.requestOut} style={styles.reqOutImage} />
            <Text style={styles.challengerText}>Challenger</Text>
          </View>

          <View style={styles.teamView}>
            <Image source={images.teamPlaceholder} style={styles.teamImage} />
            <Text style={styles.teamNameText}>{homeTeam?.group_name || `${homeTeam?.first_name} ${homeTeam?.last_name}`}</Text>
          </View>

        </View>
        <View style={styles.challengeeView}>
          <View style={styles.teamView}>
            <Image source={images.requestIn} style={styles.reqOutImage} />
            <Text style={styles.challengeeText}>Challengee</Text>
          </View>

          <View style={styles.teamView}>
            <Image source={images.teamPlaceholder} style={styles.teamImage} />
            <Text
                style={{
                  marginLeft: 5,
                  fontFamily: fonts.RMedium,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                }}>
              {awayTeam?.group_name || `${awayTeam?.first_name} ${awayTeam?.last_name}`}
            </Text>
          </View>

        </View>
      </View>
      <TCThinDivider />
      {bodyParams && route && route.params && route.params.teamData && (
        <View>
          <View style={styles.editableView}>
            <TCLabel title={`Match · ${bodyParams.sport}`} />
            <TouchableOpacity style={styles.editTouchArea} hitSlop={{
              top: 15, bottom: 15, left: 15, right: 15,
            }} onPress={() => navigation.navigate('CreateChallengeForm1', { editable: true, body: bodyParams })}>
              <Image source={images.editSection} style={styles.editButton}/>
            </TouchableOpacity>
          </View>

          <TCInfoImageField
            title={'Home'}
            name={route.params.teamData[0].group_name || `${route.params.teamData[0].first_name} ${route.params.teamData[0].last_name}`}
            marginLeft={30}
          />
          <TCThinDivider />
          <TCInfoImageField
            title={'Away'}
            name={route.params.teamData[1].group_name || `${route.params.teamData[1].first_name} ${route.params.teamData[1].last_name}`}
            marginLeft={30}
          />
          <TCThinDivider />
          <TCInfoField
            title={'Time'}
            value={`${getDateFormat(bodyParams.start_datetime)} -\n${getDateFormat(bodyParams.end_datetime)}\n(${getTimeDifForReservation(bodyParams.start_datetime * 1000, bodyParams.end_datetime * 1000)})`}
            // value={`${
            //   monthNames[new Date(bodyParams.start_datetime).getMonth()]
            // } ${new Date(bodyParams.start_datetime).getDate()}, ${new Date(
            //   bodyParams.start_datetime,
            // ).getFullYear()} ${time_format(
            //   new Date(new Date(bodyParams.start_datetime)),
            // )} - \n${
            //   monthNames[new Date(bodyParams.end_datetime).getMonth()]
            // } ${new Date(bodyParams.end_datetime).getDate()}, ${new Date(
            //   bodyParams.end_datetime,
            // ).getFullYear()} ${time_format(
            //   new Date(new Date(bodyParams.end_datetime)),
            // )}\n( ${getTimeDifferent(
            //   new Date(bodyParams.start_datetime),
            //   new Date(bodyParams.end_datetime),
            // )} )`}
            marginLeft={30}
            titleStyle={{ fontSize: 16 }}
          />
          <TCThinDivider />
          <TCInfoField
            title={'Venue'}
            value={bodyParams.venue.title}
            marginLeft={30}
            titleStyle={{ fontSize: 16 }}
          />
          <TCThinDivider />
          <TCInfoField
            title={'Address'}
            value={bodyParams.venue.address}
            marginLeft={30}
            titleStyle={{ fontSize: 16 }}
          />
          <EventMapView
            coordinate={{
              latitude: bodyParams.venue.lat,
              longitude: bodyParams.venue.long,
            }}
            region={{
              latitude: bodyParams.venue.lat,
              longitude: bodyParams.venue.long,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={styles.map}
          />
          <TCThickDivider marginTop={20} />
        </View>
      )}
      {bodyParams && (
        <View>
          <View style={styles.editableView}>
            <TCLabel title={'Responsibility  to Secure Venue'} />
            <TouchableOpacity style={styles.editTouchArea}
            hitSlop={{
              top: 15, bottom: 15, left: 15, right: 15,
            }}
            onPress={() => navigation.navigate('CreateChallengeForm1', { editable: true, body: bodyParams })}>
              <Image source={images.editSection} style={styles.editButton}/>
            </TouchableOpacity>
          </View>
          <TCInfoImageField
      title={'Venue'}
      name={bodyParams.responsible_to_secure_venue}
      marginLeft={30}
    />
          <TCThickDivider marginTop={8} />
        </View>
      )}
      {bodyParams && (
        <View>
          <View style={styles.editableView}>
            <TCLabel title={'Rules'} />
            <TouchableOpacity style={styles.editTouchArea}
            hitSlop={{
              top: 15, bottom: 15, left: 15, right: 15,
            }}
            onPress={() => navigation.navigate('CreateChallengeForm2', { editable: true, body: bodyParams, teamData: route.params.teamData })}>
              <Image source={images.editSection} style={styles.editButton}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.rulesText}>{bodyParams.special_rule}</Text>
        </View>
      )}
      <TCThickDivider marginTop={20} />
      <View>
        <View style={styles.editableView}>
          <TCLabel title={'Responsibility to Secure Referees'} />
          <TouchableOpacity style={styles.editTouchArea}
          hitSlop={{
            top: 15, bottom: 15, left: 15, right: 15,
          }}
          onPress={() => navigation.navigate('CreateChallengeForm3', { editable: true, body: bodyParams, teamData: route.params.teamData })}>
            <Image source={images.editSection} style={styles.editButton}/>
          </TouchableOpacity>
        </View>
        {bodyParams && <FlatList
          data={bodyParams.referee}
          renderItem={renderSecureReferee}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <TCThinDivider />}
        />}
      </View>
      <TCThickDivider marginTop={10} />
      <View>
        <View style={styles.editableView}>
          <TCLabel title={'Responsibility to Secure ScoreKeeper'} />
          <TouchableOpacity style={styles.editTouchArea}
          hitSlop={{
            top: 15, bottom: 15, left: 15, right: 15,
          }}
            onPress={() => navigation.navigate('CreateChallengeForm3', { editable: true, body: bodyParams, teamData: route.params.teamData })}>
            <Image source={images.editSection} style={styles.editButton}/>
          </TouchableOpacity>
        </View>

        {bodyParams && <FlatList
          data={bodyParams.scorekeeper}
          renderItem={renderSecureScorekeeper}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <TCThinDivider />}
        />}
      </View>
      <TCGradientButton
        title={strings.nextTitle}
        onPress={() => navigation.navigate('CreateChallengeForm5', {
          teamData: route.params.teamData,
          body: {
            ...route.params.body,
          },
        })}
      />
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
});
