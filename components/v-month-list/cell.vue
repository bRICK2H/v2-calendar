<template>
	<div class="v2dp-cell-month"
		:class="setClassCellMonth"
		@click="select"
	>
			<div class="v2dp-cell-month-content"
				:class="setClassCellMonthContent"
			>
				
				<span class="v2dp-cell-month-date"
					:class="setClassCellMonthDate"
				>
					{{ date.day }}
				</span>
			</div>

			<div class="v2dp-month-slot-area">
				<slot></slot>
			</div>
	</div>
</template>

<script>
export default {
	name: 'VMonthCell',
	props: {
		date: {
			type: Object,
			default: () => ({})
		},
		isMarkedDay: {
			type: Boolean,
			default: true
		},
	},
	computed: {
		setClassCellMonth() {
			if (!this.isMarkedDay) return null
			const CELL = 'v2dp-cell-month'

			return {
				[`${CELL}__range-day`]: this.date.isRangeDay,
				[`${CELL}__last-range-day`]: this.date.isLastRangeDay,
				[`${CELL}__first-range-day`]: this.date.isFirstRangeDay,
				[`${CELL}__offset-day`]: !this.date.isVisibleCurrentMonth,
				[`${CELL}__hidden-range-to-prev-day`]: this.date.isHiddenRangeToPrevDay,
				[`${CELL}__hidden-range-from-next-day`]: this.date.isHiddenRangeFromNextDay,
			}
		},
		setClassCellMonthContent() {
			if (!this.isMarkedDay) return null
			const CELL_CONTENT = 'v2dp-cell-month-content'

			return {
				[`${CELL_CONTENT}__event-day`]: this.date.isEventDay,
				[`${CELL_CONTENT}__current-day`]: this.date.isCurrentDay,
				[`${CELL_CONTENT}__selected-day`]: this.date.isSelectedDay,
				[`${CELL_CONTENT}__event-selected-day`]: this.date.isEventSelectedDay,
				[`${CELL_CONTENT}__disabled-range-day`]: this.date.isDisabledToRangeDay,
			}
		},
		setClassCellMonthDate() {
			if (!this.isMarkedDay) return null
			const CELL_DATE = 'v2dp-cell-month-date'

			return {
				[`${CELL_DATE}__empty-day`]: this.date.isEmptyDay,
				[`${CELL_DATE}__selected-day`]: this.date.isSelectedDay,
				[`${CELL_DATE}__event-selected-day`]: this.date.isEventSelectedDay,
				[`${CELL_DATE}__range-day`]: this.date.isRangeDay && !this.date.isCurrentDay,
				[`${CELL_DATE}__disabled-range-day`]: this.date.isDisabledToRangeDay,
			}
		}
	},
	methods: {
		select() {
			if (!this.date.isDisabledToRangeDay) {
				this.$emit('select-date')
			}
		}
	}
}
</script>

<style lang="scss">
.v2dp-cell-month {
	flex: 1 1 100%;
	height: var(--height);
	display: flex;
	justify-content: center;
	align-items: center;

	&__first-range-day {
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
	}
	&__last-range-day {
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
	}
	&__hidden-range-from-next-day,
	&__hidden-range-to-prev-day {
		visibility: hidden;
	}
	&__range-day {
		background: #4bbac5;
	}
	&__offset-day {
		opacity: .5;
	}
}

.v2dp-cell-month-content {
	width: calc(100% - var(--offset-size-day));
	height: calc(100% - var(--offset-size-day));
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: box-shadow .2s;
	cursor: pointer;

	&:hover {
		box-shadow: 0 0 8px 0 #1f1f33;
	}
	&:active {
		box-shadow: 0 0 4px 0 #1f1f33;
	}

	&__event-day {
		border: var(--border-width) solid #e6e6ee;
	}
	&__event-selected-day {
		border: var(--border-width) solid #1f1f33;
	}
	&__current-day {
		background: #eeedf7;
	}
	&__selected-day {
		box-shadow: 0 0 4px 0 #1f1f33;
	}
	&__disabled-range-day {
		&:hover {
			box-shadow: none;
			cursor: no-drop;
		}
	}
}

.v2dp-cell-month-date {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	font-weight: 500;
	color: #1f1f33;
	font-size: var(--font-size-day);
	
	&__empty-day {
		border: 1px solid rgba(255, 255, 255, .2);
	}
	&__selected-day {
		color: #fff;
		background: #1f1f33;
	}
	&__disabled-range-day {
		opacity: .2;
	}
	&__event-selected-day {
		border: var(--border-width) solid #fff;
	}
	&__range-day {
		color: #fff;
	}
}
</style>