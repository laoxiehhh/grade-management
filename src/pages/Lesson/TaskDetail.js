import React, { PureComponent } from 'react';
import { Card, Form, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import TableForm from './TableForm';
import styles from './Table.less';

@connect(({ loading, lesson }) => ({
  ...lesson,
  submitting: loading.effects['lesson/setTaskScore'],
}))
@Form.create()
class TaskDetail extends PureComponent {
  state = {
    width: '100%',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    dispatch({
      type: 'lesson/getAllClasses',
    });
    dispatch({
      type: 'lesson/getTaskDetail',
      payload: { taskId: match.params.taskId },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
      match,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { Data } = values;
        const ScoreData = Data.reduce((pre, cur) => {
          const { StudentId, Score } = cur;
          return {
            ...pre,
            [StudentId]: Score,
          };
        }, {});
        const payload = {
          taskId: match.params.taskId,
          ScoreData,
          lessonId: match.params.lessonId,
        };
        dispatch({
          type: 'lesson/setTaskScore',
          payload,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      taskDetail,
      classById,
    } = this.props;
    const { width } = this.state;

    const tableData = taskDetail.map((item, index) => {
      return {
        key: index,
        Class: classById[item.ClassId] && classById[item.ClassId].Name,
        Name: item.Name,
        Score: item.StudentTasks.Score || 0,
        StudentId: item.id,
      };
    });
    return (
      <PageHeaderWrapper
        title="成绩登记"
        content="为需要完成该任务的所有学生登记成绩，最高分为100，最低分为0"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="学生列表" bordered={false}>
          {getFieldDecorator('Data', {
            initialValue: tableData,
          })(<TableForm />)}
        </Card>
        <FooterToolbar style={{ width }}>
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default TaskDetail;
