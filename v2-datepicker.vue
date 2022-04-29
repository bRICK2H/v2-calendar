<template>
	<div class="v2dp-container"
		ref="v2dp-container"
		:style="{
			maxWidth: `${width}px`,
			'--margin': margin,
			'--font-size': fontSize,
			'--size-circle-toggle': sizeCircleToggle,
			'--size-circle-current': sizeCircleCurrent,
		}"
	>

		<div class="v2dp-toggle-mode">
			<button class="v2dp-toggle-mode-button"
				@click="toggleMode"
			>
				<img :src="getIconMode"
					alt="mode-toggle"
					class="v2dp-controls-icon-mode-toggle"
				>
			</button>
		</div>

		<!-- Controls -->
		<div class="v2dp-controls">
			<p class="v2dp-controls-date">
				{{ getMonth }} {{ currYear }}
			</p>

			<div class="v2dp-controls-buttons">
				<button @click="offset(0, 0)"
					class="v2dp-controls-current"
				>
					<img src="./assets/img/svg/curr-day.svg"
						alt="curr-day"
						class="v2dp-controls-icon-current"
						:style="{ opacity: isOffsetCurrentSpace ? 1 : .2 }"
					>
				</button>
				<button @click="offset(-1, 7)"
					class="v2dp-controls-prevent"
				>
					<img src="./assets/img/svg/prev-day.svg"
						alt="prev-day"
						class="v2dp-controls-icon-toggle"
					>
				</button>
				<button @click="offset(1, 7)"
					class="v2dp-controls-next"
				>
					<img src="./assets/img/svg/next-day.svg"
						alt="next-day"
						class="v2dp-controls-icon-toggle"
					>
				</button>
			</div>
		</div>

		<transition name="toggle-mode" mode="out-in">

		<!-- Week -->
			<V2WeekList v-if="isWeekMode"
				:width="width"
				:weeks="weeks"
				:currMonth="currMonth"
				:selectedDates="dates"
				:todaysDate="todaysDate"
				:switchedDate="switchedDate"
				:selectedDate="selectedDate"
				@select-date="date => updateDate(date)"
			>

				<template v-slot="date">
					<slot v-bind="date" />
				</template>
				
			</V2WeekList>

			<!-- Month -->
			<V2MonthList v-else
				:width="width"
				:weeks="weeks"
				:months="months"
				:currYear="currYear"
				:currMonth="currMonth"
				:selectedDates="dates"
				:todaysDate="todaysDate"
				:switchedDate="switchedDate"
				:selectedDate="selectedDate"
				@select-date="date => updateDate(date)"
			>

				<template v-slot="date">
					<slot v-bind="date" />
				</template>
			
			</V2MonthList>

		</transition>

	</div>
</template>

<script>
import {
	splitDate,
	resetDateTime,
	calcDayOffset,
	getDayWeekLast,
	getDayWeekFirst
} from './functions'

import V2WeekList from './components/v-week-list'
import V2MonthList from './components/v-month-list'

export default {
	name: 'V2DatePicker',
	components: {
		V2WeekList,
		V2MonthList
	},
	props: {
		width: {
			type: [Number, String],
			default: 375
		},
		dates: {
			type: Array,
			default: () => ([])
		},
	},
	data: () => ({
		mode: 'week',

		margin: 0,
		fontSize: 0,
		sizeCircleToggle: 0,
		sizeCircleCurrent: 0,

		currDay: null,
		currYear: null,
		currMonth: null,
		todaysDate: null,
		switchedDate: null,
		selectedDate: null,
		
		weeks: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
		months: [
			'Январь', 'Февраль', 'Март',
			'Апрель', 'Май', 'Июнь',
			'Июль', 'Август', 'Сентябрь',
			'Окрябрь', 'Ноябрь', 'Декабрь'
		],
	}),
	computed: {
		getMonth() {
			return this.months[this.currMonth]
		},
		isWeekMode() {
			return this.mode === 'week'
		},
		getIconMode() {
			const mode = this.isWeekMode ? 'mode-close' : 'mode-open'

			return require(`./assets/img/svg/${mode}.svg`)
		},
		isOffsetCurrentSpace() {
			const {
					_year: todayYear,
					_month: todayMonth,
					_dateString: todayDateString
				} = splitDate(this.todaysDate)
				, {
					_day: firstOfWeekDay
				} = splitDate(getDayWeekFirst(this.todaysDate))
				, {
					_day: finstSwitchOfWeekDay
				} = splitDate(this.switchedDate)
				, {
					_dateString: selectedDateString
				} = splitDate(this.selectedDate)

			return todayYear !== this.currYear
				||	todayMonth !== this.currMonth
				|| todayDateString !== selectedDateString
				|| (this.mode === 'week' && firstOfWeekDay !== finstSwitchOfWeekDay)
		}
	},
	methods: {
		initDate() {
			this.todaysDate = resetDateTime(new Date)
			this.updateDate(this.todaysDate)
		},
		offset(side, days) {
			let date = null

			if (!side && !days) {
				this.updateDate(this.todaysDate)
			}

			switch (this.mode) {
				case 'month': {
					const {
						_day,
						_month
					} = splitDate(this.todaysDate)
					,	day 	= side === 0 ? _day: 1
					,	month = side === 0 ? _month : this.currMonth + side

					date = new Date(this.currYear, month, day)
				}
					break
			
				case 'week': {
					const offsetDate = new Date(
						Date.parse(this.switchedDate) + (calcDayOffset(days) * side)
					)

					date = side === 0 && days === 0
						? getDayWeekFirst(this.todaysDate)
						: side > 0
							? getDayWeekFirst(offsetDate)
							: getDayWeekLast(offsetDate)
				}
					break
			}

			this.updateDate(date, false)
		},
		updateDate(date, isUpdateSelected = true) {
			const {
				_day,
				_year,
				_month
			} = splitDate(date)

			if (isUpdateSelected) {
				this.selectedDate = date
			}

			this.currDay 		= _day
			this.currMonth 	= _month
			this.currYear 		= _year
			this.switchedDate = getDayWeekFirst(date)
		},
		toggleMode() {
			this.updateDate(this.selectedDate)

			this.mode = this.mode === 'week' ? 'month' : 'week'
		},
		setComputedSize() {
			const container = this.$refs['v2dp-container']
			const DOMRect = container?.getBoundingClientRect()

			if (DOMRect !== undefined) {
				const { width } = DOMRect

				this.margin = `${(width / 2) * .1}px`
				this.fontSize = `${(width / 2) * .15}px`
				this.sizeCircleToggle = `${(width / 2) * .14}px`
				this.sizeCircleCurrent = `${(width / 2) * .12}px`
			}
		},
	},
	watch: {
		async width() {
			await this.$nextTick()
			this.setComputedSize()
		},
	},
	created() {
		this.initDate()
	},
	mounted() {
		this.setComputedSize()
		window.addEventListener('resize', this.setComputedSize)

		/**
		 * 1. Продумать слотовую систему
		 * 2. Реализация режимов типа single, range, multi
		 */
	}

}
</script>

<style lang="scss">
	@import url('assets/fonts/inter/index.scss');

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	html {
		font-family: 'Inter',
		sans-serif;
	}

	.v2dp-container {

		& > * {
			color: #1f1f33;
			font-weight: 600;
			background: #fff;
		}
		
		min-width: 240px;
		padding: 5px;
		margin: auto;
		user-select: none;
	}

	// Toggle mode
	.v2dp-toggle-mode {
		width: 100%;
		display: flex;
		justify-content: center;
		margin: calc(var(--margin) / 2) 0;
	}
	.v2dp-controls-icon-mode-toggle {
		width: var(--size-circle-toggle);
		height: var(--size-circle-toggle);
		transition: filter .2s;

		&:hover {
			filter: brightness(.5);
		}
	}

	// Controls
	.v2dp-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--margin);
		padding: 0 10px;
	}
	.v2dp-controls-date {
		font-size: var(--font-size);
		font-weight: 700;
	}
	.v2dp-controls-buttons {
		display: flex;
		align-items: center;
	}
	.v2dp-controls-prevent,
	.v2dp-controls-current,
	.v2dp-controls-next,
	.v2dp-toggle-mode-button {
		border: none;
		outline: none;
		background: none;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	.v2dp-controls-current {
		margin-right: calc(var(--margin) - 3px);
	}
	.v2dp-controls-prevent {
		margin-right: var(--margin);
	}
	.v2dp-controls-icon-current {
		width: var(--size-circle-current);
		height: var(--size-circle-current);
	}
	.v2dp-controls-icon-toggle {
		width: var(--size-circle-toggle);
		height: var(--size-circle-toggle);
	}
	.v2dp-controls-icon-current,
	.v2dp-controls-icon-toggle {
		border-radius: 50%;
		transition: box-shadow .2s;

		&:hover {
			box-shadow: 0 0 8px 0 #1f1f33;
		}
	}

	// Animation toggle mode
	.toggle-mode-enter-active {
		animation: toggle-mode-enter .2s;
		@keyframes toggle-mode-enter {
			0% { opacity: 0; transform: translateY(var(--margin)) }
		}
	}
	.toggle-mode-leave-active {
		animation: toggle-mode-leave .2s;
		@keyframes toggle-mode-leave {
			100% { opacity: 0; transform: translateY(calc(0px - var(--margin))) }
		}
	}
</style>