<template>
  <div class="v2dp-cell"
		:class="[
			setClassRange('v2dp-cell'),
			setClassRangeHover('v2dp-cell')
		]"
  	>
		<div class="v2dp-cell-container"
			:class="[
				setClassRange('v2dp-cell-container'),
				setClassRangeHover('v2dp-cell-container')
			]"
		>
			<div class="v2dp-cell-content"
				:class="setClassCellContent"
				@click="select"
				@mouseenter="over"
			>
				<span class="v2dp-cell-title"
					:class="setClassCellTitle"
				>
					<slot name="clear" v-bind="month">
						{{ month.title }}
					</slot>
				</span>
			</div>
		</div>

		<div class="v2dp-slot-container"
			:class="month.classes.parent"
		>
			<div v-for="name of month.classes.children"
				:key="`${name}`"
				:class="name"
			></div>
		
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
		setClassCellContent() {
			if (!this.isMarkedDay) return null

			const CELL_CONTENT = 'v2dp-cell-content'

			return {
				[`${CELL_CONTENT}__event-month`]: this.month.isEventMonth,
				[`${CELL_CONTENT}__selected-month`]: this.month.isSelectedMonth,
				[`${CELL_CONTENT}__disabled-range-month`]: this.month.isDisabledToRangeMonth,
				[`${CELL_CONTENT}__event-selected-month`]: this.month.isEventSelectedMonth,
			}
		},
		setClassCellTitle() {
			if (!this.isMarkedDay) return null

			const CELL_TITLE = 'v2dp-cell-title'

			return {
				[`${CELL_TITLE}__empty-month`]: this.month.isEmptyMonth,
				[`${CELL_TITLE}__current-month`]: this.month.isCurrentMonth,
				[`${CELL_TITLE}__selected-month`]: this.month.isSelectedMonth,
				[`${CELL_TITLE}__event-selected-month`]: this.month.isEventSelectedMonth,
				[`${CELL_TITLE}__range-month`]: this.month.isRangeMonth && !this.month.isCurrentMonth,
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
		},

		setClassRange(root) {
			if (!this.isMarkedDay) return null

			const { selectedMonth } = this.month
				,	isFromHoverRangeMonth = this.hoverMonth
						&& this.name === 'from'
						&& this.hoverMonth.index < selectedMonth
				,	isToHoverRangeMonth = this.hoverMonth
						&& this.name === 'to'
						&& this.hoverMonth.index > selectedMonth

			return {
				[`${root}__range-month`]: this.month.isRangeMonth,
				[`${root}__last-range-month`]: this.month.isLastRangeMonth && this.isRangeMode && !isToHoverRangeMonth,
				[`${root}__first-range-month`]: this.month.isFirstRangeMonth && this.isRangeMode && !isFromHoverRangeMonth,
				[`${root}__before-first-range-month`]: this.month.isBeforeFirstRangeMonth,
				[`${root}__disabled-range-month`]: this.month.isDisabledToRangeMonth,
			}
		},
		setClassRangeHover(root) {
			if (!this.isMarkedDay || !this.hoverMonth || !this.isRangeMode) return null

			const { index: hoverMonth } = this.hoverMonth
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
				[`${root}__from-hover-range-month`]: isFromHoverRangeMonth,
				[`${root}__first-from-hover-range-month`]: isFirstFromHoverRangeMonth,
				[`${root}__to-hover-range-month`]: isToHoverRangeMonth,
				[`${root}__last-to-hover-range-month`]: isLastToHoverRangeMonth,
			}
		},
	}
}

/**
 * 1. Разобратся со всеми стилями, кому какие нужны.
 * 2. Переименовать и сократить
 * 3. Именить index
 * 4. Перенести все измененное для years
 * 5. Поправить так же высоты для month-days and week (заменить бордер высотой)
 */

</script>

<style lang="scss">
	.v2dp-cell {
		flex: 1 1 calc(100% / 3);
		height: var(--height-cell);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: var(--font-size-month);
		position: relative;
		transition: border-right .1s;

		&:not(:nth-child(3n)) {
			border-right: 1px solid #B7B7CC;
		}
		&:not(:nth-last-child(-n + 3)) {
			border-bottom: 1px solid #B7B7CC;
		}

		&__range-month,
		&__from-hover-range-month,
		&__to-hover-range-month,
		&__before-first-range-month {
			&:not(:nth-child(3n)) {
				border-right: 1px solid transparent;
			}

			// &:not(:nth-last-child(-n + 3)) {
			// 	border-bottom: 1px solid transparent;
			// }
		}

		&__disabled-range-month {
			cursor: no-drop;
		}
	}

	.v2dp-cell-container {
		width: 100%;
		height: var(--height-range);
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		box-sizing: content-box;
		cursor: pointer;

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
			border: 1px solid #4bbac5;
		}

		&__from-hover-range-month,
		&__to-hover-range-month {
			background: #b9e6eb;
			border: 1px solid transparent;
		}

		&__disabled-range-month {
			opacity: .4;
			cursor: no-drop;
		}
	}

	.v2dp-cell-content {
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
			}
		}
	}

	.v2dp-cell-title {
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

	.v2dp-slot-container {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>