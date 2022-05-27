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
				<slot name="clear" v-bind="year">
					{{ year.title }}
				</slot>
			</div>
		</div>

		<div class="v2dp-slot-years-complete"
			:class="year.classes.parent"
		>
			<div v-for="name of year.classes.children"
				:key="`${name}`"
				:class="name"
			></div>
		
			<slot v-bind="year" />
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
				,	{ title: hoverYear } = this.hoverYear
				,	{ title: currYear, selectedYear } = this.year
				,	{
					_year: toSelectedYear
				} = splitDate(this.cList.to.selectedDate)
				,	{
					_year: fromSelectedYear
				} = splitDate(this.cList.from.selectedDate)
				,	isFromHoverRangeYear = this.name === 'from'
						&& hoverYear !== selectedYear
						&&	currYear >= hoverYear
						&& (
							fromSelectedYear === toSelectedYear
								? currYear <= selectedYear
								: currYear < selectedYear
						)
				,	isFirstFromHoverRangeYear = this.name === 'from'
						&&	currYear === hoverYear
						&& currYear < selectedYear
				,	isToHoverRangeYear = this.name === 'to'
						&& hoverYear !== selectedYear
						&&	currYear <= hoverYear
						&& (
							toSelectedYear === fromSelectedYear
								? currYear >= selectedYear
								: currYear > selectedYear
						)
				,	isLastToHoverRangeYear = this.name === 'to'
						&& currYear === hoverYear
						&& currYear > selectedYear

			return {
				[`${CELL}__from-hover-range-year`]: isFromHoverRangeYear,
				[`${CELL}__first-from-hover-range-year`]: isFirstFromHoverRangeYear,
				[`${CELL}__to-hover-range-year`]: isToHoverRangeYear,
				[`${CELL}__last-to-hover-range-year`]: isLastToHoverRangeYear,
			}
		},
		setClassCellYears() {
			if (!this.isMarkedDay) return null

			const CELL = 'v2dp-cell-years'
				,	{ selectedYear } = this.year
				,	isFromHoverRangeYear = this.hoverYear
						&& this.name === 'from'
						&& this.hoverYear.title < selectedYear
				,	isToHoverRangeYear = this.hoverYear
						&& this.name === 'to'
						&& this.hoverYear.title > selectedYear

			return {
				[`${CELL}__future-day`]: this.year.isFutureYear,
				[`${CELL}__range-year`]: this.year.isRangeYear,
				[`${CELL}__last-range-year`]: this.year.isLastRangeYear && this.isRangeMode && !isToHoverRangeYear,
				[`${CELL}__first-range-year`]: this.year.isFirstRangeYear && this.isRangeMode && !isFromHoverRangeYear,
				[`${CELL}__before-first-range-year`]: this.year.isBeforeFirstRangeYear,
				[`${CELL}__disabled-range-year`]: this.year.isDisabledToRangeYear,
			}
		},
		setClassCellYearsContent() {
			if (!this.isMarkedDay) return null

			const CELL_CONTENT = 'v2dp-cell-years-content'

			return {
				[`${CELL_CONTENT}__event-year`]: this.year.isEventYear,
				[`${CELL_CONTENT}__selected-year`]: this.year.isSelectedYear,
				[`${CELL_CONTENT}__disabled-range-year`]: this.year.isDisabledToRangeYear,
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
		position: relative;
		cursor: pointer;

		&:not(:nth-child(3n)) {
			&::before {
				content: '';
				height: 100%;
				width: 1px;
				background: #B7B7CC;
				position: absolute;
				right: 0;
			}
		}
		&:not(:nth-last-child(-n + 3)) {
			margin-bottom: var(--margin-bottom);

			&::after {
				content: '';
				height: 1px;
				width: 100%;
				background: #B7B7CC;
				position: absolute;
				bottom: calc(var(--margin-bottom) / -2);
			}
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

		&__disabled-range-year {
			opacity: .4;
		}

		&__range-year,
		&__from-hover-range-year,
		&__to-hover-range-year,
		&__before-first-range-year {
			&:not(:nth-child(3n)) {
				&::before {
					background: transparent;
				}
			}

			&:not(:nth-last-child(-n + 3)) {
				&::after {
					background: transparent;
				}
			}
		}
	}

	.v2dp-cell-years-content {
		width: var(--width-content);
		height: var(--height-content);
		border-radius: var(--border-radius);
		transition: box-shadow .4s;
		position: relative;
		z-index: 1;

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
		&__selected-year {
			color: #fff;
			background: #1f1f33;

			.v2dp-cell-week-name,
			.v2dp-cell-week-year {
				color: #fff;
			}
		}
		&__event-selected-year {
			border: var(--border-width) solid #fff;
		}
		&__range-year {
			color: #fff;
		}
	}

	.v2dp-slot-years-complete {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>