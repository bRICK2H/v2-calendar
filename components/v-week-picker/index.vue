<template>
	<div class="v2dp-week-picker">
		<div v-for="({
				id,
				day,
				date,
				name,
				isSlctDay,
				isCurrDay,
				isCurrWeek,
				isDblSlctd,
				isSlctdDays,
			}) of getDaysWeek"
			:key="id"
			:ref="id"
			:style="{ height: `${height}px` }"
			:class="{
				'v2dp-week-item__slct-day': isSlctDay,
				'v2dp-week-item__curr-day': isCurrDay,
				'v2dp-week-item__curr-week': isCurrWeek,
				'v2dp-week-item__slctd-dbl': isDblSlctd,
				'v2dp-week-item__slctd-days': isSlctdDays,
			}"
			class="v2dp-week-item"
			@click="selectDate(date)"
		>
			<div class="v2dp-week-item-content"
				:class="{'v2dp-week-item-content__slctd-days': isSlctdDays,}"
			>
				<span class="v2dp-week-item-name">
					{{ name }}
				</span>
				<span class="v2dp-week-item-day">
					{{ day }}
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
		switchDate: {
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
	data: () => ({
		height: 0,
	}),
	computed: {
		getDaysWeek() {
			if (!this.switchDate) return []
			
			const array = new Array(7).fill(null)

			return array.map((_, i) => {
				const selectedDates = this.selectedDates.map(date => date.toLocaleDateString())
				const date = new Date(
					Date.parse(this.switchDate) + this.calcDayOffset(i)
				)
				const currDate 	= this.todaysDate
					,	currDay 		= currDate.getDate()
					,	currMonth 	= currDate.getMonth()
					,	slctDay		= this.selectedDate?.getDate()
					,	name			= this.weeks[i]
					,	day 			= date.getDate()
					,	month 		= date.getMonth()
					,	year 			= date.getFullYear()
					,	localeDate	= date.toLocaleDateString()
					,	id 			= `week-${localeDate}`
					,	isCurrWeek 	= this.currMonth === month
					,	isCurrDay 	= currDay === day && currMonth === month
					,	isSlctDay	= slctDay === day
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
		selectDate(date) {
			this.$emit('select-date', date)
		},

		getDayWeekFirst(date) {
			return new Date(
				Date.parse(date) - this.calcDayOffset(this.getDayWeek(date))
			)
		},
		getDayWeekLast(date) {
			return new Date(
				Date.parse(date) + this.calcDayOffset(6 - this.getDayWeek(date))
			)
		},
		getDayWeek(date) {
			const nativeDay = date.getDay()
			return nativeDay === 0 ? 6 : nativeDay - 1
		},
		calcDayOffset(days) {
			return 60 * 60 * 24 * days * 1000
		},
		setHeightDayWeek() {
			const heightList = this.getDaysWeek.map(el => {
				const [node] = this.$refs[el.id]
				return node?.clientWidth ?? 35
			})

			this.height = Math.min(...heightList) + 22
		},
	},
	watch: {
		sideOffset: {
			deep: true,
			handler({ side, days }) {
				const switchDate = days == 0
					? this.getDayWeekFirst(this.todaysDate)
					: new Date(Date.parse(this.switchDate) + (this.calcDayOffset(days) * side))

				const currDayWeek = side === 0
					? this.todaysDate
					: side > 0
						? this.getDayWeekFirst(switchDate)
						: this.getDayWeekLast(switchDate)

				const currMonth = currDayWeek.getMonth()
				const currYear = currDayWeek.getFullYear()

				this.$emit('set-switch-date', { switchDate, currYear, currMonth })
			}
		}
	},
	created() {
		const switchDate  = this.getDayWeekFirst(this.todaysDate)
			,	currYear		= this.todaysDate.getFullYear()
			,	currMonth	= this.todaysDate.getMonth()

		this.$emit('set-switch-date', { switchDate, currYear, currMonth })
	},
	async mounted() {
		await this.$nextTick()

		this.setHeightDayWeek()
		window.addEventListener('resize', () => this.setHeightDayWeek())
	}
}
</script>

<style lang="scss">
	.v2dp-week-picker {
		display: flex;
		justify-content: space-between;
	}

	.v2dp-week-item {
		flex: 0 1 38px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 24px;
		border: 2px solid transparent;
		cursor: pointer;
		transition: box-shadow .2s;
		color: #b7b7cc;
		
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
		// height: calc(100% - 4px);
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		border-radius: 24px;
		border: 2px solid transparent;
		
		&__slctd-days {
			border: 2px solid #fff;
		}
	}
	.v2dp-week-item-name {
		font-size: 12px;
		color: #b7b7cc;
	}
	.v2dp-week-item-day {
		font-size: 18px;
	}
</style>