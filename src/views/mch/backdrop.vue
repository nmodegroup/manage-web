<template>
    <div>
        <div class="header-bar">
            <Select style="width:100px" v-model="query.status">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="query.queryStr" placeholder="输入商家名称/手机号搜" search style="width:200px;"/>
            <span class="seach-lable">提交时间：</span>
            <DatePicker type="daterange" placement="bottom-end"
             placeholder="请选择提交时间" style="width: 200px"
             v-model="timeArr" @on-clear='clearChange' @on-change='dateChange'>
            </DatePicker>
            <Button type="primary" style="margin-left:20px;" @click="onSerach">搜索</Button>
            <Button  @click="onReset">重置</Button>
        </div>
        <Table stripe :columns="columns1" :data="list" height="450"></Table>
        <div style="padding-top:30px;text-align:center;">
        <Page :total="dataCount" border show-total :current="startRow" :page-size="query.pageSize" @on-change="changepage"/>
        </div>
    </div>
</template>
<script>
import { get_code_back, audit_code_back } from "@/api/mch"
export default {
    data(){
        return {
            query: {
                pageSize: 10,
                pageNum: 1,
                status: "",
                queryStr: "",
                beginTime: "",
                endTime: ""
            },
            timeArr: [],
            statusList: [
                {
                    label: '待审核',
                    value: 0
                },
                {
                    label: '审核通过',
                    value: 1
                },
                {
                    label: '审核未通过',
                    value: 2
                },
            ],
            columns1: [
                {
                    title: '提交时间',
                    key: 'createTime',
                    // width: 150
                },
                 {
                    title: '商家名称',
                    key: 'name',
                    // width: 100,
                },
                 {
                    title: '商家电话',
                    key: 'phone',
                },
                {
                    title: '背景图片',
                    key: 'img',
                    render: (h,params) => {
                        return h('img',{
                            attrs: {
                                src: this.staticURL(params.row.img),
                                style: 'width:100%; padding:5px;'
                            },
                        })
                    }

                },
                {
                    title: '图片状态',
                    key: 'auditStatus',
                    // width: 130,
                    render: (h, params) => {
                        let  tip = ''
                        switch (params.row.auditStatus) {
                            case 0:
                                tip = `待审核`
                            break
                            case 1:
                                tip = `审核通过`
                            break
                            case 2:
                                tip = `审核未通过(${params.row.reason})`
                            break
                        }
                        return h('span', tip)
                    }
                },
                {
                    title: '操作',
                    // width: 180,
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                props: {
                                    href: "javascript:void(0)"
                                },
                                style: {
                                    "margin-right": "5px",
                                    'color': params.row.auditStatus == 0 ? '' : 'gray'
                                },
                                on: {
                                    click: () => {
                                        if (params.row.auditStatus != 0) return
                                         this.$Modal.confirm({
                                            title: "审核确认",
                                            content: "确定该商家提交的背景图片符合规范？审核通过后将直接替换商家小程序码背景图。",
                                            onOk: () => {
                                                const data = {
                                                    status: 1,
                                                    reason: "",
                                                    id: params.row.id
                                                }
                                                console.log(data)
                                                this.auditCodeBack(data)
                                            },
                                         })
                                    }
                                }
                            }, '审核通过'),
                            h('a', {
                                props: {
                                    href: "javascript:void(0)"
                                },
                                style: {
                                    "margin-right": "5px",
                                    'color': params.row.auditStatus == 0 ? '' : 'gray'
                                },
                                on: {
                                    click: () => {
                                        if (params.row.auditStatus != 0) return
                                        this.$Modal.confirm({
                                            title: "不通过原因",
                                            render: (h) => {
                                                return h('Input', {
                                                    props: {
                                                        title: '不通过原因',
                                                        value: this.reason,
                                                        autofocus: true,
                                                        placeholder: '请填写审核不通过原因，最多填写25个字',
                                                        type: 'textarea',
                                                        maxlength: 25
                                                    },
                                                    on: {
                                                        input: (val) => this.reason = val
                                                    }
                                                })
                                            },
                                            onOk: () => {
                                                const data = {
                                                    status: 2,
                                                    reason: this.reason,
                                                    id: params.row.id
                                                }
                                                 console.log(data)
                                                this.auditCodeBack(data)
                                            },
                                            onCancel: () => this.reason = '' // 取消按钮清空不通过原因
                                        });
                                    }
                                }
                            }, '审核不通过')
                        ])
                    }
                },
            ],
            list: [],
            // 总条数
            dataCount: 0,
            // 当前页
            startRow: 1,
            reason: ""
        }
    },
    mounted() {
        this.getCodeBack()
    },
    methods: {
         // 清空日历
        clearChange() {
            this.query.beginTime = '';
            this.query.endTime = '';
        },
        // 日历改变
        dateChange(date) {
            this.query.beginTime = date[0]
            this.query.endTime = date[1]
        },
        onSerach(){
            this.query.pageNum = 1;
            this.startRow = 1;
            this.getCodeBack()
        },
        // 重置按钮事件
        onReset() {
            this.query.queryStr = ''
            this.query.beginTime = ''
            this.query.endTime = ''
            this.query.status = ""
            this.query.pageNum = 1
            this.startRow = 1
            this.timeArr = []
            this.getCodeBack()
        },
        // 页码改变
        changepage(index) {
            this.query.pageNum = index;
            this.startRow =  index;
            this.getCodeBack()
        },
        getCodeBack(){
            get_code_back(this.query).then( res => {
                const data = res.data
                console.log(data)
                this.list = data.list;
                this.dataCount = data.totalSize;
            }).catch( err => {
                console.error(err)
            })
        },
        auditCodeBack(data){
            audit_code_back(data).then( res => {
                console.log(res)
                this.$Message.success('提交成功');
                this.query.pageNum = 1
                this.startRow = 1
                this.getCodeBack()
            }).catch( err => {
                console.error(err)
            })
        }
    },
}
</script>
<style scoped>
    
</style>