import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Platform, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Constants from 'expo-constants';
import Clipboard from 'expo-clipboard';

export default function App() {

  const [message, setMessage] = React.useState('undefined');
  const [resp, setResponse] = React.useState('undefined');
  const [token, setToken] = React.useState('undefined');

  const pushNotificationsSetup = async () => {
    if(Constants.default.isDevice) {
      const currently = await Notifications.getPermissionsAsync();
      var response : Notifications.NotificationPermissionsStatus = currently;
      setMessage(JSON.stringify(currently));
      if(!currently.granted && currently.canAskAgain) {
        var response = await Notifications.requestPermissionsAsync();
        const {status} = response;
        console.log('2nd:', response);
        setResponse(JSON.stringify(response));
      }
      if(!response.granted) {
        console.log('3rd:', response);
        setMessage('3rd:' + response.status);
        return;
      }
      const expoToken = await Notifications.getExpoPushTokenAsync();
      console.log(expoToken);
      setToken(JSON.stringify(expoToken));
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
      <Text>Start: {message}</Text>
      <Text>Response:{resp}</Text>
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
