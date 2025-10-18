import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams } from 'expo-router';
import EJSON from 'ejson';
import Cover from './Cover.jsx';
import Standings from './Standings.jsx';
import Details from './Details.jsx';
import Chat from './Chat.jsx';
import auth from '../../api/auth.js';
import { get_event } from '../../api/event.js';
import { get_organization } from '../../api/organization.js';
import theme_variables from '../../helpers/theme-variables.js';
import { get_auth_token } from '../../helpers/auth.js';
import { hex_to_rgb } from '../../helpers/utils.js';

export default function Event() {
  const { width, height } = Dimensions.get('window');
  const params = useLocalSearchParams();

  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [panels, setPanels] = useState([
    {
      id: 'cover',
      label: 'Event'
    }
  ]);

  const [panel, setPanel] = useState(panels[0]);

  /** UI **/
  const PanelNavigation = function () {
    return (
      <View
        style={{
          width: width - theme_variables.gap,
          position: 'absolute',
          top: theme_variables.gap,
          left: theme_variables.gap / 2,
          zIndex: 5,
          gap: theme_variables.gap,
          ...theme_variables.flex_center
        }}
      >
        {panels.map((tab, index) => {
          return (
            <Pressable
              key={tab.id}
              onPress={() => setPanel(tab)}
              style={{
                flex: 1
              }}
            >
              <BlurView
                intensity={10}
                style={{
                  height: 32,
                  borderRadius: 100,
                  backgroundColor:
                    panel.id == tab.id
                      ? hex_to_rgb(theme_variables.primary, 0.75)
                      : 'rgba(0, 0, 0, 0.5)',
                  borderWidth: 1,
                  borderColor: theme_variables.primary,
                  overflow: 'hidden',
                  ...theme_variables.flex_center
                }}
              >
                <Text
                  style={{
                    fontFamily: theme_variables.gothic,
                    textTransform: 'uppercase',
                    fontSize: 16,
                    letterSpacing: 1,
                    color: '#fff'
                  }}
                >
                  {tab.label}
                </Text>
              </BlurView>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const Panels = function () {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        {panel?.id == 'cover' && <Cover event={event} organization={organization} user={user} />}
        {panel?.id == 'standings' && <Standings event={event} user={user} />}
        {panel?.id == 'details' && (
          <Details event={event} organization={organization} user={user} />
        )}
      </View>
    );
  };

  useEffect(() => {
    (async () => {
      const req_event = await get_event({ id: params.id });
      setEvent(req_event);

      if (req_event?.organization_id) {
        const req_organization = await get_organization({ id: req_event.organization_id });
        setOrganization(req_organization);
      }

      const _panels = panels;

      if (Object.keys(req_event.heats).length > 0) {
        _panels.push({
          id: 'standings',
          label: 'Standings'
        });
      }

      _panels.push({
        id: 'details',
        label: 'Details'
      });

      setPanels(_panels);

      const token = await get_auth_token();
      if (!token) return;

      const req_user = await auth.user(token);
      if (!req_user?._id) return;

      setUser(req_user);
    })();
  }, []);

  if (!event) return <></>;

  return (
    <View style={{ flex: 1 }}>
      <PanelNavigation />
      <Panels />
      {event.enabled.chat && <Chat event={event} user={user} />}
    </View>
  );
}
