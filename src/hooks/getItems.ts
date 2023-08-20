import axios from 'axios';

const API_URL = 'https://cloud-api.yandex.net/v1/disk/public/resources';

export const getItems = async (public_url: string, path: string, limit: number, offset: number) => {
  const { data } = await axios.get(API_URL, {
    params: {
      public_key: encodeURI(public_url),
      path,
      limit,
      offset,
    },
  });
  return data._embedded;
};
