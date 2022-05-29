<template>
	<div class="v2dp-row-month-day">
		<VMonthDayCell v-for="date of row"
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

		</VMonthDayCell>
	</div>
</template>

<script>
import VMonthDayCell from './cell.vue'

export default {
	name: 'VMonthDayRow',
	components: {
		VMonthDayCell
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
	.v2dp-row-month-day {
		width: 100%;
		display: flex;
		justify-content: space-between;

		&:not(:last-child) {
			border-bottom: calc(var(--border-width) * 5) solid #fff;
		}
	}
</style>