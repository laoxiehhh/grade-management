import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ global, loading }) => ({
  global,
  submitting: loading.effects['global/createAssessmentCategory'],
}))
@Form.create()
class AssessmentCategory extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'global/createAssessmentCategory',
          payload: values,
        });
        form.resetFields();
      }
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };
    const buttonLayout = {
      wrapperCol: { span: 18, offset: 6 },
    };
    return (
      <PageHeaderWrapper title="创建考核类别" content="为系统创建考核类别，供教师选择">
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="考核类别名称" {...formItemLayout}>
              {getFieldDecorator('Name', {
                rules: [{ required: true, message: '请输入考核类别名称' }],
              })(<Input size="large" placeholder="考核类别名称" />)}
            </FormItem>
            <FormItem label="考核类别描述" {...formItemLayout}>
              {getFieldDecorator('Desc', {})(
                <TextArea style={{ minHeight: 32 }} placeholder="考核类别描述" rows={4} />
              )}
            </FormItem>
            <FormItem {...buttonLayout}>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className={styles.submit}
                loading={submitting}
              >
                创建
              </Button>
            </FormItem>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default AssessmentCategory;
