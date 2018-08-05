import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, List, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';
import ClassesEditModal from '../../components/Modal/ClassesModal';

@connect(({ classes, loading }) => ({
  classes,
  loading: loading.models.user,
}))
@Form.create()
export default class TableList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'classes/fetch',
    });
  }

  handleAdd = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'classes/create',
      payload: values,
    });
  };

  handleEdit = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'classes/patch',
      payload: { id, values },
    });
  };

  handelDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'classes/remove',
      payload: id,
    });
  };

  render() {
    const {
      classes: { classes },
      loading,
    } = this.props;

    // const paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   pageSize: 5,
    //   total: 50,
    // };

    return (
      <PageHeaderLayout title="班级管理">
        <Card bordered={false}>
          <div className={styles.tableListOperator}>
            <ClassesEditModal title="新建班级" record={{}} onOk={this.handleAdd}>
              <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
                添加
              </Button>
            </ClassesEditModal>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              // pagination={paginationProps}
              dataSource={classes}
              renderItem={item => (
                <List.Item
                  actions={[
                    <ClassesEditModal
                      title="编辑班级"
                      record={item}
                      onOk={this.handleEdit.bind(null, item.id)}
                    >
                      <a>编辑</a>
                    </ClassesEditModal>,
                    <Popconfirm
                      title="确认删除？"
                      onConfirm={this.handelDelete.bind(null, item.id)}
                    >
                      <a href="">删除</a>
                    </Popconfirm>,
                  ]}
                >
                  {item.name}
                </List.Item>
              )}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
