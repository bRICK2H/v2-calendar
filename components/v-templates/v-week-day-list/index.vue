<template>
	<div class="v2dp-week-day-list"
		ref="v2dp-week-day-list"
		:style="{
			'--width-day': widthDay,
			'--height-day': heightDay,
			'--height-cell': heightCell,
			'--border-width': borderWidth,
			'--font-size-day': fontSizeDay,
			'--font-size-day-week': fontSizeDayWeek,
		}"
	>
		

		<VWeekCell v-for="date of getWeekDays"
			:date="date"
			:key="date.id"
			:isMarkedDay="isMarkedDay"
			@select-date="selectDate(date)"
		>

			<template v-slot:clear="data">
				<slot name="clear" v-bind="data" />
			</template>

			<template v-slot:default="data">
				<slot v-bind="data" />
			</template>
			
		</VWeekCell>

	</div>
</template>

<script>

import {
	splitDate,
	calcDayOffset
} from '../../../functions'

import VWeekCell from './cell'

export default {
	name: 'VWeekDayList',
	components: {
		VWeekCell
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
		widthDay: 0,
		heightDay: 0,
		heightCell: 0,
		borderWidth: 0,
		fontSizeDay: 0,
		fontSizeDayWeek: 0,
	}),
	computed: {
		getWeekDays() {
			const weeks = this.createWeekDays(7, this.switchedDate)
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
				,	title = day
				,	name = this.weeks[i]
				,	id = `${this.name}:${_dateString}`
				,	isVisibleCurrentWeek = this.currMonth === month
				,	isEventDay = preSelectedStringDates.includes(_dateString)
				,	isSelectedDay	= selectedDay === day && selectedMonth === month && selectedYear === year
				,	isEventSelectedDay = isSelectedDay && isEventDay
				,	isEmptyDay = !isSelectedDay && !isEventDay && !isEventSelectedDay
				,	isCurrentDay = currentDay === day && currenMonth === month && currenYear === year

				return {
					id,
					date,
					year,
					name,
					title,
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
			this.$emit('select-date', date, this.name)
		},
		createWeekDays(size, start) {
			const array = new Array(size).fill(null)

			return array.map((_, i) => {
				const date = new Date(
					Date.parse(start) + calcDayOffset(i)
				)

				return date
			})
		},
		сalculatedSizes() {
			const weekList = this.$refs['v2dp-week-day-list']

			if (weekList) {
				const width = Math.floor(weekList.offsetWidth / 7)

				this.heightCell = `${Math.floor(width * 1.7)}px`
				this.widthDay = `${Math.floor(width / 1.13)}px`
				this.fontSizeDay = `${Math.floor(width * .36)}px`
				this.borderWidth = `${Math.floor(width * .06)}px`
				this.fontSizeDayWeek = `${Math.floor(width * .26)}px`
				this.heightDay = `${Math.floor((width * 1.7) / 1.13)}px`
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
	.v2dp-week-day-list {
		display: flex;
		justify-content: space-between;
	}
</style>