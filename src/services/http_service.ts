import axios from 'axios';

const BASE_URL = '/';
const instance = axios.create({
  baseURL: BASE_URL
})

instance.interceptors.request.use((config) => config);

instance.interceptors.response.use((response) => {
  if (response && response.data) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject('reponse not exist');
  }
}, (error) => {
  return Promise.reject({
    success: false,
    msg: 'error'
  })
});

export default instance;
