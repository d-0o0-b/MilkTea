<template>
    <div class="pay">
        <van-nav-bar
            title="提交订单"
            left-text="返回"
            left-arrow
            :fixed="true"
            @click-left="back()"
        />

        <div class="address-box">
            <div class="address">
                <div class="clearfix" @click="openAddressBox()">
                    <div class="fl address-title">选择收货地址</div>
                    <div class="fl arrow-box">
                        <van-icon name="arrow" class="arrow-icon"/>
                    </div>
                </div>
                <div class="address-content">
                     <div class="clearfix">
                        <div class="fl name">{{currentAddress.name}}</div>
                        <div class="fl phone">{{currentAddress.tel}}</div>
                    </div>
                    <div class="address-info">{{currentAddress.address}}</div>
                </div>
            </div>
        </div>

        <div class="order-info">
            <div class="order-box">
                <div class="order-title">订单信息</div>
                <div>
                    <div class="clearfix cell-box" v-for="(item,index) in shopbagData" :key = "index">
                        <div class="fl pro-img">
                            <img class="auto-img" :src="item.smallImg" alt="">
                        </div>
                        <div class="fl pro-info">
                            <div class="text-box">
                                <div class="clearfix">
                                    <div class="fl text-name">{{item.name}}</div>
                                    <div class="fl text-rule">{{item.rule}}</div>
                                </div>
                                <div class="text-enname">{{item.enname}}</div>
                            </div>
                            <div class="price-box">
                                <div class="fl price">￥{{item.price}}</div>
                                <div class="fr count">x{{item.count}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pro-box">
                    <div class="clearfix pro-boxing">
                        <div class="fl pro-count">共计 {{product.count}} 件商品</div>
                        <div class="fr pro-total">合计 {{product.total}}</div>
                    </div>
                    <div class="left-box left"></div>
                    <div class="left-box right"></div>
                </div>
            </div>
        </div>

        <div class="pay-btn">
            <van-button round block color="#0c34ba" @click = "pay()">立即结算</van-button>
        </div>

        <van-popup v-model="isOpen" position="bottom">
            <div class="address-title-box">选择收获地址</div>
            <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @select="selectAdress"
                @add="newAddress"
            />
        </van-popup>
    </div>
</template>

<script>
    import "../assets/less/pay.less"    
    export default {
        data() {
            return {
                isOpen: false,
                chosenAddressId: '1',
                ruleData: [],
                sids: [],
                // 地址列表数据
                list: [],
                // 购物袋数据
                shopbagData: [],
                countData: [],
                // 当前选择地址数据
                currentAddress: {
                    name: '',
                    tel: '',
                    address: ''
                },
                product: {
                    count: 0,
                    total: 0
                },
            }
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1)
            },

            // 打开选择地址页面
            openAddressBox() {
                this.isOpen = true
            },

            // 选择地址
            selectAdress(item) {
                this.isOpen = false
                for(let key in this.currentAddress) {
                    this.currentAddress[key] = item[key]
                }   
            },

            // 新增地址
            newAddress() {
                this.$router.push({name: 'NewAddress'})
            },

            // 查询收货地址
            getReceiveAddress() {
                let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.addressInfo.map(v => {
                    this.list.push({
                        id: v.id,
                        name: v.name,
                        tel: v.tel,
                        address: v.province + v.city + v.county + v.addressDetail,
                        isDefault: v.isDefault
                    })

                    if(v.isDefault) {
                        this.chosenAddressId = v.id
                        this.currentAddress.name = v.name
                        this.currentAddress.tel = v.tel
                        this.currentAddress.address = v.province + '/ ' + v.city + '/ ' + v.county + '/ ' + v.addressDetail
                    }
                })
            },

            // 根据sid获取商品信息
            getShopbagDataBySids() {
                if(this.$route.query.isBuy) {
                    let pid = this.$route.query.pid
                    let rule = this.$route.query.rule.join('/')
                    let count = this.$route.query.count
                    this.data.products.map(item => {
                        if(item.pid == pid) {
                            this.shopbagData.push(item)
                            this.shopbagData[0].price = item.price
                        }
                    })
                    this.shopbagData[0].count = count
                    this.shopbagData[0].rule = rule

                    // 计算商品总数量，总价格
                    this.product.count = count
                    this.product.total = this.shopbagData[0].price * count
                }else{
                    this.sids = this.$route.query.sids.split('_')
                    let data = JSON.parse(localStorage.getItem('userInfo'))[this.$store.state.index].userData.shopbag
                    this.sids.map(item => {
                        data.map(v => {
                            if(item == v.sid) {
                                this.countData.push(v.count)
                                this.shopbagData.push(v)
                                this.ruleData.push(v.rules)
                            }
                        })
                    })
                    this.data.products.map(item => {
                        this.shopbagData.map((v,index) => {
                            if(item.pid == v.pid) {
                                Object.assign(v,item)
                                v.count = this.countData[index]
                                v.rule = this.ruleData[index].join('/')
                            }
                        })
                    })
                    // 计算商品总数量，总价格
                    this.shopbagData.map(v => {
                        this.product.count += v.count
                        this.product.total += v.count * v.price
                    })

                    // 若提交订单页面商品为空，则返回购物袋
                    if(this.shopbagData.length == 0) {
                        this.$router.push({name: 'Shopbag'})
                    }
                }
            },
            
            // 立即结算
            pay() {
                for(let o in this.currentAddress) {
                    if(this.currentAddress[o] == '') {
                         this.$toast('请选择收获地址')
                        return
                    }
                }
                let data = JSON.parse(localStorage.getItem('userInfo'))
                let order = {}
                let id = []
                let numArr = new Date().getTime().toString(9).split('')
                for(let n = 0; n < 6; n++) {
                    let i = Math.floor(Math.random() * numArr.length)
                    id.push(numArr[i])
                }
                id = id.join("")
                order.id = id
                order.pro = []
                order.price = this.product.total
                order.count = this.product.count
                order.date = this.getNowFormatDate()
                order.status = 1
                if(this.$route.query.isBuy) {
                    order.pro.push(this.shopbagData[0])
                    this.shopbagData = []
                }else{
                    this.sids.map(item => {
                        data[this.$store.state.index].userData.shopbag.map((v,i) => {
                            if(item == v.sid) {
                                order.pro.push(data[this.$store.state.index].userData.shopbag.splice(i,1)[0])
                            }
                        })
                    })
                }
                data[this.$store.state.index].userData.order.push(order)
                localStorage.setItem('userInfo',JSON.stringify(data))
                this.$router.replace({name: 'Order'})
            },

            // 获取日期
            getNowFormatDate() {
                let date = new Date();
                let seperator1 = "-";
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            }
        },

        created() {
            this.getReceiveAddress()

            this.getShopbagDataBySids()
        },
    }
</script>