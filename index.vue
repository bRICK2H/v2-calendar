<template>
	<div class="wrapper">

		<div class="v2dp-container"
			:style="{ maxWidth: `${width}px` }"
		>

			<!-- Controls -->
			<div class="v2dp-controls">
				<p class="v2dp-controls-date">
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
			<V2WeekPicker v-if="isWeekMode"
				:weeks="weeks"
				:months="months"
				:currMonth="currMonth"
				:sideOffset="sideOffset"
				:todaysDate="todaysDate"
				:switchedDate="switchedDate"
				:selectedDate="selectedDate"
				:selectedDates="selectedDates"
				@select-date="selectDate"
				@switch-date="switchDate"
			/>

			<!-- Month -->
			<V2MonthPicker v-else
				:weeks="weeks"
				:months="months"
				:currMonth="currMonth"
				:sideOffset="sideOffset"
				:todaysDate="todaysDate"
				:switchedDate="switchedDate"
				:selectedDate="selectedDate"
				:selectedDates="selectedDates"
				@select-date="selectDate"
				@switch-date="switchDate"
			/>

			<button
				@click="toggleMode"
			>toggle</button>

		</div>

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
		dates: {
			type: Array,
			default: () => ([])
		},
		width: {
			type: [Number, String],
			default: 375
		},
	},
	data: () => ({
		mode: 'week',
		sideOffset: {
			days: 0,
			side: null,
			toggle: false
		},
		todaysDate: null,
		currYear: null,
		currMonth: null,
		switchedDate: null,
		selectedDate: null,
		selectedDates: [],
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
		resetTimeInDate(date) {
			date.setHours(0, 0, 0, 0)
			return date
		},
		offset(side, days) {
			this.sideOffset.side = side
			this.sideOffset.days = days
			this.sideOffset.toggle = !this.sideOffset.toggle

			if (!side && !days) {
				this.selectedDate = this.todaysDate
			}
		},
		switchDate({ switchedDate, currYear, currMonth }) {
			this.currYear = currYear
			this.currMonth = currMonth
			this.switchedDate = switchedDate
		},
		selectDate(date) {
			this.selectedDate = date
			this.currMonth = date.getMonth()
			this.currYear = date.getFullYear()
		},
		toggleMode() {
			this.mode = this.mode === 'week' ? 'month' : 'week'
		}
	},
	created() {
		this.todaysDate = this.selectedDate = this.resetTimeInDate(new Date)
		this.selectedDates = this.dates
	},

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
		font-size: calc(14px + .5vmin);
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