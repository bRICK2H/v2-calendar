<template>
	<div class="v2dp-row-month">
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
	.v2dp-row-month {
		width: 100%;
		display: flex;
		justify-content: space-between;

		&:not(:last-child) {
			border-bottom: var(--border-width) solid #fff;
		}
	}
</style>