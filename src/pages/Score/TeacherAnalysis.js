import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const ScoreCard = React.lazy(() => import('./ScoreCard'));

@connect(({ score, loading, lesson }) => ({
  selfLessonById: lesson.selfLessonById,
  ...score,
  loading: loading.models.score || loading.models.lesson,
}))
class TeacherAnalysis extends Component {
  state = {
    loading: true,
    currentIndex: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'score/getTeacherAllLessonScore',
      });
    });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 500);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.reqRef);
  }

  handleLessonChange = value => {
    const { currentTeacherLessonScoreById } = this.props;
    const currentIndex = Object.keys(currentTeacherLessonScoreById).indexOf(value);
    this.setState({
      currentIndex,
    });
  };

  render() {
    const { loading: stateLoading, currentIndex } = this.state;
    const {
      currentTeacherLessonScore,
      loading: propsLoading,
      currentTeacherLessonScoreById,
    } = this.props;
    const loading = stateLoading || propsLoading;

    const scoreData =
      currentTeacherLessonScoreById[Object.keys(currentTeacherLessonScoreById)[currentIndex]];
    return (
      <GridContent>
        <Suspense fallback={null}>
          <ScoreCard
            scoreData={currentTeacherLessonScore}
            loading={loading}
            title="各课程学生平均平时成绩"
            rankingTitle="各课程学生平均平时成绩排名"
            showExtra={false}
          />
        </Suspense>
        {Object.keys(currentTeacherLessonScoreById).length > 0 && (
          <Suspense fallback={null}>
            <ScoreCard
              scoreData={scoreData}
              loading={loading}
              title="课程各班级平均平时成绩"
              rankingTitle="课程班级平均平时成绩排名"
              showExtra
              handleLessonChange={this.handleLessonChange}
            />
          </Suspense>
        )}
      </GridContent>
    );
  }
}

export default TeacherAnalysis;
