import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../config/constants';
const {strings, colors, fonts} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  tabContainer:{width:'100%',height:50,flexDirection:'row'},
  upcomingTab:{flex:0.5,height:50,justifyContent:'center',alignItems:'center'},
  upcomingText:{alignSelf:'center',fontSize:16,fontFamily:fonts.RBold,color:colors.lightBlackColor},
  selectedLine:{alignSelf:'center',position:'absolute',bottom:-15,height:2,width:'100%',backgroundColor:colors.themeColor},
  pastTab:{flex:0.5,height:50,justifyContent:'center',alignItems:'center'},
  pastText:{alignSelf:'center',fontSize:16,fontFamily:fonts.RBold,color:colors.lightBlackColor},

  
});

export default styles;
        