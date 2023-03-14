// @flow
import React, {useContext, useState} from 'react';
import {View, StyleSheet, SafeAreaView, TextInput} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import {createReaction} from '../../../../api/NewsFeeds';
import AuthContext from '../../../../auth/context';
import ScreenHeader from '../../../../components/ScreenHeader';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';

const ReplyScreen = ({navigation, route}) => {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const {sport, sportType, activityId} = route.params;

  const handleSave = () => {
    if (!activityId || !reply) {
      return;
    }
    const bodyParams = {
      reaction_type: 'comment',
      activity_id: activityId,
      data: {
        text: reply,
      },
    };
    setLoading(true);
    createReaction(bodyParams, authContext)
      .then(() => {
        setLoading(false);
        navigation.navigate('SportActivityHome', {
          sport,
          sportType,
          uid: authContext.entity.obj.user_id,
          selectedTab: strings.reviews,
        });
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.navigate('SportActivityHome', {
            sport,
            sportType,
            uid: authContext.entity.obj.user_id,
            selectedTab: strings.reviews,
          });
        }}
        title={strings.reply}
        containerStyle={{paddingBottom: 14}}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={handleSave}
        loading={loading}
      />
      <View style={styles.input}>
        <TextInput
          placeholder={strings.reply}
          style={styles.inputFont}
          multiline
          onChangeText={(text) => setReply(text)}
          value={reply}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  input: {
    margin: 40,
    minHeight: 120,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  inputFont: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
});
export default ReplyScreen;
