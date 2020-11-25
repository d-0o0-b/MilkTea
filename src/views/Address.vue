<template>
    <div class="my-address">
         <van-nav-bar
            title="地址管理"
            left-text="返回"
            left-arrow
            :fixed="true"
            @click-left="back"
        />
        <div class="address-bg"></div>
        <div class="address-box">
            <div v-if="list.length > 0">
                <van-address-list
                        v-model="chosenAddressId"
                        :list="list"
                        default-tag-text="默认"
                        @add="newAddress"
                        @edit="editAddress"
                />
            </div>
            <div v-else>
                <van-empty description="地址栏为空，去新增地址信息吧">
                    <van-button round color="#0c34ba" class="bottom-button" @click="newAddress">
                        新增地址信息
                    </van-button>
                </van-empty>
            </div>
        </div>
    </div>
</template>

<script>
import '../assets/less/address.less'
    export default {
        data() {
            return {
                // 地址列表数据
                list: [],

                // 选择地址的id
                chosenAddressId: '',

            }
        },

        methods: {
            // 返回上一级
            back() {
                this.$router.go(-1)
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
                })
            },

            // 新增地址
            newAddress() {
                this.$router.push({name: 'NewAddress'})
            },

            // 编辑地址
            editAddress(item) {
                this.$router.push({name: 'NewAddress',query: {aid: item.id}})
            }
        },

        created() {
            // 跳转登录
            if(!this.$store.state.isLogin) {
                this.$toast("清先登录后再操作")
                return this.$router.replace({name: 'Login'})
            }

            // 查询收货地址
            this.getReceiveAddress()
        }
    }
</script>