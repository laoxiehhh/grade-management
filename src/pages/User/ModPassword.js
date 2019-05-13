import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from './UserCenter.less';

const FormItem = Form.Item;

@connect(({ global, loading, user }) => ({
  ...global,
  ...user,
  submitting: loading.effects['global/createProfession'],
}))
@Form.create()
class ModPassword extends PureComponent {
  state = {
    confirmDirty: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserInfo',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        // eslint-disable-next-line camelcase
        const { Password, Old_Password } = values;
        dispatch({
          type: 'user/modUserPassword',
          payload: { Password, Old_Password },
        });
        form.resetFields();
      }
    });
  };

  checkPassword = (rule, value, callback) => {
    const { confirmDirty } = this.state;
    if (!value) {
      callback('请输入密码！');
    } else if (value.length < 6) {
      callback('请输入不少于6位长度的密码！');
    } else {
      const { form } = this.props;
      if (value && confirmDirty) {
        form.validateFields(['Confirm_Password'], { force: true });
      }
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('Password')) {
      callback('两次输入的密码不匹配！');
    } else {
      callback();
    }
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
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
      <PageHeaderWrapper title="修改密码" content="可修改个人密码">
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="旧密码">
              {getFieldDecorator('Old_Password', {
                rules: [{ required: true, message: '请输入旧密码！' }],
              })(<Input size="large" type="password" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('Password', {
                rules: [{ validator: this.checkPassword }, { required: true }],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder="请输入不少于6位长度的密码，区分大小写"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="确认新密码">
              {getFieldDecorator('Confirm_Password', {
                rules: [
                  { required: true, message: '请重复第一次输入的密码' },
                  { validator: this.checkConfirm },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder="确认密码"
                  onBlur={this.handleConfirmBlur}
                />
              )}
            </FormItem>
            <FormItem {...buttonLayout}>
              <Button
                size="large"
                className={styles.submit}
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                修改
              </Button>
            </FormItem>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ModPassword;
