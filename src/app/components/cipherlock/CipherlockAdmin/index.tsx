import styles from "./styles.module.scss";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Admonition from "@site/src/theme/Admonition";
import io, {Socket} from "socket.io-client";
import {useEffect, useState} from "react";
import {observer} from "mobx-react";
import cipherlockAdminStore from "@site/src/app/stores/CipherlockAdminStore";
import {action} from "mobx";

let socket: Socket;

const CipherlockAdmin = observer(() => {

  const [serverConnected, setServerConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [serverUrl, setServerUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    setServerUrl(cipherlockAdminStore.serverUrl || '');
    setApiKey(cipherlockAdminStore.apiKey || '');
  }, []);

  useEffect(() => {
    return action(() => {
      cipherlockAdminStore.serverUrl = serverUrl;
      cipherlockAdminStore.apiKey = apiKey;
    });
  }, [serverUrl, apiKey]);

  function resetError() {
    setError('');
  }

  function connectToSocket() {
    setConnecting(true);
    resetError();
    if (!serverUrl) {
      setConnecting(false);
      return;
    }

    try {
      const url = new URL(serverUrl);
      const wsUrl = `ws://${url.host}`;
      socket = io(wsUrl, {
        extraHeaders: {
          apikey: apiKey,
        }
      });
    } catch (e) {
      setError(e.toString());
      setConnecting(false);
      return;
    }

    socket.on('connect', () => {
      setServerConnected(true);
      setConnecting(false);
    })

    socket.on('disconnect', () => setServerConnected(false));

    socket.on('connect_error', (error: any) => {
      setError(error.toString());
      setConnecting(false);
    });
  }

  function disconnectFromServer() {
    socket.disconnect();
  }

  return (
    <div>
      <details className={styles.connectionPanel} open={!serverConnected}>
        <summary>Connection</summary>
        <div>

          {!serverConnected &&
            <Admonition type='warning' title='Not connected'>
              Not connected to game server.
            </Admonition>
          }

          {error &&
            <Admonition type='danger' title='Error'>
              {error}
            </Admonition>
          }

          <div className={styles.connectionInputs}>
            <div className={styles.connectionInputGroup}>
              <label htmlFor="input-server-url">Game Server URL</label>
              <input
                type="text"
                id="input-server-url"
                placeholder="https://..."
                value={serverUrl}
                onChange={e => setServerUrl(e.target.value)}
                disabled={connecting || serverConnected}
              />
            </div>
            <div className={styles.connectionInputGroup}>
              <label htmlFor="input-server-api-key">API Key</label>
              <input
                type="password"
                id="input-server-api-key"
                placeholder="API key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                disabled={connecting || serverConnected}
              />
            </div>
            <div>
              {!serverConnected &&
                <button
                  className="button button--primary"
                  onClick={() => connectToSocket()}
                  disabled={!(serverUrl && apiKey) || connecting}>Connect</button>
              }
              {serverConnected &&
                <button
                  className="button button--secondary"
                  onClick={() => disconnectFromServer()}>Disconnect</button>
              }
            </div>
          </div>
        </div>
      </details>

      <div className={styles.tabs}>
        <Tabs groupId="panel">
          <TabItem value="game" label="Game">
            Upload game file, see currently active gameId / name / description
          </TabItem>

          <TabItem value="lora" label="LoRaWAN Dashboard">
            See lorawan gateway status, online status for expected boxes (derived from game file), etc.
          </TabItem>
        </Tabs>
      </div>
    </div>
  )
});

export default CipherlockAdmin;
