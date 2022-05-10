<template>
	<div class="v2dp-month-container"
		:style="{
			'--height': height,
			'--border-width': borderWidth,
			'--font-size-day': fontSizeDay,
			'--offset-size-day': offsetSizeDay,
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
		>
		
			<!-- <VMonthItem v-for="date of getMonths"
				:date="date"
				:key="date.id"
				:isMarkedDay="isMarkedDay"
				@select-date="selectDate(date)"
			>
			
				<slot v-bind="date" />
				
			</VMonthItem> -->

			<VMonthRow v-for="(row, i) of getMonths"
				:key="`${name}:${i}`"
				:row="row"
				:isMarkedDay="isMarkedDay"
				@select-date="selectDate"
			/>

		</div>
		
	</div>
</template>

<script>
import {
	splitDate,
	calcDayWeek,
	calcDayOffset
} from '../../functions'

// import VMonthItem from './item'
import VMonthRow from './row'

export default {
	name: 'VMonthList',
	components: {
		// VMonthItem,
		VMonthRow,
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
		height: 0,
		borderWidth: 0,
		fontSizeDay: 0,
		offsetSizeDay: 0,
		fontSizeDayWeek: 0,
		offsetBottomDayWeek: 0,
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

			return this.createMonth(this.firstCurrentDayWeek, firstPreventDate)
		},
		currentMonth() {
			const	{ _day: lastCurrentDay } = splitDate(this.lastCurrentDate)

			return this.createMonth(lastCurrentDay, this.firstCurrentDate)
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

			return this.createMonth(difineNextSize, firstDateOfNext)
		},
		getMonths() {
			const ROW_COUNT = 6
				,	CELL_COUNT = 7
				,	ROWS = new Array(ROW_COUNT).fill(null)
				,	 {
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
				,	preSelectedStringDates = this.selectedDates.map(date => date.toLocaleDateString())

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
				,	id = `date:${_dateString}`
				,	name = this.weeks[calcDayWeek(date)]
				,	isVisibleCurrentMonth = this.currMonth === month
				,	isEventDay = preSelectedStringDates.includes(_dateString)
				,	isSelectedDay = selectedDay === day && selectedMonth === month && selectedYear === year
				,	isEventSelectedDay = isSelectedDay && isEventDay
				,	isEmptyDay = !isSelectedDay && !isEventDay && !isEventSelectedDay
				,	isCurrentDay = currentDay === day && currenMonth === month && currenYear === year

				,	isRangeDay = this.isRangeMode && splitDate(this.cList.to.selectedDate)._dateString !== fromSelectedString
						&& (this.name === 'from' && this.selectedDate <= date && date <= this.cList.to.selectedDate
						|| this.name === 'to' && this.selectedDate >= date && this.cList.from.selectedDate <= date)
				,	isFirstRangeDay = isRangeDay && fromSelectedString === _dateString
				,	isLastRangeDay = isRangeDay && splitDate(this.cList.to.selectedDate)._dateString === _dateString
				,	isDisabledToRangeDay = this.isRangeMode && this.name === 'to'
						&& this.cList.to.selectedDate > date && this.cList.from.selectedDate > date
				,	isHiddenRangeFromNextDay = this.isRangeMode && this.name === 'from' && date > this.lastCurrentDate
				,	isHiddenRangeToPrevDay = this.isRangeMode && this.name === 'to' && date < this.firstCurrentDate

				return {
					id,
					day,
					date,
					year,
					name,
					month,

					isDisabledToRangeDay,
					isRangeDay,
					isFirstRangeDay,
					isLastRangeDay,
					isHiddenRangeFromNextDay,
					isHiddenRangeToPrevDay,
					
					isEmptyDay,
					isEventDay,
					isCurrentDay,
					isSelectedDay,
					isEventSelectedDay,
					isVisibleCurrentMonth
				}
			})

			return ROWS.map(() => dateList.splice(0, CELL_COUNT))
		},
	},
	methods: {
		selectDate({ date }) {
			this.$emit('select-date', date, this.name)
		},
		createMonth(size, start) {
			const array = new Array(size).fill(null)

			return array.map((_, i) => {
				const date = new Date(
					Date.parse(start) + calcDayOffset(i)
				)

				return date
			})
		},
		сalculatedSizes() {
			const monthList = this.$refs['v2dp-month-list']

			if (monthList) {
				const item = monthList.firstChild.firstChild
					,	DOMRect = item.getBoundingClientRect()

				if (DOMRect !== undefined) {
					const { width } = DOMRect

					// const height = Math.floor(width / 7)
					// const height = width / 7
					const height = width

					this.height = `${height}px`
					this.fontSizeDay = `${Math.floor(height * .42)}px`
					this.borderWidth = `${Math.floor(height * .07)}px`
					this.offsetSizeDay = `${Math.floor(height * .17)}px`
					this.fontSizeDayWeek = `${Math.floor(height * .3)}px`
					this.offsetBottomDayWeek = `-${Math.floor(height * .06)}px`

					// this.height = `${width}px`
					// this.fontSizeDay = `${Math.floor(width * .42)}px`
					// this.fontSizeDayWeek = `${Math.floor(width * .3)}px`
					// this.borderWidth = `${Math.floor(width * .07)}px`
					// this.offsetBottomDayWeek = `-${Math.floor(width * .06)}px`
				}
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
	}
}
</script>

<style lang="scss">
	.v2dp-week-names {
		height: calc(var(--height) / 1.5);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.v2dp-week-name {
		flex: 0 1 calc(100% / 7 - 7px);
		font-size: var(--font-size-day-week);
		text-align: center;
		color: #b7b7cc;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		position: relative;

		&:not(:last-of-type) {
			margin-right: 5px;
		}
	}
	.v2dp-month-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
</style>