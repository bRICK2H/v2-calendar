<template>
	<div class="v2dp-month-container"
		:style="{
			'--size-day': sizeDay,
			'--height-cell': heightCell,
			'--height-week': heightWeek,
			'--height-range': heightRange,
			'--border-width': borderWidth,
			'--font-size-day': fontSizeDay,
			'--font-size-day-week': fontSizeDayWeek,
			'--offset-bottom-day-week': offsetBottomDayWeek
		}"
	>
		
		<div class="v2dp-week-names">
			<span v-for="(name, i) of weeks"
				:key="i"
				class="v2dp-week-name"
			>
				{{ name }}
			</span>
		</div>

		<div class="v2dp-month-list"
			ref="v2dp-month-list"
			@mouseleave="hoverDateRage = null"
		>
		
			<VMonthDayRow v-for="(row, i) of getMonthDays"
				:key="`${name}:${i}`"
				:row="row"
				:name="name"
				:cList="cList"
				:isMarkedDay="isMarkedDay"
				:isRangeMode="isRangeMode"
				:selectedDate="selectedDate"
				:hoverDateRage="hoverDateRage"
				@over-date="overDate"
				@select-date="selectDate"
			>
			
				<template v-slot:clear="data">
					<slot name="clear" v-bind="data" />
				</template>							

				<template v-slot:default="data">
					<slot v-bind="data" />
				</template>
				
			</VMonthDayRow>

		</div>
		
	</div>
</template>

<script>
import {
	splitDate,
	calcDayWeek,
	calcDayOffset
} from '../../../functions'

import VMonthDayRow from './row'

export default {
	name: 'VMonthDayList',
	components: {
		VMonthDayRow,
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
		weeks: {
			type: Array,
			require: true
		},
		months: {
			type: Array,
			require: true
		},
		cList: {
			type: Object,
			default: () => ({})
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
		currMonth: {
			type: Number,
			default: 0
		},
		currYear: {
			type: Number,
			default: 0
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
		sizeDay: 0,
		heightCell: 0,
		heightWeek: 0,
		heightRange: 0,
		borderWidth: 0,
		fontSizeDay: 0,
		fontSizeDayWeek: 0,
		offsetBottomDayWeek: 0,
		hoverDateRage: null
	}),
	computed: {
		firstCurrentDate() {
			return new Date(this.currYear, this.currMonth, 1)
		},
		firstCurrentDayWeek() {
			return calcDayWeek(this.firstCurrentDate)
		},
		lastCurrentDate() {
			return new Date(this.currYear, this.currMonth + 1, 0)
		},
		preventMonth() {
			const	firstPreventDate = new Date(
				Date.parse(this.firstCurrentDate) - calcDayOffset(this.firstCurrentDayWeek)
			)

			return this.createMonthDays(this.firstCurrentDayWeek, firstPreventDate)
		},
		currentMonth() {
			const	{ _day: lastCurrentDay } = splitDate(this.lastCurrentDate)

			return this.createMonthDays(lastCurrentDay, this.firstCurrentDate)
		},
		nextMonth() {
			const	{ _day: lastCurrentDay } = splitDate(this.lastCurrentDate)
				,	lastDayWeekOfCurr = calcDayWeek(this.lastCurrentDate)
				,	firstDateOfNext = new Date(this.currYear, this.currMonth + 1, 1)
				, 	nextSize = 6 - lastDayWeekOfCurr
				,	isAdditionalRow = Math.floor(
					((this.firstCurrentDayWeek + lastCurrentDay) / 6) < 6
				)
				,	difineNextSize = isAdditionalRow ? nextSize + 7 : nextSize

			return this.createMonthDays(difineNextSize, firstDateOfNext)
		},
		getMonthDays() {
			const ROW_COUNT = 6
				,	CELL_COUNT = 7
				,	ROWS = new Array(ROW_COUNT).fill(null)
				,	{
					_day: currentDay,
					_year: currenYear,
					_month: currenMonth
				} = splitDate(this.todaysDate)
				,	{
					_day: selectedDay,
					_year: selectedYear,
					_month: selectedMonth
				} = splitDate(this.selectedDate)
				,	{
					_dateString: fromSelectedString
				} = splitDate(this.cList.from.selectedDate)
				,	eventDates = this.getEventDates()

			const dateList = [
				...this.preventMonth,
				...this.currentMonth,
				...this.nextMonth
			].map(date => {
				const	{
					_day: day,
					_year: year,
					_month: month,
					_dateString
				} = splitDate(date)
				,	id = `${this.name}:${_dateString}`
				,	name = this.weeks[calcDayWeek(date)]
				,	eventDate = eventDates.find(({ date }) => date === _dateString)
				,	isVisibleCurrentMonth = this.currMonth === month
				,	isEventDay = Boolean(eventDate)
				,	isSelectedDay = selectedDay === day
						&& selectedMonth === month
						&& selectedYear === year
				,	isEventSelectedDay = isSelectedDay
						&& isEventDay
				,	isEmptyDay = !isSelectedDay
						&& !isEventDay
						&& !isEventSelectedDay
				,	isCurrentDay = currentDay === day
						&& currenMonth === month
						&& currenYear === year
				,	isRangeDay = this.isRangeMode
						&& splitDate(this.cList.to.selectedDate)._dateString !== fromSelectedString
						&& (
							this.name === 'from'
								&& this.selectedDate <= date
								&& date <= this.cList.to.selectedDate
							|| this.name === 'to'
								&& this.selectedDate >= date
								&& this.cList.from.selectedDate <= date
						)
				,	isFirstRangeDay = isRangeDay
						&& fromSelectedString === _dateString
				,	isLastRangeDay = isRangeDay
						&& splitDate(this.cList.to.selectedDate)._dateString === _dateString
				,	isDisabledToRangeDay = this.isRangeMode
						&& this.name === 'to'
						&& this.cList.to.selectedDate > date
						&& this.cList.from.selectedDate > date
				,	isRangeMonthExist = this.isRangeMode
						&& this.cList.from.currYear === this.cList.to.currYear
						&& this.cList.from.currMonth === this.cList.to.currMonth
				,	isHiddenRangeFromNextDay = isRangeMonthExist
						&& this.name === 'from'
						&& date > this.lastCurrentDate
				,	isHiddenRangeToPrevDay = isRangeMonthExist
						&& this.name === 'to'
						&& date < this.firstCurrentDate
				,	classes = {
						parent: eventDate?.parent ?? null,
						children: eventDate?.children ?? []
					}

				return {
					id,
					date,
					year,
					name,
					month,
					title: day,
					classes,
					isEmptyDay,
					isEventDay,
					isRangeDay,
					isCurrentDay,
					isSelectedDay,
					isLastRangeDay,
					isFirstRangeDay,
					isEventSelectedDay,
					isDisabledToRangeDay,
					isVisibleCurrentMonth,
					isHiddenRangeToPrevDay,
					isHiddenRangeFromNextDay,
				}
			})

			return ROWS.map(() => dateList.splice(0, CELL_COUNT))
		},
	},
	methods: {
		selectDate({ date }) {
			this.$emit('select-date', date, this.name)
		},
		overDate({ date }) {
			this.hoverDateRage = date
		},
		createMonthDays(size, start) {
			const array = new Array(size).fill(null)

			return array.map((_, i) => {
				const date = new Date(
					Date.parse(start) + calcDayOffset(i)
				)

				return date
			})
		},
		getEventDates() {
			return this.selectedDates.map(options => {
					if (options instanceof Date) {
						return {
							date: options.toLocaleDateString()
						}
					} else {
						const { date, children, parent } = options
						
						return {
							parent,
							children,
							date: date.toLocaleDateString(),
						}
					}
			})
		},
		сalculatedSizes() {
			const monthList = this.$refs['v2dp-month-list']

			if (monthList) {
				const width = Math.floor(monthList.offsetWidth / 7)
					,	height = Math.floor(width * 1.3)
				
				this.heightCell = `${height}px`
				this.heightRange = `${width}px`
				this.sizeDay = `${Math.floor(width / 1.13)}px`
				this.heightWeek = `${Math.floor(height / 2)}px`
				this.fontSizeDay = `${Math.floor(width * .36)}px`
				this.borderWidth = `${Math.floor(width * .06)}px`
				this.fontSizeDayWeek = `${Math.floor(width * .26)}px`
				this.offsetBottomDayWeek = `-${Math.floor(width * .06)}px`
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
	}
}
</script>

<style lang="scss">
	.v2dp-week-names {
		height: var(--height-week);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.v2dp-week-name {
		flex: 1 1 100%;
		font-size: var(--font-size-day-week);
		text-align: center;
		color: #b7b7cc;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		position: relative;
	}
	.v2dp-month-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
</style>