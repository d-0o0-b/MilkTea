<template>
    <div class="shopbag">
        <van-nav-bar
            title="购物袋"
            :fixed="true"
            @click-right="editProduct"
        >
            <template #right v-if="shopbag.length > 0">
                <div style="color:  #0c34ba">{{isEdit ? '完成' : '编辑'}}</div>
            </template>
            <template #left v-if="this.$route.params.fromDetail">
                <div @click="back" class="title_back">
                    <van-icon name="arrow-left" />
                    <span>返回</span>
                </div>
            </template>
        </van-nav-bar>
        <div v-if="shopbag.length > 0">
            <van-swipe-cell :disabled="!isEdit" v-for="(item,index) in shopbag" :key="index">
                <van-cell :border="false" :class="{'not-first': index > 0}">
                    <div class="clearfix cell-box">
                        <div class="fl check">
                            <van-checkbox v-model="checkData[index]" icon-size="20px" checked-color="#0c34ba" @change = "simpleSelect"></van-checkbox>
                        </div>
                        <div class="fl pro-img">
                            <img class="auto-img" :src="item.smallImg" alt="">
                        </div>
                        <div class="fl pro-info">
                            <div class="text-box">
                                <div class="clearfix">
                                    <div class="fl text-name">{{item.name}}</div>
                                    <div class="fl text-rule">{{ruleData[index]}}</div>
                                </div>
                                <div class="text-enname">{{item.enname}}</div>
                            </div>
                            <div class="price-box">
                                <div class="fl price">￥{{item.price}}</div>
                                <div class="fr">
                                    <van-stepper v-model="countData[index]" theme="round" button-size="22" disable-input @change="modifyCount(index)"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-cell>
                <template #right>
                    <van-button square color="#0c34ba" text="删除" @click = "removeOneShopbag(sidData[index])"/>
                </template>
            </van-swipe-cell>

            <div>
                <van-submit-bar  v-show="!isEdit" :price="total" button-text="提交订单" button-color='#0c34ba' @submit="commit">
                    <van-checkbox @click="allSelect" v-model="allCheck" icon-size="20px" checked-color="#0c34ba">全选</van-checkbox>
                </van-submit-bar>

                <van-submit-bar @submit="removeMoreShopbag" v-show="isEdit" button-text="删除选择" button-color='#0c34ba'>
                    <van-checkbox  @click="allSelect" v-model="allCheck" icon-size="20px" checked-color="#0c34ba">全选</van-checkbox>
                </van-submit-bar>
            </div>
        </div>
        <div v-else>
            <van-empty description="购物袋空空如也~">
                 <van-button round color="#0c34ba" type="danger" class="bottom-button" @click="goMenu()">
                    去逛一逛~
                </van-button>
            </van-empty>
        </div>

        
    </div>
</template>

<script>
    import '../../assets/less/shopbag.less'
    export default {
        data() {
            return {
                isEdit: false,
                shopbag: [],
                ruleData: [],
                checkData: [],
                countData: [],
                sidData: [],
                allCheck: false,
                total: 0
            }
        },
        methods: {
            // 返回
            back() {
                this.$router.go(-1)
            },

            // 回到菜单
            goMenu() {
                this.$router.push({name: 'Menu'})
            },

            // 编辑商品
            editProduct() {
                this.isEdit = !this.isEdit
            },

            // 获取购物袋商品
            getShopbagProducts() {
                this.shopbag = []
                this.ruleData = []
                this.checkData = []
                this.countData = []
                this.sidData = []
                let data = JSON.parse(localStorage.getItem('userInfo'))[this.$store.state.index].userData.shopbag
                data.map(
                    item => {
                        this.data.products.map(
                            v => {
                                if(v.pid == item.pid) {
                                    this.shopbag.push(v)
                                }
                            }
                        )
                    }
                )
                for(let i = 0; i < this.shopbag.length; i++) {
                    this.shopbag[i].isCheck = false
                    this.shopbag[i].rule = data[i].rules.join('/')
                    this.shopbag[i].count = data[i].count
                    this.shopbag[i].sid = data[i].sid
                    this.countData.push(this.shopbag[i].count)
                    this.ruleData.push(this.shopbag[i].rule)
                    this.checkData.push(this.shopbag[i].isCheck)
                    this.sidData.push(this.shopbag[i].sid)
                }
                this.ruleData.map(
                    (item,index) => {
                        this.shopbag[index].rule = item
                    }
                )
            },

            // 全选
            allSelect() {
                this.shopbag.map(v => {
                    v.isCheck = this.allCheck
                })
                for(let i = 0; i < this.checkData.length; i++) {
                    this.checkData[i] = this.allCheck
                }
                this.$forceUpdate()
                this.sum()
            },

            // 单选
            simpleSelect() {
                this.sum()
                for(let i = 0; i < this.shopbag.length; i++) {
                    if(!this.shopbag[i].isCheck) {
                        this.allCheck = false
                        return 
                    }
                }
                for(let i = 0; i < this.checkData.length; i++) {
                    if(!this.checkData[i]) {
                        this.allCheck = false
                        return 
                    }
                }
                this.allCheck = true
            },

            // 修改商品数量
            modifyCount(index) {
                let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.shopbag[index].count = this.countData[index]
                localStorage.setItem('userInfo',JSON.stringify(data))
                this.sum()
            },

            // 删除单个商品
            removeOneShopbag(sid) {
                let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.shopbag.map(v => {
                    if(sid == v.sid) {
                        let index = data[this.$store.state.index].userData.shopbag.indexOf(v)
                        data[this.$store.state.index].userData.shopbag.splice(index,1)
                    }
                })
                localStorage.setItem('userInfo',JSON.stringify(data))
                this.getShopbagProducts()
                this.sum()
            },

            // 删除多个商品
            removeMoreShopbag() {
                let sids = []
                this.checkData.map((v,index) => {
                    if(v) {
                       sids.push( this.sidData[index])
                    }
                })
                for(let i = 0; i < sids.length; i++) {
                    let data = JSON.parse(localStorage.getItem('userInfo'))
                    data[this.$store.state.index].userData.shopbag.map(v => {
                        if(sids[i] == v.sid) {
                            let index = data[this.$store.state.index].userData.shopbag.indexOf(v)
                            data[this.$store.state.index].userData.shopbag.splice(index,1)
                        }
                    })
                    localStorage.setItem('userInfo',JSON.stringify(data))
                }
                this.getShopbagProducts()
                this.sum()
            },

            // 计算总金额
            sum() {
                this.total = 0
                this.checkData.map((v,index) => {
                    if(v) {
                        this.total += this.shopbag[index].price * this.countData[index]
                    }
                })
                this.total *= 100
            },

            // 提交订单
            commit() {
                let sids = []
                let data = JSON.parse(localStorage.getItem('userInfo'))
                // data[this.$store.state.index].userData.shopbag.map(v => {
                //     sids.push(v.sid)
                // })
                this.checkData.map((v,index) => {
                    if(v) {
                       sids.push( data[this.$store.state.index].userData.shopbag[index].sid)
                    }
                })
                // 未勾选商品则提示
                if(!sids.length) {
                    this.$toast({
                        message: '请勾选购买商品',
                    })
                    return
                }
                sids = sids.join('_')
                this.$router.push({name: 'Pay',query: {sids}})
            }
        },

        created() {
            if(this.$store.state.isLogin) {
                // 获取加入购物袋商品
                this.getShopbagProducts()
            }
        },
    }
</script>

<style scoped>
    
</style>