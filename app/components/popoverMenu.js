import React from 'react';
import { View } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import { IconButton } from 'react-native-paper';

import { AuthContext } from '../Navigation';

export default function PopoverMenu(props) {
  const { signOut } = React.useContext(AuthContext);
  let _menu = null;
  
  return (
    <View style={props.menustyle}>
      <Menu
        ref={(ref) => (_menu = ref)}
        button={<IconButton color={"white"} icon="dots-vertical" onPress={() => _menu.show()} />} >
        <MenuItem
          onPress={() => {
            signOut();
            _menu.hide();
          }}>
          Uitloggen
        </MenuItem>
      </Menu>
    </View>
  );
}