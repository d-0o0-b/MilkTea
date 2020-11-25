<template>
    <div class="menu">
        <div class="menu-search">
            <van-search placeholder="请输入搜索关键词"  shape="round" @focus="search" />
        </div>

        <div class="menu-box">
            <div class="menu-list clearfix">
                <div :ref="'menu' + index" class="menu-list-item fl" v-for="(item,index) in data.typeData" :key='index' @click="toggleType(item)">
                    <div class="menu-content">
                        <div class="img-box">
                            <img class="auto-img" :src="item.isActive ? item.activeIcon : item.icon" alt="">
                        </div>
                        <div class="text" :class="{active:item.isActive}">{{item.typeDesc}}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="menu-product">
            <div class="product-list" :class="{'not-first':index > 0}" v-for="(item,index) in products" :key="index" @click="viewProductInfo(item.pid)">
               <div class="pro-box">
                    <div class="pro-img">
                        <!-- 图片最好宽高1:1 -->
                        <img class="auto-img" :src="item.smallImg" alt="">
                    </div>
                    <div class="pro-info">
                        <div class="pro-text fl">
                            <div class="ch-name">{{item.name}}</div>
                            <div class="en-name">{{item.enname}}</div>
                        </div>
                        <div class="pro-price fr">￥{{item.price}}</div>
                    </div>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "../../assets/less/menu.less"
    export default {
        name: 'Menu',
        data() {
            return {
                data: this.data,
                width: 0,
                menuProducts: {},
                products: {},
            }
        },

        methods: {
            // 跳转搜索页面
            search() {
                this.$router.push({name: "Search"})
            },

            // 切换商品类型
            toggleType(item) {
                this.getProductsByType(item)
                if(item.isActive) {
                    return
                }
                for(let i = 0; i < this.data.typeData.length; i++) {
                    if(this.data.typeData[i].isActive) {
                        this.data.typeData[i].isActive = false;
                        break
                    }
                }
                item.isActive = true
            },

            // 获取所有类别的商品
            getMenuProducts() {
                for(let v in this.data.MenuProductsData) {
                    this.menuProducts[v] = this.data.products.filter(
                        item => {
                            for(let i = 0; i < this.data.MenuProductsData[v].length; i++) {
                                if(item.pid == this.data.MenuProductsData[v][i]) {
                                    return item
                                }
                            }
                        }
                    )
                }
            },

            // 根据商品类型获取商品数据
            getProductsByType(item) {
                this.products = this.menuProducts[item.type]
            },

            // 查看商品详情
            viewProductInfo(id) {
                // 更新当前商品id
                this.$store.commit('changePid',id)

                // 跳转详情页面
                this.$router.push({name: 'Detail'})
            }
        },

        created() {
            // 获取所有类别的商品
            this.getMenuProducts()

            // 开始就获取推荐的商品数据 使得默认选择推荐类别的商品
            this.toggleType(this.data.typeData[0])
        },

        mounted() {
            // 动态改变menu-list 的宽度，根据menu-list-item商品类型个数改变
            let width = this.$refs.menu0[0].clientWidth;
            // 37.5是postcss.config.js基准值
            this.width = this.data.typeData.length * width / 37.5;
        },
    }
</script>

<style scoped>
    
</style>