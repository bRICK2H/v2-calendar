<template>
	<div class="v2dp-months-list"
		ref="v2dp-months-list"
		:style="{
			'--margin': margin,
			'--width-cell': widthCell,
			'--height-cell': heightCell,
			'--border-width': borderWidth,
			'--border-radius': borderRadius,
			'--font-size-month': fontSizeMonth,
		}"
	>
		<V2MonthsListCell
			v-for="(month, i) of getMonthsList"
			:key="month.name"
			:month="month"
			:isMarkedDay="isMarkedDay"
			@select-month="$emit('select-month', i)"
		/>
	</div>
</template>

<script>
import V2MonthsListCell from './cell'
import {
	splitDate,
} from '../../../functions'

export default {
	name: 'V2MonthsList',
	components: {
		V2MonthsListCell
	},
	props: {
		name: {
			type: String,
			default: 'from'
		},
		months: {
			type: Array,
			default: () => ([])
		},
		cList: {
			type: Object,
			default: () => ({})
		},
		currMonth: {
			type: Number,
			default: 0
		},
		todaysDate: {
			type: Date,
			default: new Date
		},
		selectedDate: {
			type: Date,
			default: new Date
		},
		selectedDates: {
			type: Array,
			default: () => ([])
		},
		isMarkedDay: {
			type: Boolean,
			default: true
		},
		isRangeMode: {
			type: Boolean,
			default: true
		}
	},
	data: () => ({
		margin: 0,
		widthCell: 0,
		heightCell: 0,
		borderWidth: 0,
		borderRadius: 0,
		fontSizeMonth: 0,
	}),
	computed: {
		getMonthsList() {
			const	{
				_day: selectedDay,
				_year: selectedYear,
				_month: selectedMonth
			} = splitDate(this.selectedDate)
			,	{
				_month: todayMonth
			} = splitDate(this.todaysDate)
			,	eventsMonths = [
				...new Set(
					this.selectedDates.map(date => {
						const { _month } = splitDate(date)
						return _month
					})
				)
			]

			const {
				_day: toSelectedDay,
				_year: toSelectedYear,
				_month: toSelectedMonth,
			} = splitDate(this.cList.to.selectedDate)
			const {
				_day: fromSelectedDay,
				_year: fromSelectedYear,
				_month: fromSelectedMonth,
			} = splitDate(this.cList.from.selectedDate)

			console.warn(eventsMonths, this.name)

			return this.months.map((month, i) => {
				console.log(this.cList.from.selectedDate, new Date(toSelectedYear, i, fromSelectedDay), this.currMonth)
				const isCurrentMonth = i === todayMonth
					,	isSelectedMonth = i === selectedMonth
					,	isEventMonth = eventsMonths.includes(i)
					,	isEmptyMonth = !isSelectedMonth && !isEventMonth
					,	isDisabledToRangeMonth = this.isRangeMode && this.name === 'to'
					// ! ПРодумать disabledRAngeMonth при появлении и switched
						// && this.cList.to.selectedDate > new Date(toSelectedYear, i, this.cList.from.currDay)

						// && this.cList.from.selectedDate > new Date(toSelectedYear, i, fromSelectedDay)
						// && this.cList.from.selectedDate >= new Date(toSelectedYear, i, toSelectedDay)
						
						// && this.cList.to.selectedDate.getMonth() > i && this.cList.from.selectedDate.getMonth() > i
						// && this.cList.to.selectedDate > date && this.cList.from.selectedDate > date
						// && this.cList.to.selectedDate > date && this.cList.from.selectedDate > date
				
				return {
					index: i,
					name: month,
					isEmptyMonth,
					isEventMonth,
					isCurrentMonth,
					isSelectedMonth,
					isDisabledToRangeMonth: isDisabledToRangeMonth,
					isEventSelectedMonth: isEventMonth && isSelectedMonth
				}
			})
		}
	},
	methods: {
		сalculatedSizes() {
			const weekList = this.$refs['v2dp-months-list']

			if (weekList) {
				// По окончанию разобраться с высостой
				const containerWidth = weekList.offsetWidth
					,	width = Math.floor(containerWidth / 3)
					,	height = Math.floor(width / 1.5)
					,	margin = Math.floor(width * .06)

				this.heightCell = `${height}px`
				this.borderRadius = `${height}px`
				this.margin = `${Math.floor(margin)}px`
				this.borderWidth = `${Math.floor(width * .03)}px`
				this.fontSizeMonth = `${Math.floor(width * .15)}px`
				this.widthCell = `${Math.floor(width - (margin / 2))}px`
			}
		}
	},
	watch: {
		width() {
			this.сalculatedSizes()
		},
	},
	mounted() {
		this.сalculatedSizes()
		window.addEventListener('resize', this.сalculatedSizes)
	},
}
</script>

<style lang="scss">
	.v2dp-months-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
</style>