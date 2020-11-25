<template>
    <div class="login">
        <div class="login-box">
            <van-nav-bar right-text="关闭" @click-right="back">
                <template #left>
                    <div class="left-text">
                        <div class="logo">
                            <img class="auto-img" src="../assets/images/logo.svg" alt="">
                        </div>
                        <div class="logo-title">Luckin Coffee</div>
                    </div>
                </template>
                <!-- <template #right>
                    <div>关闭</div>
                </template> -->
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
    </div>
</template>

<script>
    import "../assets/less/forgot.less"
    export default {
        
    }
</script>