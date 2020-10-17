import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
import GameCard from './GameCard';
const {strings, colors, fonts} = constants;

export default function MatchReservation() {
  return (
   <View>
        <Text style={styles.reservationNumberText}>Reservation No: 1234567D1</Text>
        <View style={styles.reservationTitleView}>
            <TouchableOpacity>
                <LinearGradient
                colors={[colors.yellowColor, colors.themeColor]}
                style={styles.borderView}>
                    <View style={styles.dateView}>
                        <Text style={styles.dateText}>Feb{'\n'}15</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
            <View style={styles.reservationTypeView}>
                <Text style={[styles.reservationText,{color:'#FF4E00'}]}>RESERVATION REQUEST SENT</Text>
                <Text style={styles.matchText}>Match · Soccer</Text>
            </View>
            <View style={styles.amountView}>
            <Text style={styles.amountText}>$35 CAD</Text>
            <Text style={styles.cancelAmountText}>$35 CAD</Text>
            </View>
            
        </View>
        <View style={{flexDirection:'row',marginLeft:20,marginTop:20}}>
            <Image source={PATH.requestIn} style={styles.inOutImageView} />
            <View style={styles.entityView}>
                <Image source={PATH.teamPlaceholder} style={styles.profileImage} />
                <Text style={styles.entityName}>Vancouver Whitecaps <Text style={[styles.requesterText,{color:colors.greeColor}]}>(requester) </Text></Text>
            </View>
        </View>
        <GameCard/>
        <TouchableOpacity>
                <LinearGradient
                    colors={[colors.yellowColor, colors.themeColor]}
                    style={styles.pendingButton}>
                        
                            <Text style={styles.pendingTimerText}>Respond within 1d 23h 59m</Text>
                      
                </LinearGradient>
            </TouchableOpacity>
            <View style={styles.bigDivider}></View>
    </View>
  );
}

const styles = StyleSheet.create({
    reservationNumberText: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color:colors.lightBlackColor,
    marginTop:15,
    marginBottom:10,
    marginRight:15, 
    textAlign: 'right',
  },
  borderView:{
     height:54,
     width:54 ,
     borderRadius:27,
     justifyContent:'center',
     alignItems:'center',
     marginLeft:15,
  },
  dateView:{
        backgroundColor: "white",
        width: 48,
        height: 48,
       borderRadius:24,
       justifyContent:'center',
       alignItems:'center',
  },
  dateText:{
    fontSize: 14,
    fontFamily: fonts.RMedium,
    color:colors.lightBlackColor,
    alignSelf:'center',
    textAlign:'center',
  },
  reservationTitleView:{
      flexDirection:'row',
      
  },
  reservationTypeView:{
    alignContent:'flex-start',
    marginLeft:10,
    alignSelf:'center',
  },
  reservationText:{
    fontFamily:fonts.RBold,
    fontSize:14,
  },
  matchText:{
    color:colors.lightBlackColor,
    fontFamily:fonts.RRegular,
    fontSize:20,
  },
  amountView:{
    position:"absolute",
    right:15,
    marginTop:10,
  },
  amountText:{
    color:colors.reservationAmountColor,
    fontFamily:fonts.RBold,
    fontSize:16,
    textAlign:'right',
  },
  cancelAmountText:{
    color:colors.veryLightGray,
    fontFamily:fonts.RLight,
    fontSize:14,
    textAlign:'right',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  inOutImageView:{
    height: 30,
    width: 30,
    resizeMode: 'cover',
    alignSelf:'center',
    
  },
  profileImage:{
    height: 30,
    width: 30,
    resizeMode: 'cover',
    alignSelf:'center',
  },
  entityName:{
    fontSize: 16,
    fontFamily: fonts.RBold,
    color:colors.lightBlackColor,
    alignSelf:'center',
  },
  requesterText:{
    fontSize: 14,
    fontFamily: fonts.RRegular,
  },
  entityView:{
      
      flexDirection:'row',
      marginLeft:10,
      justifyContent:'center',
      alignItems:"center",
  },
  pendingButton:{
    height:30,
    width:wp('86%') ,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:30,
    marginBottom:30,
  },
  pendingTimerText:{
    fontSize: 12,
    fontFamily: fonts.RBold,
    color:colors.whiteColor,
    alignSelf:'center',
    textAlign:'center',
    
  },
  bigDivider:{
      height:7,
      width:wp('100%'),
      backgroundColor:colors.grayBackgroundColor,
  }
});

