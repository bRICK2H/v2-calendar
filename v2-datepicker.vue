<template>
	<div v-if="isOpenDatePicker"
		class="v2dp-wrapper"
		:style="{
			'--margin': margin,
			'--font-size': fontSize,
			'--border-width': borderWidth,
			'--size-circle-toggle': sizeCircleToggle,
			'--size-circle-current': sizeCircleCurrent,
		}"
	>

		<!-- Input -->
		<V2Input v-if="isInput"
			:width="width"
			:isDisabledCalendarToggle="isDisabledCalendarToggle"
			v-model="inputValue"

			@toggle-calendar="isShowCalendar = !isShowCalendar"
		/>

		<!-- Calendar -->
		<transition name="toggle-calendar">
			<div v-if="isShowCalendar"
				class="v2dp-calendar-container"
				:class="setClassCalendarAbsolutePosition"
			>

				<div v-for="(options, key) in cList"
					class="v2dp-calendar-list"
					ref="v2dp-calendar-list"
					:key="key"
					:style="{ maxWidth: `${width}px` }"
				>
					<!-- Multiple toggle mode -->
					<V2MultipleToggleMode v-if="isMultipleMode"
						:icon="getIconMultipleMode"
						@multiple-toggle="multipleToggle(key)"
					/>

					<!-- Controls -->
					<V2Controls
						v-bind="options"
						:cList="cList"
						:months="months"
						:subMode="subMode"
						:todaysDate="todaysDate"
						:isRangeMode="isRangeMode"
						:isOuterAdditionalMode="isAdditionalMode"

						@offset="offset"
						@open-additional-mode="openAdditionalMode"
					/>
					<transition name="toggle-multiple" mode="out-in">

						<!-- Week -->
						<template v-if="subMode === 'week' && !options.isAdditionalMode">
							<V2WeekDayList
								v-bind="options"
								:width="width"
								:weeks="weeks"
								:selectedDates="dates"
								:todaysDate="todaysDate"
								:isMarkedDay="isMarkedDay"

								@select-date="selectDate"
							>

								<template v-slot:clear="data">
									<slot name="clear" v-bind="data" />
								</template>							

								<template v-slot:default="data">
									<slot v-bind="data" />
								</template>

							</V2WeekDayList>
						</template>

						<!-- Month-day -->
						<template v-else-if="subMode === 'month-day' && !options.isAdditionalMode">
							<V2MonthDayList
								v-bind="options"
								:cList="cList"
								:width="width"
								:weeks="weeks"
								:months="months"
								:selectedDates="dates"
								:todaysDate="todaysDate"
								:isMarkedDay="isMarkedDay"
								:isRangeMode="isRangeMode"

								@select-date="selectDate"
							>

								<template v-slot:clear="data">
									<slot name="clear" v-bind="data" />
								</template>							

								<template v-slot:default="data">
									<slot v-bind="data" />
								</template>

							</V2MonthDayList>
						</template>

						<template v-else-if="options.additionalMode === 'months'">
							<V2MonthsList
								v-bind="options"
								:cList="cList"
								:width="width"
								:months="months"
								:selectedDates="dates"
								:todaysDate="todaysDate"
								:isMarkedDay="isMarkedDay"
								:isRangeMode="isRangeMode"

								@select-month="month => selectMonth(options, month)"
							/>
						</template>

						<template v-else-if="options.additionalMode === 'years'">
							<V2YearsList
								v-bind="options"
								:cList="cList"
								:width="width"
								:selectedDates="dates"
								:todaysDate="todaysDate"
								:isMarkedDay="isMarkedDay"
								:isRangeMode="isRangeMode"

								@select-year="year => selectYear(options, year)"
							/>
						</template>

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

	import V2Input from './components/v-input'
	import V2Controls from './components/v-controls'
	import V2YearsList from './components/v-templates/v-years-list'
	import V2MonthsList from './components/v-templates/v-months-list'
	import V2WeekDayList from './components/v-templates/v-week-day-list'
	import V2MonthDayList from './components/v-templates/v-month-day-list'
	import V2MultipleToggleMode from './components/v-multiple-toggle-mode'

	export default {
		name: 'V2DatePicker',
		components: {
			V2Input,
			V2Controls,
			V2YearsList,
			V2MonthsList,
			V2WeekDayList,
			V2MonthDayList,
			V2MultipleToggleMode
		},
		props: {
			/**
			 * Режим календаря
			 * 1. single -	по умолчанию month-day
			 * 	для сменты шаблона используем - single:week || :months || :years
			 * 2. multiple -	по умолчанию week
			 * 	для сменты шаблона используем - multiple:month-day || :months || :years
			 * 3. range - визуализирует только шаблон month-day с дополнением типа :months || :years
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
			 * Разделитель между датами для инпута
			 */

			betweenRange: {
				type: String,
				default: '/'
			},

			/**
			 * Максимальная ширина календаря
			 */

			width: {
				type: [Number, String],
				default: 375
			},

			/**
			 * Показать инпут. Вызов календаря происходит непосредственно из него. 
			 */

			isInput: {
				type: Boolean,
				default: true
			},

			/**
			 * Включить всевозможные события дня (текущий, выбранный или день с каким либо событием)
			 */

			isMarkedDay: {
				type: Boolean,
				default: true
			},

			/**
			 * Включить мод открытия дополнительных шаблонов (months, years)
			 */

			isAdditionalMode: {
				type: Boolean,
				default: true
			},

			/**
			 * Скрыть (при инициализации) календарь при ключеном инпуте
			 */

			isImmediateOpen: {
				type: Boolean,
				default: false
			},

			/**
			 * Заблокировать упарвление на открытие/закрытие календаря из инпута
			 */

			isDisabledCalendarToggle: {
				type: Boolean,
				default: false
			},

			/**
			 * Установить абсолютное позиционирование календаря. Работает в связке с инпутом.
			 */

			isAbsoluteCalendarPosition: {
				type: Boolean,
				default: true
			},

			/**
			 * TODO: Информация о slots и events
			 * ? Event
			 * 1. v-model работает в обычном режиме
			 * 2. Возвращаемый event работает как для @input так и для @select (на выбор)
			 
			 * ? Slots
			 * Реализовано 2 вида слотов
			 * 1. default - никак не затрагивает внутренний контент,
			 * 	предполагает реализацию некого расширения для каждой ячейки дня. (все данные по текущему дню есть)
			 
					<template v-slot="data">
						<div style="border: 1px solid red; height: 100%">
							{{ data.day }}
						</div>
					</template>
					
			 
			 * 2. clear - стрирает внутренний контент,
			 * 	предполагает реализицию собственной визуальной части (все данные по текущему дню есть)
			 
			 		<template v-slot:clear="data">
						<div style="border: 1px solid blue">
							{{ data.day }}
						</div>
					</template>
			 
			 */
		},
		data: () => ({
			subMode: '',
			commonMode: '',
			additionalMods: ['months', 'years'],
			subMods: ['month-day', 'week', 'months', 'years'],
			cList: {
				from: {
					name: 'from',
					offsetYear: 0,
					firstYearGrid: 0,
					fromOffsetYear: 0,
					currDay: null,
					currYear: null,
					currMonth: null,
					switchedDate: null,
					selectedDate: null,
					additionalMode: '',
					isAdditionalMode: false
				},
			},

			margin: 0,
			fontSize: 0,
			borderWidth: 0,
			sizeCircleToggle: 0,
			sizeCircleCurrent: 0,

			inputValue: '',
			todaysDate: null,

			isShowCalendar: false,
			isAllowEventChanges: false,

			weeks: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
			months: [
				'Январь', 'Февраль', 'Март',
				'Апрель', 'Май', 'Июнь',
				'Июль', 'Август', 'Сентябрь',
				'Окрябрь', 'Ноябрь', 'Декабрь'
			],
		}),
		computed: {
			isWeekSubMode() {
				return this.subMode === 'week'
			},
			isRangeMode() {
				return this.commonMode === 'range'
			},
			isMultipleMode() {
				return this.commonMode === 'multiple'
			},
			isOpenDatePicker() {
				return this.subMods.includes(this.subMode)
			},
			getSelectedDays() {
				return this.getFields('selectedDate')
			},
			getIconMultipleMode() {
				const subMode = this.isWeekSubMode ? 'mode-close' : 'mode-open'
				return require(`./assets/img/svg/${subMode}.svg`)
			},
			setClassCalendarAbsolutePosition() {
				return {
					'v2dp-calendar-container--absolute': this.isInput && this.isAbsoluteCalendarPosition
				}
			}
		},
		methods: {
			initDate() {
				this.defineCalendarMode()
				this.todaysDate = resetDateTime(new Date)

				const { from } = this.cList

				if (this.isRangeMode) {
					this.$set(this.cList, 'to', {
						name: 'to',
						offsetYear: 0,
						toOffsetYear: 0,
						firstYearGrid: 0,
						currDay: null,
						currYear: null,
						currMonth: null,
						switchedDate: null,
						selectedDate: null,
						additionalMode: '',
						isAdditionalMode: false
					})
					
					const { to } = this.cList

					if (Array.isArray(this.value)) {
						const [start, end] = this.value
						
						switch (this.value.length) {
							case 0: {
								from.selectedDate = resetDateTime(this.todaysDate)
								to.selectedDate = new Date(
									Date.parse(from.selectedDate) + calcDayOffset(7)
								)
							}
								break

							case 1: {
								from.selectedDate = resetDateTime(start)
								to.selectedDate = new Date(
									Date.parse(from.selectedDate) + calcDayOffset(7)
								)
							}
								break
								
							case 2: {
								from.selectedDate = resetDateTime(start)
								to.selectedDate = resetDateTime(end)
							}
								break
						}

					} else {
						from.selectedDate = resetDateTime(this.todaysDate)
						to.selectedDate = new Date(
							Date.parse(from.selectedDate) + calcDayOffset(7)
						)
					}
				} else {
					if (Array.isArray(this.value)) {
						if (this.value.length) {
							from.selectedDate = resetDateTime(this.value[0])
						} else {
							from.selectedDate = resetDateTime(this.todaysDate)
						}
					} else {
						from.selectedDate = resetDateTime(this.value)
					}
				}

				for (const name in this.cList) {
					const date = this.cList[name].selectedDate
					
					if (date) {
						this.updateDate(date, name, false)
					}
				}

				if (this.isAdditionalMode) {
					const isExistMode = this.additionalMods.includes(this.subMode)
					

					this.cList.from.additionalMode = isExistMode ? this.subMode : ''
					this.cList.from.isAdditionalMode = isExistMode ? true : false

					if (this.isRangeMode) {
						this.cList.to.additionalMode = isExistMode ? this.subMode : ''
						this.cList.to.isAdditionalMode =  isExistMode ? true : false
					}

				}
			},
			offset({ side, days, name, mode }) {
				let date = null
				const calendar = this.cList[name]
					,	{ from, to } = this.cList
					,	isCurrentMonth = side === 0 && days === 0

				switch (mode) {
					case 'months':
					case 'month-day': {
						const {
							_day,
							_year,
							_month
						} = splitDate(this.todaysDate)
						,	day = side === 0 ? _day : 1
						,	year = side === 0 ? _year : calendar.currYear
						,	month = side === 0 ? _month : calendar.currMonth + side

						date = new Date(year, month, day)
					}
						break

					case 'week': {
						const offsetDate = new Date(
							Date.parse(calendar.switchedDate) + (calcDayOffset(days) * side)
						)

						date = isCurrentMonth
							? getDayWeekFirst(this.todaysDate)
							: side > 0
								? getDayWeekFirst(offsetDate)
								: getDayWeekLast(offsetDate)
					}
						break

					case 'years': {

						if (!side && !days) {
							date = this.todaysDate
						} else {
							calendar.offsetYear += side * 10

							if (this.isRangeMode) {
								if (from.isAdditionalMode && to.isAdditionalMode) {
									if (name === 'from') {
										if (from.offsetYear >= to.toOffsetYear) {
											to.offsetYear = from.offsetYear
										}
									} else {
										if (to.offsetYear <= from.offsetYear) {
											from.offsetYear = to.offsetYear
										}
									}
									
								}

							}

							return false
						}

					}
						break
				}

				this.updateOffset({ date, name, isCurrentMonth })
			},
			updateOffset({ date, name, isCurrentMonth }) {
				const { from, to } = this.cList
				
				if (isCurrentMonth) {
					this.updateDate(this.todaysDate, name)

					if (this.isRangeMode) {
						if (name === 'from') {
							if (date > to.selectedDate) {
								this.updateDate(date, 'to')
							} else {
								this.updateDate(to.selectedDate, 'to')
							}
						} else if (name === 'to') {
							if (date < from.selectedDate) {
								this.updateDate(date, 'from')
							} else {
								this.updateDate(from.selectedDate, 'from', false)
							}
						}
					}
				} else {
					this.updateDate(date, name, false)

					if (this.isRangeMode) {
						if (name === 'from') {
							if (date > to.selectedDate) {
								this.updateDate(date, 'to', false)
							} else {
								this.updateDate(to.selectedDate, 'to', false)
							}
						} else if (name === 'to') {
							if (date < new Date(from.currYear, from.currMonth, 1)) {
								this.updateDate(date, 'from', false)
							}
						}
					}
				}
			},
			updateDate(date, name, isUpdateSelected = true) {
				const {
					_day,
					_year,
					_month
				} = splitDate(date)
				,	{
					_year: todayYear
				} = splitDate(this.todaysDate)
				,	calcYear = _year - todayYear

				if (isUpdateSelected) {
					this.cList[name].selectedDate = date
				}

				this.cList[name].currDay = _day
				this.cList[name].currMonth = _month
				this.cList[name].currYear = _year
				this.cList[name].switchedDate = getDayWeekFirst(date)
				this.cList[name].offsetYear = Math.ceil(calcYear * 0.1) * 10
				this.cList[name][`${name}OffsetYear`] = this.cList[name].offsetYear

				return true
			},
			selectDate(date, name) {
				const	{ to } = this.cList

				this.updateDate(date, name)

				if (this.isRangeMode) {
					if (name === 'from') {
						if (date > to.selectedDate) {
							this.updateDate(date, 'to')
						}
					}
				}
			},
			selectMonth(options, month) {
				const {
					name,
					currDay,
					currYear,
					currMonth
				} = options

				if (month !== currMonth) {
					const date = new Date(currYear, month, currDay)

					this.updateOffset({ date, name, isCurrentMonth: false })
				}

				options.isAdditionalMode = false
			},
			selectYear(options, year) {
				const {
					name,
					currDay,
					currYear,
					currMonth
				} = options

				if (year !== currYear) {
					const date = new Date(year, currMonth, currDay)

					this.updateOffset({ date, name, isCurrentMonth: false })
				}

				options.isAdditionalMode = false
			},
			openAdditionalMode(name, mode) {
				const calendar = this.cList[name]
				
				calendar.isAdditionalMode = calendar.additionalMode !== mode
					? true
					: !calendar.isAdditionalMode

				calendar.additionalMode = mode
			},
			multipleToggle(name) {
				const calendar = this.cList[name]

				this.updateDate(calendar.selectedDate, name)
				this.subMode = this.subMode === 'week' ? 'month-day' : 'week'
			},
			defineCalendarMode() {
				const [commonMode, subMode] = this.mode.split(':')
					, defaultMods = {
						range: 'month-day',
						single: 'month-day',
						multiple: 'week',
					}

				this.commonMode = commonMode

				if (Object.keys(defaultMods).includes(commonMode)) {
					if (commonMode === 'range') {
						if (this.additionalMods.includes(subMode) && this.isAdditionalMode) {
							this.subMode = subMode
						} else {
							this.subMode = defaultMods[commonMode]
						}
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
			setInputDate(dates) {
				const formatDate = dates.map(date => {
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
	
						return formatResult.join(separator)
					} else {
						console.warn(`[v2-datepicker]: Выбранный вами разделитель не найден. Предлагаемые варианты для даты ['-', '.'] или другие символы не схожие с числами или буквами.`)
						return null
					}

				})

				this.inputValue = formatDate.join(` ${this.betweenRange} `)

			},
			сalculatedSizes() {
				const calendarList = this.$refs['v2dp-calendar-list']
				
				if (calendarList && calendarList.length) {

					const [item] = calendarList
						,	width = Math.floor(item?.offsetWidth / 2)

					this.margin = `${Math.floor(width * .1)}px`
					this.borderWidth = `${Math.floor(width / 3  * .06)}px`
					this.fontSize = `${Math.floor((width) * .13)}px`
					this.sizeCircleToggle = `${Math.floor(width * .15)}px`
					this.sizeCircleCurrent = `${Math.floor(width * .13)}px`
				}
			},
			getFields(field) {
				const fields = []
				const from = this.cList.from?.[field]
				const to = this.cList?.to?.[field]

				if (from) fields.push(from)
				if (to) fields.push(to)


				return fields
			},
		},
		watch: {
			async width() {
				await this.$nextTick()
				this.сalculatedSizes()
			},
			async isShowCalendar(isShow) {
				if (this.isInput && isShow) {
					this.setInputDate(this.getSelectedDays)

					await this.$nextTick()
					this.сalculatedSizes()
				}
			},
			mode(mode) {
				this.commonMode = mode
				this.initDate()
			},
			format() {
				if (this.isInput) this.setInputDate(this.getSelectedDays)
			},
			isAdditionalMode() {
				this.initDate()
			},
			isRangeMode: {
				immediate: true,
				handler(isRange) {
					if (isRange) {
						if (!this.cList.to) this.initDate()
					} else {
						this.$delete(this.cList, 'to')
					}
				}
			},
			isInput: {
				immediate: true,
				handler(isShowCalendar) {
					this.isShowCalendar = !isShowCalendar
				}
			},
			isImmediateOpen: {
				immediate: true,
				handler(isImmediate) {
					if (this.isInput) {
						this.isShowCalendar = isImmediate
					}
				}
			},
			getSelectedDays(date) {
				if (this.isAllowEventChanges) {
					const defaultListeners = ['input', 'select']
						, listeners = Object.keys(this.$listeners)
						, findedListener = defaultListeners.find(name => listeners.includes(name))
	
					if (this.isInput) this.setInputDate(date)
					this.$emit(findedListener ?? 'input', date)
				}

				this.isAllowEventChanges = true
			}
		},
		created() {
			this.initDate()

			/**
			 * 1. Предусмотреть слоты для модов months/years
			 * 2. Сделать вариант с input (не absolute а + relative)
			 * 4. Дополнить параметрами input (width, height как минимум)
			 * 5. Точки для событий, продумать структуру dates
			 * 6. Разобраться с watch mode и проверить остальные
			 * 7. Набор даты (в последнюю очередь create mask) будет включать в себя mask.
			 */

		},
		mounted() {
			this.сalculatedSizes()
			window.addEventListener('resize', this.сalculatedSizes)
		}

	}
</script>

<style lang="scss">
	@import url('assets/fonts/inter/index.scss');

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		-webkit-tap-highlight-color: rgba(0,0,0,0);
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

	// Calendar
	.v2dp-calendar-container {
		width: 100%;
		display: flex;
		flex-wrap: wrap;

		&--absolute {
			position: absolute;
			top: 48px;
			left: 0;
		}
	}
	.v2dp-calendar-list {
		width: calc(100% - 10px);
		margin: 5px;
		padding: 16px;
		position: relative;
		border-radius: 12px;
		box-shadow: 0px 0px 4px rgba(31, 31, 51, .06),
			0px -4px 10px -1px rgba(31, 31, 51, .06);
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