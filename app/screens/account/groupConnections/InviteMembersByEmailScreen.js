import React, {
  useState, useLayoutEffect,
} from 'react';
import {
  Text, View, StyleSheet, FlatList,
} from 'react-native';

import TCTextField from '../../../components/TCTextField';
import TCMessageButton from '../../../components/TCMessageButton';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';

const emailArray = [
  {
    id: 1,
    email: '',
  },
];

export default function InviteMembersByEmailScreen({ navigation }) {
  const [emailIndex, setEmailIndex] = useState(2);
  const addEmail = () => {
    setEmailIndex(emailIndex + 1);
    emailArray.push({
      id: emailIndex,
      email: '',
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.sendButtonStyle} onPress={() => console.log('Sent invitation')}>Send</Text>
      ),
    });
  }, [navigation]);
  const renderItemEmail = () => (
    <TCTextField placeholder="E-mail Address" keyboardType="email-address" style={{ alignSelf: 'center', width: ('85%'), marginBottom: 10 }}/>
  );

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.infoTextStyle}>
        {strings.inviteEmailText}
      </Text>
      <FlatList
                data={emailArray}
                renderItem={renderItemEmail}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state}
                style={styles.flateListStyle}
                >
      </FlatList>

      <TCMessageButton title={strings.addEmailText} width={85} alignSelf = 'center' marginTop={25} onPress={() => addEmail(1)}/>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  infoTextStyle: {
    margin: 15,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },

  sendButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

  flateListStyle: {
    paddingTop: 10,
    flexGrow: 0,
  },
})
