import request from './request.js';
import { currentUser } from './firebase-loader.js';

export async function _authenticatedRequest(options) {
  
  if (typeof (options) === 'string') {
    options = { url: options };
  }
  const token = await currentUser().getIdToken();
  options.headers = {
    Authorization: `Bearer ${token}`
  };
  return await request(options);
}