import { Axios } from 'axios'

const { API_BASE_URL } = require("../../config")

export const getAPI = () =>
  new Axios({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
