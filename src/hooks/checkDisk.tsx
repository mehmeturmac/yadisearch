import axios from 'axios';
const API_URL = 'https://cloud-api.yandex.net/v1/disk/public/resources';

export const checkDisk = async (public_key: string) => {
  try {
    const res = await axios.get(API_URL, { params: { public_key, limit: 0 } });
    return res.data;
  } catch (err) {
    return null;
  }
};
