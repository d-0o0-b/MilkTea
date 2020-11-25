<template>
    <div class="login">
        <div class="login-box">
            <van-nav-bar right-text="关闭" @click-right="back">
                <template #left>
                    <div class="left-text">
                        <div class="logo">
                            <img class="auto-img" src="../assets/images/logo.svg" alt="">
                        </div>
                        <div class="logo-title">Milk Tea</div>
                    </div>
                </template>
            </van-nav-bar>

            <div class="login-form">
                <div class="title">欢迎回来！</div>
                <div class="en-title">Please login to your accouts</div>
                <div class="login-form-box">
                    <van-form>
                        <van-field
                            label="手机号"
                            placeholder="11位数字"
                            v-model = "userLoginInfo.phone"
                        />
                        <van-field
                            :type="isPassword ? 'password' : 'text'"
                            label="密码"
                            placeholder="6-16位字符且以字母开头"
                            v-model = "userLoginInfo.password"
                            :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
                            @click-right-icon = "viewPassword"
                        />
                        <div class="clearfix forgot">
                            <span class="fr">忘记密码?</span>
                        </div>
                        <div class="login-btn">
                            <van-button round block native-type="submit" color = "#0c34ba" @click = 'login'>
                                登录
                            </van-button>
                        </div>

                        <div class="login-btn">
                            <van-button round block type="default" @click = 'openRegister'>注册</van-button>
                        </div>
                    </van-form>
                </div>
            </div>
        </div>

        <van-popup class="popup-box" closeable v-model="isRegister" position = "bottom">
            <div class="popup-item">
                <div class="register-text">注册</div>
                <van-form>
                    <van-field
                        label="手机号"
                        placeholder="11位数字"
                        v-model = "userRegisterInfo.phone"
                    />
                    <van-field
                        label="昵称"
                        placeholder="1-10位字符(含数字,字母,下划线)"
                        v-model = "userRegisterInfo.nickName"
                    />
                    <van-field
                        :type="isPassword ? 'password' : 'text'"
                        label="密码"
                        placeholder="6-16位字符且以字母开头"
                        v-model = "userRegisterInfo.password"
                        :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
                        @click-right-icon = "viewPassword"
                    />
                    <div class="login-btn">
                        <van-button round block type="info" native-type="submit" color = "#0c34ba" @click = "register">
                            注册
                        </van-button>
                    </div>
                </van-form>
            </div>
        </van-popup>
    </div>
</template>

<script>
import "../assets/less/login.less"
import {validForm} from '../assets/js/validForm'

export default {
    data(){
        return {
            // 登录表单信息
            userLoginInfo: {
                phone: '',
                password: ''
            },

            // 注册表单信息
            userRegisterInfo: {
                phone: '',
                nickName: '',
                password: ''
            },

            // 密码是否可看
            isPassword: true,

            // 注册窗口是否弹出
            isRegister: false,
        }
    },

    methods: {
        // 右上角关闭按钮，还没做啊啊！！！
        back() {
            this.$router.go(-1)
        },

        // 查看密码
        viewPassword() {
           this.isPassword = !this.isPassword;
        },

        // 弹出注册面板
        openRegister() {
            // 弹出注册面板前先把登录内容清空
            for(let key in this.userLoginInfo) {
                this.userLoginInfo[key] = ''
            }
            this.isRegister = true;
        },

        // 注册
        register() {
            // 获取用户注册信息
            let userInfo = this.userRegisterInfo;

            // 验证表单
            let o = {
                phone: {
                    value: userInfo.phone,
                    // 手机号，第一位1，第二位3-9，然后9位数，共11位数
                    reg: /^1[3-9]\d{9}$/,
                    errorMsg: "手机号码格式不正确"  
                },
                nickName: {
                    value: userInfo.nickName,
                    // 1到10位 字母数字下划线，汉字
                    reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
                    errorMsg: '昵称格式不正确'
                },
                password: {
                    value: userInfo.password,
                    // 密码，字母开头，共6到16位字符(数字，字母)
                    reg: /^[A-Za-z]\w{5,15}$/,
                    errorMsg: '密码格式不正确'
                }
            }

            if(!validForm.valid(o)) {
                // 验证不通过
                return
            }

            // localStorage模拟实现登录注册，localStorage的userInfo存储用户信息
            if(JSON.parse(localStorage.getItem('userInfo'))) {
                // 获取所有用户的数据
                let info = JSON.parse(localStorage.getItem('userInfo'))

                // 若有相同手机号则无法注册
                for(let i = 0; i < info.length; i++) {
                    if(userInfo.phone == info[i].phone) {
                        // 提示
                        this.$notify({ 
                            type: 'danger', 
                            message: '该手机号已被注册'
                        });
                        return
                    }
                }

                // 存储用户注册信息
                info.push(userInfo)

                // 为注册账号创建信息 存在userData里面
                let data = {
                    // 收藏内容
                    likes:[],

                    // 购物袋
                    shopbag: [],

                    // 地址信息
                    addressInfo: [],

                    // 用户头像
                    userImg: '',

                    // 用户背景图
                    userBg: '',

                    // 个性签名
                    desc: '',

                    // 订单
                    order: [],
                }
                info[info.length-1].userData = data
                localStorage.setItem('userInfo', JSON.stringify(info))
            }

            this.$notify({ 
                type: 'success', 
                message: '注册成功'
            });

            // 关闭注册窗口
            this.isRegister = false
            
            // 清空注册表单数据
            for(let key in userInfo) {
                userInfo[key] = ''
            }
        },

        // 登录
        login() {
            let userInfo = this.userLoginInfo
            let o = {
                phone: {
                    value: userInfo.phone,
                    reg: /^1[3-9]\d{9}$/,
                    errorMsg:'手机格式不正确'
                },
                password: {
                    value: userInfo.password,
                    reg: /^[A-Za-z]\w{5,15}$/,
                    errorMsg: '密码格式不正确'
                }
            }

            // 验证表单
            if(!validForm.valid(o)) {
                // 验证不通过
                return
            }

            // 获取所有用户的数据
            let info = JSON.parse(localStorage.getItem('userInfo'))

            // 手机号 密码 是否正确
            for(let i = 0; i < info.length; i++) {
                // 手机是否注册
                if(userInfo.phone == info[i].phone) {
                    // 密码是否正确
                    if(userInfo.password == info[i].password) {
                        this.$notify({ 
                            type: 'success', 
                            message: '登录成功',
                            duration: 1000
                        });

                        // 确认登录成功，并把当前手机号传给vuex
                        this.$store.commit('login',userInfo.phone)

                        // 登录成功后跳转
                        this.$router.go(-1)

                        // 找出当前账号索引值
                        this.$store.commit('setUserData')
                    }else{
                       this.$notify({ 
                            type: 'danger', 
                            message: '密码错误'
                        }); 
                        return
                    }
                }
            }

            // 检测手机号是否已注册  
            let phoneArry = []
            for(let i = 0; i < info.length; i++) {
                phoneArry.push(info[i].phone)
            }
            if(phoneArry.indexOf(userInfo.phone) == -1) {
                this.$notify({ 
                    type: 'danger', 
                    message: '该手机号未注册'
                }); 
                return
            }

            // 清空注册表单数据
            for(let key in userInfo) {
                userInfo[key] = ''
            }
        }
    },

    created() {
        // 如果localStorage 的 userfo为空则创建空数组
        if(!JSON.parse(localStorage.getItem('userInfo'))) {
            localStorage.setItem('userInfo', JSON.stringify([]))
        }
    },
};
</script>