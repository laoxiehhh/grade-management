import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Form, Input, Button, Select } from 'antd';
import { connect } from 'dva';
import styles from './CreateLesson.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ global, loading, user }) => ({
  currentUser: user.currentUser,
  professionList: global.professionList,
  submitting: loading.effects['lesson/createLesson'],
}))
@Form.create()
class CreateLesson extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, currentUser } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'lesson/createLesson',
          payload: {
            ...values,
            TeacherId: currentUser.id,
          },
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
      <PageHeaderWrapper title="创建课程" content="创建自己任课的课程，可供学生选课">
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="课程名称" {...formItemLayout}>
              {getFieldDecorator('Name', {
                rules: [{ required: true, message: '请输入课程名称' }],
              })(<Input size="large" placeholder="课程名称" />)}
            </FormItem>
            <FormItem label="课程描述" {...formItemLayout}>
              {getFieldDecorator('Desc', {})(
                <TextArea style={{ minHeight: 32 }} placeholder="课程描述" rows={4} />
              )}
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

export default CreateLesson;
