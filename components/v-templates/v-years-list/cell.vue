<template>
  <div class="v2dp-cell-years"
		:class="[
			setClassCellYearsRange('v2dp-cell-years'),
			setClassCellYearsRangeHover('v2dp-cell-years')
		]"
  	>
		<div class="v2dp-cell-years-container"
			:class="[
				setClassCellYearsRange('v2dp-cell-years-container'),
				setClassCellYearsRangeHover('v2dp-cell-years-container')
			]"
		>
			<div class="v2dp-cell-years-content"
				:class="setClassCellYearsContent"
				@click="select"
				@mouseenter="over"
			>
				<span class="v2dp-cell-years-title"
					:class="setClassCellYearsTitle"
				>
					<slot name="clear" v-bind="year">
						{{ year.title }}
					</slot>
				</span>
			</div>
		</div>

		<div class="v2dp-slot-years-container"
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
		// setClassCellhoverYear() {
		// 	if (!this.isMarkedDay || !this.hoverYear || !this.isRangeMode) return null

		// 	const CELL = 'v2dp-cell-years'
		// 		,	{ title: hoverYear } = this.hoverYear
		// 		,	{ title: currYear, selectedYear } = this.year
		// 		,	{
		// 			_year: toSelectedYear
		// 		} = splitDate(this.cList.to.selectedDate)
		// 		,	{
		// 			_year: fromSelectedYear
		// 		} = splitDate(this.cList.from.selectedDate)
		// 		,	isFromHoverRangeYear = this.name === 'from'
		// 				&& hoverYear !== selectedYear
		// 				&&	currYear >= hoverYear
		// 				&& (
		// 					fromSelectedYear === toSelectedYear
		// 						? currYear <= selectedYear
		// 						: currYear < selectedYear
		// 				)
		// 		,	isFirstFromHoverRangeYear = this.name === 'from'
		// 				&&	currYear === hoverYear
		// 				&& currYear < selectedYear
		// 		,	isToHoverRangeYear = this.name === 'to'
		// 				&& hoverYear !== selectedYear
		// 				&&	currYear <= hoverYear
		// 				&& (
		// 					toSelectedYear === fromSelectedYear
		// 						? currYear >= selectedYear
		// 						: currYear > selectedYear
		// 				)
		// 		,	isLastToHoverRangeYear = this.name === 'to'
		// 				&& currYear === hoverYear
		// 				&& currYear > selectedYear

		// 	return {
		// 		[`${CELL}__from-hover-range-year`]: isFromHoverRangeYear,
		// 		[`${CELL}__first-from-hover-range-year`]: isFirstFromHoverRangeYear,
		// 		[`${CELL}__to-hover-range-year`]: isToHoverRangeYear,
		// 		[`${CELL}__last-to-hover-range-year`]: isLastToHoverRangeYear,
		// 	}
		// },
		// setClassCellYears() {
		// 	if (!this.isMarkedDay) return null

		// 	const CELL = 'v2dp-cell-years'
		// 		,	{ selectedYear } = this.year
		// 		,	isFromHoverRangeYear = this.hoverYear
		// 				&& this.name === 'from'
		// 				&& this.hoverYear.title < selectedYear
		// 		,	isToHoverRangeYear = this.hoverYear
		// 				&& this.name === 'to'
		// 				&& this.hoverYear.title > selectedYear

		// 	return {
		// 		[`${CELL}__future-day`]: this.year.isFutureYear,
		// 		[`${CELL}__range-year`]: this.year.isRangeYear,
		// 		[`${CELL}__last-range-year`]: this.year.isLastRangeYear && this.isRangeMode && !isToHoverRangeYear,
		// 		[`${CELL}__first-range-year`]: this.year.isFirstRangeYear && this.isRangeMode && !isFromHoverRangeYear,
		// 		[`${CELL}__before-first-range-year`]: this.year.isBeforeFirstRangeYear,
		// 		[`${CELL}__disabled-range-year`]: this.year.isDisabledToRangeYear,
		// 	}
		// },
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
		setClassCellYearsTitle() {
			if (!this.isMarkedDay) return null

			const CELL_TITLE = 'v2dp-cell-years-title'

			return {
				[`${CELL_TITLE}__empty-year`]: this.year.isEmptyYear,
				[`${CELL_TITLE}__current-year`]: this.year.isCurrentYear,
				[`${CELL_TITLE}__selected-year`]: this.year.isSelectedYear,
				[`${CELL_TITLE}__event-selected-year`]: this.year.isEventSelectedYear,
				[`${CELL_TITLE}__range-year`]: this.year.isRangeYear && !this.year.isCurrentYear,
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
		},

		setClassCellYearsRange(root) {
			if (!this.isMarkedDay) return null

			const { selectedYear } = this.year
				,	isFromHoverRangeYear = this.hoverYear
						&& this.name === 'from'
						&& this.hoverYear.title < selectedYear
				,	isToHoverRangeYear = this.hoverYear
						&& this.name === 'to'
						&& this.hoverYear.title > selectedYear

			return {
				[`${root}__future-day`]: this.year.isFutureYear,
				[`${root}__range-year`]: this.year.isRangeYear,
				[`${root}__last-range-year`]: this.year.isLastRangeYear && this.isRangeMode && !isToHoverRangeYear,
				[`${root}__first-range-year`]: this.year.isFirstRangeYear && this.isRangeMode && !isFromHoverRangeYear,
				[`${root}__before-first-range-year`]: this.year.isBeforeFirstRangeYear,
				[`${root}__disabled-range-year`]: this.year.isDisabledToRangeYear,
			}
		},
		setClassCellYearsRangeHover(root) {
			if (!this.isMarkedDay || !this.hoverYear || !this.isRangeMode) return null

			const { title: hoverYear } = this.hoverYear
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
				[`${root}__from-hover-range-year`]: isFromHoverRangeYear,
				[`${root}__first-from-hover-range-year`]: isFirstFromHoverRangeYear,
				[`${root}__to-hover-range-year`]: isToHoverRangeYear,
				[`${root}__last-to-hover-range-year`]: isLastToHoverRangeYear,
			}
		}

	}
}
</script>

<style lang="scss">
	.v2dp-cell-years {
		flex: 1 1 calc(100% / 3);
		height: var(--height-cell);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: var(--font-size-year);
		position: relative;
		transition: border-right .1s;

		&:not(:nth-child(3n)) {
			border-right: 1px solid #B7B7CC;
		}
		&:not(:nth-last-child(-n + 3)) {
			border-bottom: 1px solid #B7B7CC;
		}

		&__range-year,
		&__from-hover-range-year,
		&__to-hover-range-year,
		&__before-first-range-year {
			&:not(:nth-child(3n)) {
				border-right: 1px solid transparent;
			}

			// &:not(:nth-last-child(-n + 3)) {
			// 	border-bottom: 1px solid transparent;
			// }
		}

		&__disabled-range-year {
			cursor: no-drop;
		}
	}

	.v2dp-cell-years-container {
		width: 100%;
		height: var(--height-range);
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		box-sizing: content-box;
		cursor: pointer;

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
			border: 1px solid #4bbac5;
		}

		&__from-hover-range-year,
		&__to-hover-range-year {
			background: #b9e6eb;
			border: 1px solid transparent;
		}

		&__disabled-range-year {
			opacity: .4;
			cursor: no-drop;
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
			}
		}
	}

	.v2dp-cell-years-title {
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

	.v2dp-slot-years-container {
		width: 100%;
		height: var(--height-slot);
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
	}
</style>