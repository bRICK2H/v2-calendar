<template>
	<div class="v2dp-cell-week"
		:class="setClassCellWeek"
	>
		<div class="v2dp-cell-week-content"
			:class="setClassCellWeekContent"
			@click="$emit('select-date')"
		>
			<div class="v2dp-cell-week-date"
				:class="setClassCellWeekDate"
			>
				<!-- <slot> -->
					<span class="v2dp-cell-week-name">
						{{ date.name }}
					</span>
					<span class="v2dp-cell-week-day">
						{{ date.day }}
					</span>
				<!-- </slot> -->
			</div>

			<div class="v2dp-slot-week-area">
				<slot name="supp" v-bind="date"/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'VWeekCell',
	props: {
		date: {
			type: Object,
			default: () => ({})
		},
		isMarkedDay: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		setClassCellWeek() {
			if (!this.isMarkedDay) return null
			const CELL = 'v2dp-cell-week'

			return {
				[`${CELL}__offset-day`]: !this.date.isVisibleCurrentWeek,
			}
		},
		setClassCellWeekContent() {
			if (!this.isMarkedDay) return null
			const CELL_CONTENT = 'v2dp-cell-week-content'

			return {
				[`${CELL_CONTENT}__event-day`]: this.date.isEventDay,
				[`${CELL_CONTENT}__selected-day`]: this.date.isSelectedDay,
				[`${CELL_CONTENT}__event-selected-day`]: this.date.isEventSelectedDay,
				[`${CELL_CONTENT}__disabled-range-day`]: this.date.isDisabledToRangeDay,
			}
		},
		setClassCellWeekDate() {
			if (!this.isMarkedDay) return null
			const CELL_DAY = 'v2dp-cell-week-date'

			return {
				[`${CELL_DAY}__empty-day`]: this.date.isEmptyDay,
				[`${CELL_DAY}__current-day`]: this.date.isCurrentDay,
				[`${CELL_DAY}__selected-day`]: this.date.isSelectedDay,
				[`${CELL_DAY}__event-selected-day`]: this.date.isEventSelectedDay,
				[`${CELL_DAY}__disabled-range-day`]: this.date.isDisabledToRangeDay,
			}
		}
	}
}
</script>

<style lang="scss">
	.v2dp-cell-week {
		flex: 1 1 100%;
		height: var(--height-cell);
		display: flex;
		justify-content: center;
		align-items: center;

		&__offset-day {
			opacity: .5;
		}
	}
	.v2dp-cell-week-content {
		width: var(--width-day);
		height: var(--height-day);
		border-radius: var(--width-day);
		font-weight: 500;
		color: #1f1f33;
		transition: box-shadow .2s;
		position: relative;
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
		&__selected-day {
			box-shadow: 0 0 4px 0 #1f1f33;
		}
	}
	.v2dp-cell-week-date {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		border-radius: var(--width-day);
		font-weight: 500;
		position: absolute;
		top: 0;
		left: 0;
		
		&__empty-day {
			border: 1px solid rgba(255, 255, 255, .1);
		}
		&__current-day {
			background: #eeedf7;
		}
		&__selected-day {
			color: #fff;
			background: #1f1f33;

			.v2dp-cell-week-name,
			.v2dp-cell-week-day {
				color: #fff;
			}
		}
		&__disabled-range-day {
			opacity: .2;
		}
		&__event-selected-day {
			border: var(--border-width) solid #fff;
		}
	}
	.v2dp-cell-week-name {
		font-size: var(--font-size-day-week);
		color: #b7b7cc;
	}
	.v2dp-cell-week-day {
		font-size: var(--font-size-day);
		color: #1f1f33;
	}

	// .v2dp-slot-week-area {
	// 	width: 100%;
	// 	height: 100%;
	// 	position: absolute;
	// 	top: 0;
	// 	left: 0;
	// 	border-radius: var(--border-radius-inner);
	// }
</style>