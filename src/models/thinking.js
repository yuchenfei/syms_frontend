import * as thinkingService from '../services/thinking';

export default {
  namespace: 'thinking',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(thinkingService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(thinkingService.remove, id);
      yield put({ type: 'reload' });
    },
    *reload(action, { put }) {
      yield put({ type: 'thinking/fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: { list: action.payload },
      };
    },
  },
};
