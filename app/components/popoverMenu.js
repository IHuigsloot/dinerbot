import React from 'react';
import { View } from 'react-native';
import { IconButton, Menu } from "react-native-paper";

import { useAuthContext } from '../utils/authContext';
import { useCartContext } from '../utils/cartContext';

export default function PopoverMenu(props) {
  const { signOut } = useAuthContext();
  const { clearCart } = useCartContext();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const logout = () => {
    signOut();
    clearCart();
    closeMenu();
  };
  
  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton color={"white"} icon="dots-vertical" onPress={openMenu} />
        }
      >
        <Menu.Item onPress={logout} title="Uitloggen" />
      </Menu>
    </View>
  );
}