import axios from "axios";

const IP_MACHINE = "192.168.1.121";
const SERVER_PORT = "3333";

export const api = axios.create({
  baseURL: `http://${IP_MACHINE}:${SERVER_PORT}`,
});
