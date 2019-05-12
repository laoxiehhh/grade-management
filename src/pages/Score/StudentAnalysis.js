import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const ScoreCard = React.lazy(() => import('./ScoreCard'));

@connect(({ score, loading }) => ({
  ...score,
  loading: loading.models.score || loading.models.lesson,
}))
class StudentAnalysis extends Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'score/getStudentAnalysisData',
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

  render() {
    const { loading: stateLoading } = this.state;
    const { studentAnalysisData, loading: propsLoading } = this.props;
    const loading = stateLoading || propsLoading;

    return (
      <GridContent>
        <Suspense fallback={null}>
          <ScoreCard
            scoreData={studentAnalysisData}
            loading={loading}
            title="各科成绩统计图"
            rankingTitle="各课程平时成绩排名"
          />
        </Suspense>
      </GridContent>
    );
  }
}

export default StudentAnalysis;
