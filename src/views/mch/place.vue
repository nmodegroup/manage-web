<template>
  <div>
    <div class="header-bar">
      <Input v-model="query.queryStr" placeholder="输入商家名称/手机号搜" search style="width:200px;"/>
      <Button type="primary" style="margin-left:20px;" @click="onSerach">搜索</Button>
      <Button  @click="onReset">重置</Button>
    </div>
    <Table stripe :columns="columns1" :data="list" height="450"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="dataCount" border show-total :current="startRow" :page-size="query.pageSize" @on-change="changepage"/>
    </div>
    <Modal v-model="showTableList" :closable="false" width="420">
      <div class="info-content">
        <div class="info-type" v-for="(info, idx) in infoList" :key="idx">
          <div class="info-header-bar">
            <div calss="info-title">{{info.name}}</div>
          </div>
          <div class="info-body" v-for="(item, index) in info.tables" :key="index">
            <div class="info-grid" >
              <div>{{item.name}}</div>
              <div>{{item.num}}人</div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="onKnow">我知道了</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {get_table_list, get_table_info} from "@/api/mch"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: '',//商家名称或手机号
        id: this.$route.params.id
      },
      showTableList: false,//显示桌位图
      dataCount: 0,//列表条数
      startRow: 1, // 当前页面
      list: [],//用户桌位列表
      infoList: [],//桌位图列表
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
              title: '商家名称',
              key: 'name'
          },
          {
              title: '活动区域',
              key: 'area'
          },
          {
              title: '详细地址',
              key: 'address'
          },
          {
              title: '桌位数量',
              key: 'num'
          },
          {
            title: '操作',
            render: (h,params) => {
              return h('a',{
                props: {
                  href: "javascript:void(0)"
                },
                on: {
                  click: () => {
                    let data = {
                      id: params.row.id
                    }
                    this.showTableList = true
                    this.getTableInfo(data)
                  }
                }
              }, '查看桌位图')
            }
          }
      ]
    }
  },
  methods: {
    getTableList() {
      get_table_list(this.query).then(res => {
        this.list = res.data.list
        this.dataCount = res.data.totalSize
      }).catch(error => {

      })
    },
    getTableInfo (data) {
      get_table_info(data).then(res => {
        this.infoList = res.data
      })
    },
    //点击我知道了弹框
    onKnow ()  {
      this.showTableList = false
    },
    // 页码改变
    changepage(index) {
      this.query.pageNum = index;
      this.startRow =  index
      this.getTableList()
    },
     // 搜索按钮事件
    onSerach() {
      this.query.pageNum = 1
      this.query.id = ''
      this.startRow = 1
      this.getTableList()
    },
    // 重置按钮事件
    onReset() {
      this.query.id = ''
      this.query.queryStr = ''
      this.query.pageNum = 1
      this.startRow = 1
      this.getTableList()
    },
  },
  mounted () {
    this.getTableList()
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
<style  scoped>
  .info-content {
    padding: 14px 20px 0;
    width:100%;
  }
  .info-type {
    padding-bottom: 30px;
  }
  .info-header-bar{
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    font-size: 15px;
  }
  .info-title {
    color:rgba(0, 0, 0, .8);
    font-size: 15px;
  }
  .info-body {
    display: flex;
    flex-wrap:wrap;
  }
  .info-grid {
    width:50px;
    height: 50px;
    border-radius: 4px;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    margin-right: 9px;
    margin-bottom: 9px;
    border: 1px solid rgba(58, 124, 221, 1);
  }
  .info-grid:nth-child(6n) {
    margin-right: 0;
  }
  .info-grid> div{
    height: 24px;
    line-height: 24px;
  }
</style>
