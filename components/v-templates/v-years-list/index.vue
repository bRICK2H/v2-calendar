<template>
	<div class="v2dp-years-list"
		ref="v2dp-years-list"
		:style="{
			'--height-cell': heightCell,
			'--border-width': borderWidth,
			'--margin-bottom': marginBottom,
			'--border-radius': borderRadius,
			'--width-content': widthContent,
			'--height-content': heightContent,
			'--font-size-year': fontSizeYear,
		}"

		@mouseleave="hoverYear = null"
	>
		<V2YearsListCell
			v-for="year of getYearsList"
			:key="year.id"
			:name="name"
			:year="year"
			:cList="cList"
			:hoverYear="hoverYear"
			:isMarkedDay="isMarkedDay"
			:isRangeMode="isRangeMode"

			@select-year="$emit('select-year', year.title)"
			@over-year="hoverYear = year"
		>

			<template v-slot:clear="data">
				<slot name="clear" v-bind="data" />
			</template>

			<template v-slot:default="data">
				<slot v-bind="data" />
			</template>
		
		</V2YearsListCell>
	</div>
</template>

<script>
import V2YearsListCell from './cell'
import {
	splitDate,
} from '../../../functions'

export default {
	name: 'V2YearsList',
	components: {
		V2YearsListCell
	},
	props: {
		name: {
			type: String,
			default: 'from'
		},
		width: {
			type: Number,
			default: 0
		},
		cList: {
			type: Object,
			default: () => ({})
		},
		offsetYear: {
			type: Number,
			default: 0
		},
		currDay: {
			type: Number,
			default: 0
		},
		currYear: {
			type: Number,
			default: 0
		},
		currMonth: {
			type: Number,
			default: 0
		},
		todaysDate: {
			type: Date,
			default: new Date
		},
		selectedDate: {
			type: Date,
			default: new Date
		},
		switchedDate: {
			type: Date,
			default: new Date
		},
		selectedDates: {
			type: Array,
			default: () => ([])
		},
		isMarkedDay: {
			type: Boolean,
			default: true
		},
		isRangeMode: {
			type: Boolean,
			default: true
		}
	},
	data: () => ({
		heightCell: 0,
		borderWidth: 0,
		borderRadius: 0,
		widthContent: 0,
		marginBottom: 0,
		heightContent: 0,
		fontSizeYear: 0,

		hoverYear: null,
	}),
	computed: {
		getYearsList() {
			const CELL_YEARS = 12
			,	{
				_year: todayYear
			} = splitDate(this.todaysDate)
			,	{
				_year: selectedYear,
			} = splitDate(this.selectedDate)
			,	fromSelected = this.cList?.from?.selectedDate
					? splitDate(this.cList.from.selectedDate)
					: null
			,	toSelected = this.cList?.to?.selectedDate
					? splitDate(this.cList.to.selectedDate)
					: null
			,	eventDates = this.getEventDates()
			,	TODAY_YEAR = todayYear + 1
			,	isRange = this.isRangeMode && toSelected

			return new Array(CELL_YEARS)
				.fill(null)
				.reduceRight((acc, _, i) => {
					const year = (TODAY_YEAR - i) + this.offsetYear
						,	id = `${this.name}:${year}`
						,	eventDate = eventDates.find(({ _year }) => year === _year)
						,	isCurrentYear = todayYear === year
						, 	isSelectedYear = selectedYear === year
						,	isEventYear = Boolean(eventDate)
						,	isEmptyYear = !isSelectedYear && !isEventYear
						,	isEventSelectedYear = isSelectedYear && isEventYear
						,	isFutureYear = todayYear < year
						,	isRangeYear = isRange
								&& fromSelected._year !== toSelected._year
								&& (
									this.name === 'from'
										&& fromSelected._year <= year
										&& year <= toSelected._year
									|| this.name === 'to'
										&& toSelected._year >= year
										&& fromSelected._year <= year
								)
						,	isDisabledToRangeYear = isRange
								&& this.name === 'to'
								&&	year < fromSelected._year
						,	isFirstRangeYear = isRange && year === fromSelected._year
						,	isLastRangeYear = isRange && year === toSelected._year
						, 	isBeforeFirstRangeYear = isRange
								&& fromSelected._year !== toSelected._year
								&& fromSelected._year - 1 === year
						,	classes = {
								parent: eventDate?.parent ?? null,
								children: eventDate?.children ?? []
						}
					
					acc.push({
							id,
							index: i,
							classes,
							title: year,
							selectedYear,
							isRangeYear,
							isEmptyYear,
							isEventYear,
							isFutureYear,
							isCurrentYear,
							isSelectedYear,
							isLastRangeYear,
							isFirstRangeYear,
							isEventSelectedYear,
							isDisabledToRangeYear,
							isBeforeFirstRangeYear,
						}
					)

					return acc
				}, [])
		}
	},
	methods: {
		getEventDates() {
			const eventDates = this.selectedDates.map(options => {
				if (options instanceof Date) {
					const { _month, _year } = splitDate(options)

					return { _month, _year }
				} else {
					const { date, children, parent } = options
						,	{ _month, _year } = splitDate(date)
					
					return {
						_year,
						_month,
						parent,
						children,
					}
				}
			})

			return [
				...new Set(
					eventDates
						.map(({ _month, _year }) => ({ _month, _year }))
						.map(JSON.stringify)
				)
			].map(curr => {
				const { _month, _year } = JSON.parse(curr)
					,	condition = el => el._month === _month && el._year === _year
					,	uniqueDates = eventDates.filter(item => condition(item))
					,	parent = [
						...new Set(
							uniqueDates.map(item => item.parent ?? '').filter(item => item)
						)
					]
					,	children = [
						...new Set(
							uniqueDates.map(item => item.children ?? []).flat()
						)
					]

				return {
					_year,
					parent,
					children
				}
			})
		},
		сalculatedSizes() {
			const yearList = this.$refs['v2dp-years-list']

			if (yearList) {
				const containerWidth = yearList.offsetWidth
					,	width = Math.floor(containerWidth / 3)
					,	height = Math.floor(width / 1.8)

				this.heightCell = `${height}px`
				this.borderRadius = `${height}px`
				this.borderWidth = `${Math.floor(width * .03)}px`
				this.fontSizeYear = `${Math.floor(width * .15)}px`
				this.widthContent = `${Math.floor(width / 1.09)}px`
				this.heightContent = `${Math.floor(height / 1.12)}px`
				this.marginBottom = `${Math.floor(width - (width / 1.4))}px`
			}
		},
	},
	watch: {
		width() {
			this.сalculatedSizes()
		},
		getYearsList: {
			immediate: true,
			handler(years) {
				if (this.isRangeMode) {
					this.cList[this.name].firstYearGrid = years[0].name
				}
			}
		}
	},
	mounted() {
		this.сalculatedSizes()
		window.addEventListener('resize', this.сalculatedSizes)
	},
}
</script>

<style lang="scss">
	.v2dp-years-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
</style>