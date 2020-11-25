<template>
    <div class="detail">
        <van-nav-bar
            title="商品详情"
            left-text="返回"
            left-arrow
            :fixed="true"
            @click-left="back"
        />

        <div class="detail-box">
            <img class="auto-img" :src="product.largeImg" alt="">
            <div class="pro-name">
                <div>{{product.name}}</div>
            </div>
        </div>
        <div class="detail-info">
            <div class="rule-box">
                <div class="rule-item clearfix" v-for="(item,index) in product.rulesData" :key="index">
                    <div class="fl rule-item-title">{{item.title}}</div>
                    <div class="fl clearfix">
                        <div class="fl rule-item-tag" :class="{active: v.isActive}" v-for="(v,i) in item.rules" :key="i" @click = "toggleRule(v,index)">
                            {{v.title}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="desc-box">
                <div class="desc-title">商品描述</div>
                <div class="desc-content">
                    <div class="desc-text" v-for="(item,index) in product.desc.split(/\n/)" :key='index'>
                        {{index+1}}. {{item}}
                    </div>
                </div>
            </div>
            <div class="clearfix desc-price-count">
                <div class="fl price">￥{{product.price}}</div>
                <div class="fr count">
                    <van-stepper v-model="proCount" theme="round" button-size="24" disable-input />
                </div>
            </div>
        </div>

        <van-goods-action>
            <van-goods-action-icon icon="bag" text="购物袋" :badge="bagCount == 0 ? '' : bagCount" color="#999" @click="goShopbag"/>
            <van-goods-action-icon icon="like" text="收藏" :color="isLike ? '#0c34ba' : '#999'" @click="like"/>
            <van-goods-action-button
                color="#6a91ec"
                text="加入购物袋"
                @click="addShopbag(0)"
            />
            <van-goods-action-button
                color="#0c34ba"
                text="立即购买"
                @click="buyNow"
            />
        </van-goods-action>
    </div>
</template>

<script>
    import  '../assets/less/detail.less'
    export default {
        data() {
            return {
                proCount: 1,
                currentPro: {},
                product: {},
                isLike: false,
                bagCount: 0,
            }
            
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1)
            },

            // 跳转购物袋
            goShopbag() {
                this.$router.push({name: 'Shopbag',params: {fromDetail:1}})
            },

            // 切换规格
            toggleRule(v,index) {
                if(v.isActive) {
                    return
                }
                let rule = this.product.rulesData[index].rules
                for(let i = 0; i < rule.length; i++) {
                    if(rule[i].isActive) {
                        rule[i].isActive = false
                        break
                    }
                }
                v.isActive = true
                this.$forceUpdate()
            },

            // 收藏
            like() {
                // 如果没登录，就跳到登录界面
                if(!this.$store.state.isLogin) {
                    this.$router.push({name: 'Login'})
                    this.$toast({
                        message: "请先登录后再操作",
                        duration: 2500,
                        // 是否在点击后关闭	
                        closeOnClick: true
                    })
                }else{
                    // 是否收藏
                    let data = JSON.parse(localStorage.getItem('userInfo'))
                    let i = -1
                    data[this.$store.state.index].userData.likes.map(
                        (item,index) => {
                            if(item == this.$store.state.pid) {
                                i = index
                                return
                            }
                        }
                    )
                    this.isLike = i == -1 ? false : true
                    if(!this.isLike) {
                        // 加入收藏
                        data[this.$store.state.index].userData.likes.push(this.$store.state.pid)
                        localStorage.setItem('userInfo',JSON.stringify(data))
                        this.$toast.success({
                            message: "收藏成功",
                        })
                    }else{
                        // 取消收藏
                        data[this.$store.state.index].userData.likes.splice(i,1)
                        localStorage.setItem('userInfo',JSON.stringify(data))
                        this.$toast.fail({
                            message: "取消收藏",
                        })
                    }
                    this.isLike = !this.isLike
                }
            },

            // 加入购物袋
            addShopbag(isBuy) {
                // 如果没登录，就跳到登录界面
                if(!this.$store.state.isLogin) {
                    this.$router.push({name: 'Login'})
                    this.$toast({
                        message: "请先登录后再操作",
                        duration: 2500,
                        // 是否在点击后关闭	
                        closeOnClick: true
                    })
                    return
                }

                // 获取选择的规格
                let rules = this.product.rulesData
                let rule = []
                rules.map(v => {
                    for(let i = 0; i < v.rules.length; i++) {
                        if(v.rules[i].isActive) {
                            rule.push(v.rules[i].title)
                            break
                        }
                    }
                })
                let data = JSON.parse(localStorage.getItem('userInfo'))
                
                 // 购物袋商品sid
                let shopbagSid = Number(`${this.$store.state.pid}` + `${data[this.$store.state.index].userData.shopbag.length}`)

                if(isBuy) {
                    setTimeout(() => {
                        this.$router.push({name: 'Pay',query: {isBuy: true,rule: rule,count:this.proCount,pid:this.$store.state.pid}})
                        return
                    },600)
                }else{
                    for(let i = 0; i < data[this.$store.state.index].userData.shopbag.length; i++) {
                        if(rule.toString() == data[this.$store.state.index].userData.shopbag[i].rules.toString()) {
                            this.$toast({
                                type: 'fail',
                                message: '已有相同规格商品加入',
                                duration: 2000,
                                // 是否在点击后关闭
                                closeOnClick: true,
                            })
                            return
                        }
                    }
                    data[this.$store.state.index].userData.shopbag.push({
                        pid: this.$store.state.pid,
                        rules: rule,
                        sid: shopbagSid,
                        count: this.proCount,
                    })
                    localStorage.setItem("userInfo",JSON.stringify(data))
                    
                    //累加购物袋徽章数量bagCount，是购物袋里商品数据，而非商品数量proCount
                    this.bagCount++

                    this.$toast('成功加入购物车')
                }
            },
        
            // 获取当前商品信息
            getCurrentPro() {
               this.data.products.map(
                    item => {
                        if(item.pid == this.$store.state.pid) {
                            this.currentPro = item
                            return
                        }
                    }
                )
            },
        
            // 为当前商品信息重新整理rules 存入product里 
            setProduct() {
                for(let v in this.currentPro) {
                    // this.product[v] = []
                    if(v == "rules") {
                        this.product.rulesData = []
                        for(let item in this.currentPro[v]) {
                            if(item == 'tem') {
                                this.product.rulesData.push({
                                    title: '温度',
                                    rules: []
                                }) 
                                this.currentPro[v][item].map(
                                    pro => {
                                        for(let i = 0; i < this.product.rulesData.length; i++) {
                                            if(this.product.rulesData[i].title == '温度') {
                                                let active = this.product.rulesData[i].rules.length == 0 ? true : false
                                                this.product.rulesData[i].rules.push({
                                                    title: pro,
                                                    isActive: active,
                                                })
                                            }
                                        }
                                    }
                                )
                            }

                            if(item == 'suger') {
                                this.product.rulesData.push({
                                    title: '糖',
                                    rules: []
                                }) 
                                this.currentPro[v][item].map(
                                    pro => {
                                        for(let i = 0; i < this.product.rulesData.length; i++) {
                                            if(this.product.rulesData[i].title == '糖') {
                                                let active = this.product.rulesData[i].rules.length == 0 ? true : false
                                                this.product.rulesData[i].rules.push({
                                                    title: pro,
                                                    isActive: active,
                                                })
                                            }
                                        }
                                    }
                                )
                            }
                        
                            if(item == 'milk') {
                                this.product.rulesData.push({
                                    title: '奶油',
                                    rules: []
                                }) 
                                this.currentPro[v][item].map(
                                    pro => {
                                        for(let i = 0; i < this.product.rulesData.length; i++) {
                                            if(this.product.rulesData[i].title == '奶油') {
                                                let active = this.product.rulesData[i].rules.length == 0 ? true : false
                                                this.product.rulesData[i].rules.push({
                                                    title: pro,
                                                    isActive: active,
                                                })
                                            }
                                        }
                                    }
                                )
                            }
                        }
                    }else{
                        this.product[v] = this.currentPro[v]
                        // this.product[v] = JSON.parse(JSON.stringify(this.currentPro[v]))
                    }
                }
            },

            // 立即购买
            buyNow() {
                this.addShopbag(true)
            }
        },

        created() {
            // 登录后才获取账号信息
            if(this.$store.state.isLogin) {
                // 获取收藏状态
                let data = JSON.parse(localStorage.getItem('userInfo'))
                let i = -1
                data[this.$store.state.index].userData.likes.map(
                    (item,index) => {
                        if(item == this.$store.state.pid) {
                            i = index
                            return
                        }
                    }
                )
                this.isLike = i == -1 ? false : true
                
                // 获取购物袋商品数量
                this.bagCount = JSON.parse(localStorage.getItem('userInfo'))[this.$store.state.index].userData.shopbag.length
            }

            // 获取当前商品信息
            this.getCurrentPro()

            // 为当前商品信息重新整理rules 存入product里
            this.setProduct()
        },
    }
</script>

<style scoped>

</style>