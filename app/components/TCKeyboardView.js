import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const scrollDefault = React.createRef();
function TCKeyboardView({ children, scrollReference = scrollDefault }) {
  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }
      keyboardVerticalOffset={ Platform.OS === 'ios' ? 100 : 0 }
      enabled={ Platform.OS === 'ios' }>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView ref={scrollReference} style={{ flex: 1 }}>{children}</ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default TCKeyboardView;
