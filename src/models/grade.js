import * as gradeService from '../services/grade';

export default {
  namespace: 'grade',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(gradeService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload: values, experiment }, { call, put }) {
      yield call(gradeService.create, values);
      yield put({ type: 'grade/fetch', payload: experiment });
    },
    *patch(
      {
        payload: { id, values },
        experiment,
      },
      { call, put }
    ) {
      yield call(gradeService.patch, id, values);
      yield put({ type: 'grade/fetch', payload: experiment });
    },
    *remove({ payload: id, experiment }, { call, put }) {
      yield call(gradeService.remove, id);
      yield put({ type: 'grade/fetch', payload: experiment });
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
