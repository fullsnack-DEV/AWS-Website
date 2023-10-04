// @flow
import React from 'react';
import {StyleSheet, Text, SafeAreaView, ScrollView} from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const LongTextMessageScreen = ({navigation, route}) => {
  const {messageText} = route.params;
  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.viewAll}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 20}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.messageText}>{messageText}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default LongTextMessageScreen;
