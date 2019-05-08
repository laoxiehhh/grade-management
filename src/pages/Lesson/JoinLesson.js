import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { List, Card, Radio, Input, Divider, Modal, Form } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './JoinLesson.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ lesson, loading, user, global }) => ({
  ...lesson,
  ...user,
  assessmentCategoryList: global.assessmentCategoryList,
  loading: loading.models.lesson,
}))
@Form.create()
class JoinLesson extends PureComponent {
  state = {
    currentSearchMode: 'all', // 默认为全部
    currentSearchValue: '',
  };

  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'lesson/getAllLessons',
    });
    dispatch({
      type: 'lesson/getAccessToLessons',
      payload: {
        studentId: currentUser.id,
      },
    });
    dispatch({
      type: 'lesson/getSelfLessons',
    });
  }

  handleLessonJoin = value => {
    const { id } = value;
    const { dispatch, currentUser } = this.props;
    Modal.confirm({
      title: '确定要加入这个课程吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'lesson/joinLesson',
          payload: {
            StudentId: currentUser.id,
            LessonId: id,
          },
        });
      },
    });
  };

  handleSearchRadioChange = e => {
    const { value } = e.target;
    this.setState({
      currentSearchMode: value,
    });
  };

  handleSearch = value => {
    this.setState({
      currentSearchValue: value,
    });
  };

  render() {
    const { loading, accessToLessonList, assessmentCategoryList, lessonList } = this.props;
    const { currentSearchMode, currentSearchValue } = this.state;

    let currentSearchLessonList = [];
    if (currentSearchMode === 'all') {
      currentSearchLessonList = lessonList;
    } else if (currentSearchMode === 'progress') {
      currentSearchLessonList = lessonList.filter(item =>
        accessToLessonList.some(i => i.LessonId === item.id && i.Status === 0)
      );
    } else if (currentSearchMode === 'hasJoin') {
      currentSearchLessonList = lessonList.filter(item =>
        accessToLessonList.some(i => i.LessonId === item.id && i.Status === 1)
      );
    }
    currentSearchLessonList = currentSearchLessonList.filter(
      item => item.Name.indexOf(currentSearchValue) !== -1
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all" onChange={this.handleSearchRadioChange}>
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">待审核</RadioButton>
          <RadioButton value="hasJoin">已加入</RadioButton>
        </RadioGroup>
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
      total: currentSearchLessonList.length,
    };

    const assessmentCategoryMap = assessmentCategoryList.reduce((pre, cur) => {
      return {
        ...pre,
        [cur.id]: cur.Name,
      };
    }, {});

    const ListContent = ({ data: { Profession, Teacher, Assessments } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem} style={{ width: '500px' }}>
          <span>考核方式</span>
          <div>
            {Assessments.map((item, index) => {
              return (
                <span key={item.id}>
                  {assessmentCategoryMap[item.AssessmentCategoryId]}: {item.Proportion}%
                  {index !== Assessments.length - 1 && <Divider type="vertical" />}
                </span>
              );
            })}
          </div>
        </div>
        <div className={styles.listContentItem}>
          <span>专业</span>
          <p>{Profession.Name}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>老师</span>
          <p>{Teacher.Name}</p>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="标准列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={currentSearchLessonList}
              renderItem={item => {
                const { id } = item;
                const JoinBtn = (
                  <a onClick={() => this.handleLessonJoin(item)}>&nbsp;&nbsp;&nbsp;加入</a>
                );
                const Waiting = (
                  <a style={{ color: 'rgba(0,0,0,0.65)', cursor: 'not-allowed' }}>待审核</a>
                );
                const HasJoin = (
                  <a style={{ color: 'rgba(0,0,0,0.65)', cursor: 'not-allowed' }}>已加入</a>
                );
                let ActionNode;
                if (accessToLessonList.some(i => i.LessonId === id && i.Status === 0)) {
                  ActionNode = Waiting;
                } else if (accessToLessonList.some(i => i.LessonId === id && i.Status === 1)) {
                  ActionNode = HasJoin;
                } else {
                  ActionNode = JoinBtn;
                }
                const index = item.Name.indexOf(currentSearchValue);
                const beforeStr = item.Name.substr(0, index);
                const afterStr = item.Name.substr(index + currentSearchValue.length);
                const title =
                  index > -1 ? (
                    <span>
                      {beforeStr}
                      <span style={{ color: '#f50' }}>{currentSearchValue}</span>
                      {afterStr}
                    </span>
                  ) : (
                    <span>{item.Name}</span>
                  );
                return (
                  <List.Item actions={[ActionNode]}>
                    <List.Item.Meta title={title} description={item.Desc} />
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

export default JoinLesson;
