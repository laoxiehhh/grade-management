import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { List, Card, Radio, Input, Modal, Form, Row, Col } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './JoinLesson.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ lesson, loading, user, global }) => ({
  ...lesson,
  ...user,
  assessmentCategoryList: global.assessmentCategoryList,
  professionById: global.professionById,
  loading: loading.models.lesson,
}))
@Form.create()
class AccessToLesson extends PureComponent {
  state = {
    currentSearchMode: 'all', // 默认为全部
    currentSearchValue: '',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'lesson/getAllLessons',
    });
    dispatch({
      type: 'lesson/getAccessToLessonsByLessonId',
      payload: {
        lessonId: match.params.lessonId,
      },
    });
    dispatch({
      type: 'lesson/getAllClasses',
    });
  }

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

  handleStudentAccess = value => {
    const { id } = value;
    const { dispatch, match } = this.props;
    Modal.confirm({
      title: '确定批准该学生加入此课程吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'lesson/accessToLesson',
          payload: {
            lessonId: match.params.lessonId,
            Status: 1,
            accessToLessonId: id,
          },
        });
      },
    });
  };

  render() {
    const {
      loading,
      accessToLessonListFormLesson,
      match,
      lessonById,
      professionById,
      classById,
    } = this.props;
    const { currentSearchMode, currentSearchValue } = this.state;

    let currentSearchList = [];
    if (currentSearchMode === 'all') {
      currentSearchList = accessToLessonListFormLesson;
    } else if (currentSearchMode === 'progress') {
      currentSearchList = accessToLessonListFormLesson.filter(item => item.Status === 0);
    } else if (currentSearchMode === 'hasDone') {
      currentSearchList = accessToLessonListFormLesson.filter(item => item.Status !== 0);
    }
    currentSearchList = currentSearchList.filter(
      item => item.Student.Name.indexOf(currentSearchValue) !== -1
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all" onChange={this.handleSearchRadioChange}>
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">未处理</RadioButton>
          <RadioButton value="hasDone">已处理</RadioButton>
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
      total: accessToLessonListFormLesson.length,
    };

    const ListContent = ({ data: { Student, createdAt } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>所在班级</span>
          <p>{classById[Student.ClassId] && classById[Student.ClassId].Name}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>所在专业</span>
          <p>{professionById[Student.ProfessionId] && professionById[Student.ProfessionId].Name}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>申请时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    );

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info
                  title="全部申请"
                  value={`${accessToLessonListFormLesson.length}个申请`}
                  bordered
                />
              </Col>
              <Col sm={8} xs={24}>
                <Info
                  title="未处理"
                  value={`${
                    accessToLessonListFormLesson.filter(item => item.Status === 0).length
                  }个申请`}
                  bordered
                />
              </Col>
              <Col sm={8} xs={24}>
                <Info
                  title="已处理"
                  value={`${
                    accessToLessonListFormLesson.filter(item => item.Status !== 0).length
                  }个申请`}
                />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title={lessonById[match.params.lessonId] && lessonById[match.params.lessonId].Name}
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
                const { Student, Status } = item;
                const Access = <a onClick={() => this.handleStudentAccess(item)}>批准通过</a>;
                const HasAccess = (
                  <a style={{ color: 'rgba(0,0,0,0.65)', cursor: 'not-allowed' }}>已加入</a>
                );
                const ActionNode = Status === 0 ? Access : HasAccess;
                const index = Student.Name.indexOf(currentSearchValue);
                const beforeStr = Student.Name.substr(0, index);
                const afterStr = Student.Name.substr(index + currentSearchValue.length);
                const Name =
                  index > -1 ? (
                    <span>
                      {beforeStr}
                      <span style={{ color: '#f50' }}>{currentSearchValue}</span>
                      {afterStr}
                    </span>
                  ) : (
                    <span>{Student.Name}</span>
                  );
                return (
                  <List.Item actions={[ActionNode]}>
                    <List.Item.Meta title="申请人" description={Name} />
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

export default AccessToLesson;
