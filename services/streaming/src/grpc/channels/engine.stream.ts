import * as engineGrpc from '../generated/engine';
import config from "../../config/config";
import * as grpc from '@grpc/grpc-js';


class EngineStream {
  private stream: grpc.ClientDuplexStream<any, any> | null = null;
  private client: engineGrpc.EngineClient | null = null;
  private reconnectDelay = 1000; // стартовый backoff
  private maxDelay = 30000;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  getEngineStream = () => {
    if (!this.stream) {
      throw new Error('Engine stream is not initialized');
    }

    return this.stream;
  }

  connect = () => {
    this.client = new engineGrpc.EngineClient(
      config.serviceEngineUrl,
      grpc.credentials.createInsecure()
    );
    this.stream = this.client.battleChannel();

    this.stream.on('data', (update) => {
      // транслируем обновления игрокам
    });

    this.stream.on('error', (err) => {
      console.error('Stream error:', err);
      this.scheduleReconnect();
    });

    this.stream.on('end', () => {
      console.warn('Stream ended');
      this.scheduleReconnect();
    });

    this.startHeartbeat();

    return this.stream;
  }

  write(data: engineGrpc.BattleChannelClientEvent) {
    if (!this.stream) {
      throw new Error('Engine stream not initialized');
    }

    this.stream.write(data);
  }

  scheduleReconnect = () => {
    setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxDelay);
      this.connect();
    }, this.reconnectDelay);
  }

  startHeartbeat = () => {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.stream) {
        this.stream.write({
          ping: {timestamp: Date.now()}
        });
      }
    }, 5000); // каждые 5 секунд
  }

  stopHeartbeat = () => {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

const engineStream = new EngineStream();

export default engineStream;
