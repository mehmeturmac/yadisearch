import axios from 'axios';

const API_URL = 'https://cloud-api.yandex.net/v1/disk/public/resources';

export const download = async (public_key: string, path: string) => {
  const { data } = await axios.get<{ href: string }>(`${API_URL}/download`, {
    params: {
      public_key,
      path,
    },
    timeout: 1000,
  });
  const linkElement = document.createElement('a');
  linkElement.href = data.href;
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
};
