import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {heightPercentageToDP as hp} from '../utils';

const scrollDefault = React.createRef();
function TCKeyboardView({
  children,
  scrollReference = scrollDefault,
  enableOnAndroid = false,
}) {
  return (
    <TouchableWithoutFeedback
      style={styles.container}
      disabled
      onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView
        ref={scrollReference}
        nestedScrollEnabled={true}
        bounces={false}
        enableOnAndroid={enableOnAndroid}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flex: 1}}
        extraScrollHeight={hp(5)}>
        <View style={{flex: 1}}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always">
            <SafeAreaView k>{children}</SafeAreaView>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default TCKeyboardView;
