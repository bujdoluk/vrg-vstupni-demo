import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSocketStore = defineStore('socket', () => {
  const isConnected = ref(false);
  const socket = ref<WebSocket | null>(null);
  const messages = ref<string[]>([]);

  const connect = () => {
    socket.value = new WebSocket('ws://localhost:3000');

    socket.value.onopen = () => {
      isConnected.value = true;
      console.log('WebSocket connected');
    };

    socket.value.onmessage = (event) => {
      messages.value.push(event.data);
    };

    socket.value.onclose = () => {
      isConnected.value = false;
      console.log('WebSocket disconnected');
    };

    socket.value.onerror = (err) => {
      console.error('WebSocket error', err);
    };
  };

  const sendMessage = (msg: string) => {
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