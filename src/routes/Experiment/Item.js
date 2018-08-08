import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, List, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';
import ItemModal from '../../components/Modal/ItemModal';

@connect(({ item, loading }) => ({
  item,
  loading: loading.models.item,
}))
@Form.create()
export default class TableList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'item/fetch',
    });
  }

  handleAdd = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'item/create',
      payload: values,
    });
  };

  handleEdit = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'item/patch',
      payload: { id, values },
    });
  };

  handelDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'item/remove',
      payload: id,
    });
  };

  render() {
    const {
      item: { items },
      loading,
    } = this.props;

    // const paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   pageSize: 5,
    //   total: 50,
    // };

    return (
      <PageHeaderLayout title="实验项目管理">
        <Card bordered={false}>
          <div className={styles.tableListOperator}>
            <ItemModal title="新建实验项目" record={{}} onOk={this.handleAdd}>
              <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
                添加
              </Button>
            </ItemModal>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              // pagination={paginationProps}
              dataSource={items}
              renderItem={item => (
                <List.Item
                  actions={[
                    <ItemModal
                      title="编辑项目"
                      record={item}
                      onOk={this.handleEdit.bind(null, item.id)}
                    >
                      <a>编辑</a>
                    </ItemModal>,
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
