import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Cover from './Cover.jsx';
import Standings from './Standings.jsx';
import Details from './Details.jsx';
import Chat from './Chat.jsx';
import auth from '../../api/auth.js';
import theme_variables from '../../helpers/theme-variables.js';
import { get_auth_token } from '../../helpers/auth.js';
import { get_event } from '../../api/event.js';
import { get_organization } from '../../api/organization.js';

const panels = [
  {
    id: 'cover',
    label: 'Event'
  },
  {
    id: 'standings',
    label: 'Standings'
  },
  {
    id: 'details',
    label: 'Details'
  }
];

export default function Event() {
  const params = useLocalSearchParams();

  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [panel, setPanel] = useState(panels[0]);

  useEffect(() => {
    (async () => {
      console.log('--mount');
      const req_event = await get_event({ id: params.id });
      setEvent(req_event);

      if (req_event?.organization_id) {
        const req_organization = await get_organization({ id: req_event.organization_id });
        setOrganization(req_organization);
      }

      const token = await get_auth_token();
      if (!token) return;

      const req_user = await auth.user(token);
      if (!req_user?._id) return;

      setUser(req_user);
    })();
  }, []);

  if (!event) return <></>;

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#ffffff',
          borderColor: theme_variables.primary,
          borderBottomWidth: 2
        }}
      >
        {panels.map((tab, index) => {
          return (
            <Pressable
              key={tab.id}
              style={{
                flex: 1
              }}
              onPress={() => setPanel(tab)}
            >
              <View
                style={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: index > 0 ? theme_variables.primary : 'transparent',
                  borderLeftWidth: 1,
                  backgroundColor: panel.id == tab.id ? theme_variables.primary : 'transparent'
                }}
              >
                <Text
                  style={{
                    color: panel.id == tab.id ? '#ffffff' : theme_variables.gray400,
                    fontFamily: theme_variables.gothic,
                    textTransform: 'uppercase',
                    fontSize: 20,
                    letterSpacing: 1
                  }}
                >
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
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

      {event.enabled.chat && <Chat event={event} user={user} />}
    </View>
  );
}
