import { Axios } from 'axios'

export const getAPI = () =>
  new Axios({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
