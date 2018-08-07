import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  // My API Mock
  'POST /api/login': 'http://localhost:8080',
  'GET /api/logout': 'http://localhost:8080',
  'GET /api/currentUser': 'http://localhost:8080',
  'GET /api/users/': 'http://localhost:8080',
  'POST /api/users/': 'http://localhost:8080',
  'PATCH /api/users/': 'http://localhost:8080',
  'DELETE /api/users/': 'http://localhost:8080',
  'GET /api/classes/': 'http://localhost:8080',
  'POST /api/classes/': 'http://localhost:8080',
  'PATCH /api/classes/': 'http://localhost:8080',
  'DELETE /api/classes/': 'http://localhost:8080',
  'GET /api/course/': 'http://localhost:8080',
  'POST /api/course/': 'http://localhost:8080',
  'PATCH /api/course/': 'http://localhost:8080',
  'DELETE /api/course/': 'http://localhost:8080',
  'GET /api/experiment/': 'http://localhost:8080',
  'POST /api/experiment/': 'http://localhost:8080',
  'PATCH /api/experiment/': 'http://localhost:8080',
  'DELETE /api/experiment/': 'http://localhost:8080',
  'GET /api/student/': 'http://localhost:8080',
  'POST /api/student/': 'http://localhost:8080',
  'PATCH /api/student/': 'http://localhost:8080',
  'DELETE /api/student/': 'http://localhost:8080',
};

export default (noProxy ? {} : delay(proxy, 1000));
