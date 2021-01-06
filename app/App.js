import React from 'react';
import Navigation from './Navigation';
import { Provider, DefaultTheme } from 'react-native-paper';

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: "#004D45",
		accent: "#2a9d8f",
	}
}

export default function App() {
  return (
		<Provider theme={theme} >
			<Navigation />
		</Provider>
  );
}
