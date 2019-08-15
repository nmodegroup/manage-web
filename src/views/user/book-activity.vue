<template>
  <div>
    <div class="header-bar">
        <Input v-model="value" placeholder="输入用户手机号/活动主题/酒吧名称" search style="width:200px;"/>
        <span class="seach-lable">预定日期：</span>
        <DatePicker type="daterange" placement="bottom-end" placeholder="请选择预定日期" style="width: 200px"></DatePicker>
    </div>
    <Table stripe :columns="columns1" :data="data1"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="100" show-total  style=""/>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: '',
      columns1: [
          {
            title: '微信昵称',
            key: 'nickName'
          },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '酒吧名称',
            key: 'name'
          },
          {
            title: '预定日期',
            key: 'createTime'
          },
          {
            title: '活动时间',
            keyL: 'remindPhone'
          },
          {
            title: '主题活动',
            key: 'theme'
          }
      ],
      data1: [
          {}
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
