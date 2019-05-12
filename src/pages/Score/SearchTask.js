import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { List, Card, Input, Form } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SearchTask.less';

const { Search } = Input;

@connect(({ lesson, loading, global, score }) => ({
  ...lesson,
  ...score,
  assessmentCategoryList: global.assessmentCategoryList,
  loading: loading.models.lesson,
}))
@Form.create()
class SearchTask extends PureComponent {
  state = {
    currentSearchValue: '',
  };

  componentDidMount() {
    const { location, dispatch } = this.props;
    dispatch({
      type: 'score/getTaskScore',
      payload: { ...location.query },
    });
  }

  handleSearch = value => {
    this.setState({
      currentSearchValue: value,
    });
  };

  render() {
    const { loading, lessonById, match, assessmentCategoryList, currentLessonTask } = this.props;
    const { currentSearchValue } = this.state;

    let currentSearchList = [];
    currentSearchList = currentLessonTask.filter(
      item => item.Name.indexOf(currentSearchValue) !== -1
    );

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
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={currentSearchList}
              renderItem={item => {
                const { Name, Desc, StudentTasks } = item;
                const ActionNode = <a>{StudentTasks.Score}</a>;
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
      </PageHeaderWrapper>
    );
  }
}

export default SearchTask;
