import Vue from 'vue'
import functions from './functions'
import V2DatePicker from './v2-datepicker.vue'

Vue.config.productionTip = false

for (const name in functions) {
	Vue.prototype[name] = functions[name]
}


export default V2DatePicker
