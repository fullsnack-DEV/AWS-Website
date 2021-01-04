import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import colors from '../Constants/Colors'
import MessageChat from '../components/message/MessageChat';
import MessageInviteeDrawerScreen from '../components/message/MessageInviteeDrawerScreen';

const Drawer = createDrawerNavigator();

const MessageDrawerNavigator = () => (
  <Drawer.Navigator
        drawerContent={(props) => (
          <MessageInviteeDrawerScreen {...props}
                participants={props?.state?.routes[0]?.params?.participants ?? []}
                dialog={props?.state?.routes[0]?.params?.dialog ?? null}
            />
        )}
        drawerPosition={'right'}
        drawerContentOptions={{
          activeTintColor: 'red',
        }}
        openByDefault={false}
        overlayColor={'white'}
        drawerStyle={{
          width: '70%',
          backgroundColor: colors.whiteColor,
          borderTopLeftRadius: 10,
          shadowColor: colors.googleColor,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.5,
          shadowRadius: 6,
          elevation: 13,
        }}>
    <Drawer.Screen
        name="MessageChatRoom"
        component={ MessageChat }
    />

  </Drawer.Navigator>
)

export default MessageDrawerNavigator;
