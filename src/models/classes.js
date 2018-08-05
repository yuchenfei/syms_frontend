import * as classesService from '../services/classes';

export default {
  namespace: 'classes',

  state: {
    classes: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(classesService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(classesService.create, values);
      yield put({ type: 'reload' });
    },
    *patch(
      {
        payload: { id, values },
      },
      { call, put }
    ) {
      yield call(classesService.patch, id, values);
      yield put({ type: 'reload' });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(classesService.remove, id);
      yield put({ type: 'reload' });
    },
    *reload(action, { put }) {
      yield put({ type: 'classes/fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        classes: action.payload,
      };
    },
  },
};
