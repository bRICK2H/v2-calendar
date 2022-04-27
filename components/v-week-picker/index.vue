<template>
	<div class="v2dp-week-picker"
		ref="v2dp-week-list"
		:style="{ '--width': itemWidth }"
	>
		<div v-for="date of getWeeks"
			:key="date.id"
			:class="{
				'v2dp-week-item__slct-day': date.isSlctDay,
				'v2dp-week-item__curr-day': date.isCurrDay,
				'v2dp-week-item__curr-week': date.isCurrWeek,
				'v2dp-week-item__slctd-dbl': date.isDblSlctd,
				'v2dp-week-item__slctd-days': date.isSlctdDays,
				'v2dp-week-item__slct-day-prev':  !date.isCurrWeek && date.isSlctDay,
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
	},
	data: () => ({
		itemWidth: null
	}),
	computed: {
		getWeeks() {
			const weeks = this.createWeek(7, this.switchedDate)
			const selectedDates = this.selectedDates.map(date => date.toLocaleDateString())

			return weeks.map((date, i) => {
				const currDate 	= this.todaysDate
					,	currDay 		= currDate.getDate()
					,	currMonth 	= currDate.getMonth()
					,	currYear 	= currDate.getFullYear()
					,	slctDay		= this.selectedDate.getDate()
					,	slctMonth	= this.selectedDate.getMonth()
					,	slctYear		= this.selectedDate.getFullYear()
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
	methods: {
		selectDate({ date }) {
			this.$emit('select-date', date)
		},
		createWeek(size, start) {
			const array = new Array(size).fill(null)

			return array.map((_, i) => {
				const date = new Date(
					Date.parse(start) + this.calcDayOffset(i)
				)

				return date
			})
		},
		setItemWidth() {
			const container = this.$refs['v2dp-week-list']
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
	.v2dp-week-picker {
		display: flex;
		justify-content: space-between;
	}

	.v2dp-week-item {
		flex: 0 1 calc(100% / 7 - 7px);
		height: calc(var(--width) + (var(--width) * .4));
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: calc(var(--width) * .35);
		// border: calc(var(--width) * .07) solid transparent;
		border: 1px solid #fafafa;
		transition: box-shadow .2s;
		color: #b7b7cc;
		position: relative;
		cursor: pointer;
		
		
		&:not(:last-of-type) {
			margin-right: 7px;
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
			border: calc(var(--width) * .07) solid #eeedf7;
		}
		&__slctd-dbl {
			border: calc(var(--width) * .07) solid #1f1f33;
		}
		&__slct-day-prev {
			opacity: .4;
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
		border-radius: calc(var(--width) * .30);
		
		&__slctd-days {
			border: calc(var(--width) * .07) solid #fff;
		}
	}
	.v2dp-week-item-name {
		font-size: calc(var(--width) * .25);
		color: #b7b7cc;
	}
	.v2dp-week-item-day {
		font-size: calc(var(--width) * .45);
	}
</style>