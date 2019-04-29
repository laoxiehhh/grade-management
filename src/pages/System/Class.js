import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Form, Input, Button, Select } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ global, loading }) => ({
  professionList: global.professionList,
  submitting: loading.effects['global/createClass'],
}))
@Form.create()
class Class extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'global/createClass',
          payload: values,
        });
        form.resetFields();
      }
    });
  };

  render() {
    const { form, submitting, professionList } = this.props;
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
      <PageHeaderWrapper title="创建班级" content="为系统的各专业创建班级，供学生选择">
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="班级名称" {...formItemLayout}>
              {getFieldDecorator('Name', {
                rules: [{ required: true, message: '请输入班级名称' }],
              })(<Input size="large" placeholder="班级名称" />)}
            </FormItem>
            <FormItem label="选择专业" {...formItemLayout}>
              {getFieldDecorator('ProfessionId', {
                rules: [{ required: true, message: '请选择专业' }],
              })(
                <Select placeholder="专业" size="large">
                  {professionList.map(profession => {
                    return (
                      <Option key={profession.id} value={profession.id}>
                        {profession.Name}
                      </Option>
                    );
                  })}
                </Select>
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

export default Class;
