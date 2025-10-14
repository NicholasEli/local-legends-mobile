import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
      <View style={{ marginBottom: theme_variables.gap }}>
        <Scroller athletes={athletes} marginTop={theme_variables.gap * 2.5} />
      </View>
      <ScrollView>
        <Banner
          href="https://locallegends.live"
          title="Local Legends Live"
          subtitle="Amateur Action Sports"
          uri="https://locallegends.live/home/banner/vod.jpg"
        />

        <Scroller
          vods={[
            ...vods,
            {
              title: 'Upload. Share. Grow',
              text: 'Local Legends Live Network',
              href: 'https://locallegends.live/creator-program',
              banner: {
                url: 'https://locallegendslive.b-cdn.net/card-vod.jpg'
              }
            }
          ]}
          user={user}
        />
        <Scroller events={events} marginTop={theme_variables.gap} />
        <View style={{ width: '100%', height: theme_variables.gap * 4 }} />
      </ScrollView>
    </View>
  );
}
