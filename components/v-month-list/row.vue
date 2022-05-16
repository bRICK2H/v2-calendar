<template>
	<div class="v2dp-row-month">
		<VMonthCell v-for="date of row"
			:key="date.id"
			:date="date"
			:name="name"
			:cList="cList"
			:isMarkedDay="isMarkedDay"
			:isRangeMode="isRangeMode"
			:selectedDate="selectedDate"
			:hoverDateRage="hoverDateRage"
			@over-date="$emit('over-date', date)"
			@select-date="$emit('select-date', date)"
		>
			<template v-slot:clear="data">
				<slot name="clear" v-bind="data" />
			</template>							

			<template v-slot:default="data">
				<slot v-bind="data" />
			</template>
		</VMonthCell>
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
		name: {
			type: String,
			default: 'from'
		},
		row: {
			type: Array,
			default: () => ([])
		},
		cList: {
			type: Object,
			default: () => ({})
		},
		isMarkedDay: {
			type: Boolean,
			default: true
		},
		isRangeMode: {
			type: Boolean,
			default: true
		},
		selectedDate: {
			type: Date,
			default: new Date
		},
		hoverDateRage: null,
	},
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