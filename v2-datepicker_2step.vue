<template>
	<div v-if="isShowDatePicker"
		class="v2dp-wrapper"
		:style="{
			maxWidth: `${isRangeMode ? (width * 2) + 12 : width}px`,
			'--margin': margin,
			'--font-size': fontSize,
			'--size-circle-toggle': sizeCircleToggle,
			'--size-circle-current': sizeCircleCurrent,
		}"
	>

		<!-- Input -->
		<div v-show="isInput" class="v2dp-input-container">
			<input class="v2dp-input-item"
				type="text"
				placeholder="Выберите дату"
				v-model="inputDateValue"
			>
			<img class="v2dp-input-icon"
				src="./assets/img/svg/calendar.svg"
				alt="calendar"
				@click="isShowCalendar = !isShowCalendar"
			>
		</div>

		<!-- Calendar -->
		<transition name="toggle-calendar">
			<div v-if="isShowCalendar"
				class="test"
				:class="{
					'test--absolute': isInput,
				}"
			>

				<div class="v2dp-container"
					v-for="type of dateTypes"
					:key="type"
					:style="{
						maxWidth: `${width}px`
					}"
					ref="v2dp-container"
				>

					<!-- Toggle button week/month -->
					<div v-show="isMultipleMode"
						class="v2dp-toggle-sub-mode"
					>
						<button class="v2dp-toggle-sub-mode-button"
							@click="toggleSubMode"
						>
							<img class="v2dp-controls-icon-mode-toggle"
								:src="getIconSubMode"
								alt="mode-toggle" 
							>
						</button>
					</div>

					<!-- Controls -->
					<div class="v2dp-controls">
						<p class="v2dp-controls-date">
							<!-- {{ getMonth[type] }} {{ currYear[type] }} -->
						</p>

						<div class="v2dp-controls-buttons">
							<button class="v2dp-controls-current"
								@click="offset(0, 0)" 
							>
								<img class="v2dp-controls-icon-current"
									:style="{ opacity: isOffsetCurrentSpace ? 1 : .2 }"
									src="./assets/img/svg/curr-day.svg"
									alt="curr-day" 
								>
							</button>
							<button class="v2dp-controls-prevent"
								@click="offset(-1, 7)"
							>
								<img class="v2dp-controls-icon-toggle"
									src="./assets/img/svg/prev-day.svg"
									alt="prev-day"
								>
							</button>
							<button class="v2dp-controls-next"
								@click="offset(1, 7)"
							>
								<img class="v2dp-controls-icon-toggle"
									src="./assets/img/svg/next-day.svg"
									alt="next-day"
								>
							</button>
						</div>
					</div>

					<transition name="toggle-multiple" mode="out-in">

						<!-- Week -->
						<V2WeekList v-if="isWeekSubMode"
							:width="width"
							:weeks="weeks"
							:currMonth="currMonth.start"
							:selectedDates="dates"
							:todaysDate="todaysDate"
							:isMarkedDay="isMarkedDay"
							:switchedDate="switchedDate.start"
							:selectedDate="selectedDate.start"
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
							:currYear="currYear[type]"
							:currMonth="currMonth[type]"
							:selectedDates="dates"
							:todaysDate="todaysDate"
							:isMarkedDay="isMarkedDay"
							:switchedDate="switchedDate[type]"
							:selectedDate="selectedDate[type]"
							@select-date="date => updateDate(date)"
						>

							<template v-slot="date">
								<slot v-bind="date" />
							</template>

						</V2MonthList>

					</transition>

				</div>
				
			</div>
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
			/**
			 * Режим календаря
			 * 1. single -	по умолчанию month
			 * 	для сменты шаблона используем - single:week
			 * 2. multiple -	по умолчанию week
			 * 	для сменты шаблона используем - multiple:month
			 * 3. range - визуализирует только шаблон month
			 */

			mode: {
				type: String,
				default: 'single'
			},

			/**
			 * Выбранная дата
			 */

			value: {
				type: [Date, Array],
				default: () => new Date
			},

			/**
			 * Список дат, несущие за собой какое-либо событие
			 */

			dates: {
				type: Array,
				default: () => ([])
			},

			/**
			 * Устанавливает формат даты с разделителем для инпута
			 */

			format: {
				type: String,
				default: 'dd-mm-yyyy'
			},
			/**
			 * Максимальная ширина календаря
			 */

			width: {
				type: [Number, String],
				default: 375
			},

			/**
			 * Отменить день. Включает в себя текущий, выбранный или событийный день
			 */

			isMarkedDay: {
				type: Boolean,
				default: true
			},

			/**
			 * Показать инпут. Вызов календаря происходит непосредственно из него. 
			 */

			isInput: {
				type: Boolean,
				default: true
			}

			/**
			 * TODO: Информация о slots и events
			 * ? Event
			 * 1. v-model работает в обычном режиме
			 * 2. Возвращаемый event работает как для @input так и для @select (на выбор)
			 */
		},
		data: () => ({
			subMode: '',
			commonMode: '',
			subMods: ['month', 'week'],

			margin: 0,
			fontSize: 0,
			sizeCircleToggle: 0,
			sizeCircleCurrent: 0,

			dateValue: [],
			dateTypes: [],
			todaysDate: null,
			currDay: { start: null, end: null },
			currYear: { start: null, end: null },
			currMonth: { start: null, end: null },
			switchedDate: { start: null, end: null },
			selectedDate: { start: null, end: null },
			inputDateValue: null,

			isShowCalendar: false,

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
			isWeekSubMode() {
				return this.subMode === 'week'
			},
			isShowDatePicker() {
				return this.subMods.includes(this.subMode)
			},
			isMultipleMode() {
				return this.commonMode === 'multiple'
			},
			isRangeMode() {
				return this.commonMode === 'range'
			},
			getIconSubMode() {
				const subMode = this.isWeekSubMode ? 'mode-close' : 'mode-open'

				return require(`./assets/img/svg/${subMode}.svg`)
			},
			isOffsetCurrentSpace() {
				return false
			},
			// isOffsetCurrentSpace() {
			// 	const {
			// 		_year: todayYear,
			// 		_month: todayMonth,
			// 		_dateString: todayDateString
			// 	} = splitDate(this.todaysDate)
			// 	, {
			// 		_day: firstOfWeekDay
			// 	} = splitDate(getDayWeekFirst(this.todaysDate))
			// 	, {
			// 		_day: firstSwitchOfWeekDay
			// 	} = splitDate(this.switchedDate)
			// 	, {
			// 		_dateString: selectedDateString
			// 	} = splitDate(this.selectedDate)

			// 	return todayYear !== this.currYear
			// 		|| todayMonth !== this.currMonth
			// 		|| todayDateString !== selectedDateString
			// 		|| (this.subMode === 'week' && firstOfWeekDay !== firstSwitchOfWeekDay)
			// }
		},
		methods: {
			initDate() {
				this.defineCalendarMode()

				// this.dateValue = Array.isArray(this.value)
				// 	? { start: this.value[0], end: this.value[1] }
				// 	: { start: this.value }
				// const { start, end } = this.dateValue

				this.todaysDate = resetDateTime(new Date)

				if (this.isRangeMode) {
					this.dateTypes = ['start', 'end']
				} else {
					this.dateTypes = ['start']
					this.selectedDate.start = resetDateTime(start)
					this.updateDate(this.todaysDate, false)
				}

				// if (Array.isArray(this.value) && this.value.length > 1) {
				// 	this.dateTypes = ['start', 'end']
				// 	this.dateValue = this.value
				// } else {
				// 	this.dateTypes = ['start']
				// 	this.dateValue = [this.value]
				// }

				// const [start, end] = this.dateValue

				
				// this.selectedDate.start = resetDateTime(start)
				// this.updateDate(this.todaysDate, false)

				console.log(this.isRangeMode)
				if (this.isRangeMode) {
					const endDate = end
						? resetDateTime(end)
						: this.todaysDate

					this.selectedDate.end = new Date(
						Date.parse(endDate) + calcDayOffset(7)
					)

					this.updateDate(this.selectedDate.end , false, 'end')
				}
			},
			offset(side, days) {
				let date = null

				if (!side && !days) {
					this.updateDate(this.todaysDate)
				}

				switch (this.subMode) {
					case 'month': {
						const {
							_day,
							_month
						} = splitDate(this.todaysDate)
							, day = side === 0 ? _day : 1
							, month = side === 0 ? _month : this.currMonth + side

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
			updateDate(date, isUpdateSelected = true, range = 'start') {
				const {
					_day,
					_year,
					_month
				} = splitDate(date)

				if (isUpdateSelected) {
					this.selectedDate[range] = date
				}

				this.currDay[range] = _day
				this.currMonth[range] = _month
				this.currYear[range] = _year
				this.switchedDate[range] = getDayWeekFirst(date)
			},
			toggleSubMode() {
				this.updateDate(this.selectedDate)

				this.subMode = this.subMode === 'week' ? 'month' : 'week'
			},
			defineCalendarMode() {
				const [commonMode, subMode] = this.mode.split(':')
					, defaultMods = {
						range: 'month',
						single: 'month',
						multiple: 'week',
					}

				this.commonMode = commonMode

				if (Object.keys(defaultMods).includes(commonMode)) {
					if (commonMode === 'range') {
						this.subMode = 'month'
					} else if (subMode) {
						if (this.subMods.includes(subMode)) {
							this.subMode = subMode
						} else {
							this.subMode = defaultMods[commonMode]
						}
					} else {
						this.subMode = defaultMods[commonMode]
					}
				} else {
					this.subMode = ''
					console.warn(`[v2-datepicker]: Вы допустили ошибку в названии выбранного режима - "${commonMode}", уточните допустимое имя в документации.`)
				}
			},
			setInputDate(date) {
				const splitedDate = splitDate(date)
					, formatMap = {
						dd: '_day',
						mm: '_month',
						yyyy: '_year',
						yy: '_shortYear',
					}
				const separator = this.format.match('_') ?? this.format.match(/\W/)

				if (separator) {
					const formatArray = this.format.split(separator[0])
						, formatResult = formatArray.map(name => {
							const type = formatMap[name.toLowerCase()]
								, value = type === '_month'
									? splitedDate[type] + 1
									: splitedDate[type]

							return value < 10 ? `0${value}` : `${value}`
						})

					this.inputDateValue = formatResult.join(separator)
				} else {
					console.warn(`[v2-datepicker]: Выбранный вами разделитель не найден. Предлагаемые варианты для даты ['-', '.'] или другие символы не схожие с числами или буквами.`)
				}

			},
			setComputedSize() {
				const containers = this.$refs['v2dp-container']

				if (containers) {
					const DOMRect = containers[0]?.getBoundingClientRect()
	
					if (DOMRect !== undefined) {
						const { width } = DOMRect
	
						this.margin = `${(width / 2) * .1}px`
						this.fontSize = `${(width / 2) * .11}px`
						this.sizeCircleToggle = `${(width / 2) * .14}px`
						this.sizeCircleCurrent = `${(width / 2) * .12}px`
					}
				}

			},
		},
		watch: {
			async width() {
				await this.$nextTick()
				this.setComputedSize()
			},
			async mode() {
				this.defineCalendarMode()

				await this.$nextTick()
				this.setComputedSize()
			},
			format() {
				if (this.isInput) this.setInputDate(this.selectedDate)
			},
			async isShowCalendar() {
				await this.$nextTick()
				this.setComputedSize()
			},
			isInput: {
				immediate: true,
				handler(isShowCalendar) {
					this.isShowCalendar = !isShowCalendar
				}
			},
			selectedDate(date) {
				const defaultListeners = ['input', 'select']
					, listeners = Object.keys(this.$listeners)
					, findedListener = defaultListeners.find(name => listeners.includes(name))

				if (this.isInput) this.setInputDate(date)
				this.$emit(findedListener ?? 'input', date)
			}
		},
		created() {
			this.initDate()

			/**
			 * + 1. Упростить переменные на isEvent и isEventSelected 
			 * + 2. Баг на откритые недели, непосредственно с шириной и размерами
			 * 3. Логика работы инпута и открытие календарей
			 * + 4. Определение модов [multiple, range, single]
			 * + 5. Стилизация инпута + иконка
			 * + 6. Позиционирование абсолютное (определить позицию)
			 * + 7. dd-mm-yy props
			 * 8. создание range
			 * 9. определение передачи типов данных для даты String, Date, Array
			 * 10. Набор даты (в последнюю очередь)
			 */

		},
		mounted() {
			this.setComputedSize()
			window.addEventListener('resize', this.setComputedSize)
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

	.v2dp-wrapper {
		min-width: 240px;
		margin: auto;
		user-select: none;
		position: relative;

		& > * {
			color: #1f1f33;
			font-weight: 600;
			background: #fff;
		}
	}

	// Input
	.v2dp-input-container {
		max-width: 300px;
		margin: 5px;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;
	}

	.v2dp-input-item {
		width: 100%;
		height: 44px;
		outline: none;
		border-radius: 8px;
		border: 2px solid #eeedf7;
		padding: 0 44px 0 12px;
		transition: border .2s;

		&:focus {
			border: 2px solid #cfcde5;
		}

		&::placeholder {
			color: #b7b7cc;
		}
	}

	.v2dp-input-icon {
		position: absolute;
		right: 12px;
		cursor: pointer;
		opacity: .4;
		transition: opacity .2s;

		&:hover {
			opacity: 1;
		}
	}

	// Calendar
	.test {
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		
		margin: 5px;
		position: relative;

		
		&--absolute {
			position: absolute;
			top: 50px;
			left: 0;
		}
	}
	.v2dp-container {
		width: 100%;
		padding: 16px;
				border-radius: 12px;
		box-shadow: 0px 0px 4px rgba(31, 31, 51, .06),
			0px -4px 10px -1px rgba(31, 31, 51, .06);
	}

	// Toggle mode
	.v2dp-toggle-sub-mode {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-bottom: calc(var(--margin) / 2);
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
	.v2dp-toggle-sub-mode-button {
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

	// Animations

	// Toggle calendar
	.toggle-calendar-enter-active {
		animation: toggle-calendar-enter .2s ease-in-out;

		@keyframes toggle-calendar-enter {
			0% {
				opacity: 0;
				transform: translateY(-50px)
			}
		}
	}

	.toggle-calendar-leave-active {
		animation: toggle-calendar-leave .2s ease-in-out;

		@keyframes toggle-calendar-leave {
			100% {
				opacity: 0;
				transform: translateY(-50px)
			}
		}
	}

	// Toggle multiple mode
	.toggle-multiple-enter-active {
		animation: toggle-multiple-enter .2s;

		@keyframes toggle-multiple-enter {
			0% {
				opacity: 0;
				transform: translateY(var(--margin))
			}
		}
	}

	.toggle-multiple-leave-active {
		animation: toggle-multiple-leave .2s;

		@keyframes toggle-multiple-leave {
			100% {
				opacity: 0;
				transform: translateY(calc(0px - var(--margin)))
			}
		}
	}
</style>