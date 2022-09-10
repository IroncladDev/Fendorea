export const Get = async (url) => {
  return await fetch(url).then(r => r.json());
}

export const Post = async (url, body) => {
  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "*/*"
    },
    body: JSON.stringify(body)
  }).then(r => r.json());
  return res;
}