<template>
    <div class="home">
        <van-nav-bar :fixed = 'true' style="marginTop: 10px">
            <template #left>
                <div class="home-title" v-if="isLogin">{{timeText}}<span>,{{nickName}}</span></div>
                <div class="home-title noLogin_title" v-else>{{timeText}}</div>
            </template>
            <template #right>
                <van-search placeholder="请输入商品名称"  shape='round' @focus="search" />
            </template>
        </van-nav-bar>
        <div class="banner-box">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#0c34ba">
                <van-swipe-item v-for="(item,index) in data.bannerImgData" :key = 'index' @click="goMenu">
                    <img class="auto-img" :src="item.bannerImg" alt="">
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="hot-product">
            <div class="hot-product-title">热门推荐</div>
            <div class="product-box clearfix">
                <div class="product-item fl" :class="[index % 2 == 0 ? 'p-left' : 'p-right']" v-for="(item,index) in hotProducts" :key='index'>
                    <div class="p-img" @click="viewProductInfo(item.pid)">
                        <img class="auto-img" :src="item.smallImg" alt="">
                    </div>
                    <div class="pro-name one-text">{{item.name}}</div>
                    <div class="pro-price fl">￥{{item.price}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "../../assets/less/home.less"
    export default {
        name: 'Home',
        data() {
            return {
                // 记录时间段
                timeText: '',

                // 获取热门商品
                hotProducts: {},

                // 昵称
                nickName: '',

                //登录状态
                isLogin: this.$store.state.isLogin

            }
        },

        methods: {
            // 跳转菜单页面
            goMenu() {
                // 跳转菜单页面menu
                this.$router.push({name: 'Menu'})
            },

            // 跳转搜索页面
            search() {
                this.$router.push({name: "Search"})
            },

            // 获取时间段
            getTime() {
                let hours = new Date().getHours();
                if(hours >= 6 && hours < 12) {
                    this.timeText = "早上好"
                }else if(hours >= 12 && hours < 18) {
                    this.timeText = "下午好"
                }else if(hours >= 18 && hours < 24) {
                    this.timeText = "晚上好"
                }else {
                    this.timeText = "深夜好"
                }
            },

            // 查看商品详情
            viewProductInfo(id) {
                //  更新当前商品id 
                this.$store.commit('changePid',id)

                // 跳转详情页
                this.$router.push({name: 'Detail'})
            },

            // 获取热门商品
            getHotProducts() {
                this.hotProducts = this.data.products.filter(
                    item => {
                        for(let i = 0; i < this.data.hotProducts.length; i++) {
                            if(item.pid == this.data.hotProducts[i]) {
                               return item
                            }
                        }
                    }
                )
            },

            // 获取用户昵称
            getNickName() {
                let data = JSON.parse(localStorage.getItem('userInfo'))[this.$store.state.index].nickName
                this.nickName = data
            }

        },

        created() {
            // 获取时间段
            this.getTime()

            // 获取热门商品
            this.getHotProducts()

            if(this.$store.state.isLogin) {
               // 获取用户昵称
                this.getNickName() 
            }
        },
    }
</script>

<style scoped>
    
</style>