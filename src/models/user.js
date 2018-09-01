// import * as routerRedux from 'react-router-redux';
import { message } from 'antd';
import * as userService from '../services/user';
// import { setAuthority } from '../utils/authority';

export default {
  namespace: 'user',

  state: {
    status: '',
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
      if (currentUser) {
        yield put({
          type: 'saveCurrentUser',
          payload: currentUser,
        });
      } else {
        yield put({ type: 'login/logout' });
      }

      // if (currentAuthority) {
      //   setAuthority(currentAuthority);
      //   if (currentAuthority === 'admin') yield put(routerRedux.push('/info/teacher'));
      //   if (currentAuthority === 'user') yield put(routerRedux.push('/exam/start'));
      // }
    },
    *setting({ payload: values }, { call, put }) {
      const response = yield call(userService.setting, values);
      yield put({ type: 'saveStatus', payload: response });
      if (response.status === 'ok') {
        message.success('修改成功');
        yield put({ type: 'saveStatus', payload: { status: 'changed' } });
        yield put({ type: 'user/fetchCurrent' });
        yield put({ type: 'reload' });
      }
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
    saveStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status || '',
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
