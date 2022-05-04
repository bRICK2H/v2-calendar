<template>
	<div class="v2dp-week-list"
		ref="v2dp-week-list"
		:style="{
			'--height': height,
			'--border-width': borderWidth,
			'--font-size-day': fontSizeDay,
			'--font-size-day-week': fontSizeDayWeek,
			'--border-radius-outer': borderRadiusOuter,
			'--border-radius-inner': borderRadiusInner,
		}"
	>
		

		<VWeekItem v-for="date of getWeeks"
			:date="date"
			:key="date.id"
			:isMarkedDay="isMarkedDay"
			@select-date="selectDate(date)"
		>

			<slot v-bind="date"/>
			
		</VWeekItem>

	</div>
</template>

<script>

import {
	splitDate,
	calcDayOffset
} from '../../functions'

import VWeekItem from './item'

export default {
	name: 'VWeekList',
	components: {
		VWeekItem
	},
	props: {
		width: {
			type: Number,
			default: 0
		},
		weeks: {
			type: Array,
			require: true
		},
		todaysDate: {
			type: Date,
			default: new Date
		},
		switchedDate: {
			type: null,
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
		isMarkedDay: {
			type: Boolean,
			default: true
		}
	},
	data: () => ({
		height: 0,
		borderWidth: 0,
		fontSizeDay: 0,
		fontSizeDayWeek: 0,
		borderRadiusOuter: 0,
		borderRadiusInner: 0
	}),
	computed: {
		getWeeks() {
			const weeks = this.createWeek(7, this.switchedDate)
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
			,	preSelectedStringDates = this.selectedDates.map(date => date.toLocaleDateString())

			return weeks.map((date, i) => {
				const	{
					_day: day,
					_year: year,
					_month: month,
					_dateString
				} = splitDate(date)
				,	id = `week:${_dateString}`
				,	name = this.weeks[i]
				,	isVisibleCurrentWeek = this.currMonth === month
				,	isEventDay = preSelectedStringDates.includes(_dateString)
				,	isSelectedDay	= selectedDay === day && selectedMonth === month && selectedYear === year
				,	isEventSelectedDay = isSelectedDay && isEventDay
				,	isEmptyDay = !isSelectedDay && !isEventDay && !isEventSelectedDay
				,	isCurrentDay = currentDay === day && currenMonth === month && currenYear === year

				return {
					id,
					day,
					date,
					year,
					name,
					month,
					isEventDay,
					isEmptyDay,
					isCurrentDay,
					isSelectedDay,
					isEventSelectedDay,
					isVisibleCurrentWeek
				}
			})
		}
	},
	methods: {
		selectDate({ date }) {
			this.$emit('select-date', date)
		},
		createWeek(size, start) {
			const array = new Array(size).fill(null)

			return array.map((_, i) => {
				const date = new Date(
					Date.parse(start) + calcDayOffset(i)
				)

				return date
			})
		},
		setComputedSize() {
			const container = this.$refs['v2dp-week-list']
			const DOMRect = container?.firstChild?.getBoundingClientRect()

			if (DOMRect !== undefined) {
				const { width } = DOMRect

				this.fontSizeDay = `${width * .4}px`
				this.fontSizeDayWeek = `${width * .25}px`
				this.height = `${width + (width / 1.5)}px`
				this.borderRadiusInner = `${width * .5}px`
				this.borderRadiusOuter = `${width * .55}px`
				this.borderWidth = `${Math.floor(width * .06)}px`
			}
		}
	},
	watch: {
		width() {
			this.setComputedSize()
		},
	},
	mounted() {
		this.setComputedSize()
		window.addEventListener('resize', this.setComputedSize)
	}
}
</script>

<style lang="scss">
	.v2dp-week-list {
		display: flex;
		justify-content: space-between;
	}
</style>