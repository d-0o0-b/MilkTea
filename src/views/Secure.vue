<template>
    <div class="secure">
        <van-nav-bar 
            title="安全中心"
            left-text="返回"
            left-arrow
            :fixed="true"
            @click-left="back"
        />
        <div class="secure-bg"></div>
        <div class="secure-box">
            <div>
                <van-cell title="修改密码" isLink @click="openPasswordPopup" />
                <van-cell title="注销账号" isLink @click="destroyAccount" />
            </div>
        </div>
        <div class="btn-box">
            <van-button round color="#0c34ba" block @click="logout">退出登录</van-button>
        </div>

        <van-popup class="popup-box" closeable v-model="isOpen" position = "bottom">
            <div class="popup-item">
                <div class="password-text">修改密码</div>
                <van-form>
                    <van-field
                        v-for="(item,index) in password"
                        :key="index"
                        :type="item.isPassword ? 'password' : 'text'"
                        :label="item.title"
                        placeholder="6-16位字符且以字母开头"
                        v-model = "item.password"
                        :right-icon="item.isPassword ? 'closed-eye' : 'eye-o'"
                        @click-right-icon = "viewPassword(item)"
                    />
                    <div class="login-btn">
                        <van-button round block type="info" native-type="submit" color = "#0c34ba" @click="confirmPassword">
                            确认修改
                        </van-button>
                    </div>
                </van-form>
            </div>
        </van-popup>

    </div>
</template>

<script>
    import "../assets/less/secure.less"
    import {validForm} from "../assets/js/validForm"
    export default {
        data() {
            return {
                isOpen: false,
                password: {
                    old: {
                        password: '',
                        isPassword: true,
                        title: '旧密码'
                    },
                    new: {
                        password: '',
                        isPassword: true,
                        title: '新密码'
                    }
                }
            }
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1)
            },

            // 查看密码
            viewPassword(item) {
                item.isPassword = !item.isPassword
            },

            // 退出登录
            logout() {
                this.$dialog.confirm({
                    title: '退出登录',
                    message: '是否确定退出当前账号',
                    confirmButtonColor: "#0c34ba"
                })
                .then(() => {
                    this.$store.state.isLogin = false
                    this.$toast.loading({
                        message: '加载中……',
                        forbidClick: true,
                        duration: 0,
                        loadingType: 'spinner'
                    })
                    setTimeout(() => {
                        this.$router.push({name: 'Home'})
                        this.$toast.clear()
                    },500)
                })
                .catch(() => {
                });
            },

            // 修改密码
            openPasswordPopup() {
                this.isOpen = true
            },

            // 确认修改密码
            confirmPassword() {
                let o = {
                    oldPassword: {
                        value: this.password.old.password,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMsg: '旧密码支持6-16位字符且以字母开头'
                    },
                    password: {
                        value: this.password.new.password,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMsg: '新密码支持6-16位字符且以字母开头'
                    },
                }

                // 验证表单
                if(!validForm.valid(o)) {
                    // 验证不通过
                    return
                }

                let data = JSON.parse(localStorage.getItem('userInfo'))
                // 旧密码是否正确
                if(data[this.$store.state.index].password == this.password.old.password) {
                    // 新旧密码一致
                    if(this.password.old.password == this.password.new.password) {
                        this.$notify({
                            message: '新旧密码不能一致'
                        })
                        return
                    }else{
                        data[this.$store.state.index].password = this.password.new.password
                        localStorage.setItem('userInfo',JSON.stringify(data))
                        // 清空表格
                        for(let o in this.password) {
                            this.password[o].password = ""
                        }
                        this.isOpen = false
                        this.$toast('成功修改密码')
                    }
                }else{
                    this.$notify({
                        message: '旧密码错误'
                    })
                    return
                }
            },

            // 注销账号
            destroyAccount() {
                this.$dialog.confirm({
                    title: '注销账号',
                    message: '是否确定注销当前账号，一旦注销将无法恢复',
                    confirmButtonColor: "#0c34ba"
                })
                .then(() => {
                    let data = JSON.parse(localStorage.getItem('userInfo'))
                    data.splice(this.$store.state.index,1)
                    localStorage.setItem('userInfo',JSON.stringify(data))
                    this.$toast('注销成功')
                    this.$store.state.isLogin = false
                    this.$router.replace({name: 'Home'})
                })
                .catch(() => {
                });
            }
        },

        created() {
            if(!this.$store.state.isLogin) {
                this.$toast("清先登录后再操作")
                return this.$router.replace({name: "Login"})
            }
        }
    }
</script>