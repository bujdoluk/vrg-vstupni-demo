import { defineStore } from 'pinia';
import { ref } from 'vue';
import config from '../config/config.json';

export const useSocketStore = defineStore('socket', () => {
  const isConnected = ref<boolean>(false);
  const socket = ref<WebSocket | null>(null);
  const messages = ref<string[]>([]);

  const connect = (): void => {
    socket.value = new WebSocket(config.ws);

    socket.value.onopen = (): void => {
      isConnected.value = true;
      console.log('Socket connected');
    };

    socket.value.onmessage = (event: MessageEvent): void => {
      messages.value.push(event.data);
    };

    socket.value.onclose = (): void => {
      isConnected.value = false;
      console.log('Socket disconnected');
    };

    socket.value.onerror = (err: unknown): void => {
      console.error('Socket error', err);
    };
  };

  const sendMessage = (msg: string): void => {
    if (socket.value && isConnected.value) {
      socket.value.send(msg);
    }
  };

  return {
    isConnected,
    socket,
    messages,
    connect,
    sendMessage,
  };
});