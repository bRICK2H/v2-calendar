<template>
	<div class="wrapper">

		<div class="v2dp-container"
			:style="{ width: `${width}px` }"
		>

			<!-- Controls -->
			<div class="v2dp-controls">
				<button @click="offset(-1)">left</button>
				<div>
					{{ months[currMonth] }}
					<button @click="offsetToday">curr</button>
				</div>
				<button @click="offset(1)">right</button>
			</div>

			<!-- Week names -->
			<!-- <div class="v2dp-week-names">
				<span v-for="(name, i) of weeks"
					:key="i"
					class="v2dp-week-name"
				>
					{{ name }}
				</span>
			</div> -->

			<!-- Week -->
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
					:class="{
						'v2dp-week-item__slct-day': isSlctDay,
						'v2dp-week-item__curr-day': isCurrDay,
						'v2dp-week-item__curr-week': isCurrWeek,
						'v2dp-week-item__slctd-dbl': isDblSlctd,
						'v2dp-week-item__slctd-days': isSlctdDays,
					}"
					:style="{ height: `${heightDayWeek}px` }"
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

			<!-- Month -->
			<div class="v2dp-month-picker">

			</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'V2DatePicker',
		props: {
			width: {
				type: [Number, String],
				default: 375
			},
			dates: {
				type: Array,
				default: () => ([])
			}
		},
		data: () => ({
			today: null,
			currYear: null,
			currMonth: null,
			switchDate: null,
			selectedDate: null,
			selectedDates: [],
			heightDayWeek: 0,
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
				return this.switchDate.getMonth()
			},
			getDaysWeek() {
				const array = new Array(7).fill(null)

				return array.map((_, i) => {
					const selectedDates = this.dates.map(date => date.toLocaleDateString())
					const date = new Date(
						Date.parse(this.switchDate) + this.calcDayOffset(i)
					)
					const currDate 	= this.today
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
			offset(n) {
				this.switchDate = new Date(
					Date.parse(this.switchDate) + (this.calcDayOffset(7) * n)
				)

				const currDayWeek = n > 0
					? this.getDayWeekFirst(this.switchDate)
					: this.getDayWeekLast(this.switchDate)
				
				this.currMonth = currDayWeek.getMonth()
				this.currYear = currDayWeek.getFullYear()
			},
			offsetToday() {
				this.switchDate = this.getDayWeekFirst(this.today)
				this.currMonth = this.switchDate.getMonth()
				this.currYear = this.switchDate.getFullYear()
			},
			selectDate(date) {
				this.selectedDate = date
				this.currMonth = date.getMonth()
				console.log(this.getDayWeekFirst(date))
			},
			resetTime(date) {
				date.setHours(0, 0, 0, 0)
				return date
			},
			calcDayOffset(days) {
				return 60 * 60 * 24 * days * 1000
			},
			getDayWeek(date) {
				const nativeDay = date.getDay()
				return nativeDay === 0 ? 6 : nativeDay - 1
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
			setHeightDayWeek() {
				const heightList = this.getDaysWeek.map(el => {
					const [node] = this.$refs[el.id]
					return node.clientWidth
				})

				this.heightDayWeek = Math.min(...heightList) + 20
			}
		},
		created() {
			this.today = this.resetTime(new Date)
			this.switchDate = this.getDayWeekFirst(this.today)
			this.selectedDates = this.dates
			this.currMonth = this.switchDate.getMonth()
			this.currYear = this.switchDate.getFullYear()
		},
		mounted() {
			this.setHeightDayWeek()
			window.addEventListener('resize', () => this.setHeightDayWeek())
		}
	}
</script>

<style lang="scss">
	@import url('assets/fonts/inter/index.scss');

	* {
		margin: 0;
		padding: 0;
	}

	html {
		font-family: 'Inter',
		sans-serif;
	}
	.wrapper {
		width: 100vw;
		height: 100vh;
		display: flex;
	}

	.v2dp-container {

		& > * {
			color: #1f1f33;
			font-weight: 600;
			box-sizing: border-box;
		}
		
		min-width: 240px;
		padding: 5px;
		margin: auto;
		user-select: none;
	}

	// Controls
	.v2dp-controls {
		border: 1px solid #000;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	// Week names
	.v2dp-week-names {
		display: flex;
		justify-content: space-between;
		margin-bottom: 5px;
	}

	.v2dp-week-name {
		flex: 1 1 100%;
		text-align: center;
	}

	// Week picker
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
		
		&:not(:last-of-type) {
			margin-right: 5px;
		}
		&:hover {
			box-shadow: 0 0 8px 0 #1f1f33;
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
		height: calc(100% - 4px);
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		border-radius: 24px;
		
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