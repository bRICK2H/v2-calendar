<template>
	<div class="v2dp-week-picker">
		<div v-for="date of getDates"
			:key="date.id"
			:class="{
				'v2dp-week-item__slct-day': date.isSlctDay,
				'v2dp-week-item__curr-day': date.isCurrDay,
				'v2dp-week-item__curr-week': date.isCurrWeek,
				'v2dp-week-item__slctd-dbl': date.isDblSlctd,
				'v2dp-week-item__slctd-days': date.isSlctdDays,
			}"
			class="v2dp-week-item"
			@click="selectDate(date)"
		>
			<div class="v2dp-week-item-content"
				:class="{ 'v2dp-week-item-content__slctd-days': date.isSlctdDays }"
			>
				<span class="v2dp-week-item-name">
					{{ date.name }}
				</span>
				<span class="v2dp-week-item-day">
					{{ date.day }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'VWeekPicker',
	props: {
		weeks: {
			type: Array,
			require: true
		},
		months: {
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
		sideOffset: {
			type: Object,
			require: true
		}
	},
	computed: {
		getDates() {
			if (!this.switchedDate) return []
			
			const array = new Array(7).fill(null)

			return array.map((_, i) => {
				const selectedDates = this.selectedDates.map(date => date.toLocaleDateString())
				const date = new Date(
					Date.parse(this.switchedDate) + this.calcDayOffset(i)
				)
				const currDate 	= this.todaysDate
					,	currDay 		= currDate.getDate()
					,	currMonth 	= currDate.getMonth()
					,	currYear 	= currDate.getFullYear()
					,	slctDay		= this.selectedDate?.getDate()
					,	slctMonth	= this.selectedDate?.getMonth()
					,	slctYear		= this.selectedDate?.getFullYear()
					,	name			= this.weeks[i]
					,	day 			= date.getDate()
					,	month 		= date.getMonth()
					,	year 			= date.getFullYear()
					,	localeDate	= date.toLocaleDateString()
					,	id 			= `week:${localeDate}`
					,	isCurrWeek 	= this.currMonth === month
					,	isCurrDay 	= currDay === day && currMonth === month && currYear === year
					,	isSlctDay	= slctDay === day && slctMonth === month && slctYear === year
					,	isSlctdDays = selectedDates.includes(localeDate)
					,	isDblSlctd	= isSlctDay && isSlctdDays

				return {
					id,
					day,
					date,
					year,
					name,
					month,
					isSlctDay,
					isCurrDay,
					isDblSlctd,
					isCurrWeek,
					isSlctdDays
				}
			})
		}
	},
	data: () => ({
		date: null,
		month: null
	}),
	methods: {
		selectDate({ date }) {
			this.$emit('select-date', date)
		},

		getDayWeekFirst(date) {
			return new Date(
				Date.parse(date) - this.calcDayOffset(this.calcDayWeek(date))
			)
		},
		getDayWeekLast(date) {
			return new Date(
				Date.parse(date) + this.calcDayOffset(6 - this.calcDayWeek(date))
			)
		},
		// getDayWeek(date) {
		// 	const nativeDay = date.getDay()
		// 	return nativeDay === 0 ? 6 : nativeDay - 1
		// },
		// calcDayOffset(days) {
		// 	return 60 * 60 * 24 * days * 1000
		// },
	},
	watch: {
		sideOffset: {
			deep: true,
			handler({ side, days }) {
				const switchedDate = days === 0
					? this.getDayWeekFirst(this.todaysDate)
					: new Date(Date.parse(this.switchedDate) + (this.calcDayOffset(days) * side))

				const currDayWeek = side === 0
					? this.todaysDate
					: side > 0
						? this.getDayWeekFirst(switchedDate)
						: this.getDayWeekLast(switchedDate)

				const currMonth = currDayWeek.getMonth()
				const currYear = currDayWeek.getFullYear()

				this.$emit('switch-date', { switchedDate, currYear, currMonth })
			}
		}
	},
	created() {
		const date 	= this.selectedDate
			,	month = date.getMonth()
			,	year 	= date.getFullYear()

		this.$emit('switch-date', {
			currYear: year,
			currMonth: month,
			switchedDate: this.getDayWeekFirst(date),
		})
	},
}
</script>

<style lang="scss">
	.v2dp-week-picker {
		display: flex;
		justify-content: space-between;
	}

	.v2dp-week-item {
		flex: 0 1 calc(100% / 7 - 5px);
		height: 0;
		padding-top: calc(100% / 7 - 7px + 18px);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 24px;
		border: 2px solid transparent;
		transition: box-shadow .2s;
		color: #b7b7cc;
		position: relative;
		cursor: pointer;
		
		&:not(:last-of-type) {
			margin-right: 5px;
		}
		&:hover {
			box-shadow: 0 0 8px 0 #1f1f33;
		}
		&:active {
			box-shadow: 0 0 4px 0 #1f1f33;
		}

		&__curr-week {
			color: #000;
		}
		&__curr-day {
			background: #f6f6fb;
		}
		&__slct-day {
			background: #1f1f33;

			.v2dp-week-item-name,
			.v2dp-week-item-day {
				color: #fff;
			}
		}
		&__slctd-days {
			border: 2px solid #eeedf7;
		}
		&__slctd-dbl {
			border: 2px solid #1f1f33;
		}
	}
	.v2dp-week-item-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 24px;
		
		&__slctd-days {
			border: 2px solid #fff;
		}
	}
	.v2dp-week-item-name {
		font-size: calc(9px + .5vmin);
		color: #b7b7cc;
	}
	.v2dp-week-item-day {
		font-size: calc(15px + .5vmin);
	}
</style>