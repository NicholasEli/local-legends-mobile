import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'react-native';
import theme_variables from '../../helpers/theme-variables.js';

const RunTimer = ({ time = null, seconds = null, start = false, onComplete = null }) => {
	const el_ref = useRef(null);
	const raf_ref = useRef(null);
	const [display, setDisplay] = useState('00:00:00');

	useEffect(() => {
		if (!time || !seconds || !el_ref.current) {
			if (seconds && el_ref.current) {
				const mins = Math.floor(seconds / (60 * 1000));
				const secs = Math.floor((seconds % (60 * 1000)) / 1000);
				const hundredths = Math.floor((seconds % 1000) / 10);

				const formatted = `${mins}:${secs.toString().padStart(2, '0')}:${hundredths
					.toString()
					.padStart(2, '0')}`;

				setDisplay(formatted);
			}

			return;
		}

		let running = true;

		const tick = () => {
			if (!time || !start || !running) {
				cancelAnimationFrame(raf_ref.current);

				return;
			}

			const current_time = Date.now();
			const time_diff = current_time - time;

			if (time_diff >= seconds) {
				//el_ref.current.innerText = '00:00:00';
				setDisplay('00:00:00');
				if (onComplete) onComplete();
				return;
			}

			const remaining_time = seconds - time_diff;

			const mins = Math.floor(remaining_time / (60 * 1000));
			const secs = Math.floor((remaining_time % (60 * 1000)) / 1000);
			const hundredths = Math.floor((remaining_time % 1000) / 10);

			const formatted = `${mins}:${secs.toString().padStart(2, '0')}:${hundredths
				.toString()
				.padStart(2, '0')}`;

			//el_ref.current.innerText = formatted;
			setDisplay(formatted);

			raf_ref.current = requestAnimationFrame(tick);
		};

		if (start) {
			raf_ref.current = requestAnimationFrame(tick);
		}

		return () => {
			running = false;
			cancelAnimationFrame(raf_ref.current);
		};
	}, [time, seconds, start, onComplete]);

	return (
		<Text
			ref={el_ref}
			style={{
				fontFamily: theme_variables.gothic,
				fontSize: 33,
				letterSpacing: 1
			}}
		>
			{display}
		</Text>
	);
};

export default RunTimer;
