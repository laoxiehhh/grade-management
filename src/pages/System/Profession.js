import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ global, loading }) => ({
  global,
  submitting: loading.effects['global/createProfession'],
}))
@Form.create()
class Profession extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'global/createProfession',
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
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };
    const buttonLayout = {
      wrapperCol: { span: 20, offset: 4 },
    };
    return (
      <PageHeaderWrapper title="创建专业" content="为系统创建专业，供师生选择">
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="专业名称" {...formItemLayout}>
              {getFieldDecorator('Name', {
                rules: [{ required: true, message: '请输入专业名称' }],
              })(<Input size="large" placeholder="专业名称" />)}
            </FormItem>
            <FormItem label="专业描述" {...formItemLayout}>
              {getFieldDecorator('Desc', {})(
                <TextArea style={{ minHeight: 32 }} placeholder="专业描述" rows={4} />
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

export default Profession;
