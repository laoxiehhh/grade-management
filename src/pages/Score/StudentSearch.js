import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { List, Card, Input, Form } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './TeacherSearch.less';

const { Search } = Input;

@connect(({ lesson, loading, user, score }) => ({
  ...lesson,
  ...user,
  ...score,
  loading: loading.models.score || loading.models.lesson,
}))
@Form.create()
class StudentSearch extends PureComponent {
  state = {
    currentSearchName: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'score/getStudentAnalysisData',
    });
  }

  handleLessonChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'score/getLessonStudentScore',
      payload: {
        lessonId: value,
      },
    });
  };

  handleNameSearch = value => {
    this.setState({
      currentSearchName: value,
    });
  };

  filterByName = (list = [], name) => {
    if (!name) return list;
    const { selfLessonById } = this.props;
    return list.filter(item => selfLessonById[item.LessonId].Name.indexOf(name) !== -1);
  };

  handleGoTask = data => {
    const { StudentId, LessonId } = data;
    router.push({
      pathname: '/score/task',
      query: {
        studentId: StudentId,
        lessonId: LessonId,
      },
    });
  };

  render() {
    const { loading, currentLessonStudent, selfLessonById } = this.props;

    const { currentSearchName } = this.state;

    const currentSearchList = this.filterByName(currentLessonStudent, currentSearchName);

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.extraContentItem}>
          <span>姓名: </span>
          <Search
            className={styles.extraContentForm}
            placeholder="请输入"
            onSearch={this.handleNameSearch}
          />
        </div>
      </div>
    );

    const paginationProps = {
      showQuickJumper: true,
      pageSize: 10,
      total: currentSearchList.length,
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="成绩查询"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={currentSearchList}
              renderItem={item => {
                const { LessonId, Score } = item;
                const Name = (selfLessonById[LessonId] && selfLessonById[LessonId].Name) || '';
                const ActionNode = <a>{Score || 0}</a>;
                const index = Name.indexOf(currentSearchName);
                const beforeStr = Name.substr(0, index);
                const afterStr = Name.substr(index + currentSearchName.length);
                const name =
                  index > -1 ? (
                    <span>
                      {beforeStr}
                      <span style={{ color: '#f50' }}>{currentSearchName}</span>
                      {afterStr}
                    </span>
                  ) : (
                    <span>{Name}</span>
                  );
                return (
                  <List.Item actions={[ActionNode]} onClick={() => this.handleGoTask(item)}>
                    <List.Item.Meta title="课程名称" description={name} />
                  </List.Item>
                );
              }}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default StudentSearch;
