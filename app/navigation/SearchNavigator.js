import {createStackNavigator} from '@react-navigation/stack';
import EntitySearchScreen from '../screens/search/EntitySearchScreen';
import SearchScreen from '../screens/search/SearchScreen';

const Stack = createStackNavigator();

const SearchNavigator = () => (
  <Stack.Navigator initialRouteName="SearchScreen">
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="EntitySearchScreen"
      component={EntitySearchScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default SearchNavigator;
