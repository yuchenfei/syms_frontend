import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Badge,
  Divider,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import UserModal from '../../components/Modal/UserModal';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'user/fetch',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'user/fetch',
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/fetch',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'user/remove',
          payload: {
            userName: selectedRows.map(row => row.username).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/create',
      payload: {
        username: fields.username,
        last_name: fields.last_name,
        first_name: fields.first_name,
        is_admin: fields.is_admin,
      },
    });
  };

  handleEdit = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/patch',
      payload: { id, values },
    });
  };

  handelDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/remove',
      payload: id,
    });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="管理员">
              {getFieldDecorator('is_admin')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      user: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '管理员',
        dataIndex: 'is_admin',
        sorter: true,
        render(val) {
          return val ? <Badge status="success" text="是" /> : <Badge status="default" text="否" />;
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <UserModal
              title="编辑教师账户"
              record={record}
              onOk={this.handleEdit.bind(null, record.id)}
            >
              <a>编辑</a>
            </UserModal>
            <Divider type="vertical" />
            <Popconfirm title="确认删除？" onConfirm={this.handelDelete.bind(this, record.id)}>
              <a href="">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="教师管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <UserModal title="新建教师账户" record={{}} onOk={this.handleAdd}>
                <Button icon="plus" type="primary">
                  新建
                </Button>
              </UserModal>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey="id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
