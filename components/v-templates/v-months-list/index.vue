<template>
	<div class="v2dp-months-list"
		ref="v2dp-months-list"
		:style="{
			'--height-cell': heightCell,
			'--border-width': borderWidth,
			'--margin-bottom': marginBottom,
			'--border-radius': borderRadius,
			'--width-content': widthContent,
			'--height-content': heightContent,
			'--font-size-month': fontSizeMonth,
		}"
	>
		<V2MonthsListCell
			v-for="(month, i) of getMonthsList"
			:key="month.name"
			:name="name"
			:month="month"
			:cList="cList"
			:hoverMonth="hoverMonth"
			:isMarkedDay="isMarkedDay"
			:isRangeMode="isRangeMode"
			@select-month="$emit('select-month', i)"
			@over-month="hoverMonth = month"
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
		width: {
			type: Number,
			default: 0
		},
		months: {
			type: Array,
			default: () => ([])
		},
		cList: {
			type: Object,
			default: () => ({})
		},
		currDay: {
			type: Number,
			default: 0
		},
		currYear: {
			type: Number,
			default: 0
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
		switchedDate: {
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
		heightCell: 0,
		borderWidth: 0,
		borderRadius: 0,
		widthContent: 0,
		marginBottom: 0,
		heightContent: 0,
		fontSizeMonth: 0,

		hoverMonth: null,
	}),
	computed: {
		getMonthsList() {
			const	{
				_day: selectedDay,
				_year: selectedYear,
				_month: selectedMonth,
				_dateString: selectedDateString,
			} = splitDate(this.selectedDate)
			,	{
				_year: todayYear,
				_month: todayMonth
			} = splitDate(this.todaysDate)
			,	eventsMonths = this.selectedDates.map(date => splitDate(date))
			,	fromSelected = this.cList?.from?.selectedDate
					? splitDate(this.cList.from.selectedDate)
					: null
			,	toSelected = this.cList?.to?.selectedDate
					? splitDate(this.cList.to.selectedDate)
					: null
			,	fromDate = new Date(fromSelected._year, fromSelected._month, selectedDay)
			,	toDate = toSelected
					? new Date(toSelected._year, toSelected._month, selectedDay)
					: null
			,	isRange = this.isRangeMode && toSelected && toDate
			
			// потом начало и конец и одиноковые и hover
			return this.months.map((month, i) => {
				const date = new Date(this.currYear, i, selectedDay)
					,	isCurrentMonth = i === todayMonth
							&& todayYear === this.currYear
					,	isSelectedMonth = i === selectedMonth
							&& selectedYear === this.currYear
					,	isEventMonth = eventsMonths.some(({ _month, _year }) => {
							return i === _month && this.currYear === _year
						})
					,	isEmptyMonth = !isSelectedMonth && !isEventMonth
					,	isDisabledToRangeMonth = isRange
							&& this.name === 'to'
							&& i < fromSelected._month
							&& toSelected._year <= fromSelected._year
							&& this.currYear <= fromSelected._year
					,	isRangeMonth = isRange
							&& fromDate.toLocaleDateString() !== toDate.toLocaleDateString()
							&& (
								this.name === 'from'
									&& this.selectedDate <= date
									&& date <= toDate
								|| this.name === 'to'
									&& this.selectedDate >= date
									&& fromDate <= date
							)
					, 	isFirstRangeMonth = isRange
							&& (
								this.name === 'from'
									&& selectedDateString === date.toLocaleDateString()
								|| this.name === 'to'
									&& fromSelected._year === this.currYear
									&& fromSelected._month === i
							)
					, 	isLastRangeMonth = isRange
							&& (
								this.name === 'to'
									&& selectedDateString === date.toLocaleDateString()
								|| this.name === 'from'
									&& toSelected._year === this.currYear
									&& toSelected._month === i
							)

				return {
					index: i,
					name: month,
					isRangeMonth,
					isEmptyMonth,
					isEventMonth,
					selectedMonth,
					isCurrentMonth,
					isSelectedMonth,
					isLastRangeMonth,
					isFirstRangeMonth,
					year: selectedYear,
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
				const containerWidth = weekList.offsetWidth
					,	width = Math.floor(containerWidth / 3)
					,	height = Math.floor(width / 1.5)

				this.heightCell = `${height}px`
				this.borderRadius = `${height}px`
				this.borderWidth = `${Math.floor(width * .03)}px`
				this.fontSizeMonth = `${Math.floor(width * .15)}px`
				this.widthContent = `${Math.floor(width / 1.13)}px`
				this.heightContent = `${Math.floor(height / 1.23)}px`
				this.marginBottom = `${Math.floor(width - (width / 1.12))}px`
			}
		},
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