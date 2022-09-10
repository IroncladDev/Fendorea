import { Post } from '../fetch'

export const authenticate: void = () => {
    window<Window>.addEventListener('message', authComplete);
    let h = 500;
    let w = 350;
    let left = screen.width / 2 - w / 2;
    let top = screen.height / 2 - h / 2;
  
    let authWindow = window<Window>.open(
      'https://replit.com/auth_with_repl_site?domain=' + location.host,
      '_blank',
      `modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`
    );
  
    function authComplete(e): void {
      if (e.data !== 'auth_complete') {
        return;
      }
  
      window<Window>.removeEventListener('message', authComplete);
  
      authWindow.close();
      location<Location>.reload();
    }
  }

export const generateImage: void = async (prompt: string, callback: (res: object) => unknown) => {
  let res = await Post("/api/generate", {
    prompt
  });
  callback(res)
}

export const postComment: void = async (body: string, callback: (res: object) => unknown) => {
  let res = await Post("/api/comment", {
    body,
    image_id: 6
  });
  callback(res)
}

export const likeImage: void = async (image_id: number, callback: (res: object) => unknown) => {
  let res = await Post("/api/like", {
    image_id
  });
  callback(res)
}

export const bookmarkImage: void = async (image_id: number, callback: (res: object) => unknown) => {
  let res = await Post("/api/bookmark", {
    image_id
  });
  callback(res)
}

export const deleteComment: void = async (comment_id: number, callback: (res: object) => unknown) => {
  let res = await Post("/api/delete-comment", {
    comment_id
  });
  callback(res)
}