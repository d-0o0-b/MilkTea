<template>
    <div class="main">
        <div>
            <!-- 二级路由 -->
            <keep-alive include="Home,Menu">
                <router-view></router-view>
            </keep-alive>
        </div>

        <van-tabbar v-model="active" active-color = "#13227a" :route="true">
            <van-tabbar-item v-for = "(item,index) in tabbarData" :key = index :to = "item.url">
                <span>{{item.title}}</span>
                <template #icon="props">
                    <img :src="props.active ? item.icon.active : item.icon.inactive" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                active: 0,
                tabbarData: [
                    {
                        title: '首页',
                        icon: {
                            active: require("../assets/images/main_01.svg"),
                            inactive: require("../assets/images/main_02.svg")
                        },
                        url: {
                            name: 'Home'
                        }
                    },
                    {
                        title: '菜单',
                        icon: {
                            active: require("../assets/images/main_03.svg"),
                            inactive: require("../assets/images/main_04.svg")
                        },
                        url: {
                            name: 'Menu'
                        }
                    },
                    {
                        title: '购物袋',
                        icon: {
                            active: require("../assets/images/main_05.svg"),
                            inactive: require("../assets/images/main_06.svg")
                        },
                        url: {
                            name: 'Shopbag'
                        }
                    },
                    {
                        title: '我的',
                        icon: {
                            active: require("../assets/images/main_07.svg"),
                            inactive: require("../assets/images/main_08.svg")
                        },
                        url: {
                            name: 'My'
                        }
                    }
                ],
            }
        }
    }
</script>

<style lang="less" scoped>
     .main{
        padding-bottom: 50px;
    }
</style>