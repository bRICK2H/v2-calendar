<template>
	<div class="v2dp-container"
		ref="v2dp-container"
		:style="{ maxWidth: `${width}px` }"
	>

		<!-- Controls -->
		<div class="v2dp-controls">
			<p class="v2dp-controls-date"
				:style="{ '--containerWidth': containerWidth  }"
			>
				{{ getMonth }} {{ currYear }}
			</p>

			<div class="v2dp-controls-buttons">
				<button @click="offset(0, 0)"
					class="v2dp-controls-curr"
				>
					<img src="./assets/img/svg/curr-day.svg"
						alt="curr-day"
						:style="{ opacity: isTodaysDate ? .2 : 1 }"
					>
				</button>
				<button @click="offset(-1, 7)"
					class="v2dp-controls-prev"
				>
					<img src="./assets/img/svg/prev-day.svg" alt="prev-day">
				</button>
				<button @click="offset(1, 7)"
					class="v2dp-controls-next"
				>
					<img src="./assets/img/svg/next-day.svg" alt="next-day">
				</button>
			</div>
		</div>

		<!-- Week -->
		<!-- v-if="isWeekMode" -->
		<V2WeekPicker
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
		<!-- v-else -->
		<V2MonthPicker
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

		<button
			@click="toggleMode"
		>toggle</button>

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
		mode: 'month',
		currDay: null,
		currYear: null,
		currMonth: null,
		todaysDate: null,
		switchedDate: null,
		selectedDate: null,
		containerWidth: null,
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
		setContainerWidth() {
			const container = this.$refs['v2dp-container']
			const containerWidth = container?.firstChild.offsetWidth

			if (containerWidth !== undefined) {
				this.containerWidth = `${containerWidth}px`
			}
		}
	},
	watch: {
		width() {
			this.setContainerWidth()
		},
	},
	created() {
		this.initDate()
	},
	mounted() {
		this.setContainerWidth()
		window.addEventListener('resize', this.setContainerWidth)

		/**
		 * 1. Возможно передать дальше ширину ресайза и на основе него высчытвать
		 * 2. Адаптив svg
		 * 3. Сделать решимы week, month, range
		 * 4. Иконка переключения режиков
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

	// Controls
	.v2dp-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4vmin;
		padding: 0 10px;
	}
	.v2dp-controls-date {
		font-size: calc((var(--containerWidth) / 2) * .15);
		font-weight: 700;
	}
	.v2dp-controls-buttons {
		display: flex;
		align-items: center;
	}
	.v2dp-controls-prev,
	.v2dp-controls-curr,
	.v2dp-controls-next {
		border: none;
		outline: none;
		background: none;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	.v2dp-controls-curr {
		margin-right: 19px;
	}
	.v2dp-controls-prev {
		margin-right: 16px;
	}
</style>