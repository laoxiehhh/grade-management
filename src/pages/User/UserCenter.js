import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Form, Input, Button, Select } from 'antd';
import { connect } from 'dva';
import styles from './UserCenter.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;

@connect(({ global, loading, user }) => ({
  ...global,
  ...user,
  submitting: loading.effects['user/modUserInfo'],
}))
@Form.create()
class UserCenter extends PureComponent {
  state = {
    prefix: '86',
    isProfessionChange: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getProfessions',
    });
    dispatch({
      type: 'user/getUserInfo',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'user/modUserInfo',
          payload: values,
        });
      }
    });
  };

  handleProfessionChange = value => {
    const { dispatch } = this.props;
    this.setState({
      isProfessionChange: true,
    });
    dispatch({
      type: 'global/getClasses',
      payload: { ProfessionId: value },
    });
  };

  render() {
    const { prefix, isProfessionChange } = this.state;
    const { form, submitting, professionList, userInfo, classList } = this.props;
    const { getFieldDecorator } = form;
    const { Name, Username, Telephone, ProfessionId, ClassId } = userInfo;
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
      <PageHeaderWrapper title="个人信息" content="可修改个人信息">
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('Name', {
                rules: [{ required: true, message: '请填写你的真实姓名' }],
                initialValue: Name,
              })(<Input size="large" placeholder="姓名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="账号">
              {getFieldDecorator('Username', {
                rules: [{ required: true, message: '请填写你的登录账号' }],
                initialValue: Username,
              })(<Input size="large" placeholder="账号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="电话">
              <InputGroup compact>
                <Select
                  size="large"
                  value={prefix}
                  onChange={this.changePrefix}
                  style={{ width: '20%' }}
                >
                  <Option value="86">+86</Option>
                  <Option value="87">+87</Option>
                </Select>
                {getFieldDecorator('Telephone', {
                  rules: [
                    {
                      required: true,
                      message: '请填写你的电话号码',
                    },
                    {
                      pattern: /^\d{11}$/,
                      message: '请填写正确的电话号码',
                    },
                  ],
                  initialValue: Telephone,
                })(<Input size="large" style={{ width: '80%' }} placeholder="手机号" />)}
              </InputGroup>
            </FormItem>

            <FormItem {...formItemLayout} label="专业">
              {getFieldDecorator('ProfessionId', {
                rules: [{ required: true, message: '请选择专业' }],
                initialValue: ProfessionId,
              })(
                <Select placeholder="专业" size="large" onChange={this.handleProfessionChange}>
                  {professionList.map(profession => {
                    return (
                      <Option value={profession.id} key={profession.id}>
                        {profession.Name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            {ClassId && (
              <FormItem {...formItemLayout} label="班级">
                {getFieldDecorator('ClassId', {
                  rules: [{ required: true, message: '请选择班级' }],
                  initialValue: isProfessionChange ? '' : ClassId,
                })(
                  <Select placeholder="班级" size="large">
                    {classList.map(c => {
                      return (
                        <Option value={c.id} key={c.id}>
                          {c.Name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            )}
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

export default UserCenter;
