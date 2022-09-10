import Swal from './modal'

export default async function Post(url: string, body: object): Promise<any> {
  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "*/*"
    },
    body: JSON.stringify(body)
  }).then(r => r.json());
  if(res.success){
    return res;
  }else {
    Swal.fire({
      title: "Failed",
      text: res.message,
      showCancelButton: false
    })
    return false;
  }
}

export interface DataResponse {
  success: boolean;
  message: string;
  remove: boolean | null;
}