import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List } from 'antd';
import router from 'umi/router';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TeacherLesson.less';

@connect(({ lesson, loading, user }) => ({
  ...lesson,
  ...user,
  loading: loading.models.lesson,
}))
class TeacherLesson extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'lesson/getSelfLessons',
    });
  }

  handleAccessClick = value => {
    const { id } = value;
    router.push(`/lesson/access/${id}`);
  };

  handleTaskClick = value => {
    const { id } = value;
    router.push(`/lesson/${id}/task`);
  };

  render() {
    const { selfLessonList, loading } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>我的课程：教师所任课的课程, 可进行申请加入课程审批、课程任务布置</p>
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
      <PageHeaderWrapper title="我的课程" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...selfLessonList]}
            renderItem={item => {
              const Action1 = <a onClick={() => this.handleAccessClick(item)}>课程审批</a>;
              const Action2 = <a onClick={() => this.handleTaskClick(item)}>课程任务</a>;
              return (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card} actions={[Action1, Action2]}>
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

export default TeacherLesson;
