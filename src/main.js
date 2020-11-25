import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// lib-flexible 用于设置 rem 基准值
import 'lib-flexible/flexible'  

// 全局引入data数据
import data from "./assets/js/data"
Vue.prototype.data = data

//vant组件
import { 
  NavBar, 
  Form,
  Field,
  Button,
  Popup,
  Tabbar,
  TabbarItem,
  Toast,
  Notify,
  Swipe, 
  SwipeItem,
  Search,
  Skeleton,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  Stepper,
  SwipeCell,
  Cell,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  Empty,
  Icon,
  AddressList,
  AddressEdit,
  Uploader,
  Tab,
  Tabs,
  Dialog 
} from 'vant'

Vue
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Button)
  .use(Popup)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Toast)
  .use(Notify)
  .use(Swipe)
  .use(SwipeItem)
  .use(Search)
  .use(Skeleton)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Stepper)
  .use(SwipeCell)
  .use(Cell)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(Empty)
  .use(Icon)
  .use(AddressList)
  .use(AddressEdit)
  .use(Uploader)
  .use(Tab)
  .use(Tabs)
  .use(Dialog)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
