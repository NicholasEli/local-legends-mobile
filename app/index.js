import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { ScrollView, View } from 'react-native';
import Banner from '../components/Banner.js';
import Scroller from '../components/Scroller.js';
import { get_events } from '../api/events.js';
import { get_vod_previews } from '../api/videos-on-demand.js';
import { get_athletes } from '../api/athletes.js';
import auth from '../api/auth.js';
import { get_auth_token } from '../helpers/auth.js';
import theme_variables from '../helpers/theme-variables.js';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [vods, setVODs] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const req_events = await get_events();
      const req_vods = await get_vod_previews();
      const req_athletes = await get_athletes();

      setEvents(req_events);
      setVODs(req_vods);
      setAthletes(req_athletes);

      const token = await get_auth_token();
      if (!token) return;

      const req_user = await auth.user(token);
      if (!req_user?._id) return;

      setUser(req_user);
      setVODs(req_vods.filter((vod) => vod.user_id != req_user._id));
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Banner
        title="Local Legends Live"
        subtitle="Amateur Action Sports"
        uri="https://locallegends.live/home/banner/vod.jpg"
      />
      <ScrollView
        style={{
          marginBottom: theme_variables.gap,
          paddingLeft: theme_variables.gap,
          borderTopWidth: 2,
          borderTopColor: theme_variables.primary
        }}
      >
        <Scroller title="Athletes" athletes={athletes} />
        <Scroller title="Videos On Demand" vods={vods} user={user} />
        <Scroller title="Events" events={events} />
      </ScrollView>
    </View>
  );
}
