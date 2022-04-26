<template>
	<div class="v2dp-month-picker">
		
		<div class="v2dp-week-names">
			<span v-for="(name, i) of weeks"
				:key="i"
				class="v2dp-week-name"
			>
				{{ name }}
			</span>
		</div>

		<div class="v2dp-month-list">
			<div v-for="date of getDates"
				:key="date.id"
				:class="{
					'v2dp-month-item__slct-day': date.isSlctDay,
					'v2dp-month-item__curr-day': date.isCurrDay,
					'v2dp-month-item__curr-month': date.isCurrMonth,
					'v2dp-month-item__slctd-dbl': date.isDblSlctd,
					'v2dp-month-item__slctd-days': date.isSlctdDays,
				}"
				class="v2dp-month-item"
				@click="selectDate(date)"
			>
				<span class="v2dp-month-day"
					:class="{ 'v2dp-month-day__slctd-days': date.isSlctdDays }"
				>
					{{ date.day }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'VMonthPicker',
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
			const date 	= this.date
				,	month = date.getMonth()
				,	year 	= date.getFullYear()
			
			const firstDateOfCurr 		= new Date(year, month, 1)
				,	lastDateOfCurr 		= new Date(year, month + 1, 0)
				,	firstDayWeekOfCurr 	= this.getDayWeek(firstDateOfCurr)
				,	lastDayWeekOfCurr 	= this.getDayWeek(lastDateOfCurr)
				,	firstDateOfNext 		= new Date(year, month + 1, 1)
				,	firstDateOfPrev 		= new Date(
						Date.parse(firstDateOfCurr) - this.calcDayOffset(firstDayWeekOfCurr)
					)

			const prev = this.createMonth(
				firstDayWeekOfCurr,
				firstDateOfPrev
			)

			const curr = this.createMonth(
				lastDateOfCurr.getDate(),
				firstDateOfCurr
			)

			const nextSize = 6 - lastDayWeekOfCurr
				,	isAdditionalRow = Math.floor(
					((firstDayWeekOfCurr + lastDateOfCurr.getDate()) / 6) < 6
				)
			const difineNextSize = isAdditionalRow ? nextSize + 7 : nextSize
			const next = this.createMonth(
				difineNextSize,
				firstDateOfNext
			)
				

			const result = [...prev, ...curr, ...next]

			return result.map(date => {
				const selectedDates = this.selectedDates.map(date => date.toLocaleDateString())
				const currDate 	= this.todaysDate
					,	currDay 		= currDate.getDate()
					,	currMonth 	= currDate.getMonth()
					,	currYear 	= currDate.getFullYear()
					,	slctDay		= this.selectedDate?.getDate()
					,	slctMonth	= this.selectedDate?.getMonth()
					,	slctYear		= this.selectedDate?.getFullYear()
					,	name			= this.weeks[this.getDayWeek(date)]
					,	day 			= date.getDate()
					,	month 		= date.getMonth()
					,	year 			= date.getFullYear()
					,	localeDate	= date.toLocaleDateString()
					,	id 			= `month:${localeDate}`
					,	isCurrMonth = this.currMonth === month
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
					isSlctdDays,
					isCurrMonth
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
			this.date = date
			this.$emit('select-date', date)
		},
		calcDayOffset(days) {
			return 60 * 60 * 24 * days * 1000
		},
		getDayWeek(date) {
			const nativeDay = date.getDay()
			return nativeDay === 0 ? 6 : nativeDay - 1
		},
		createMonth(size, start) {
			const array = new Array(size).fill(null)

			return array.map((_, i) => {
				const date = new Date(
					Date.parse(start) + this.calcDayOffset(i)
				)

				return date
			})
		},
	},
	watch: {
		sideOffset: {
			deep: true,
			handler({ side }) {
				const day = side === 0
					? this.todaysDate.getDate()
					: 1
				this.month = side === 0
					? this.todaysDate.getMonth()
					: this.month + side
				
				this.date = new Date(2022, this.month, day)

				this.$emit('switch-date', {
					switchedDate: this.date,
					currYear: this.date.getFullYear(),
					currMonth: this.date.getMonth()
				})
			}
		}
	},
	created() {
		const date 	= this.date = this.selectedDate
			,	month = this.month = date.getMonth()
			,	year 	= date.getFullYear()

		this.$emit('switch-date', {
			currYear: year,
			currMonth: month,
			switchedDate: date,
		})
	}
}
</script>

<style lang="scss">
	.v2dp-week-names {
		display: flex;
		justify-content: space-between;
		margin: 10px 0;
	}
	.v2dp-week-name {
		flex: 0 1 calc(100% / 7 - 5px);
		font-size: calc(9px + .5vmin);
		text-align: center;
		color: #b7b7cc;

		&:not(:last-of-type) {
			margin-right: 5px;
		}
	}
	.v2dp-month-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.v2dp-month-item {
		flex: 0 1 calc(100% / 7 - 5px);
		height: 0;
		padding-top: calc(100% / 7 - 7px);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		border: 2px solid transparent;
		transition: box-shadow .2s;
		color: #b7b7cc;
		position: relative;
		cursor: pointer;

		&:not(:nth-child(7n + 7)) {
			margin: 0 5px 5px 0;
		}

		&__curr-month {
			color: #000;
		}
		&__curr-day {
			background: #f6f6fb;
		}
		&__slct-day {
			background: #1f1f33;

			.v2dp-month-day {
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
	.v2dp-month-day {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		border-radius: 50%;
		top: 0;
		left: 0;
		font-size: calc(15px + .5vmin);

		&__slctd-days {
			border: 2px solid #fff;
		}
	}

</style>