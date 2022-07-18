import {DefaultTheme} from '@react-navigation/native';

import colors from '../Constants/Colors';

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.themeColor,
    background: colors.whiteColor,
  },
};
