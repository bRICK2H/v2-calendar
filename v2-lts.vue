<template>
	<div v-if="isOpenDatePicker"
		class="v2dp-wrapper"
		ref="v2dp-wrapper"
		:style="{
			maxWidth: `${width}px`,
			'--margin': margin,
			'--font-size': fontSize,
			'--size-circle-toggle': sizeCircleToggle,
			'--size-circle-current': sizeCircleCurrent,
		}"
	>

		<!-- Input -->
		<V2Input v-if="isInput"
			v-model="inputValue"
			@toggle-calendar="isShowCalendar = !isShowCalendar"
		/>

		<!-- Calendar -->
		<transition name="toggle-calendar">
			<div v-if="isShowCalendar"
				class="v2dp-container"
				:class="{ 'v2dp-container--absolute': isInput }"
			>

				<!-- Multiple toggle mode -->
				<V2MultipleToggleMode v-if="isMultipleMode"
					:icon="getIconMultipleMode"
					@multiple-toggle="multipleToggle"
				/>

				<!-- Controls -->
				<V2Controls
					:getMonth="getMonth"
					:currYear="currYear"
					:isOffsetCurrentSpace="isOffsetCurrentSpace"
					@offset="offset"
				/>

				<transition name="toggle-multiple" mode="out-in">

					<!-- Week -->
					<V2WeekList v-if="isWeekSubMode"
						:width="width"
						:weeks="weeks"
						:currMonth="currMonth"
						:selectedDates="dates"
						:todaysDate="todaysDate"
						:isMarkedDay="isMarkedDay"
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
						:isMarkedDay="isMarkedDay"
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

	import V2Input from './components/v-input'
	import V2Controls from './components/v-controls'
	import V2WeekList from './components/v-week-list'
	import V2MonthList from './components/v-month-list'
	import V2MultipleToggleMode from './components/v-multiple-toggle-mode'

	export default {
		name: 'V2DatePicker',
		components: {
			V2Input,
			V2WeekList,
			V2Controls,
			V2MonthList,
			V2MultipleToggleMode
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
				type: Date,
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

			inputValue: '',
			currDay: null,
			currYear: null,
			currMonth: null,
			todaysDate: null,
			switchedDate: null,
			selectedDate: null,

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
			isOpenDatePicker() {
				return this.subMods.includes(this.subMode)
			},
			isMultipleMode() {
				return this.commonMode === 'multiple'
			},
			getIconMultipleMode() {
				const subMode = this.isWeekSubMode ? 'mode-close' : 'mode-open'

				return require(`./assets/img/svg/${subMode}.svg`)
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
						_day: firstSwitchOfWeekDay
					} = splitDate(this.switchedDate)
					, {
						_dateString: selectedDateString
					} = splitDate(this.selectedDate)

				return todayYear !== this.currYear
					|| todayMonth !== this.currMonth
					|| todayDateString !== selectedDateString
					|| (this.subMode === 'week' && firstOfWeekDay !== firstSwitchOfWeekDay)
			}
		},
		methods: {
			initDate() {
				this.todaysDate = resetDateTime(new Date)
				this.selectedDate = resetDateTime(this.value)

				this.defineCalendarMode()
				this.updateDate(this.todaysDate, false)
			},
			offset({ side, days }) {
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
			updateDate(date, isUpdateSelected = true) {
				const {
					_day,
					_year,
					_month
				} = splitDate(date)

				if (isUpdateSelected) {
					this.selectedDate = date
				}

				this.currDay = _day
				this.currMonth = _month
				this.currYear = _year
				this.switchedDate = getDayWeekFirst(date)
			},
			multipleToggle() {
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

					this.inputValue = formatResult.join(separator)
				} else {
					console.warn(`[v2-datepicker]: Выбранный вами разделитель не найден. Предлагаемые варианты для даты ['-', '.'] или другие символы не схожие с числами или буквами.`)
				}

			},
			setComputedSize() {
				const container = this.$refs['v2dp-wrapper']
				const DOMRect = container?.getBoundingClientRect()

				if (DOMRect !== undefined) {
					const { width } = DOMRect

					this.margin = `${(width / 2) * .1}px`
					this.fontSize = `${(width / 2) * .11}px`
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
			async mode() {
				this.defineCalendarMode()

				await this.$nextTick()
				this.setComputedSize()
			},
			format() {
				if (this.isInput) this.setInputDate(this.selectedDate)
			},
			isShowCalendar(isShow) {
				if (this.isInput && isShow) this.setInputDate(this.selectedDate)
			}, 
			selectedDate(date) {
				const defaultListeners = ['input', 'select']
					, listeners = Object.keys(this.$listeners)
					, findedListener = defaultListeners.find(name => listeners.includes(name))

				if (this.isInput) this.setInputDate(date)
				this.$emit(findedListener ?? 'input', date)
			},
			isInput: {
				immediate: true,
				handler(isShowCalendar) {
					this.isShowCalendar = !isShowCalendar
				}
			},
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

		&>* {
			color: #1f1f33;
			font-weight: 600;
			background: #fff;
		}
	}

	// Calendar
	.v2dp-container {
		width: calc(100% - 10px);
		padding: 16px;
		margin: 5px 0 5px 5px;
		position: relative;
		border-radius: 12px;
		box-shadow: 0px 0px 4px rgba(31, 31, 51, .06),
			0px -4px 10px -1px rgba(31, 31, 51, .06);

		&--absolute {
			position: absolute;
			top: 50px;
			left: 0;
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