<template>
  <div class="v2dp-cell-months"
	:class="[setClassCellMonths, setClassCellHoverMonth]"
  >
		<div class="v2dp-cell-months-content"
			:class="setClassCellMonthsContent"
			@click="select"
			@mouseenter="over"
		>
			<span class="v2dp-cell-sub-months"
				:class="setClassCellSubMonth"
			>
				<slot name="clear" v-bind="month">
					{{ month.name }}
				</slot>
			</span>
		</div>

		<div class="v2dp-slot-months-complete">
			<slot v-bind="month" />
		</div>
  </div>
</template>

<script>
import {
	splitDate,
} from '../../../functions'

export default {
	name: 'V2MonthsListCell',
	props: {
		hoverMonth: null,
		name: {
			type: String,
			default: 'from'
		},
		cList: {
			type: Object,
			default: () => ({})
		},
		month: {
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
		setClassCellHoverMonth() {
			if (!this.isMarkedDay || !this.hoverMonth || !this.isRangeMode) return null

			const CELL = 'v2dp-cell-months'
				,	{ index: hoverMonth } = this.hoverMonth
				,	{ index: currMonth, selectedMonth } = this.month
				,	{
					_month: toSelectedMonth
				} = splitDate(this.cList.to.selectedDate)
				,	{
					_month: fromSelectedMonth
				} = splitDate(this.cList.from.selectedDate)
				,	isFromHoverRangeMonth = this.name === 'from'
						&& hoverMonth !== selectedMonth
						&& currMonth >= hoverMonth
						&& (
							fromSelectedMonth === toSelectedMonth
								? currMonth <= selectedMonth
								: currMonth < selectedMonth
						)
				,	isFirstFromHoverRangeMonth = this.name === 'from'
						&& currMonth === hoverMonth
						&& currMonth < selectedMonth
				,	isToHoverRangeMonth = this.name === 'to'
						&& hoverMonth !== selectedMonth
						&& currMonth <= hoverMonth
						&& (
							toSelectedMonth === fromSelectedMonth
								? currMonth >= selectedMonth
								: currMonth > selectedMonth
						)
				,	isLastToHoverRangeMonth = this.name === 'to'
						&& currMonth === hoverMonth
						&& currMonth > selectedMonth

			return {
				[`${CELL}__from-hover-range-month`]: isFromHoverRangeMonth,
				[`${CELL}__first-from-hover-range-month`]: isFirstFromHoverRangeMonth,
				[`${CELL}__to-hover-range-month`]: isToHoverRangeMonth,
				[`${CELL}__last-to-hover-range-month`]: isLastToHoverRangeMonth,
			}
		},
		setClassCellMonths() {
			if (!this.isMarkedDay) return null

			const CELL = 'v2dp-cell-months'
				,	{ selectedMonth } = this.month
				,	isFromHoverRangeMonth = this.hoverMonth
						&& this.name === 'from'
						&& this.hoverMonth.index < selectedMonth
				,	isToHoverRangeMonth = this.hoverMonth
						&& this.name === 'to'
						&& this.hoverMonth.index > selectedMonth

			return {
				[`${CELL}__range-month`]: this.month.isRangeMonth,
				[`${CELL}__last-range-month`]: this.month.isLastRangeMonth && this.isRangeMode && !isToHoverRangeMonth,
				[`${CELL}__first-range-month`]: this.month.isFirstRangeMonth && this.isRangeMode && !isFromHoverRangeMonth,
			}
		},
		setClassCellMonthsContent() {
			if (!this.isMarkedDay) return null

			const CELL_CONTENT = 'v2dp-cell-months-content'

			return {
				[`${CELL_CONTENT}__event-month`]: this.month.isEventMonth,
				[`${CELL_CONTENT}__selected-month`]: this.month.isSelectedMonth,
				[`${CELL_CONTENT}__disabled-range-month`]: this.month.isDisabledToRangeMonth,
				[`${CELL_CONTENT}__event-selected-month`]: this.month.isEventSelectedMonth,
			}
		},
		setClassCellSubMonth() {
			if (!this.isMarkedDay) return null

			const CELL_MONTH = 'v2dp-cell-sub-months'

			return {
				[`${CELL_MONTH}__empty-month`]: this.month.isEmptyMonth,
				[`${CELL_MONTH}__current-month`]: this.month.isCurrentMonth,
				[`${CELL_MONTH}__selected-month`]: this.month.isSelectedMonth,
				[`${CELL_MONTH}__event-selected-month`]: this.month.isEventSelectedMonth,
				[`${CELL_MONTH}__range-month`]: this.month.isRangeMonth && !this.month.isCurrentMonth,
				[`${CELL_MONTH}__disabled-range-month`]: this.month.isDisabledToRangeMonth,
			}
		}
	},
	methods: {
		select() {
			if (!this.month.isDisabledToRangeMonth) {
				this.$emit('select-month')
			}
		},
		over() {
			if (!this.month.isDisabledToRangeMonth) {
				this.$emit('over-month')
			}
		}

	}
}
</script>

<style lang="scss">
	.v2dp-cell-months {
		flex: 1 1 calc(100% / 3);
		height: var(--height-cell);
		font-size: var(--font-size-month);
		position: relative;
		cursor: pointer;

		&:not(:nth-last-child(-n + 3)) {
			margin-bottom: var(--margin-bottom);
		}

		display: flex;
		justify-content: center;
		align-items: center;

		&__first-range-month,
		&__first-from-hover-range-month  {
			border-top-left-radius: var(--border-radius);
			border-bottom-left-radius: var(--border-radius);
		}
		&__last-range-month,
		&__last-to-hover-range-month {
			border-top-right-radius: var(--border-radius);
			border-bottom-right-radius: var(--border-radius);
		}

		&__range-month {
			background: #4bbac5;
		}
		
		&__from-hover-range-month,
		&__to-hover-range-month {
			transition: background-color .2s;
			background: #b9e6eb;
			opacity: .8;
		}
	}

	.v2dp-cell-months-content {
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

		&__event-month {
			border: var(--border-width) solid #e6e6ee;
		}
		&__event-selected-month {
			border: var(--border-width) solid #1f1f33;
		}
		&__selected-month {
			box-shadow: 0 0 2px 0 #1f1f33;
		}
		&__disabled-range-month {
			&:hover {
				box-shadow: none;
				cursor: no-drop;
			}
		}
	}

	.v2dp-cell-sub-months {
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

		&__empty-month {
			border: 1px solid rgba(255, 255, 255, .1);
		}
		&__current-month {
			background: #eeedf7;
		}
		&__disabled-range-month {
			opacity: .2;
		}
		&__selected-month {
			color: #fff;
			background: #1f1f33;

			.v2dp-cell-week-name,
			.v2dp-cell-week-month {
				color: #fff;
			}
		}
		&__event-selected-month {
			border: var(--border-width) solid #fff;
		}
		&__range-month {
			color: #fff;
		}
	}

	.v2dp-slot-months-complete {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>