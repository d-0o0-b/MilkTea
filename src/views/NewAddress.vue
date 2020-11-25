<template>
    <div class="new-address">
        <van-nav-bar
            :title="aid ? '编辑地址' : '新增地址'"
            left-text="返回"
            left-arrow
            :fixed="true"
            @click-left="back"
        />

        <van-address-edit
            show-postal
            :show-delete="!!aid"
            show-set-default
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            :area-list="areaList"
            :address-info="addressInfo"
            @save="saveAddress"
            @delete="removeAddress"
        />
    </div>
</template>

<script>
    import "../assets/less/newAddress.less"
    import areaList from "../assets/js/area"
    export default {
        data() {
            return {
                areaList,
                // 地址数据初始值
                addressInfo: {
                    id: '',
                    name: '',
                    tel: '',
                    province: '',
                    city: '',
                    county: '',
                    addressDetail: '',
                    areaCode: '',
                    postalCode: '',
                    isDefault: false,
                },
                aid: '',

            }
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1)
            },

            // 新增地址
            newAddress(address) {
                let addressInfo = Object.assign({},address)
                addressInfo.id = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36)
                let data = JSON.parse(localStorage.getItem('userInfo'))
                if(addressInfo.isDefault) {
                    data[this.$store.state.index].userData.addressInfo.map(v => {
                        if(v.isDefault) {
                            v.isDefault = false
                        }
                    })
                }
                data[this.$store.state.index].userData.addressInfo.unshift(addressInfo)
                localStorage.setItem('userInfo',JSON.stringify(data))
                this.$toast('新增地址成功')
                setTimeout(() => {
                    this.$router.replace({name: 'Address'})
                },500)
            },

            // 编辑地址
            editAddress(content) {
                // 判断地址是否被修改
                let isModify = false
                for(let key in this.addressInfo) {
                    if(this.addressInfo[key] != content[key]) {
                        // 已经被修改
                        isModify = true
                        break
                    }
                }
                if(isModify) {
                    let data = JSON.parse(localStorage.getItem('userInfo'))
                    data[this.$store.state.index].userData.addressInfo.map((item,index) => {
                        if(item.id == this.aid) {
                            // item = content
                            data[this.$store.state.index].userData.addressInfo[index] = content
                            // 修改默认地址
                            if(content.isDefault) {
                                data[this.$store.state.index].userData.addressInfo.map((v,i) => {
                                    if(v.isDefault) {
                                        data[this.$store.state.index].userData.addressInfo[i].isDefault = false
                                    }
                                })
                                data[this.$store.state.index].userData.addressInfo[index].isDefault = true
                            }
                        }
                    })
                    localStorage.setItem('userInfo',JSON.stringify(data))
                    this.$toast('修改成功')
                    setTimeout(() => {
                        // this.$router.push({name: 'Address'})
                        this.$router.go(-1)
                    },500)
                }else{
                    // this.$router.push({name: 'Address'})
                    this.$router.go(-1)
                }
            },

            // 保存地址
            saveAddress(address) {
                if(this.aid) {
                    this.editAddress(address)
                }else{
                    this.newAddress(address)
                }
            },

            // 获取地址数据
            getAddressDataByAid() {
                let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.addressInfo.map(v => {
                    if(v.id == this.aid) {
                        for(let key in v) {
                            this.addressInfo[key] = v[key]
                        }
                    }
                })
            },

            // 删除地址
            removeAddress() {
                let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.addressInfo.map((item,index) => {
                    if(item.id == this.aid) {
                        data[this.$store.state.index].userData.addressInfo.splice(index,1)
                    }
                })
                localStorage.setItem('userInfo',JSON.stringify(data))
                this.$toast('删除地址成功')
                this.back()
            }
        },

        created() {
            // 获取地址id
            this.aid = this.$route.query.aid
            if(this.aid) {
                this.getAddressDataByAid()
            }
        }
    }
</script>