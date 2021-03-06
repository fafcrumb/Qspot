import {
  SET_USER,
  RECEIVE_USER_DATA,
  CREATE_SPOTIFY_ACCOUNT,
  FAIL_CREATE_SPOTIFY_ACCOUNT,
} from '../actions/auth.js';
import {
  REQUEST_NEW_CLIENT_TOKEN,
  RECEIVE_NEW_CLIENT_TOKEN,
  FAIL_NEW_CLIENT_TOKEN,
  RECEIVE_CLIENT_TOKEN_FROM_LISTENER,
  REQUEST_NEW_ACCESS_TOKEN,
  RECEIVE_NEW_ACCESS_TOKEN,
  FAIL_NEW_ACCESS_TOKEN,
} from '../actions/tokens';
import { UPDATE_LOCATION } from '../actions/app.js';

const auth = (state = { spotify: {} }, action) => {
  switch (action.type) {
    case SET_USER: {
      const user = action.user;
      const { id, displayName, email, photoURL } = user || {};
      return {
        ...state,
        user: user && { id, displayName, email, photoURL },
        initialized: true,
        authorizing: false,
        spotify: spotify(state.spotify, action),
      };
    }
    case UPDATE_LOCATION:
      return {
        ...state,
        authorizing: state.authorizing || action.page === 'authorize_spotify',
        spotify: spotify(state.spotify, action)
      };
    case RECEIVE_USER_DATA:
    case CREATE_SPOTIFY_ACCOUNT:
    case FAIL_CREATE_SPOTIFY_ACCOUNT:
    case REQUEST_NEW_CLIENT_TOKEN:
    case RECEIVE_NEW_CLIENT_TOKEN:
    case FAIL_NEW_CLIENT_TOKEN:
    case RECEIVE_CLIENT_TOKEN_FROM_LISTENER:
    case REQUEST_NEW_ACCESS_TOKEN:
    case RECEIVE_NEW_ACCESS_TOKEN:
    case FAIL_NEW_ACCESS_TOKEN:
      return {
        ...state,
        spotify: spotify(state.spotify, action)
      };
    default:
      return state;
  }
};

const spotify = (state = {}, action) => {
  switch (action.type) {
    case SET_USER: {
      const user = action.user;
      return {
        ...state,
        linked: user && user.spotify,
        premium: user && user.spotifyPremium,
      };
    }
    case RECEIVE_USER_DATA: {
      const { spotifyCountry: country } = action.userData;
      return {
        ...state,
        country,
        tokens: tokens(state.tokens, action)
      };
    }
    case REQUEST_NEW_CLIENT_TOKEN:
    case RECEIVE_NEW_CLIENT_TOKEN:
    case FAIL_NEW_CLIENT_TOKEN:
    case RECEIVE_CLIENT_TOKEN_FROM_LISTENER:
    case REQUEST_NEW_ACCESS_TOKEN:
    case RECEIVE_NEW_ACCESS_TOKEN:
    case FAIL_NEW_ACCESS_TOKEN:
      return {
        ...state,
        tokens: tokens(state.tokens, action)
      };
    case CREATE_SPOTIFY_ACCOUNT:
    case FAIL_CREATE_SPOTIFY_ACCOUNT:
    case UPDATE_LOCATION:
      return {
        ...state,
        login: login(state.login, action)
      };
    default:
      return state;
  }
};

const tokens = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_NEW_CLIENT_TOKEN:
    case RECEIVE_NEW_CLIENT_TOKEN:
    case FAIL_NEW_CLIENT_TOKEN:
    case RECEIVE_CLIENT_TOKEN_FROM_LISTENER:
      return {
        ...state,
        client: client(state.client, action)
      };
    case REQUEST_NEW_ACCESS_TOKEN:
    case RECEIVE_NEW_ACCESS_TOKEN:
    case FAIL_NEW_ACCESS_TOKEN:
    case RECEIVE_USER_DATA:
      return {
        ...state,
        access: access(state.access, action)
      };
    default:
      return state;
  }
};

const client = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_NEW_CLIENT_TOKEN:
      return {
        ...state,
        failure: false,
        isFetching: true
      };
    case RECEIVE_NEW_CLIENT_TOKEN:
      return {
        ...state,
        value: action.token,
        failure: false,
        isFetching: false
      };
    case FAIL_NEW_CLIENT_TOKEN:
      return {
        ...state,
        failure: true,
        isFetching: false
      };
    case RECEIVE_CLIENT_TOKEN_FROM_LISTENER:
      return {
        ...state,
        value: action.token,
      };
    default:
      return state;
  }
};

const access = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_NEW_ACCESS_TOKEN:
      return {
        ...state,
        failure: false,
        isFetching: true
      };
    case RECEIVE_NEW_ACCESS_TOKEN:
      return {
        ...state,
        value: action.token,
        failure: false,
        isFetching: false
      };
    case FAIL_NEW_ACCESS_TOKEN:
      return {
        ...state,
        failure: true,
        isFetching: false
      };
    case RECEIVE_USER_DATA:
      return {
        ...state,
        value: action.userData.spotifyAccessToken,
        expireTime: action.userData.spotifyAccessTokenExpireTime
      };
    default:
      return state;
  }
};

const login = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SPOTIFY_ACCOUNT:
      return {
        ...state,
        failure: false,
      };
    case FAIL_CREATE_SPOTIFY_ACCOUNT:
      return {
        ...state,
        failure: true,
        error: action.error
      };
    case UPDATE_LOCATION:
      return {
        ...state,
        code: state.code || action.params.get('code'),
        verificationState: state.verificationState || action.params.get('state'),
        error: state.error || action.params.get('error'),
      };
    default:
      return state;
  }
};

export default auth;

export const userSelector = state => state.auth.user;
export const userIdSelector = state => state.auth.user && state.auth.user.id;
export const spotifyAccountSelector = state => state.auth.spotify;
export const spotifyAccountIsPremiumSelector = state => state.auth.spotify && state.auth.spotify.premium;
export const spotifyClientTokenSelector = state => state.auth.spotify.tokens && state.auth.spotify.tokens.client;
export const spotifyAccessTokenSelector = state => state.auth.spotify.tokens && state.auth.spotify.tokens.access;
export const spotifyLoginSelector = state => state.auth.spotify.login;