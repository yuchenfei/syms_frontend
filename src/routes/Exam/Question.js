import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Button,
  List,
  Popconfirm,
  Row,
  Col,
  Tag,
  Select,
  Steps,
  Icon,
  message,
  Upload,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import QuestionModal from '../../components/Modal/QuestionModal';
import styles from './style.less';
import config from '../../config';
import Result from '../../components/Result';
import fetch from '../../../node_modules/dva/fetch';

const FormItem = Form.Item;
const { Option } = Select;
const { Step } = Steps;
const { Dragger } = Upload;

@connect(({ question, item, loading }) => ({
  question,
  item,
  loading: loading.models.question,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    step: -1,
    uploadData: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
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

  handleItemChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'question/fetch',
      payload: { item: value },
    });
  };

  handleUploadButtonClick = () => {
    const { form, dispatch } = this.props;
    const { step } = this.state;
    const { getFieldValue } = form;
    if (step < 0) {
      this.setState({
        step: 0,
      });
    } else {
      dispatch({
        type: 'question/fetch',
        payload: { item: getFieldValue('item') },
      });
      this.setState({
        step: -1,
        uploadData: {},
      });
    }
  };

  handleImportConfirmClick = () => {
    const { form } = this.props;
    const { uploadData } = this.state;
    const { getFieldValue } = form;
    const { data } = uploadData;
    const item = getFieldValue('item');
    fetch(`${config.domain}/api/question/import`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ item, data }),
    }).then(response => {
      if (response.status === 200) {
        this.setState({
          step: 2,
        });
      }
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

  handelUploadDelete = i => {
    const { uploadData } = this.state;
    const { data } = uploadData;
    data.splice(data.findIndex(item => item.i === i), 1);
    this.setState({ uploadData: { data } });
  };

  renderForm() {
    const {
      form,
      item: { items },
    } = this.props;
    const { step } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="实验项目">
              {getFieldDecorator('item', {
                rules: [
                  {
                    required: true,
                    message: '请选择课程',
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
            <span className={styles.submitButtons}>
              <Button icon="cloud-upload-o" type="primary" onClick={this.handleUploadButtonClick}>
                {step < 0 && '批量上传'}
                {step >= 0 && '返回'}
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      form,
      item: { items },
      loading,
    } = this.props;
    let {
      question: { questions },
    } = this.props;
    const { step, uploadData } = this.state;
    const { getFieldValue } = form;

    if (!getFieldValue('item')) questions = [];

    const colProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
      xl: 12,
      style: { marginBottom: 12 },
    };

    const props = {
      name: 'file',
      accept: '.xls,.xlsx',
      action: `${config.domain}/api/question/import`,
      data: { item: getFieldValue('item') },
      withCredentials: true,
      onChange: i => {
        const { file } = i;
        const { name, status, response } = file;
        if (status === 'done') {
          if (response.status === 'ok') {
            message.success(`${name} 上传成功！`);
            this.setState({
              uploadData: response,
              step: 1,
            });
          }
          if (response.status === 'error') {
            message.error(`${name} 文件格式出错！`);
          }
        } else if (status === 'error') {
          message.error(`${name} 上传失败！`);
        }
      },
    };

    return (
      <PageHeaderLayout title="题库管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            {step < 0 && (
              <div>
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
                        <Col {...colProps}>
                          选项A：<Tag>{question.a}</Tag>
                        </Col>
                        <Col {...colProps}>
                          选项B：<Tag>{question.b}</Tag>
                        </Col>
                        <Col {...colProps}>
                          选项C：<Tag>{question.c}</Tag>
                        </Col>
                        <Col {...colProps}>
                          选项D：<Tag>{question.d}</Tag>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </div>
            )}
            {step >= 0 && (
              <Steps current={step} style={{ maxWidth: '750px', margin: '16px auto' }}>
                <Step title="上传文件" />
                <Step title="预览信息" />
                <Step title="完成导入" />
              </Steps>
            )}
            {step === 0 && (
              <div style={{ margin: '40px auto 0', maxWidth: '500px' }}>
                <Dragger disabled={!getFieldValue('item')} {...props}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p className="ant-upload-hint">支持扩展名：.xls .xlsx</p>
                  <p className="ant-upload-hint">
                    模板：
                    <a href={`${config.domain}/static/template_question.xlsx`}>下载链接</a>
                  </p>
                </Dragger>
              </div>
            )}
            {step === 1 && (
              <div>
                <List
                  itemLayout="vertical"
                  size="large"
                  dataSource={uploadData.data}
                  renderItem={question => (
                    <List.Item
                      key={question.i}
                      actions={[
                        <div>答案：{question.answer}</div>,
                        <Popconfirm
                          title="确认删除？"
                          onConfirm={this.handelUploadDelete.bind(null, question.i)}
                        >
                          <a href="">删除</a>
                        </Popconfirm>,
                      ]}
                    >
                      <List.Item.Meta title={question.title} />
                      <Row style={{ marginBottom: 5 }}>
                        <Col {...colProps}>
                          选项A：<Tag>{question.a}</Tag>
                        </Col>
                        <Col {...colProps}>
                          选项B：<Tag>{question.b}</Tag>
                        </Col>
                        <Col {...colProps}>
                          选项C：<Tag>{question.c}</Tag>
                        </Col>
                        <Col {...colProps}>
                          选项D：<Tag>{question.d}</Tag>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
                <Button
                  type="primary"
                  onClick={this.handleImportConfirmClick}
                  disabled={uploadData.data && uploadData.data.length < 1}
                  style={{ marginTop: '12px' }}
                >
                  确认
                </Button>
              </div>
            )}
            {step === 2 && <Result type="success" title="导入成功" className={styles.result} />}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
