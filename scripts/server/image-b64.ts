import request from 'request'
export default function getB64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    request(
      {
        url,
        encoding: null
      },
      (err, resp, buffer) => {
        const bs4 = Buffer.from(buffer, 'base64').toString('base64');
        const b64 = `data:${resp.headers['content-type']};base64,${bs4}`
        resolve(b64);
      }
    );
  })
}