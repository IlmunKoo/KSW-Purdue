import axios from 'axios';

const devUrl = `http://34.67.222.137`; //with k8s
// const devUrl = `http://34.121.157.198:8080`; //without k8s
// const devUrl = `http://localhost:8080`;
const pubUrl = ``;

const url = () => {
  if (process.env.REACT_APP_URL === 'production') return pubUrl;
  else return devUrl;
};

export const http = axios.create({
  baseURL: url(),
  headers: {},
});

export default http;
