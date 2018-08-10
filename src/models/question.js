import * as questionService from '../services/question';

export default {
  namespace: 'question',

  state: {
    questions: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(questionService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(questionService.create, values);
      yield put({ type: 'reload' });
    },
    *patch(
      {
        payload: { id, values },
      },
      { call, put }
    ) {
      yield call(questionService.patch, id, values);
      yield put({ type: 'reload' });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(questionService.remove, id);
      yield put({ type: 'reload' });
    },
    *reload(action, { put }) {
      yield put({ type: 'question/fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        questions: action.payload,
      };
    },
  },
};
