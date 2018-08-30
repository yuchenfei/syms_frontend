import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '信息管理',
    icon: 'dashboard',
    path: 'info',
    authority: 'admin',
    children: [
      {
        name: '教师管理',
        path: 'teacher',
      },
      {
        name: '班级管理',
        path: 'classes',
      },
      {
        name: '学生管理',
        path: 'student',
      },
      {
        name: '课程管理',
        path: 'course',
      },
    ],
  },
  {
    name: '实验管理',
    icon: 'table',
    path: 'experiment',
    children: [
      {
        name: '实验项目',
        path: 'item',
      },
      {
        name: '实验管理',
        path: 'experiment',
      },
      {
        name: '实验反馈',
        path: 'feedback',
      },
      {
        name: '成绩管理',
        path: 'grade',
      },
      {
        name: '课程成绩',
        path: 'course_grade',
      },
    ],
  },
  {
    name: '在线答题',
    icon: 'form',
    path: 'exam',
    children: [
      {
        name: '答题设置',
        path: 'start',
      },
      {
        name: '答题记录',
        path: 'record',
      },
      {
        name: '题库管理',
        path: 'question',
      },
    ],
  },
  {
    name: '思考题库',
    icon: 'profile',
    path: 'thinking',
  },
  {
    name: '发布文件',
    icon: 'file',
    path: 'file',
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
