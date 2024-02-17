import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import useAppleHealthData from './app/hooks/useAppleHealthData';
import useGoogleHealthConnect from './app/hooks/useGoogleHealthConnect';

export default function App() {
	const apple = useAppleHealthData(new Date());
	const google = useGoogleHealthConnect(new Date());

	return (
		<View style={styles.container}>
			<Text style={{ fontSize: 25 }}>React Native Health</Text>
			{Platform.OS === 'ios' ? (
				<Text style={styles.subtitle}>Apple Steps: {apple.steps}</Text>
			) : (
				<Text style={styles.subtitle}>Google Steps: {google.steps}</Text>
			)}

			<StatusBar style='auto' />
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
	subtitle: {
		fontSize: 20,
		marginTop: 10,
		textAlign: 'center',
		fontWeight: 'bold',
	},
});
