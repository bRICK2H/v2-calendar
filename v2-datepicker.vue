<template>
	<div v-if="isOpenDatePicker"
		class="v2dp-wrapper"
		:style="{
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
				class="v2dp-calendar-container"
				:class="{ 'v2dp-calendar-container--absolute': isInput }"
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
						:todaysDate="todaysDate"
						:isRangeMode="isRangeMode"
						@offset="offset"
					/>
					<transition name="toggle-multiple" mode="out-in">

						<!-- Week -->
						<V2WeekList v-if="isWeekSubMode"
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

						</V2WeekList>

						<!-- Month -->
						<V2MonthList v-else
							v-bind="options"
							:width="width"
							:weeks="weeks"
							:months="months"
							:cList="cList"
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
				default: '-'
			},

			/**
			 * Максимальная ширина календаря
			 */

			width: {
				type: [Number, String],
				default: 375
			},

			/**
			 * Сразуже открыть календарь при существовании инпута
			 */

			isImmediateOpen: {
				type: Boolean,
				default: false
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
			subMods: ['month', 'week'],
			cList: {
				from: {
					name: 'from',
					currDay: null,
					currYear: null,
					currMonth: null,
					switchedDate: null,
					selectedDate: null,
				},
			},

			margin: 0,
			fontSize: 0,
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
		},
		methods: {
			initDate() {
				this.defineCalendarMode()
				this.todaysDate = resetDateTime(new Date)

				const { from } = this.cList

				if (this.isRangeMode) {
					this.$set(this.cList, 'to', {
						name: 'to',
						currDay: null,
						currYear: null,
						currMonth: null,
						switchedDate: null,
						selectedDate: null,
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
			},
			offset({ side, days, name }) {
				let date = null
				const calendar = this.cList[name]
					,	{ from, to } = this.cList

				switch (this.subMode) {
					case 'month': {
						const {
							_day,
							_month
						} = splitDate(this.todaysDate)
							, day = side === 0 ? _day : 1
							, month = side === 0 ? _month : calendar.currMonth + side

						date = new Date(calendar.currYear, month, day)
					}
						break

					case 'week': {
						const offsetDate = new Date(
							Date.parse(calendar.switchedDate) + (calcDayOffset(days) * side)
						)

						date = side === 0 && days === 0
							? getDayWeekFirst(this.todaysDate)
							: side > 0
								? getDayWeekFirst(offsetDate)
								: getDayWeekLast(offsetDate)
					}
						break
				}

				if (!side && !days) {
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
			updateDate(date, name, isUpdateSelected = true) {
				const {
					_day,
					_year,
					_month
				} = splitDate(date)

				if (isUpdateSelected) {
					this.cList[name].selectedDate = date
				}

				this.cList[name].currDay = _day
				this.cList[name].currMonth = _month
				this.cList[name].currYear = _year
				this.cList[name].switchedDate = getDayWeekFirst(date)

				return true
			},
			multipleToggle(name) {
				const calendar = this.cList[name]

				this.updateDate(calendar.selectedDate, name)
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

				if (calendarList) {
					const [item] = calendarList
						,	DOMRect = item?.getBoundingClientRect()

					if (DOMRect !== undefined) {
						const { width } = DOMRect

						this.margin = `${(Math.floor(width / 2) * .1)}px`
						this.fontSize = `${Math.floor((width / 2) * .13)}px`
						this.sizeCircleToggle = `${Math.floor((width / 2) * .15)}px`
						this.sizeCircleCurrent = `${Math.floor((width / 2) * .13)}px`
					}
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
			 * 1. Разобраться с watch mode и проверить остальные
			 * 10. Набор даты (в последнюю очередь)
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