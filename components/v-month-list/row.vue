<template>
	<div class="v2dp-month-row">
		<VMonthCell v-for="date of row"
			:key="date.id"
			:date="date"
			:isMarkedDay="isMarkedDay"
			@select-date="$emit('select-date', date)"
		/>
	</div>
</template>

<script>
import VMonthCell from './cell.vue'

export default {
	name: 'VMonthRow',
	components: {
		VMonthCell
	},
	props: {
		row: {
			type: Array,
			default: () => ([])
		},
		isMarkedDay: {
			type: Boolean,
			default: true
		},
	}
}
</script>
<style lang="scss">
	.v2dp-month-row {
		width: 100%;
		display:flex;
		justify-content: space-between;
		border: 2px solid #fff;
	}
</style>