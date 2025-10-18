import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View } from 'react-native';
import Banner from '../components/Banner.js';
import Scroller from '../components/Scroller.js';
import { get_content } from '../api/content.js';
import { get_events } from '../api/events.js';
import { get_vod_previews } from '../api/videos-on-demand.js';
import { get_athletes } from '../api/athletes.js';
import auth from '../api/auth.js';
import { get_auth_token } from '../helpers/auth.js';
import theme_variables from '../helpers/theme-variables.js';

export default function Home() {
  const [content, setContent] = useState({});
  const [events, setEvents] = useState([]);
  const [vods, setVODs] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const req_content = await get_content();
      const req_athletes = await get_athletes();
      const req_vods = await get_vod_previews();
      const req_events = await get_events();

      setContent(req_content);

      const _athletes = req_athletes;
      _athletes.splice(req_content.index.athletes.index, 0, req_content.index.athletes);
      setAthletes(req_athletes);

      setEvents(req_events);

      const _vods = req_vods;
      if (req_content?.index?.vods) _vods.push(req_content.index.vods);
      setVODs(_vods);

      const token = await get_auth_token();
      if (!token) return;

      const req_user = await auth.user(token);
      if (!req_user?._id) return;

      setUser(req_user);
      setVODs(_vods.filter((vod) => vod.user_id != req_user._id));
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: theme_variables.gap }}>
        <Scroller athletes={athletes} marginTop={theme_variables.gap * 2.5} />
      </View>
      <ScrollView>
        {content?.index?.banner && <Banner {...content.index.banner} />}

        <Scroller vods={vods} user={user} />
        <Scroller events={events} marginTop={theme_variables.gap} />
        <View style={{ width: '100%', height: theme_variables.gap * 4 }} />
      </ScrollView>
    </View>
  );
}
