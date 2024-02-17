import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppleHealthKit, { HealthInputOptions, HealthKitPermissions, HealthValue } from 'react-native-health';

/* Permission options */
const permissions: HealthKitPermissions = {
	permissions: {
		read: [
			AppleHealthKit.Constants.Permissions.Steps,
			AppleHealthKit.Constants.Permissions.FlightsClimbed,
			AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
			AppleHealthKit.Constants.Permissions.HeartRate,
		],
		write: [],
	},
};

const useAppleHealthData = (date: Date) => {
	const [hasPermissions, setHasPermission] = useState(false);
	const [steps, setSteps] = useState(0);
	const [flights, setFlights] = useState(0);
	const [distance, setDistance] = useState(0);
	const [heartRate, setHeartRate] = useState<HealthValue[]>();

	// iOS - Init HealthKit
	useEffect(() => {
		if (Platform.OS !== 'ios') return;

		AppleHealthKit.isAvailable((err, isAvailable) => {
			if (err) return console.log('Error checking availability');
			if (!isAvailable) return console.log('Apple Health not available');

			AppleHealthKit.initHealthKit(permissions, (err) => {
				if (err) return console.log('Error getting permissions');
				setHasPermission(true);
			});
		});
	}, []);

	// iOS - Get Health Data
	useEffect(() => {
		if (!hasPermissions) return;

		const options: HealthInputOptions = {
			date: date.toISOString(),
			includeManuallyAdded: true,
		};

		AppleHealthKit.getStepCount(options, (err, results) => {
			if (err) return console.log('Error getting the steps');
			console.log(results);
			setSteps(results.value);
		});

		AppleHealthKit.getFlightsClimbed(options, (err, results) => {
			if (err) return console.log('Error getting the steps:', err);
			setFlights(results.value);
		});

		AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
			if (err) return console.log('Error getting the steps:', err);
			setDistance(results.value);
		});

		let optionsHeart: HealthInputOptions = {
			startDate: new Date(2024, 1, 12).toISOString(), // required
			endDate: new Date().toISOString(), // optional; default now
			ascending: false, // optional; default false
			limit: 10, // optional; default no limit
		};

		AppleHealthKit.getHeartRateSamples(optionsHeart, (err, results) => {
			if (err) return console.log('Error getting the Heart Rate:', err);
			setHeartRate(results);
		});
	}, [hasPermissions]);

	return { steps, flights, distance, heartRate };
};

export default useAppleHealthData;
