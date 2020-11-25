import Vue from 'vue'
import { Notify } from 'vant'
Vue.use(Notify)

class ValidForm {
    // 验证表单
    valid(o) {
        for(let key in o) {
            // 验证不通过
            if(!o[key].reg.test(o[key].value)) {
                // 提示
                Notify({ 
                    type: 'danger', 
                    message: o[key].errorMsg
                });
                // 验证失败
                return false
            }
        }

        // 验证通过
        return true
    }
}

export const validForm = new ValidForm()