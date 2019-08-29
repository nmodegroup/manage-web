<template>
  <div>
    <div class="header-bar">顶部banner图管理</div>
    <div class="index-body">
      <div class="banner-item" v-for="(banner, idx)  in bannerList" :key="idx">
        <Upload :action="action" :headers="headers" :show-upload-list="false"
        :on-success="handleSuccess" :data ="uploadForm"
        :before-upload="handleBeforeUpload"
        >
          <div class="banner-img-frame">
            <div class="banner-add" v-show="!banner.img">
              <img src="../../../static/img/icon_add.png">
              <div class="banner-add-tips">点击添加图片</div>
            </div>
            <img v-show="banner.img" class="banner-img" :src="staticURL(banner.img)" alt="">
          </div>
        </Upload>
        <div class="banner-btn-frame">
          <div class="bnt-join" @click="onJoin">
            <span :class="[banner.name ? '' : 'arrow']">{{banner.name ? banner.name : '跳转关联'}}</span> 
          </div>
          <i-switch v-model="banner.onStatus" @on-change="change" />
        </div>
      </div>
    </div>
    <div class="header-bar" style="padding-top: 20px;">人气酒吧管理</div>
    <div class="index-body">
      <div class="bar-item" v-for="(bar, index)  in barList" :key="index">
        <div class="bar-header">
          <div class="bar-header-r">
            <img class="bar-cover" :src="staticURL(bar.img)">
            <div class="bar-content">
              <div class="bar-name">{{bar.name}}</div>
              <div class="bar-time">
                <img class="icon-time" src="../../../static/img/icon_time.png">
                <span v-for="(time, idx) in bar.times" :key="idx">{{time}}</span>
              </div>
              <div class="bar-address">
                <img class="icon-adre" src="../../../static/img/icon_location.png">
                {{bar.address}}
              </div>
            </div>
          </div>
          <div class="bar-header-l">
            <div class="btn-tips">餐吧</div>
          </div>
        </div>
        <div class="bar-btn">
          <Button type="primary" @click="onSelMch(2)">替换</Button>
          <i-switch v-model="bar.onStatus" @on-change="change" />
        </div>
      </div>
    </div>
    <Modal
      v-model="joinModal"
      width="400"
      title="请选择banner关联活动或商家">
      <div class="join-btn-frame">
        <Button @click="onSelActivity">选择活动</Button>
        <Button @click="onSelMch(1)">选择商家</Button>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal
      v-model="mchModal"
      width="400"
      title="请选择一个商家">
      <div class="join-btn-frame">
        <RadioGroup v-model="bannerForm.objId">
          <div class="radio-item" v-for="item in list" :key="item.id"> 
            <Radio label="item.id">
              <span>{{item.name}}</span>
            </Radio>
          </div>
        </RadioGroup>
      </div>
    </Modal>
    <Modal
      v-model="activityModal"
      width="400"
      title="请选择一个活动 ">
      <div class="join-btn-frame">
        <RadioGroup v-model="bannerForm.objId">
          <div class="radio-item" v-for="item in list" :key="item.id"> 
            <Radio label="item.id">
              <span>{{item.name}}</span>
            </Radio>
          </div>
        </RadioGroup>
      </div>
    </Modal>
  </div>
</template>
<script>
import {get_homePage, get_mch_list, get_activity_list} from "@/api/index"
import constant from "../../constant.js"
export default {
  data () {
    return {
      switch1: false,
      joinModal: false,
      activityModal: false,
      mchModal: false,
      list: [],//活动、商家列表
      bannerForm: {
        id: '',//banner id，新增不传，修改必传
        img: '',//banner url
        objId: '',//商铺或活动id
        type: '',//关联类型（0商家 1活动）
        name: '',//酒吧名称或活动名称
        onStatus: '',//是否启用展示(0启用  1关闭)
        order: ''//排序 (数值越小越靠前)
      },
      barList: [],//酒吧列表
      bannerList: [],//banner图列表
      roleMch: '',//1:banner选择商家 2：人气酒吧选择商家
      action: '',//上传图片地址
      headers: {//设置上传请求头部
        token: ''
      },
      uploadForm: {//上传文件传的参数
        floder: 'web_image',//保存到的文件夹
        fileName: ''//带扩展的文件名
      }
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
    },
    //点击关联
    onJoin() {
      this.joinModal = true
    },
    //点击选择活动
    onSelActivity () {
      this.joinModal  = false
      this.activityModal = true
      this.getActivityList()
    },
    //点击选择商家
    onSelMch (value) {
      this.roleMch = value
      this.joinModal = false
      this.mchModal = true
      this.getMchList()
    },
    //获取首页信息
    getHomePage () {
      get_homePage().then(res => {
        let barList = res.data.bar
        let bannerList = res.data.banner
        if (bannerList.length < 4) {
          for (let i = bannerList.length + 1; i < 5; i++) {
            let form = {
                  id: '',//banner id，新增不传，修改必传
                  img: '',//banner url
                  objId: '',//商铺或活动id
                  type: '',//关联类型（0商家 1活动）
                  name: '',//酒吧名称或活动名称
                  onStatus: 0,//是否启用展示(0启用  1关闭)
                  order: i//排序 (数值越小越靠前)
                }
            bannerList.push(form)
          }
        }
       this.bannerList = bannerList
      }).then(error => {

      })
    },
    handleSuccess ( response, file, fileList) {
      console.log(file)
    },
    handleBeforeUpload (res) {
      this.uploadForm.fileName = res.name
    },
    //获取商家列表
    getMchList () {
      get_mch_list().then(res => {
        this.list = res.data
      }).catch(error => {

      })
    },
    //获取活动列表
    getActivityList () {
      get_activity_list().then(res => {
        this.list = res.data
      }).catch(error => {
        
      })
    },
    //设置上传文件地址
    setFileUrl () {
      this.action = constant.globalData.baseURL + '/common/upload'
    },
  },
  mounted () {
    this.getHomePage()
    this.setFileUrl()
    this.headers.token = localStorage.getItem("token") || ''
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
    overflow-x: auto;
    overflow-y: hidden;
  }
  .banner-item{
    width:368px;
    height:319px;
    background:rgba(248, 248, 251, 1);
    border-radius:10px;
    margin-right: 20px;
    padding:10px;
  }
  .banner-img-frame {
    height: 218px;
    border-radius:4px;
    border:1px dashed rgba(0,0,0,.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .banner-img{
    width:348px;
    height:218px;
  }
  .banner-add{
    cursor: pointer;
  } 
  .banner-btn-frame{
    padding-top:7px;
    padding-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bnt-join{
    width:255px;
    height: 60px;
    background:rgba(58,124,221,1);
    border-radius:4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .bnt-join span{
    padding-right:11px;
    color:rgba(248, 248, 251, 1);
    font-size: 14px;
    position: relative;
  }
  .bnt-join span.arrow::after{
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
  .bar-item {
    background-color: rgba(248, 248, 251, 1);
    width:367px;
    height: 174px;
    margin-right: 20px;
  }
  .bar-header{
    display: flex;
    padding:16px 11px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    align-items: center;
    justify-content: space-between;
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
    align-items: center;
  }
  .bar-address {
    display: flex;
    color:rgba(0, 0, 0, .5);
    font-size: 13px;
    align-items:center;
    max-width: 160px;
  }
  .bar-btn {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 11px;
  }
  .btn-tips {
    width:40px;
    height:20px;
    border-radius:1px;
    opacity:0.8;
    border:1px solid rgba(206,91,235,1);
    font-size:12px;
    color:rgba(228,99,255,1);
    text-align: center;
    line-height: 18px;
  }
  .icon-time {
    width:14px;
    height: 14px;
    margin-right: 4px;
  }
  .icon-adre {
    width:14px;
    height: 14px;
    margin-right: 4px;
    align-self: flex-start;
    margin-top: 2px;
  }
  .join-btn-frame {
    display: flex;
    justify-content: space-between;
  }
  .radio-item {
    padding-bottom: 15px;
  }
</style>
