<template>
  <div>
    <div class="header-bar">顶部banner图管理</div>
    <div class="index-body">
      <div class="banner-item">
        <Upload action="//jsonplaceholder.typicode.com/posts/">
          <div class="banner-img">
            <div class="banner-add">
              <img src="../../../static/img/icon_add.png">
              <div class="banner-add-tips">点击添加图片</div>
            </div>
          </div>
        </Upload>
        <div class="banner-btn-frame">
          <div class="bnt-join">
            <span>跳转关联</span> 
          </div>
          <div class="toggle-frame">
            <Switch v-model="switch1" @on-change="change" />
          </div>
        </div>
      </div>
    </div>
    <div class="header-bar" style="padding-top: 20px;">人气酒吧管理</div>
    <div class="index-body">
      <div class="bar-item">
        <div class="bar-header">
          <div class="bar-header-r">
            <img class="bar-cover" src="../../../static/img/icon_add.png">
            <div class="bar-content">
              <div class="bar-name">JUNGLE BAR</div>
              <div class="bar-time">
                <img src="../../../static/img/icon_location.png">
                20:00-2:00
              </div>
              <div class="bar-address">
                <img src="../../../static/img/icon_location.png">
                深圳保利文化广场F3层
              </div>
            </div>
          </div>
          <div class="bar-header-l">
            <div class="btn-tips">餐吧</div>
          </div>
        </div>
        <div class="bar-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {get_auth_list} from "@/api/mch"
export default {
  data () {
    return {
      switch1: false
    }
  },
  methods: {
    getAuthList() {
      get_auth_list(this.query).then(res => {
        console.log(res)
      }).catch(error => {

      })
    },
    change (status) {
      this.$Message.info('开关状态：' + status);
    }
  },
  mounted () {
    this.getAuthList()
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
<style scoped>
  .index-body {
    display: flex;
  }
  .banner-item{
    width:368px;
    height:319px;
    background:rgba(248, 248, 251, 1);
    border-radius:10px;
    margin-right: 30px;
    padding:10px;
  }
  .banner-img {
    height: 218px;
    border-radius:4px;
    border:1px dashed rgba(0,0,0,.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .banner-add{
    cursor: pointer;
  }
  .banner-btn-frame{
    padding-top:7px;
    padding-bottom: 5px;
    display: flex;
  }
  .bnt-join{
    width:255px;
    height: 60px;
    background:rgba(58,124,221,1);
    border-radius:4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bnt-join span{
    padding-right:11px;
    color:rgba(248, 248, 251, 1);
    font-size: 14px;
    position: relative;
  }
  .bnt-join span::after{
    content: '';
    position:absolute;
    right:0;
    top:0;
    bottom:0;
    width:8px;
    height: 8px;
    margin: auto;
    border:1px solid transparent;
    border-top-color: rgba(248, 248, 251, 1);
    border-right-color: rgba(248, 248, 251, 1);
    transform: rotate(45deg)
  }
  .bar-header{
    display: flex;
    padding:16px 11px;
  }
  .bar-header-r{
    display: flex;
  }
  .bar-cover {
    width:104px;
    height:80px;
    border-radius:4px;
  }
  .bar-content {
    padding-left: 8px;
  }
  .bar-name {
    color:rgba(0, 0, 0, 1);
    font-size: 17px;
    padding-bottom: 15px;
  }
  .bar-time{
    display: flex;
    color:rgba(0, 0, 0, .5);
    font-size: 13px;
    padding-bottom: 6px;
  }
  .bar-address {
    display: flex;
    color:rgba(0, 0, 0, .5);
    font-size: 13px;
  }
</style>
