import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, List, Popconfirm, Row, Col, Tag, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import QuestionModal from '../../components/Modal/QuestionModal';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ question, item, loading }) => ({
  question,
  item,
  loading: loading.models.question,
}))
@Form.create()
export default class TableList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'question/fetch',
    });
    dispatch({
      type: 'item/fetch',
    });
  }

  getItemName = id => {
    const {
      item: { items },
    } = this.props;
    for (const i in items) {
      if (items[i].id === id) return items[i].name;
    }
    return '';
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      dispatch({
        type: 'question/fetch',
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'question/fetch',
      payload: {},
    });
  };

  handleAdd = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'question/create',
      payload: values,
    });
  };

  handleEdit = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'question/patch',
      payload: { id, values },
    });
  };

  handelDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'question/remove',
      payload: id,
    });
  };

  renderForm() {
    const {
      form,
      item: { items },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="实验项目">
              {getFieldDecorator('item')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
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
      question: { questions },
      item: { items },
      loading,
    } = this.props;

    return (
      <PageHeaderLayout title="题库管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <QuestionModal title="新建题目" items={items} record={{}} onOk={this.handleAdd}>
              <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
                添加题目
              </Button>
            </QuestionModal>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={questions}
              loading={loading}
              renderItem={question => (
                <List.Item
                  key={question.id}
                  actions={[
                    <div>答案：{question.answer}</div>,
                    <div>所属实验：{this.getItemName(question.item)}</div>,
                    <QuestionModal
                      title="编辑题目"
                      items={items}
                      record={question}
                      onOk={this.handleEdit.bind(null, question.id)}
                    >
                      <a>编辑</a>
                    </QuestionModal>,
                    <Popconfirm
                      title="确认删除？"
                      onConfirm={this.handelDelete.bind(null, question.id)}
                    >
                      <a href="">删除</a>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta title={question.title} />
                  <Row style={{ marginBottom: 5 }}>
                    <Col span={12}>
                      选项A：<Tag>{question.a}</Tag>
                    </Col>
                    <Col span={12}>
                      选项B：<Tag>{question.b}</Tag>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      选项C：<Tag>{question.c}</Tag>
                    </Col>
                    <Col span={12}>
                      选项D：<Tag>{question.d}</Tag>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
