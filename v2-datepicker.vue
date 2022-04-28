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
						:style="{ opacity: isTodaysDate ? .2 : 1 }"
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

		<!-- Week -->
		<V2WeekPicker v-if="isWeekMode"
			:width="width"
			:weeks="weeks"
			:currMonth="currMonth"
			:selectedDates="dates"
			:todaysDate="todaysDate"
			:switchedDate="switchedDate"
			:selectedDate="selectedDate"
			@select-date="date => updateDate(date)"
		/>

		<!-- Month -->
		<V2MonthPicker v-else
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
		/>

	</div>
</template>

<script>
import V2WeekPicker from './components/v-week-picker'
import V2MonthPicker from './components/v-month-picker'

export default {
	name: 'V2DatePicker',
	components: {
		V2WeekPicker,
		V2MonthPicker
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
		isTodaysDate() {
			return this.todaysDate?.toLocaleDateString() === this.selectedDate?.toLocaleDateString()
		}
	},
	methods: {
		initDate() {
			this.todaysDate = this.resetDateTime(new Date)
			this.updateDate(this.todaysDate)
		},
		offset(side, days) {
			let date = null

			if (!side && !days) {
				this.selectedDate = this.todaysDate
			}

			switch (this.mode) {
				case 'month': {
					const month = side === 0 ? this.todaysDate.getMonth() : this.currMonth + side
						,	day 	= side === 0 ? this.todaysDate.getDate() : 1

					date 	= new Date(this.currYear, month, day)
				}
					break
			
				case 'week': {
					const offsetDate = new Date(
						Date.parse(this.switchedDate) + (this.calcDayOffset(days) * side)
					)

					date = side === 0 && days === 0
						? this.getDayWeekFirst(this.todaysDate)
						: side > 0
							? this.getDayWeekFirst(offsetDate)
							: this.getDayWeekLast(offsetDate)
				}
					break
			}

			this.updateDate(date, false)
		},
		updateDate(date, isUpdateSelected = true) {
			if (isUpdateSelected) {
				this.selectedDate = date
			}

			this.currDay 		= date.getDate()
			this.currMonth 	= date.getMonth()
			this.currYear 		= date.getFullYear()
			this.switchedDate = this.getDayWeekFirst(date)
		},
		toggleMode() {
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
		}
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
		 * 1. Реализация режимов типа single, range, multi
		 * 2. Продумать сопоставление чисел и дней недели при смене режимов
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
</style>