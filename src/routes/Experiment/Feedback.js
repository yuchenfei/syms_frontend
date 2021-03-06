import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, List, Popconfirm, Row, Col, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Gallery from '../../components/Gallery';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ feedback, item, classes, loading }) => ({
  feedback,
  item,
  classes,
  loading: loading.models.feedback,
}))
@Form.create()
export default class TableList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'item/fetch',
    });
    dispatch({
      type: 'classes/fetch',
    });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      dispatch({
        type: 'feedback/fetch',
        payload: values,
      });
    });
  };

  handelDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedback/remove',
      payload: id,
    });
  };

  renderForm() {
    const {
      form,
      classes: { classes },
      item: { items },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="实验名">
              {getFieldDecorator('item', {
                rules: [
                  {
                    required: true,
                    message: '请选择实验项目',
                  },
                ],
              })(
                <Select
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  onChange={this.handleItemChange}
                >
                  {items.map(i => {
                    return (
                      <Option key={i.id} value={i.id}>
                        {i.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="班级">
              {getFieldDecorator('classes', {
                rules: [
                  {
                    required: true,
                    message: '请选择班级',
                  },
                ],
              })(
                <Select placeholder="请选择" onChange={this.handleClassesChange}>
                  {classes.map(i => {
                    return (
                      <Option key={i.id} value={i.id}>
                        {i.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      feedback: { feedback },
      loading,
    } = this.props;

    return (
      <PageHeaderLayout title="实验反馈">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={feedback}
              loading={loading}
              renderItem={i => (
                <List.Item
                  key={i.id}
                  actions={[
                    <div>{i.studentXH}</div>,
                    <div>{i.studentName}</div>,
                    <div>{i.courseName}</div>,
                    <div>{i.datetime}</div>,
                    <Popconfirm title="确认删除？" onConfirm={this.handelDelete.bind(null, i.id)}>
                      <a href="">删除</a>
                    </Popconfirm>,
                  ]}
                  extra={
                    <div style={{ width: '250px' }} inline-block>
                      <Gallery images={i.images} showThumbnails />
                    </div>
                  }
                >
                  <List.Item.Meta title={i.experimentName} description={i.content} />
                </List.Item>
              )}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
