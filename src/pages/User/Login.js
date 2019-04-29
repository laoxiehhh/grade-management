import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Form, Input, Button, Radio } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/login'],
}))
@Form.create()
class Login extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'user/login',
          payload: values,
        });
      }
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h3>登录</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('Type', {
              initialValue: 1,
            })(
              <RadioGroup size="large">
                <Radio value={1}>学生</Radio>
                <Radio value={2}>老师</Radio>
                <Radio value={3}>管理员</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Username', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(<Input size="large" placeholder="用户名" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(<Input size="large" type="password" placeholder="密码" />)}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              className={styles.submit}
              type="primary"
              htmlType="submit"
              loading={submitting}
            >
              登录
            </Button>
            <Link className={styles.login} to="/User/Login">
              没有账号？去注册
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Login;
