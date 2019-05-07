import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './MyLesson.less';

@connect(({ lesson, loading, user }) => ({
  ...lesson,
  ...user,
  loading: loading.models.lesson,
}))
class MyLesson extends PureComponent {
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
            renderItem={item => (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card} actions={[<a>操作一</a>, <a>操作二</a>]}>
                  <Card.Meta
                    // avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    title={<a>{item.Name}</a>}
                    description={
                      <Ellipsis className={styles.item} lines={3}>
                        {item.Desc}
                      </Ellipsis>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

// const ActionNode = (props) => {
//   return (
//     <a></a>
//   )
// }

export default MyLesson;
