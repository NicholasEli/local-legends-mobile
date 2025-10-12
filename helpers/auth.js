import Meteor from '@meteorrn/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const get_auth_token = function () {
	return new Promise(async (resolve) => {
		const token = await AsyncStorage.getItem('meteor_login_token');
		resolve(token);
	});
};

export const set_auth_token = function (token) {
	return new Promise(async (resolve) => {
		await AsyncStorage.setItem('meteor_login_token', token);
		resolve(token);
	});
};

export const remove_auth_token = function () {
	return new Promise(async (resolve) => {
		await AsyncStorage.removeItem('meteor_login_token');
		resolve(true);
	});
};
