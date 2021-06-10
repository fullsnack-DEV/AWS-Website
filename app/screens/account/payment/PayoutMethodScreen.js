import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import {
  View, StyleSheet, Alert,
} from 'react-native';

import { WebView } from 'react-native-webview';

import AuthContext from '../../../auth/context'
import ActivityLoader from '../../../components/loader/ActivityLoader';
import { merchantAuthDetail, addMerchantAccount } from '../../../api/Users';
import strings from '../../../Constants/String'
import colors from '../../../Constants/Colors'
import { resgisterMerchantURL } from '../../../utils/constant';
import TCInnerLoader from '../../../components/TCInnerLoader';

export default function PayoutMethodScreen({ navigation }) {
  const [loading, setloading] = useState(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState(false);
  const authContext = useContext(AuthContext)
  const [merchantURL, setMerchantURL] = useState();
  const [redirectURI, setRedirectURI] = useState();
  const [state, setState] = useState();

  const webView = useRef();

  useEffect(() => {
    callPaymentAuthDetailAPI()
  }, [])

  const callPaymentAuthDetailAPI = async () => {
      setFirstTimeLoad(true)
    merchantAuthDetail(authContext.entity.uid, authContext)
      .then((response) => {
        setState(response.payload.state)
        setRedirectURI(response.payload.redirect_uri)
        let urlString = `${resgisterMerchantURL}?client_id=${response.payload.client_id}&state=${response.payload.state}&redirect_uri=${encodeURI(response.payload.redirect_uri)}`;
        urlString = `${urlString}&stripe_user[business_type]=individual&stripe_user[business_name]=TownsCup&`
        urlString = `${urlString}&stripe_user[first_name]=${encodeURI(authContext.entity.obj.group_name || authContext.entity.obj.first_name)}`
        urlString = `${urlString}&stripe_user[last_name]=${encodeURI(authContext.entity.obj.last_name || '')}`
        urlString = `${urlString}&stripe_user[email]=${encodeURIComponent(authContext.entity.role === ('team' || 'club') ? authContext.entity.auth.user.email : authContext.entity.obj.email)}`
        urlString = `${urlString}&stripe_user[country]=CA`
        urlString = `${urlString}&suggested_capabilities[]=card_payments`
        setMerchantURL(urlString)
        console.log('URL::=>', urlString)
        setFirstTimeLoad(false)
      })
      .catch((e) => {
        console.log('error in payout method', e)
        setFirstTimeLoad(false)
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10)
      })
  }

  const callAddMercentAccountAPI = async (code) => {
    setloading(true)
    addMerchantAccount(authContext.entity.uid, { code }, authContext)
      .then(() => {
        setloading(false)
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, 'Your Account Added Successfully', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }, 10)
      })
      .catch((e) => {
        console.log('error in payout method callAddMercentAccountAPI', e)
        setloading(false)
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10)
      })
  }
  const renderLoadingView = () => (
    <ActivityLoader visible={loading} />
    )
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <TCInnerLoader visible={firstTimeLoad} size={50}/>
      {merchantURL && <WebView
        ref={webView}
        source={{ uri: merchantURL }}
        renderLoading={renderLoadingView}
        startInLoadingState={true}
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request;
          if (!url) return false;
          if (url.includes(redirectURI) && url.indexOf('?')) {
            const querystring = url.substring(url.indexOf('?') + 1, url.length)
            if (url.includes(`state=${state}`)) {
              const totalValues = querystring.split('&')
              for (const value of totalValues) {
                const nameValue = value.split('=')
                if (nameValue[0] === 'code') {
                  if (webView.current) {
                    webView.current.stopLoading();
                  }
                  callAddMercentAccountAPI(nameValue[1])
                  return false;
                }
              }
            }
          }

          return true;
        }}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
})
