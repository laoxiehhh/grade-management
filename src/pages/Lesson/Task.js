import React, { PureComponent } from 'react';
import { connect } from 'dva';
// eslint-disable-next-line import/no-unresolved
import { findDOMNode } from 'react-dom';
import { List, Card, Input, Modal, Form, Button, DatePicker, Select } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './JoinLesson.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ lesson, loading, global }) => ({
  ...lesson,
  assessmentCategoryList: global.assessmentCategoryList,
  loading: loading.models.lesson,
}))
@Form.create()
class AccessToLesson extends PureComponent {
  state = {
    currentSearchValue: '',
    taskModalVisible: false,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'lesson/getAllLessons',
    });
    dispatch({
      type: 'lesson/getLessonTask',
      payload: { lessonId: match.params.lessonId },
    });
    dispatch({
      type: 'lesson/getLessonAssessments',
      payload: { lessonId: match.params.lessonId },
    });
  }

  handleSearch = value => {
    this.setState({
      currentSearchValue: value,
    });
  };

  handleTaskModalShow = () => {
    this.setState({
      taskModalVisible: true,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      taskModalVisible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, match } = this.props;
    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, values) => {
      if (err) return;
      const payload = {
        ...values,
        Deadline: values.Deadline.format('YYYY-MM-DD'),
        lessonId: match.params.lessonId,
      };
      dispatch({
        type: 'lesson/createLessonTask',
        payload,
      });
      this.setState({
        taskModalVisible: false,
      });
    });
  };

  handleScore = value => {
    const { id } = value;
    router.push(`/lesson/task/${id}`);
  };

  render() {
    const {
      loading,
      lessonTaskList,
      lessonById,
      match,
      form,
      lessonAssessmentList,
      assessmentCategoryList,
    } = this.props;
    const { currentSearchValue, taskModalVisible } = this.state;

    let currentSearchList = [];
    currentSearchList = lessonTaskList.filter(item => item.Name.indexOf(currentSearchValue) !== -1);

    const extraContent = (
      <div className={styles.extraContent}>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入"
          onSearch={this.handleSearch}
        />
      </div>
    );

    const paginationProps = {
      showQuickJumper: true,
      pageSize: 5,
      total: currentSearchList.length,
    };

    const assessmentCategoryMap = assessmentCategoryList.reduce((pre, cur) => {
      return {
        ...pre,
        [cur.id]: cur.Name,
      };
    }, {});

    const ListContent = ({ data: { Assessment, createdAt, Deadline } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>所属考核类别</span>
          <p>
            {assessmentCategoryMap[Assessment.AssessmentCategoryId]}: {Assessment.Proportion}%
          </p>
        </div>
        <div className={styles.listContentItem}>
          <span>创建日期</span>
          <p>{moment(createdAt).format('YYYY-MM-DD')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>截止日期</span>
          <p>{Deadline}</p>
        </div>
      </div>
    );

    const { getFieldDecorator } = form;

    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="所属考核类别" {...this.formLayout}>
            {getFieldDecorator('AssessmentId', {
              rules: [{ required: true, message: '请选择考核类别' }],
            })(
              <Select placeholder="请选择">
                {lessonAssessmentList.map(item => {
                  return (
                    <SelectOption value={item.id} key={item.id}>
                      {assessmentCategoryMap[item.AssessmentCategoryId]}
                    </SelectOption>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="任务名称" {...this.formLayout}>
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入任务名称' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="截止时间" {...this.formLayout}>
            {getFieldDecorator('Deadline', {
              rules: [{ required: true, message: '请选择截止时间' }],
            })(<DatePicker placeholder="请选择" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem {...this.formLayout} label="任务描述">
            {getFieldDecorator('Desc', {
              rules: [{ message: '请输入至少五个字符的任务描述！', min: 5 }],
            })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
          </FormItem>
        </Form>
      );
    };

    const modalFooter = {
      cancelText: '取消',
      okText: '保存',
      onOk: this.handleSubmit,
      onCancel: this.handleCancel,
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title={lessonById[match.params.lessonId] && lessonById[match.params.lessonId].Name}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.handleTaskModalShow}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={currentSearchList}
              renderItem={item => {
                const { Name, Desc } = item;
                const ActionNode = <a onClick={() => this.handleScore(item)}>成绩登记</a>;
                const index = Name.indexOf(currentSearchValue);
                const beforeStr = Name.substr(0, index);
                const afterStr = Name.substr(index + currentSearchValue.length);
                const title =
                  index > -1 ? (
                    <span>
                      {beforeStr}
                      <span style={{ color: '#f50' }}>{currentSearchValue}</span>
                      {afterStr}
                    </span>
                  ) : (
                    <span>{Name}</span>
                  );
                return (
                  <List.Item actions={[ActionNode]}>
                    <List.Item.Meta title={title} description={Desc} />
                    <ListContent data={item} />
                  </List.Item>
                );
              }}
            />
          </Card>
        </div>
        <Modal
          title="添加任务"
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={taskModalVisible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default AccessToLesson;
