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
          <div class="bnt-join">跳转关联</div>
          <div class="toggle-frame">
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {get_auth_list} from "@/api/mch"
export default {
  data () {
    return {
    }
  },
  methods: {
    getAuthList() {
      get_auth_list(this.query).then(res => {
        console.log(res)
      }).catch(error => {

      })
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
</style>
