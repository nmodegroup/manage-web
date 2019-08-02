<template>
  <div>
    <Row justify="center" align="middle" :gutter="10" style="margin-bottom:20px;">
        <Col span="4">
            <Input v-model="value" placeholder="输入用户昵称/手机号搜" search style="width:200px;"/>
        </Col>
        <Col span="6">
            注册日期：<DatePicker type="daterange" :start-date="new Date(1991, 4, 14)" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
        </Col>
    </Row>
    <Table stripe :columns="columns1" :data="data1"></Table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: '',
      columns1: [
          {
              title: 'Name',
              key: 'name'
          },
          {
              title: 'Age',
              key: 'age'
          },
          {
              title: 'Address',
              key: 'address'
          }
      ],
      data1: [
          {
              name: 'John Brown',
              age: 18,
              address: 'New York No. 1 Lake Park',
              date: '2016-10-03'
          },
          {
              name: 'Jim Green',
              age: 24,
              address: 'London No. 1 Lake Park',
              date: '2016-10-01'
          },
          {
              name: 'Joe Black',
              age: 30,
              address: 'Sydney No. 1 Lake Park',
              date: '2016-10-02'
          },
          {
              name: 'Jon Snow',
              age: 26,
              address: 'Ottawa No. 2 Lake Park',
              date: '2016-10-04'
          }
      ]
    }
  },
  methods: {
  },
  beforeCreate () {
  },
  created () {
    
  },
  activated () {
  }
}
</script>
