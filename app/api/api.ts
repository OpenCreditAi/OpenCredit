import axios from 'axios'

export const getAPI = () =>
  axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    },
    // Preserve existing JSON.parse(response.data) usage across the codebase
    transformResponse: [(data) => data],
    // Ensure request body is properly JSON stringified
    transformRequest: [(data) => {
      if (data && typeof data === 'object') {
        return JSON.stringify(data);
      }
      return data;
    }],
  })
