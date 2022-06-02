<template>
	<div v-if="isOpenDatePicker"
		class="v2dp-wrapper"
		:style="[{
			'--margin': margin,
			'--font-size': fontSize,
			'--border-width': borderWidth,
			'--height-control': heightControl,
			'--size-circle-toggle': sizeCircleToggle,
			'--size-circle-current': sizeCircleCurrent,
		}, setStyleMaxWidth]"
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
					:ref="calendarListRef"
					:key="key"
					:style="{ maxWidth: `${width}px` }"
				>
					<!-- Multiple toggle mode -->
					<V2MultipleToggle v-if="isMultipleMode"
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
						@toggle-additional-mode="mode => toggleAdditionalMode(options, mode)"
					/>
					<transition name="toggle-multiple" mode="out-in">

						<!-- Week -->
						<template v-if="subMode === 'week' && !options.isAdditionalMode">
							<V2WeekDayList
								v-bind="options"
								:cList="cList"
								:width="width"
								:weeks="weeks"
								:selectedDates="dates"
								:todaysDate="todaysDate"
								:isMarkedDay="isMarkedDay"

								@select-date="selectDate"
								@visible-dates="setVisibleDates"
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
								@visible-dates="setVisibleDates"
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

								@select-month="month => selectAdditional(options, month)"
								@visible-dates="setVisibleDates"
							>

								<template v-slot:clear="data">
									<slot name="clear" v-bind="data" />
								</template>							

								<template v-slot:default="data">
									<slot v-bind="data" />
								</template>
								
							</V2MonthsList>
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

								@select-year="year => selectAdditional(options, year)"
								@visible-dates="setVisibleDates"
							>

								<template v-slot:clear="data">
									<slot name="clear" v-bind="data" />
								</template>							

								<template v-slot:default="data">
									<slot v-bind="data" />
								</template>
								
							</V2YearsList>
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
		getLastDay,
		resetDateTime,
		calcDayOffset,
		getDayWeekLast,
		getDayWeekFirst,
		getRandomNumber,
		getResetedDateString
	} from './functions'

	import V2Input from './components/v-input'
	import V2Controls from './components/v-controls'
	import V2YearsList from './components/v-templates/v-years-list'
	import V2MonthsList from './components/v-templates/v-months-list'
	import V2WeekDayList from './components/v-templates/v-week-day-list'
	import V2MonthDayList from './components/v-templates/v-month-day-list'
	import V2MultipleToggle from './components/v-multiple-toggle-mode'

	export default {
		name: 'V2DatePicker',
		components: {
			V2Input,
			V2Controls,
			V2YearsList,
			V2MonthsList,
			V2WeekDayList,
			V2MonthDayList,
			V2MultipleToggle
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
			 * Примеры передачи параметров:
			 * 	1: [ new Date('2022-5-25'), new Date('2022-5-29'), ... ]
			 * 	2: [ { date: new Date('2022-5-23'), parent: 'parent', children: ['one', 'two'] }, ... ],
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
			 * Закрыть календарь, сразу же после выбора даты
			 */

			isCloseAfterSelect: {
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
			 * 3. @visible-rage возвращает диапозон первой и послделней видимой даты (Array)
			 
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
			splitedSubMode: '',
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
					isChoosen: false,
					isAdditionalMode: false
				},
			},
			dateList: {
				from: [],
				to: [],
			},

			margin: 0,
			fontSize: 0,
			borderWidth: 0,
			heightControl: 0,
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
			
			calendarListRef: '',
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
			},
			setStyleMaxWidth() {
				return {
					maxWidth: this.isRangeMode
						? `${(this.width * 2) + 5}px`
						: `${this.width}px`
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
						isChoosen: false,
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
					const { to } = this.cList
						,	isExistMode = this.additionalMods.includes(this.splitedSubMode)

					from.additionalMode = isExistMode ? this.splitedSubMode : ''
					from.isAdditionalMode = isExistMode ? true : false

					if (this.isRangeMode) {
						to.additionalMode = isExistMode ? this.splitedSubMode : ''
						to.isAdditionalMode =  isExistMode ? true : false
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
				const	{ from, to } = this.cList

				this.updateDate(date, name)
				this.cList[name].isChoosen = true

				if (this.isRangeMode) {
					if (name === 'from') {
						if (date > to.selectedDate) {
							this.updateDate(date, 'to')
						}
					}

					if (from.isChoosen && to.isChoosen) {
						this.isShowCalendar = !this.isCloseAfterSelect
					}
				} else {
					this.isShowCalendar = !this.isCloseAfterSelect
				}
			},
			selectAdditional(options, value) {
				const {
					name,
					currYear,
					currMonth,
					additionalMode
				} = options
				
				let date = null,
					isCurrentDate = false

				switch (additionalMode) {
					case 'months': {
						isCurrentDate = value === currMonth
						date = new Date(currYear, value, 1)
					}
						break

					case 'years': {
						isCurrentDate = value === currYear
						date = new Date(value, currMonth, 1)
					}
						break
				}

				if (this.additionalMods.includes(additionalMode)) {
					this.subMode = 'month-day'
				}

				if (!isCurrentDate) {
					this.updateOffset({ date, name, isCurrentMonth: false })
				}

				options.isAdditionalMode = false
			},
			toggleAdditionalMode(options, mode) {
				const {
					additionalMode,
					isAdditionalMode
				} = options
				
				options.isAdditionalMode = additionalMode !== mode
					? true
					: !isAdditionalMode

				options.additionalMode = mode

				if (this.additionalMods.includes(additionalMode)) {
					this.subMode = 'month-day'
				}
			},
			multipleToggle(name) {
				const calendar = this.cList[name]

				calendar.isAdditionalMode = false
				this.updateDate(calendar.selectedDate, name)
				this.subMode = this.subMode === 'week'
					? 'month-day' : 'week'
			},
			defineCalendarMode() {
				const [commonMode, subMode] = this.mode.split(':')
					, defaultMods = {
						range: 'month-day',
						single: 'month-day',
						multiple: 'week',
					}

				this.commonMode = commonMode
				this.splitedSubMode = subMode

				if (Object.keys(defaultMods).includes(commonMode)) {
					switch (commonMode) {
						case 'range':
						case 'single':
						case 'multiple': {
							if (!subMode) {
								this.subMode = defaultMods[commonMode]
							} else {
								this.subMode = subMode
							}
						}
							break
					
						default: {
							this.subMode = defaultMods[commonMode]
						}
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
				const calendarList = this.$refs[this.calendarListRef]
				
				if (calendarList && calendarList.length) {
					const [item] = calendarList
						,	width = Math.floor(item?.offsetWidth / 2)

					this.margin = `${Math.floor(width * .1)}px`
					this.fontSize = `${Math.floor((width) * .12)}px`
					this.heightControl = `${Math.floor(width * .16)}px`
					this.borderWidth = `${Math.floor(width / 3  * .06)}px`
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
			setVisibleDates({ name, dates }) {
				this.dateList[name] = dates
			},
			getVisibleRange({ from, to }) {
				const {
					from: fromList,
					to: toList
				} = this.cList
				,	getLastAdditionalDay = (mode, date) => {
						switch (mode) {
							case 'months': {
								return getResetedDateString(getLastDay(date))
							}

							case 'years': {
								const {
									_day,
									_year,
								} = splitDate(new Date(last))
								,	dt = new Date(_year, 11, _day)

								return getResetedDateString(getLastDay(dt))
							}
						}
				}
				let first = from[0].dateString,
					last = this.isRangeMode
						? to[to.length - 1].dateString
						: from[from.length - 1].dateString

				if (this.isRangeMode) {
					if (toList.isAdditionalMode) {
						last = getLastAdditionalDay(toList.additionalMode, last)
					}
				} else {
					if (fromList.isAdditionalMode) {
						last = getLastAdditionalDay(fromList.additionalMode, last)
					}
				}

				return [first, last]
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

				if (!isShow && this.isRangeMode) {
					const { from, to } = this.cList

					from.isChoosen = to.isChoosen = false
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

					if (Array.isArray(date) && !this.isRangeMode) {
						const [single] = date
						
						date = single
					}

					this.$emit(findedListener ?? 'input', date)
				}

				this.isAllowEventChanges = true
			},
			dateList: {
				deep: true,
				handler(dates) {
					this.$emit('visible-rage', this.getVisibleRange(dates))
				}
			}
		},
		created() {
			this.initDate()
			this.calendarListRef = `calendar-list:${getRandomNumber()}`
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
		font-family: 'Inter', sans-serif;
	}

	.v2dp-wrapper {
		min-width: 240px;
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
		justify-content: space-between;
		margin-top: 4px;

		&--absolute {
			position: absolute;
			top: 48px;
			left: 0;
			margin-top: 0;
		}
	}
	.v2dp-calendar-list {
		width: 100%;
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