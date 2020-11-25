<template>
    <div class="order">
        <van-nav-bar 
            title="我的订单"
            left-text="返回"
            left-arrow
            :fixed="true"
            @click-left="back"
        />

        <div class="order-bg"></div>
        <div class="tab-box">
            <van-tabs v-if="this.$store.state.isLogin" v-model="tabIndex" @change="toggleStatus" color="#0c34ba" line-height="2px" title-active-color="#0c34ba" :sticky="true" offset-top="10px">
                <van-tab :title="m.title" v-for="(m,n) in tabItems" :key="n">
                    <div v-if="orderData.length > 0">
                        <div class="tab-item" v-for="(item,index) in orderData" :key='index'>
                            <div class="clearfix tab-item-box">
                                <div class="fl no">NO.{{item.id}}</div>
                                <div class="fr">
                                    <div class="text" v-if="item.status == 1" @click="confirmReceive(item.id)">确认收货</div>
                                    <div class="text-box-tab" v-else>
                                        <div class="finished">已完成</div>
                                        <div class="remove" @click="removeOrder(item.id)">
                                            <van-icon name="delete" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="order-box">
                                <div>
                                    <div class="clearfix cell-box" v-for="(v,i) in item.pro" :key="i">
                                        <div class="fl pro-img">
                                            <img class="auto-img" :src="v.smallImg" alt="">
                                        </div>
                                        <div class="fl pro-info">
                                            <div class="text-box">
                                                <div class="clearfix">
                                                    <div class="fl text-name">{{v.name}}</div>
                                                    <div class="fl text-rule">{{v.rule}}</div>
                                                </div>
                                                <div class="text-enname">{{v.enname}}</div>
                                            </div>
                                            <div class="price-box">
                                                <div class="fl price">￥{{v.price}}</div>
                                                <div class="fr count">x{{v.count}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="pro-box">
                                    <div class="clearfix pro-boxing">
                                        <div class="date">{{item.date}}</div>
                                        <div class="clearfix">
                                            <div class="fl pro-count">共计 {{item.count}} 件商品</div>
                                            <div class="fr pro-total">合计 ￥{{item.price}}</div>
                                        </div>
                                    </div>
                                    <div class="left-box left"></div>
                                    <div class="left-box right"></div>
                                </div>
                            </div>
                        
                        </div>
                    </div>
                    <div v-else>
                        <van-empty description="暂无订单，去逛一逛吧">
                            <van-button round color="#0c34ba" class="bottom-button" @click="goMenu">
                                去逛一逛
                            </van-button>
                        </van-empty>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    import "../assets/less/order.less"
    export default {
        data() {
            return{
                tabIndex: 0,
                orderData: [],
                tabItems: [
                    {title: '全部'},
                    {title: '进行中'},
                    {title: '已完成'},
                ]
            }
        },

        methods: {
            // 跳转菜单页面
            goMenu() {
                return this.$router.push({name: 'Menu'})
            },

            // 返回
            back() {
                this.$router.go(-1)
            },

            // 订单数据
            getOrderData() {
                this.orderData = []
                let data = JSON.parse(localStorage.getItem('userInfo'))
                this.orderData = data[this.$store.state.index].userData.order
                this.orderData.map((item,index) => {
                    item.pro.map((v,i) => {
                        this.data.products.map(o => {
                            if(v.pid == o.pid) {
                                Object.assign(v,o)
                            }
                        })
                        v.count = JSON.parse(localStorage.getItem('userInfo'))[this.$store.state.index].userData.order[index].pro[i].count
                    })
                })
            },

            // 切换订单状态
            toggleStatus(name) {
                // status 订单号 1进行中  2已完成
                this.getOrderData()
                if(name == 1) {
                   this.orderData = this.orderData.filter(item => {
                       return item.status == 1
                   })
                }else if(name == 2) {
                    this.orderData = this.orderData.filter(item => {
                       return item.status == 2
                   })
                }
            },

            // 确认收货
            confirmReceive(id) {
                // id 订单号
                // index 下标
                let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.order.map(item => {
                    if(item.id == id) {
                        item.status = 2
                    }
                })
                localStorage.setItem('userInfo',JSON.stringify(data))
                this.toggleStatus(this.tabIndex)
                this.$toast('确认收货成功')
            },

            // 删除订单
            removeOrder(id) {
               let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.order.map((item,index) => {
                    if(item.id == id) {
                        data[this.$store.state.index].userData.order.splice(index,1)
                    }
                })
                localStorage.setItem('userInfo',JSON.stringify(data))
                this.toggleStatus(this.tabIndex)
                this.$toast('删除订单成功')
            }
        },

        created() {
            // 跳转登录
            if(!this.$store.state.isLogin) {
                this.$toast("清先登录后再操作")
                return this.$router.replace({name: 'Login'})
            }

            this.getOrderData()
        },
    }
</script>