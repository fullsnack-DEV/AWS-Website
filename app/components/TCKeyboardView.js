import React from 'react';
import {
  View, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP as hp } from '../utils';

const scrollDefault = React.createRef();
function TCKeyboardView({ children, scrollReference = scrollDefault }) {
  return (
    <TouchableWithoutFeedback
          style={styles.container}
          disabled
          onPress={() => Keyboard.dismiss()}
      >
      <KeyboardAwareScrollView
            ref={scrollReference}
              nestedScrollEnabled={true}
              bounces={false}
              enableOnAndroid={false}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flex: 1 }}
              extraScrollHeight={hp(5)}>
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {children}
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
