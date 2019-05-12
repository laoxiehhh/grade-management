import React, { PureComponent } from 'react';
import { Row, Col, Card, Select } from 'antd';
import { connect } from 'dva';
import styles from './StudentAnalysis.less';
import { Bar } from '@/components/Charts';

const { Option } = Select;

@connect(({ score, lesson }) => ({
  ...score,
  selfLessonById: lesson.selfLessonById,
}))
class ScoreCard extends PureComponent {
  render() {
    const {
      scoreData,
      loading,
      title,
      rankingTitle,
      showExtra,
      selfLessonById,
      currentTeacherLessonScoreById,
      handleLessonChange,
    } = this.props;

    const extraContent = (
      <Select
        style={{ width: '230px' }}
        defaultValue={Object.keys(currentTeacherLessonScoreById)[0]}
        onChange={handleLessonChange}
      >
        {Object.keys(currentTeacherLessonScoreById).map(item => {
          return (
            <Option value={item} key={item}>
              {selfLessonById[item] && selfLessonById[item].Name}
            </Option>
          );
        })}
      </Select>
    );

    return (
      <Card
        loading={loading}
        bordered={false}
        bodyStyle={{ padding: 0 }}
        title={title}
        extra={showExtra ? extraContent : <div />}
      >
        <div className={styles.salesCard}>
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar height={295} title="分数" data={scoreData} />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>{rankingTitle}</h4>
                <ul className={styles.rankingList}>
                  {scoreData
                    .sort((a, b) => a.y - b.y > 0)
                    .map((item, i) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={i}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.title}>
                          {item.x}
                        </span>
                        <span className={styles.rankingItemValue}>{item.y}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    );
  }
}

export default ScoreCard;
