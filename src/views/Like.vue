<template>
    <div class="like">
        <van-nav-bar 
            title="我的收藏"
            left-text="返回"
            left-arrow
            :fixed="true"
            @click-left="back"
        />
        <div class="like-bg"></div>
        <div class="like-box">
            <div class="product-box clearfix" v-if="likeData.length > 0">
                <div class="product-item fl" :class="[index % 2 == 0 ? 'pro-left' : 'pro-right']" v-for="(item,index) in likeData" :key="index">
                    <div class="p-img" @click = viewProductInfo(item.pid)>
                        <img class="auto-img" :src="item.smallImg" alt="">
                    </div>
                    <div class="pro-name one-text">{{item.name}}</div>
                    <div class="clearfix">
                        <div class="pro-price fl">￥{{item.price}}</div>
                        <div class="pro-remove fr" @click="removeLike(item.pid)">
                            <van-icon name="delete" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <van-empty description="收藏空空如也，去逛一逛吧">
                    <van-button round color="#0c34ba" class="bottom-button" @click="goMenu">
                        去逛一逛
                    </van-button>
                </van-empty>
            </div>
        </div>
    </div>
</template>

<script>
    import "../assets/less/like.less"
    export default {
        data() {
            return {
                // 收藏商品数据
                likeData: []
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

            // 获取收藏商品数据
            getLikeData() {
                this.likeData = []
                let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.likes.map(item => {
                    this.data.products.map(v => {
                        if(item == v.pid) {
                            this.likeData.push(v)
                        }
                    })
                })
            },

            // 删除收藏数据
            removeLike(pid) {
                let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.likes.map((item,index) => {
                    if(item == pid) {
                        data[this.$store.state.index].userData.likes.splice(index,1)
                    }
                })
                localStorage.setItem('userInfo',JSON.stringify(data))
                this.getLikeData()
                this.$toast({
                    message: '取消收藏成功',
                    duration: 1000
                })
            },

            // 查看商品详情
            viewProductInfo(id) {
                // 跳转详情页
                this.$router.push({name: 'Detail'})

                // 更新当前商品id
                this.$store.commit('changePid',id)
            },
        },

        created() {
            // 跳转登录
            if(!this.$store.state.isLogin) {
                this.$toast("清先登录后再操作")
                return this.$router.replace({name: 'Login'})
            }

            this.getLikeData()
        }
    }
</script>