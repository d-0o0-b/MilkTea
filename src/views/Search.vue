<template>
    <div class="search">
        <form action="/">
            <van-search
                v-model="value"
                show-action
                shape='round'
                autofocus=true
                placeholder="请输入商品名称关键字"
                @search="onSearch"
                @cancel="onCancel"
                @input="onInput(value)"
            />
        </form>
        <div class="result" v-show="pro.length>0">
            <div class="content">
                <div class="box"  @click="changeValue(item,index)" v-for="(item,index) in pro" :key="index">{{item}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: "",
                name: [],
                pro: []
            }
        },

        methods: {
            // 获取商品名称
            getPorName() {
                this.data.products.map(item => {
                    this.name.push(item.name)
                })
            },

            // 取消搜索
            onCancel() {
                this.$router.go(-1)
            },

            // 搜索
            onSearch() {
                let data = this.data.products
                data.map(v => {
                    if(v.name == this.value) {
                        this.$store.state.pid = v.pid
                        this.$router.replace({name: "Detail"})
                    }
                })
            },

            // 内容输入时
            onInput(value) {
                this.pro = []
                let arr = value.split("")
                arr.map(v => {
                    this.name.map(item => {
                        let flag = item.indexOf(v) != -1
                        if(flag && value.length>0) {
                            this.pro.push(item)
                        }
                    })
                })
                this.pro = Array.from(new Set(this.pro))
            },

            // 选中搜索选项
            changeValue(item) {
                this.value = item
                this.pro = []
                this.onSearch()
            }
        },

        created() {
            this.getPorName()
        }
    }
</script>

<style lang="less" scoped>
    .search{
        /deep/ .van-search__action{
            color: #0c34ba
        }
        /deep/ .van-field__control{
            font-size: 14px;
        }

        .result{
            width: calc(100% - 58px);
            position: absolute;
            left: 3.5%;
            margin-top: -10px;
        }
        .content{
            // F7F8FA
            padding: 5px 10px;
            background-color: #F7F8FA;
            border-radius: 15px 15px 25px 25px;
        }
        .box{
            padding: 5px;
            border-bottom: 2px solid#fff;
            &:last-child{
                border-bottom: none;
            }
            line-height: 35px;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.486)
        }
    }
</style>