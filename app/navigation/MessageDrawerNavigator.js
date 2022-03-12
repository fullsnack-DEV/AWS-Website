import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import colors from '../Constants/Colors';
import MessageNavigator from './MessageNavigator';
import MessageInviteeDrawerScreen from '../components/message/MessageInviteeDrawerScreen';

const Drawer = createDrawerNavigator();

const MessageDrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => (
      <MessageInviteeDrawerScreen
        {...props}
        participants={props?.state?.routes[0]?.params?.participants ?? []}
        dialog={props?.state?.routes[0]?.params?.dialog ?? null}
      />
    )}
    drawerPosition={'right'}
    screenOptions={{
      activeTintColor: 'red',
    }}
    defaultStatus={'close'}
    overlayColor={'rgba(0,0,0,0.4)'}
    drawerStyle={{
      marginTop: 25,
      paddingTop: 25,
      width: '70%',
      backgroundColor: colors.whiteColor,
      borderTopLeftRadius: 10,
    }}>
    <Drawer.Screen name="MessageChat" component={MessageNavigator} />
    
  </Drawer.Navigator>
);

export default MessageDrawerNavigator;
