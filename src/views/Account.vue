<template>
    <div class="account">
        <van-nav-bar
            title="个人资料"
            left-text="返回"
            left-arrow
            :fixed="true"
            @click-left="back"
         />
        <div class="account-bg"></div>
        <div class="account-box">
            <div class="list-box">
                <van-cell title="头像">
                    <div class="avatar fr">
                        <img class="auto-img" src="../assets/images/userIcon.svg" alt="">
                        <van-uploader class="uploader-box" :after-read="uploadUserImg"/>
                    </div>
                </van-cell>
                <van-cell title="昵称">
                    <div class="fr">
                        <input class="nickname" type="text" v-model="userInfo.nickName" @change="modifyNickName" @focus="getOldName">
                    </div>
                </van-cell>
                <van-cell title="用户ID">
                    <div class="fr">2368148075</div>
                </van-cell>
                <van-cell title="手机号">
                    <div class="fr">{{userInfo.phone}}</div>
                </van-cell>

                <div class="desc-box">
                    <div class="desc-title">简介</div>
                    <div>
                        <textarea @change="modifyDesc" v-model="userInfo.userData.desc" class="text-area" placeholder="这家伙很懒，什么都没有留下"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "../assets/less/account.less"
    export default {
        data() {
            return{
                userInfo: {
                    userData: {
                        desc: ''
                    }
                },
                oldName: '',
            }
        },

        methods:{
            // 返回
            back() {
                this.$router.go(-1)
            },

            // 获取用户资料
            getUserInfo() {
                let data = JSON.parse(localStorage.getItem('userInfo'))
                this.userInfo = data[this.$store.state.index]
                this.oldName = this.userInfo.nickName
            },

            // 上传头像
            uploadUserImg() {},

            // 修改昵称
            modifyNickName() {
                // 1到10位 字母数字下划线，汉字   
                let rule = /^[\w\u4e00-\u9fa5]{1,10}$/
                let isPass = rule.test(this.userInfo.nickName)
                if(isPass) {
                    let data = JSON.parse(localStorage.getItem('userInfo'))
                    data[this.$store.state.index].nickName = this.userInfo.nickName
                    localStorage.setItem('userInfo',JSON.stringify(data))
                    this.$toast('修改昵称成功')
                }else{
                    let data = JSON.parse(localStorage.getItem('userInfo'))
                    data[this.$store.state.index].nickName = this.oldName
                    localStorage.setItem('userInfo',JSON.stringify(data))
                    this.getUserInfo()
                    this.$notify({
                        message: '昵称格式为1~10位字母数字下划线或汉字',
                        duration: 2000,
                        type: 'danger'
                    })
                    return
                }
            },

            //记录之前的昵称
            getOldName() {
                this.oldName = this.userInfo.nickName
            },

            // 修改简介
            modifyDesc() {
                let data = JSON.parse(localStorage.getItem('userInfo'))
                data[this.$store.state.index].userData.desc = this.userInfo.userData.desc
                localStorage.setItem('userInfo',JSON.stringify(data))
                this.$toast('修改简介成功')
            }
        },

        created() {
            // 跳转登录
            if(!this.$store.state.isLogin) {
                this.$toast("清先登录后再操作")
                return this.$router.replace({name: 'Login'})
            }

            this.getUserInfo()
        },
    }
</script>