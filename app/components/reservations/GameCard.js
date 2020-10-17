import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedbackComponent,
  SafeAreaView,
  TextInput,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../Constants/ImagePath';
import strings from '../../Constants/String';

export default function GameCard({onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.backgroundView}>
            <View style={[styles.colorView,{backgroundColor:colors.yellowEventColor}]}>
              <View style={styles.dateView}>
                <Text style={styles.dateMonthText}>Aug </Text>
                <Text style={styles.dateText}>13 </Text>
              </View>
            </View>
            <View style={styles.eventText}>
              <Text style={styles.eventTitle}>Soccer</Text>
              <View style={styles.bottomView}>
                <Text style={styles.eventTimeLocation}>12:00 PM - 11:00 AM</Text>
                <Text style={styles.textSaperator}> | </Text>
                <Text style={styles.eventTimeLocation}>Vancouver, BC, Canada</Text>
            </View>
            <View style={styles.gameVSView}>
                <View style={styles.leftGameView}>
                  <Image source={PATH.teamPlaceholder} style={styles.profileImage} />
                  <Text style={styles.leftEntityText} numberOfLines={2}>New york Football Team</Text>
                </View>
                   <Text style={styles.eventTimeLocation}>VS</Text>
                <View style={styles.rightGameView}>
                  <Text style={styles.rightEntityText} numberOfLines={2}>Vancuver New City Team</Text>
                  <Image source={PATH.teamPlaceholder} style={styles.profileImage} />
                </View>
            </View>
            </View> 
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    borderRadius: 8,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    height: 102,
    alignSelf: 'center',
    width: wp('86%'),
    marginTop:15,
    
  },
  dateView:{
    marginTop:15, 
  },
  dateMonthText: {
    color: colors.whiteColor,
    fontSize: 12,
    fontFamily: fonts.RLight,
    alignSelf: 'center',
  },
  dateText: {
    color: colors.whiteColor,
    fontSize: 12,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  colorView: {
    height: 102,
    width: 42,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  eventText: {
    flexDirection: 'column',
    width: wp('76%'),
    padding: 10,
  },
  eventTitlewithDot: {
    flexDirection: 'row',
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.googleColor,
    marginBottom: 1,
  },
  bottomView: {
    flexDirection: 'row',
  },
  eventTimeLocation: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.googleColor,
  },
  threedot: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    marginTop: 2,
    marginLeft: 20,
  },
  gameVSView:{
    marginTop:5,
   
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    flex:1,
  },
  profileImage:{
    height: 35,
    width: 35,
    resizeMode: 'cover',
    alignSelf:'center',
  },
  rightGameView:{
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    flex:0.4,
    
  },
  leftGameView:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
   
    flex:0.4,
  },
  leftEntityText:{
    fontSize: 11,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textAlign:'left',
    marginLeft:5, 
    flex:1,
  },
  rightEntityText:{
    fontSize: 11,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textAlign:'right',
    marginRight:5, 
    flex:1,
  },
  textSaperator:{
    color:colors.userPostTimeColor,
    opacity:0.4,
    marginLeft:5,
    marginRight:5,
  },
});
