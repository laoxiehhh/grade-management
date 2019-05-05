import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Form, Input, Button, Select, Radio } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect(({ user, loading, global }) => ({
  user,
  ...global,
  submitting: loading.effects['user/register'],
}))
@Form.create()
class Register extends PureComponent {
  state = {
    prefix: '86',
    confirmDirty: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getProfessions',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'user/register',
          payload: values,
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

  handleProfessionChange = value => {
    const { form, dispatch } = this.props;
    const { getFieldValue, resetFields } = form;
    const typeValue = getFieldValue('Type');
    if (typeValue === 1) {
      resetFields(['ClassId']);
      dispatch({
        type: 'global/getClasses',
        payload: { ProfessionId: value },
      });
    }
  };

  handleTypeChange = () => {
    const { form } = this.props;
    const { resetFields } = form;
    resetFields(['ProfessionId', 'ClassId']);
  };

  render() {
    const { form, professionList, classList } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { prefix } = this.state;
    const typeValue = getFieldValue('Type');
    const professionId = getFieldValue('ProfessionId');
    return (
      <div className={styles.main}>
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('Type', {
              initialValue: 1,
            })(
              <RadioGroup size="large" onChange={this.handleTypeChange}>
                <Radio value={1}>学生</Radio>
                <Radio value={2}>老师</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: '请填写你的真实姓名' }],
            })(<Input size="large" placeholder="姓名" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Username', {
              rules: [{ required: true, message: '请填写你的登录账号' }],
            })(<Input size="large" placeholder="账号" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Password', {
              rules: [{ validator: this.checkPassword }],
            })(
              <Input
                size="large"
                type="password"
                placeholder="请输入不少于6位长度的密码，区分大小写"
              />
            )}
          </FormItem>
          <FormItem>
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
          <FormItem>
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
              })(<Input size="large" style={{ width: '80%' }} placeholder="手机号" />)}
            </InputGroup>
          </FormItem>
          <FormItem>
            {getFieldDecorator('Gender', {
              rules: [{ required: true, message: '请选择性别' }],
            })(
              <Select placeholder="性别" size="large">
                <Option value={1}>男</Option>
                <Option value={2}>女</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('ProfessionId', {
              rules: [{ required: true, message: '请选择专业' }],
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
          {typeValue === 1 && professionId && (
            <FormItem>
              {getFieldDecorator('ClassId', {
                rules: [{ required: true, message: '请选择班级' }],
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
          <FormItem>
            <Button size="large" className={styles.submit} type="primary" htmlType="submit">
              注册
            </Button>
            <Link className={styles.login} to="/User/Login">
              使用已有的账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
