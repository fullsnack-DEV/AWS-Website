import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

function TCKeyboardView({ children }) {
  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }
      keyboardVerticalOffset={ Platform.OS === 'ios' ? 100 : 0 }
      enabled={ Platform.OS === 'ios' }>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default TCKeyboardView;
