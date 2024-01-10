// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseProvider } from './FirebaseContext';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import ProductListScreen from './ProductListScreen';
import { auth } from './firebase';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    <FirebaseProvider value={{ user }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user ? 'Index' : 'Login'}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Index" component={ProductListScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FirebaseProvider>
  );
};

export default App;
