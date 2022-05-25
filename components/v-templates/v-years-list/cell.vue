<template>
  <div class="v2dp-cell-years"
	:class="[setClassCellYears, setClassCellhoverYear]"
  >
		<div class="v2dp-cell-years-content"
			:class="setClassCellYearsContent"
			@click="select"
			@mouseenter="over"
		>
			<div class="v2dp-cell-sub-years"
				:class="setClassCellSubYear"
			>
	  			{{ year.name }}
			</div>
		</div>
  </div>
</template>

<script>
import {
	splitDate,
} from '../../../functions'

export default {
	name: 'V2YearsListCell',
	props: {
		hoverYear: null,
		name: {
			type: String,
			default: 'from'
		},
		cList: {
			type: Object,
			default: () => ({})
		},
		year: {
			type: Object,
			default: () => ({})
		},
		isMarkedDay: {
			type: Boolean,
			default: true
		},
		isRangeMode: {
			type: Boolean,
			default: true
		},
	},
	computed: {
		setClassCellhoverYear() {
			if (!this.isMarkedDay || !this.hoverYear || !this.isRangeMode) return null

			const CELL = 'v2dp-cell-years'
				// ,	{ index: hoverYear } = this.hoverYear
				// ,	{ index: currMonth, selectedMonth } = this.year
				// ,	{
				// 	_month: toSelectedMonth
				// } = splitDate(this.cList.to.selectedDate)
				// ,	{
				// 	_month: fromSelectedMonth
				// } = splitDate(this.cList.from.selectedDate)
				// ,	isFromHoverRangeYear = this.name === 'from'
				// 		&& hoverYear !== selectedMonth
				// 		&& currMonth >= hoverYear
				// 		&& (
				// 			fromSelectedMonth === toSelectedMonth
				// 				? currMonth <= selectedMonth
				// 				: currMonth < selectedMonth
				// 		)
				// ,	isFirstFromHoverRangeYear = this.name === 'from'
				// 		&& currMonth === hoverYear
				// 		&& currMonth < selectedMonth
				// ,	isToHoverRangeYear = this.name === 'to'
				// 		&& hoverYear !== selectedMonth
				// 		&& currMonth <= hoverYear
				// 		&& (
				// 			toSelectedMonth === fromSelectedMonth
				// 				? currMonth >= selectedMonth
				// 				: currMonth > selectedMonth
				// 		)
				// ,	isLastToHoverRangeYear = this.name === 'to'
				// 		&& currMonth === hoverYear
				// 		&& currMonth > selectedMonth

			return {
				[`${CELL}__from-hover-range-year`]: false && isFromHoverRangeYear,
				[`${CELL}__first-from-hover-range-year`]: false && isFirstFromHoverRangeYear,
				[`${CELL}__to-hover-range-year`]: false && isToHoverRangeYear,
				[`${CELL}__last-to-hover-range-year`]: false && isLastToHoverRangeYear,
			}
		},
		setClassCellYears() {
			if (!this.isMarkedDay) return null

			const CELL = 'v2dp-cell-years'
				// ,	{ selectedMonth } = this.year
				// ,	isFromHoverRangeYear = this.hoverYear
				// 		&& this.name === 'from'
				// 		&& this.hoverYear.index < selectedMonth
				// ,	isToHoverRangeYear = this.hoverYear
				// 		&& this.name === 'to'
				// 		&& this.hoverYear.index > selectedMonth

			return {
				[`${CELL}__future-day`]: this.year.isFutureYear,
				[`${CELL}__range-year`]: this.year.isRangeYear,
				[`${CELL}__last-range-year`]: false && this.year.isLastRangeYear,
				[`${CELL}__last-range-year`]: false && this.year.isLastRangeYear && this.isRangeMode && !isToHoverRangeYear,
				[`${CELL}__first-range-year`]: false && this.year.isFirstRangeYear && this.isRangeMode && !isFromHoverRangeYear,
			}
		},
		setClassCellYearsContent() {
			if (!this.isMarkedDay) return null

			const CELL_CONTENT = 'v2dp-cell-years-content'

			return {
				[`${CELL_CONTENT}__event-year`]: this.year.isEventYear,
				[`${CELL_CONTENT}__selected-year`]: this.year.isSelectedYear,
				[`${CELL_CONTENT}__disabled-range-year`]: false && this.year.isDisabledToRangeYear,
				[`${CELL_CONTENT}__event-selected-year`]: this.year.isEventSelectedYear,
			}
		},
		setClassCellSubYear() {
			if (!this.isMarkedDay) return null

			const CELL_YEAR = 'v2dp-cell-sub-years'

			return {
				[`${CELL_YEAR}__empty-year`]: this.year.isEmptyYear,
				[`${CELL_YEAR}__current-year`]: this.year.isCurrentYear,
				[`${CELL_YEAR}__selected-year`]: this.year.isSelectedYear,
				[`${CELL_YEAR}__event-selected-year`]: this.year.isEventSelectedYear,
				[`${CELL_YEAR}__range-year`]: this.year.isRangeYear && !this.year.isCurrentYear,
				[`${CELL_YEAR}__disabled-range-year`]: false && this.year.isDisabledToRangeYear,
			}
		}
	},
	methods: {
		select() {
			if (!this.year.isDisabledToRangeYear) {
				this.$emit('select-year')
			}
		},
		over() {
			if (!this.year.isDisabledToRangeYear) {
				this.$emit('over-year')
			}
		}

	}
}
</script>

<style lang="scss">
	.v2dp-cell-years {
		flex: 1 1 calc(100% / 3);
		height: var(--height-cell);
		font-size: var(--font-size-year);
		cursor: pointer;

		&:not(:nth-last-child(-n + 3)) {
			margin-bottom: var(--margin-bottom);
		}

		display: flex;
		justify-content: center;
		align-items: center;

		&__first-range-year,
		&__first-from-hover-range-year  {
			border-top-left-radius: var(--border-radius);
			border-bottom-left-radius: var(--border-radius);
		}
		&__last-range-year,
		&__last-to-hover-range-year {
			border-top-right-radius: var(--border-radius);
			border-bottom-right-radius: var(--border-radius);
		}

		&__range-year {
			background: #4bbac5;
		}
		
		&__from-hover-range-year,
		&__to-hover-range-year {
			transition: background-color .2s;
			background: #b9e6eb;
			opacity: .8;
		}

		&__future-day {
			opacity: .6;
		}
	}

	.v2dp-cell-years-content {
		width: var(--width-content);
		height: var(--height-content);
		border-radius: var(--border-radius);
		transition: box-shadow .4s;
		position: relative;

		&:hover {
			box-shadow: 0 0 6px 0 #1f1f33;
		}
		&:active {
			box-shadow: 0 0 3px 0 #1f1f33;
		}

		&__event-year {
			border: var(--border-width) solid #e6e6ee;
		}
		&__event-selected-year {
			border: var(--border-width) solid #1f1f33;
		}
		&__selected-year {
			box-shadow: 0 0 2px 0 #1f1f33;
		}
		&__disabled-range-year {
			&:hover {
				box-shadow: none;
				cursor: no-drop;
			}
		}
	}

	.v2dp-cell-sub-years {
		width: 100%;
		height: 100%;
		border-radius: var(--border-radius);

		display: flex;
		justify-content: center;
		align-items: center;

		font-weight: 500;
		position: absolute;
		top: 0;
		left: 0;

		&__empty-year {
			border: 1px solid rgba(255, 255, 255, .1);
		}
		&__current-year {
			background: #eeedf7;
		}
		&__disabled-range-year {
			opacity: .2;
		}
		&__selected-year {
			color: #fff;
			background: #1f1f33;

			.v2dp-cell-week-name,
			.v2dp-cell-week-year {
				color: #fff;
			}
		}
		&__disabled-range-year {
			opacity: .2;
		}
		&__event-selected-year {
			border: var(--border-width) solid #fff;
		}
		&__range-year {
			color: #fff;
		}

	}
</style>