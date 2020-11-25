<template>
    <div class="my">
        <div class="my-bg">
            <van-uploader :after-read="upload" class="uploader-box bg" :style="{backgroundImage: `url(${userInfo.userData.userBg})`}" :disabled = 'isLogin ? false : true'>
                <div ></div>
            </van-uploader>
            <!-- <div class="bg"></div> -->
        </div>
        <div class="my-content">
            <div class="my-boxing">
                <div class="my-box" v-if="isLogin">
                    <div class="my-img">
                        <div class="img-box">
                            <img class="auto-img" :src="userInfo.userData.userImg == '' ? require('../../assets/images/userIcon.svg') : userInfo.userImg" alt="">
                        </div>
                        <div class="my-info">
                            <div class="nickname">{{userInfo.nickName}}</div>
                            <div class="desc">
                                {{userInfo.userData.desc == '' ? '这个家伙很懒，什么都没留下' : userInfo.userData.desc}}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="not-login">
                    <span @click="goLogin">请先登录</span>
                </div>

                <div class="lists">
                    <van-cell :title="item.title" :to="item.to" size="large" is-link v-for="(item,index) in lists" :key="index"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../../assets/less/my.less'
    export default {
        data() {
            return {
                lists: [
                    {title: '个人资料', to: {name: 'Account'}},
                    {title: '我的订单', to: {name: 'Order'}},
                    {title: '我的收藏', to: {name: 'Like'}},
                    {title: '地址管理', to: {name: 'Address'}},
                    {title: '安全中心', to: {name: 'Secure'}},
                ],
                isLogin: false,
                userInfo: {
                    userData: {
                        userBg: require('../../assets/images/userBg.jpg'),
                    }
                },
            }
        },

        methods: {
            // 跳转登录界面
            goLogin() {
                this.$router.push({name: 'Login'})
            },

            // 查询用户信息
            getUserInfo() {
               let data = JSON.parse(localStorage.getItem('userInfo'))
               this.userInfo = data[this.$store.state.index]
               this.userInfo.userData.userBg = require('../../assets/images/userBg.jpg')
            },

            // 上传背景
            upload(file) {
                // 限制文件类型
                let imgTypes = ['png','gif','jpg','jpeg','webp','svg','bmp','tif','fpx','pcx','tga','exif','psd','cdr','pcd','dxf','ufo','eps','ai','raw','wmf']
                // imgTypes.indexOf(file.file.type.split('/')[1]) === -1
                if(imgTypes.indexOf(file.file.name.split('.')[file.file.name.split('.').length-1]) === -1) {
                    this.$notify({
                        message: '不支持该文件类型',
                        color: '#fff',
                        background: '#0c34ba',
                        duration: 2000
                    })
                    return 
                }

                // 限制上传大小
                let maxSize = 1 * 1024 * 1024
                if(maxSize < file.file.size) {
                    this.$notify({
                        message: '上传文件大小不能超过' + maxSize / 1024 + 'Kb',
                        color: '#fff',
                        background: '#0c34ba',
                        duration: 2000
                    })
                    return 
                }
            }
        },

        created() {
            this.isLogin = this.$store.state.isLogin
            if(this.isLogin) {
                // 查询用户信息
                this.getUserInfo() 
            }
        }
    }
</script>