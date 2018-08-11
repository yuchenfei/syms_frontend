import * as feedbackService from '../services/feedback';

export default {
  namespace: 'feedback',

  state: {
    feedback: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(feedbackService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(feedbackService.remove, id);
      yield put({ type: 'reload' });
    },
    *reload(action, { put }) {
      yield put({ type: 'feedback/fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        feedback: action.payload,
      };
    },
  },
};
