import axios from 'axios';

const API_URL = 'https://cloud-api.yandex.net:443/v1/disk/public/resources';

export const download = async (public_key: string, path: string, name: string) => {
  const { data } = await axios.get(`${API_URL}/download`, {
    params: {
      public_key,
      path,
    },
    timeout: 1000,
  });
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', data.href);
  linkElement.setAttribute('download', name);
  linkElement.setAttribute('target', 'downloadIframe');
  linkElement.setAttribute('rel', 'noreferrer');
  linkElement.setAttribute('referrerPolicy', 'no-referrer');
  document.body.appendChild(linkElement);
  linkElement.click();
  setTimeout(() => document.body.removeChild(linkElement), 500);
};
