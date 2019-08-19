<template>
  <div>
    
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
