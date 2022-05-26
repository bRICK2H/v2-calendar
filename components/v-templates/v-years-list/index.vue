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
			:key="year.name"
			:name="name"
			:year="year"
			:cList="cList"
			:hoverYear="hoverYear"
			:isMarkedDay="isMarkedDay"
			:isRangeMode="isRangeMode"

			@select-year="$emit('select-year', year.name)"
			@over-year="hoverYear = year"
		/>
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
			const {
				_year: todayYear
			} = splitDate(this.todaysDate)
			const TODAY_YEAR = todayYear + 1

			const eventYears = [
				...new Set(
					this.selectedDates.map(date => splitDate(date)._year)
				)
			]
			,	{
				_year: selectedYear,
			} = splitDate(this.selectedDate)
			,	fromSelected = this.cList?.from?.selectedDate
					? splitDate(this.cList.from.selectedDate)
					: null
			,	toSelected = this.cList?.to?.selectedDate
					? splitDate(this.cList.to.selectedDate)
					: null

			return new Array(CELL_YEARS)
				.fill(null)
				.reduceRight((acc, _, i) => {
					const year = (TODAY_YEAR - i) + this.offsetYear
						,	isCurrentYear = todayYear === year
						, 	isSelectedYear = selectedYear === year
						,	isEventYear = eventYears.includes(year)
						,	isEmptyYear = !isSelectedYear && !isEventYear
						,	isEventSelectedYear = isSelectedYear && isEventYear
						,	isFutureYear = todayYear < year
						,	isRangeYear = this.isRangeMode
								&& fromSelected._year !== toSelected._year
								&& (
									this.name === 'from'
										&& fromSelected._year <= year
										&& year <= toSelected._year
									|| this.name === 'to'
										&& toSelected._year >= year
										&& fromSelected._year <= year
								)
						,	isDisabledToRangeYear = this.isRangeMode
								&& this.name === 'to'
								&&	year < fromSelected._year
						,	isFirstRangeYear = year === fromSelected._year
						,	isLastRangeYear = year === toSelected._year
					
					acc.push({
							index: i,
							name: year,
							selectedYear,
							isRangeYear,
							isEmptyYear,
							isEventYear,
							isFutureYear,
							isCurrentYear,
							isSelectedYear,
							isEventSelectedYear,
							isLastRangeYear,
							isFirstRangeYear,
							isDisabledToRangeYear,
						}
					)

					return acc
				}, [])
		}
	},
	methods: {
		сalculatedSizes() {
			const weekList = this.$refs['v2dp-years-list']

			if (weekList) {
				const containerWidth = weekList.offsetWidth
					,	width = Math.floor(containerWidth / 3)
					,	height = Math.floor(width / 1.5)

				this.heightCell = `${height}px`
				this.borderRadius = `${height}px`
				this.borderWidth = `${Math.floor(width * .03)}px`
				this.fontSizeYear = `${Math.floor(width * .15)}px`
				this.widthContent = `${Math.floor(width / 1.13)}px`
				this.heightContent = `${Math.floor(height / 1.23)}px`
				this.marginBottom = `${Math.floor(width - (width / 1.12))}px`
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