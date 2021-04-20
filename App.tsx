import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Platform, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Constants from 'expo-constants';
import Clipboard from 'expo-clipboard';

export default function App() {

  const [message, setMessage] = React.useState('undefined');
  const [token, setToken] = React.useState('undefined');

  const pushNotificationsSetup = async () => {
    if(Constants.default.isDevice) {
      const currently = await Notifications.getPermissionsAsync();
      console.log('1st:', currently);
      var response : Notifications.NotificationPermissionsStatus = currently;
      setMessage('1st:' + currently.status);
      if(!currently?.granted && currently?.canAskAgain) {
        var response = await Notifications.requestPermissionsAsync();
        const {status} = response;
        console.log('2nd:', response);
        setMessage('2nd:' + status);
      }
      if(!response.granted) {
        console.log('3rd:', response);
        setMessage('3rd:' + response.status);
        return;
      }
      const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(expoToken);
      setToken(expoToken);
    }
    else console.log('This is not a phisical device');
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    console.log('Finishing:', await Notifications.getPermissionsAsync());
  }

  React.useEffect( () => {
    pushNotificationsSetup();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Test with expo Push Notificaiton Tool</Text>
      <Text>{message}</Text>
      <Text>{token}</Text>
      <Button title="Copiar" color="tomato" onPress={() => Clipboard.setString(token)}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
