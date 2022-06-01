<template>
	<div class="v2dp-months-list"
		ref="v2dp-months-list"
		:style="{
			'--padding-top': paddingTop,
			'--height-cell': heightCell,
			'--height-slot': heightSlot,
			'--height-range': heightRange,
			'--border-width': borderWidth,
			'--border-radius': borderRadius,
			'--width-content': widthContent,
			'--height-content': heightContent,
			'--font-size-month': fontSizeMonth,
		}"

		@mouseleave="hoverMonth = null"
	>
		<V2MonthsListCell
			v-for="(month, i) of getMonthsList"
			:key="month.id"
			:name="name"
			:month="month"
			:cList="cList"
			:hoverMonth="hoverMonth"
			:isMarkedDay="isMarkedDay"
			:isRangeMode="isRangeMode"

			@select-month="$emit('select-month', i)"
			@over-month="hoverMonth = month"
		>

			<template v-slot:clear="data">
				<slot name="clear" v-bind="data" />
			</template>

			<template v-slot:default="data">
				<slot v-bind="data" />
			</template>
		
		</V2MonthsListCell>
	</div>
</template>

<script>
import V2MonthsListCell from './cell'
import {
	splitDate,
	getResetedDateString
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
		paddingTop: 0,
		heightCell: 0,
		heightSlot: 0,
		heightRange: 0,
		borderWidth: 0,
		borderRadius: 0,
		widthContent: 0,
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
			,	eventDates = this.getEventDates()
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

			return this.months.map((month, i) => {
				const id = `${this.name}:${month}`
					,	date = new Date(this.currYear, i, selectedDay)
					,	dateString = getResetedDateString(new Date(this.currYear, i, 1))
					,	eventDate = eventDates.find(({ _month, _year }) => {
						return i === _month && this.currYear === _year
					})
					,	isCurrentMonth = i === todayMonth
							&& todayYear === this.currYear
					,	isSelectedMonth = i === selectedMonth
							&& selectedYear === this.currYear
					,	isEventMonth = Boolean(eventDate)
					,	isEmptyMonth = !isSelectedMonth && !isEventMonth
					,	isEventSelectedMonth = isEventMonth && isSelectedMonth
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
					, 	isBeforeFirstRangeMonth = isRange
							&& fromSelected._month !== toSelected._month
							&& fromSelected._month - 1 === i
					, 	isLastRangeMonth = isRange
							&& (
								this.name === 'to'
									&& selectedDateString === date.toLocaleDateString()
								|| this.name === 'from'
									&& toSelected._year === this.currYear
									&& toSelected._month === i
							)
					,	classes = {
							parent: eventDate?.parent ?? null,
							children: eventDate?.children ?? []
					}

				return {
					id,
					date,
					classes,
					index: i,
					dateString,
					title: month,
					selectedMonth,
					isRangeMonth,
					isEmptyMonth,
					isEventMonth,
					isCurrentMonth,
					isSelectedMonth,
					isLastRangeMonth,
					isFirstRangeMonth,
					isEventSelectedMonth,
					isDisabledToRangeMonth,
					isBeforeFirstRangeMonth,
				}
			})
		}
	},
	methods: {
		getEventDates() {
			const eventDates = this.selectedDates.map(options => {
				if (options instanceof Date) {
					const { _month, _year } = splitDate(options)

					return { _month, _year }
				} else {
					const { date, children, parent } = options
						,	{ _month, _year } = splitDate(date)
					
					return {
						_year,
						_month,
						parent,
						children,
					}
				}
			})

			return [
				...new Set(
					eventDates
						.map(({ _month, _year }) => ({ _month, _year }))
						.map(JSON.stringify)
				)
			].map(curr => {
				const { _month, _year } = JSON.parse(curr)
					,	condition = el => el._month === _month && el._year === _year
					,	uniqueDates = eventDates.filter(item => condition(item))
					,	parent = [
						...new Set(
							uniqueDates.map(item => item.parent ?? '').filter(item => item)
						)
					]
					,	children = [
						...new Set(
							uniqueDates.map(item => item.children ?? []).flat()
						)
					]

				return {
					_year,
					_month,
					parent,
					children
				}
			})
		},
		сalculatedSizes() {
			const monthList = this.$refs['v2dp-months-list']

			if (monthList) {
				const containerWidth = monthList.offsetWidth
					,	width = Math.floor(containerWidth / 3)
					,	height = Math.floor(width / 1.15)
					,	heightRange = Math.floor(height / 1.6)
					,	widthContent = Math.floor(width / 1.09)
				
				this.heightCell = `${height}px`
				this.heightSlot = `${height / 1.3}px`
				this.borderRadius = `${height}px`
				this.heightRange = `${heightRange}px`
				this.widthContent = `${widthContent}px`
				this.borderWidth = `${Math.floor(width * .03)}px`
				this.fontSizeMonth = `${Math.floor(width * .15)}px`
				this.paddingTop = `${Math.floor(containerWidth * .04)}px`
				this.heightContent = `${Math.floor(heightRange - (width - widthContent))}px`
			}
		},
	},
	watch: {
		width() {
			this.сalculatedSizes()
		},
		getMonthsList: {
			immediate: true,
			handler(dates) {
				this.$emit('visible-dates', {
					name: this.name,
					dates: dates
				})
			}
		}
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
		padding-top: var(--padding-top);
	}
</style>