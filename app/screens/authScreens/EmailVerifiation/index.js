import React,{Component}  from 'react';
import { View, Text, Image, TouchableOpacity, Alert} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


import styles from "./style"
import * as Utility from '../../../utility/index';
import constants from '../../../config/constants';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// const {strings, urls, PATH, endPoints} = constants;

import PATH from "../../../Constants/ImagePath"
import strings from "../../../Constants/String"
  function EmailVerification({navigation}) {

    verifyUserEmail=async()=>{
        let userEmail=await Utility.getFromLocalStorge("email")
        console.log("useremail",userEmail)
        let userPassword=await Utility.getFromLocalStorge("password")
        console.log("useremail",userPassword)
        try {
            firebase
               .auth()
               .signInWithEmailAndPassword(userEmail, userPassword)
               .then(res => {
                    console.log(res);
                   console.log(res.user.email);
                   console.log(res.user.emailVerified);
                   if(res.user.emailVerified){
                     navigation.navigate("ChooseLocationScreen")
                   }
      
            });} catch (error) {
            console.log(error.toString(error));
          }
          
      
        console.log("vikkkkkkakakkakkakkaka");



    }

    resend=()=>{
      console.log("link send again ")
      // console.log("resend link by user")
      // firebase.auth().onAuthStateChanged(function(user) {
      //   user.sendEmailVerification(); })
      const user = firebase.auth().currentUser;
  
      user.sendEmailVerification().then(function() {
    Alert.alert("Verification Link sucessfull")
      }).catch(function(error) {
        // An error happened.
      });
      
    }
 
  return (
    <View style={styles.mainContainer}>
     <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />
      <View style={{marginTop:"80%",alignSelf:"center",width:"80%"}}>
        <Text style={{fontSize:17,color:"white"}}>We have sent you have a verification link to</Text>
        <Text style={{fontSize:17,color:"white"}}>Your email please verify and proceed</Text>
     
      </View>
      <TouchableOpacity onPress={()=>this.verifyUserEmail()}>
      <View style={{borderRadius:40,backgroundColor:'white',borderWidth:1,borderColor:"orange", width:"80%",justifyContent:"center",alignItems:"center",alignSelf:"center",marginTop:"10%",height:50}}>

            <Text  style={{fontSize:15,color:"blue",}}> I Verified My Email</Text>
          </View>
          </TouchableOpacity>
          <View>
          <TouchableOpacity onPress={()=>this.resend()}>
          <View style={{borderRadius:40,backgroundColor:'white',width:"80%",justifyContent:"center",alignItems:"center",alignSelf:"center",marginTop:"4%",height:50}}>
            <Text style={{color:"orange",fontSize:15,fontWeight:"700"}} >Resend Verification Link </Text>
          </View>
          </TouchableOpacity>
          </View>
    </View>
      
  );
  }
export default EmailVerification;
