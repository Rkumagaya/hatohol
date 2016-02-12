INSERT INTO server_types (type, name, parameters, plugin_path, plugin_sql_version, plugin_enabled, uuid)
  VALUES (7, 'Nagios Livestatus (HAPI2)', '[{"id": "nickname", "label": "Nickname"}, {"hint": "IP_ADDRESS:PORT or SOCKET_DIRECTORY", "id": "baseURL", "label": "URL"}, {"default": "30", "id": "pollingInterval", "label": "Polling interval (sec)"}, {"default": "10", "id": "retryInterval", "label": "Retry interval (sec)"}, {"inputStyle": "checkBox", "id": "passiveMode", "label": "Passive mode"}, {"default": "amqp://user:password@localhost/vhost", "id": "brokerUrl", "label": "Broker URL"}, {"hint": "(empty: Default)", "allowEmpty": true, "id": "staticQueueAddress", "label": "Static queue address"}, {"allowEmpty": true, "id": "tlsCertificatePath", "label": "TLS client certificate path"}, {"allowEmpty": true, "id": "tlsKeyPath", "label": "TLS client key path"}, {"allowEmpty": true, "id": "tlsCACertificatePath", "label": "TLS CA certificate path"}, {"inputStyle": "checkBox", "allowEmpty": true, "id": "tlsEnableVerify", "label": "TLS: Enable verify"}]', 'start-stop-hap2-nagios-livestatus.sh', 1, 1, '6f024e3e-a2cd-11e5-bfc7-d43d7e3146fb')
  ON DUPLICATE KEY UPDATE name='Nagios Livestatus (HAPI2)', parameters='[{"id": "nickname", "label": "Nickname"}, {"hint": "IP_ADDRESS:PORT or SOCKET_DIRECTORY", "id": "baseURL", "label": "URL"}, {"default": "30", "id": "pollingInterval", "label": "Polling interval (sec)"}, {"default": "10", "id": "retryInterval", "label": "Retry interval (sec)"}, {"inputStyle": "checkBox", "id": "passiveMode", "label": "Passive mode"}, {"default": "amqp://user:password@localhost[:port]/vhost", "id": "brokerUrl", "label": "Broker URL"}, {"hint": "(empty: Default)", "allowEmpty": true, "id": "staticQueueAddress", "label": "Static queue address"}, {"allowEmpty": true, "id": "tlsCertificatePath", "label": "TLS client certificate path"}, {"allowEmpty": true, "id": "tlsKeyPath", "label": "TLS client key path"}, {"allowEmpty": true, "id": "tlsCACertificatePath", "label": "TLS CA certificate path"}, {"inputStyle": "checkBox", "allowEmpty": true, "id": "tlsEnableVerify", "label": "TLS: Enable verify"}]', plugin_path='start-stop-hap2-nagios-livestatus.sh', plugin_sql_version='1', plugin_enabled='1';
