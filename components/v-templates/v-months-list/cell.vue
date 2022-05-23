<template>
  <div class="v2dp-cell-months"
	@click="select"
  >
		<div class="v2dp-cell-months-content"
			:class="setClassCellMonthsContent"
		>
			<div class="v2dp-cell-sub-months"
				:class="setClassCellSubMonth"
			>
	  			{{ month.name }}
			</div>
		</div>
  </div>
</template>

<script>
export default {
	name: 'V2MonthsListCell',
	props: {
		month: {
			type: Object,
			default: () => ({})
		},
		isMarkedDay: {
			type: Boolean,
			default: true
		},
	},
	computed: {
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
	}
}
</script>

<style lang="scss">
	.v2dp-cell-months {
		width: var(--width-cell);
		height: var(--height-cell);
		font-size: var(--font-size-month);
		margin-bottom: var(--margin);
		cursor: pointer;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.v2dp-cell-months-content {
		width: calc(100% - 2px);
		height: calc(100% - 2px);
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
			box-shadow: 0 0 4px 0 #1f1f33;
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
			border: 1px solid rgba(255, 255, 255, 1);
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
		&__disabled-range-month {
			opacity: .2;
		}
		&__event-selected-month {
			border: var(--border-width) solid #fff;
		}

	}
</style>