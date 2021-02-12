import React, {
  useState,
  useLayoutEffect,
  useContext,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';

import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import { patchGroup } from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCPicker from '../../components/TCPicker';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils';
import DataSource from '../../Constants/DataSource';

export default function GameFeeEditScreen({ navigation, route }) {
  // For activity indicator
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [gameFee, setGameFee] = useState(route.params.groupDetails.game_fee);
  const [currency, setCurrency] = useState(route.params.groupDetails.currency_type);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={ {
          marginEnd: 16,
          fontSize: 14,
          fontFamily: fonts.RRegular,
          color: colors.lightBlackColor,
        } } onPress={ () => {
          onSaveButtonClicked();
        } }>{strings.done}</Text>
      ),
    });
  }, [navigation, gameFee, currency]);

  const onSaveButtonClicked = () => {
    setloading(true);
    const groupProfile = {};
    groupProfile.game_fee = gameFee;
    groupProfile.currency_type = currency;
    patchGroup(route.params.groupDetails.group_id, groupProfile, authContext)
      .then((response) => {
        setloading(false);
        const entity = authContext.entity
        entity.obj = response.payload;
        authContext.setEntity({ ...entity })
        Utility.setStorage('authContextEntity', { ...entity })
        navigation.goBack();
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10)
      }).finally(() => {
        setloading(false);
      })
  }

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View>
          <View style={{ flexDirection: 'row', alignContent: 'flex-end', alignItems: 'flex-end' }}>
            <TCLabel title= {strings.gamefeetitle}/>
            <Text style={{
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 4,
              fontSize: 16,
              fontFamily: fonts.RRegular,
              color: colors.userPostTimeColor,
            }}>{strings.perhoursinbracket}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: '70%' }}>
              <TCTextField
              style={{ marginRight: 5 }}
              placeholder={strings.entergamefee}
              onChangeText={(text) => setGameFee(text)}
              multiline
              maxLength={5}
              keyboardType={'decimal-pad'}
              value={gameFee}
              />
            </View>
            <View style={{ width: '30%' }}>
              <TCPicker
                dataSource={DataSource.CurrencyType}
                placeholder={strings.currencyplacholder}
                value={currency}
                onValueChange={(value) => {
                  console.log('value', value)
                  setCurrency(value);
                }}
              />
            </View>

          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
