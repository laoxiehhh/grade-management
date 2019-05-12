import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { List, Card, Input, Form, Select, Button } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './TeacherSearch.less';

const { Option } = Select;

@connect(({ lesson, loading, user, score }) => ({
  ...lesson,
  ...user,
  ...score,
  loading: loading.models.score,
}))
@Form.create()
class TeacherSearch extends PureComponent {
  state = {
    currentSearchName: '',
    currentSearchClass: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'lesson/getAllClasses',
    });
    dispatch({
      type: 'lesson/getSelfLessons',
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

  handleClassChange = value => {
    this.setState({
      currentSearchClass: value,
    });
  };

  handleNameSearch = e => {
    const { value } = e.target;
    this.setState({
      currentSearchName: value,
    });
  };

  filterByClass = (list = [], classId) => {
    if (!classId) return list;
    return list.filter(item => item.ClassId === classId);
  };

  filterByName = (list = [], name) => {
    if (!name) return list;
    return list.filter(item => item.Name.indexOf(name) !== -1);
  };

  combineFilter = list => {
    const { currentSearchClass, currentSearchName } = this.state;
    return this.filterByClass(this.filterByName(list, currentSearchName), currentSearchClass);
  };

  handleReset = () => {
    this.setState({
      currentSearchClass: '',
      currentSearchName: '',
    });
  };

  handleGoTask = data => {
    const { id, StudentLessons } = data;
    router.push({
      pathname: '/score/task',
      query: {
        studentId: id,
        lessonId: StudentLessons.LessonId,
      },
    });
  };

  render() {
    const { loading, classById, selfLessonList, currentLessonStudent, selfLessonById } = this.props;

    const { currentSearchName, currentSearchClass } = this.state;

    const currentSearchList = this.combineFilter(currentLessonStudent);

    const currentClassList =
      currentLessonStudent.length > 0
        ? Array.from(new Set(currentLessonStudent.map(item => item.ClassId)))
        : [];

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.extraContentItem}>
          <span>课程: </span>
          <Select
            className={styles.extraContentForm}
            placeholder="请选择课程"
            onChange={this.handleLessonChange}
          >
            {selfLessonList.map(item => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.Name}
                </Option>
              );
            })}
          </Select>
        </div>
        {currentClassList.length > 0 && (
          <div className={styles.extraContentItem}>
            <span>班级: </span>
            <Select
              className={styles.extraContentForm}
              placeholder="请选择班级"
              value={classById[currentSearchClass] && classById[currentSearchClass].Name}
              onChange={this.handleClassChange}
            >
              {currentClassList.map(item => {
                return (
                  <Option value={item} key={item}>
                    {classById[item].Name}
                  </Option>
                );
              })}
            </Select>
          </div>
        )}
        <div className={styles.extraContentItem}>
          <span>姓名: </span>
          <Input
            value={currentSearchName}
            className={styles.extraContentForm}
            placeholder="请输入"
            onChange={this.handleNameSearch}
          />
        </div>
        <div className={styles.extraContentItem} style={{ width: '80px', cursor: 'pointer' }}>
          <Button type="primary" onClick={this.handleReset}>
            重置
          </Button>
        </div>
      </div>
    );

    const paginationProps = {
      showQuickJumper: true,
      pageSize: 10,
      total: currentSearchList.length,
    };

    const ListContent = props => {
      const { ClassId, StudentLessons } = props.data;
      const { LessonId } = StudentLessons;
      return (
        <div className={styles.listContent}>
          <div className={styles.listContentItem}>
            <span>所在班级</span>
            <p>{classById[ClassId] && classById[ClassId].Name}</p>
          </div>
          <div className={styles.listContentItem}>
            <span>课程</span>
            <p>{selfLessonById[LessonId] && selfLessonById[LessonId].Name}</p>
          </div>
        </div>
      );
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
                const { Name, StudentLessons } = item;
                const { Score } = StudentLessons;
                const ActionNode = <a>{Score || 0}</a>;
                const index = Name.indexOf(currentSearchName);
                const beforeStr = Name.substr(0, index);
                const afterStr = Name.substr(index + currentSearchName.length);
                const studentName =
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
                    <List.Item.Meta title="学生姓名" description={studentName} />
                    <ListContent data={item} />
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

export default TeacherSearch;
