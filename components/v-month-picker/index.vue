<template>
	<div class="v2dp-month-picker"
		:style="{ '--width': itemWidth }"
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
			<div v-for="date of getMonths"
				:key="date.id"
				:class="{
					'v2dp-month-item__slct-day': date.isSlctDay,
					'v2dp-month-item__curr-day': date.isCurrDay,
					'v2dp-month-item__curr-month': date.isCurrMonth,
					'v2dp-month-item__slctd-dbl': date.isDblSlctd,
					'v2dp-month-item__slctd-days': date.isSlctdDays,
					'v2dp-month-item__slct-day-prev':  !date.isCurrMonth && date.isSlctDay,
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
	},
	computed: {
		getMonths() {
			const firstDateOfCurr 		= new Date(this.currYear, this.currMonth, 1)
				,	lastDateOfCurr 		= new Date(this.currYear, this.currMonth + 1, 0)
				,	firstDayWeekOfCurr 	= this.calcDayWeek(firstDateOfCurr)
				,	lastDayWeekOfCurr 	= this.calcDayWeek(lastDateOfCurr)
				,	firstDateOfNext 		= new Date(this.currYear, this.currMonth + 1, 1)
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
			const selectedDates = this.selectedDates.map(date => date.toLocaleDateString())

			return result.map(date => {
				const currDate 	= this.todaysDate
					,	currDay 		= currDate.getDate()
					,	currMonth 	= currDate.getMonth()
					,	currYear 	= currDate.getFullYear()
					,	slctDay		= this.selectedDate.getDate()
					,	slctMonth	= this.selectedDate.getMonth()
					,	slctYear		= this.selectedDate.getFullYear()
					,	name			= this.weeks[this.calcDayWeek(date)]
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
		itemWidth: null
	}),
	methods: {
		selectDate({ date }) {
			this.$emit('select-date', date)
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
		setItemWidth() {
			const container = this.$refs['v2dp-month-list']
			const itemWidth = container?.firstChild.offsetWidth

			if (itemWidth !== undefined) {
				this.itemWidth = `${itemWidth}px`
			}
		}
	},
	watch: {
		width() {
			this.setItemWidth()
		},
	},
	mounted() {
		this.setItemWidth()
		window.addEventListener('resize', this.setItemWidth)
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
		font-size: calc(var(--width) * .25);
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
		flex: 0 1 calc(100% / 7 - 7px);
		height: var(--width);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		// border: calc(var(--width) * .07) solid transparent;
		border: 1px solid #fafafa;
		transition: box-shadow .2s;
		color: #b7b7cc;
		position: relative;
		cursor: pointer;

		&:not(:nth-child(7n + 7)) {
			margin: 0 7px 7px 0;
		}
		&:hover {
			box-shadow: 0 0 8px 0 #1f1f33;
		}
		&:active {
			box-shadow: 0 0 4px 0 #1f1f33;
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
			border: calc(var(--width) * .07) solid #eeedf7;
		}
		&__slctd-dbl {
			border: calc(var(--width) * .07) solid #1f1f33;
		}
		&__slct-day-prev {
			opacity: .4;
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
		font-size: calc(var(--width) * .45);

		&__slctd-days {
			border: calc(var(--width) * .07) solid #fff;
		}
	}

</style>