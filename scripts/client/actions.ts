import { Post } from '../fetch'

export const authenticate = (): void => {
  window.addEventListener('message', authComplete);
  let h = 500;
  let w = 350;
  let left = screen.width / 2 - w / 2;
  let top = screen.height / 2 - h / 2;

  let authWindow = window.open(
    'https://replit.com/auth_with_repl_site?domain=' + location.host,
    '_blank',
    `modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`
  );

  function authComplete(e): void {
    if (e.data !== 'auth_complete') {
      return;
    }

    window.removeEventListener('message', authComplete);

    authWindow.close();
    location.reload();
  }
}