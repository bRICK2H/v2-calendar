<template>
	<div class="v2dp-week-picker"
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
		<div v-for="date of getWeeks"
			:key="date.id"
			:class="{
				'v2dp-week-item__slct-day': date.isSlctDay,
				'v2dp-week-item__curr-day': date.isCurrDay,
				'v2dp-week-item__curr-week': date.isCurrWeek,
				'v2dp-week-item__slctd-dbl': date.isDblSlctd,
				'v2dp-week-item__empty-day': date.isEmptyDay,
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
					,	isEmptyDay	= !isSlctDay && !isSlctdDays && !isDblSlctd

				return {
					id,
					day,
					date,
					year,
					name,
					month,
					isSlctDay,
					isCurrDay,
					isEmptyDay,
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
	.v2dp-week-picker {
		display: flex;
		justify-content: space-between;
	}

	.v2dp-week-item {
		flex: 0 1 calc(100% / 7 - 7px);
		height: var(--height);
		border-radius: var(--border-radius-outer);
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
			background: #eeedf7;
		}
		&__slct-day {
			background: #1f1f33;

			.v2dp-week-item-name,
			.v2dp-week-item-day {
				color: #fff;
			}
		}
		&__empty-day {
			border: 1px solid #fafafa;
		}
		&__slctd-days {
			border: var(--border-width) solid #e6e6ee;
		}
		&__slctd-dbl {
			border: var(--border-width) solid #1f1f33;
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
		border-radius: var(--border-radius-inner);
		
		&__slctd-days {
			border: var(--border-width) solid #fff;
		}
	}
	.v2dp-week-item-name {
		font-size: var(--font-size-day-week);
		color: #b7b7cc;
	}
	.v2dp-week-item-day {
		font-size: var(--font-size-day);
	}
</style>