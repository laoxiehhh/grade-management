import React, { PureComponent, Fragment } from 'react';
import { Table, message, Divider, InputNumber } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './Table.less';

class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(value, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.Score) {
        message.error('请填写分数！');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const columns = [
      {
        title: '成员姓名',
        dataIndex: 'Name',
        key: 'name',
        width: '30%',
      },
      {
        title: '所在班级',
        dataIndex: 'Class',
        key: 'Class',
        width: '30%',
      },
      {
        title: '成绩',
        dataIndex: 'Score',
        key: 'Score',
        width: '30%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                value={text}
                onChange={value => this.handleFieldChange(value, 'Score', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="分数"
                min={0}
                max={100}
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    const paginationProps = {
      showQuickJumper: true,
      pageSize: 10,
      total: data.length,
    };

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={paginationProps}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
      </Fragment>
    );
  }
}

export default TableForm;
