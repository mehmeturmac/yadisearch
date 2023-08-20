export const typeShort = (type: string) => {
  return type
    .replace(/application\/|\+zip/g, '') //eslint-disable-line
    .replace(/x\-zip\-compressed|zip|x\-bittorrent\-bts|x\-bittorrent/g, 'epub') //eslint-disable-line
    .replace(/octet\/stream|octet\-stream|octetstream/g, 'pdf') //eslint-disable-line
    .replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx'); //eslint-disable-line
};
