export default function Banned({ reason }) {
  return (<div>You have been banned for this reason: {reason}</div>)
}

import { FindOne } from '../scripts/server/db'
export async function getServerSideProps({ req }) {
  let isBanned = await FindOne("Banned", {
    username: req.headers['x-replit-user-name']
  });
  if(isBanned){
    return {
      props: {
        reason: isBanned.reason
      }
    }
  }else {
    return {
      redirect: {
        destination: "/"
      }
    }
  }
}