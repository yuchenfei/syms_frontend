// import * as routerRedux from 'react-router-redux';
import * as userService from '../services/user';
// import { setAuthority } from '../utils/authority';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentUser: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(userService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(userService.fetchCurrent);
      const { currentUser } = response; // currentAuthority
      yield put({
        type: 'saveCurrentUser',
        payload: currentUser,
      });
      // if (currentAuthority) {
      //   setAuthority(currentAuthority);
      //   if (currentAuthority === 'admin') yield put(routerRedux.push('/info/teacher'));
      //   if (currentAuthority === 'user') yield put(routerRedux.push('/exam/start'));
      // }
    },
    *create({ payload: values }, { call, put }) {
      yield call(userService.create, values);
      yield put({ type: 'reload' });
    },
    *patch(
      {
        payload: { id, values },
      },
      { call, put }
    ) {
      yield call(userService.patch, id, values);
      yield put({ type: 'reload' });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(userService.remove, id);
      yield put({ type: 'reload' });
    },
    *reload(action, { put }) {
      yield put({ type: 'user/fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: { list: action.payload },
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
