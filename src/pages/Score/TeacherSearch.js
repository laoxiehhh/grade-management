import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TeacherSearch.less';

@connect(({ lesson, loading, user }) => ({
  ...lesson,
  ...user,
  loading: loading.models.lesson,
}))
class TeacherSearch extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'lesson/getSelfLessons',
    });
  }

  render() {
    const { selfLessonList, loading } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>可查询自己所任课的课程的所有学生当前的平时成绩情况</p>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    return (
      <PageHeaderWrapper title="成绩查询" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...selfLessonList]}
            renderItem={item => {
              return (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card}>
                    <Card.Meta
                      title={<a>{item.Name}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.Desc}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default TeacherSearch;
