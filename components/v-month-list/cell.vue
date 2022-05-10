<template>
	<div class="v2dp-month-cell"
		:class="{
			'v2dp-month-cell__range-day': this.date.isRangeDay,
			'v2dp-month-cell__first-range-day': this.date.isFirstRangeDay,
			'v2dp-month-cell__last-range-day': this.date.isLastRangeDay,
			'v2dp-month-cell__hidden-range-from-next-day': this.date.isHiddenRangeFromNextDay,
			'v2dp-month-cell__hidden-range-to-prev-day': this.date.isHiddenRangeToPrevDay,
		}"
		@click="select"
	>
			<div class="v2dp-day-container"
				:class="[setClassCell, setClassCurrentMonth]"
			>
				
				<span class="v2dp-day"
					:class="{ 'v2dp-day__event-day': date.isEventDay }"
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
		setClassCurrentMonth() {
			return {
				'v2dp-day-container__visible-current-month': this.date.isVisibleCurrentMonth
			}
		},
		setClassCell() {
			if (!this.isMarkedDay) return null
			const CELL = 'v2dp-day-container'

			return {
				[`${CELL}__empty-day`]: this.date.isEmptyDay,
				[`${CELL}__event-day`]: this.date.isEventDay,
				[`${CELL}__current-day`]: this.date.isCurrentDay,
				[`${CELL}__selected-day`]: this.date.isSelectedDay,
				[`${CELL}__event-selected-day`]: this.date.isEventSelectedDay,
				[`${CELL}__visible-current-month`]: this.date.isVisibleCurrentMonth,
				[`${CELL}__selected-offset-day`]: !this.date.isVisibleCurrentMonth && this.date.isSelectedDay,
				[`${CELL}__disabled-range-day`]: this.date.isDisabledToRangeDay,
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
.v2dp-month-cell {
	flex: 1 1 100%;
	height: var(--height);
	display: flex;
	justify-content: center;
	align-items: center;

	&__range-day {
		background: #4bbac5;
	}
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

}

.v2dp-day-container {
	width: calc(100% - var(--offset-size-day));
	height: calc(100% - var(--offset-size-day));
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #b7b7cc;
	transition: box-shadow .2s;
	cursor: pointer;

	&:hover {
		box-shadow: 0 0 8px 0 #1f1f33;
	}
	&:active {
		box-shadow: 0 0 4px 0 #1f1f33;
	}

	&__visible-current-month {
		color: #000;
	}
	&__current-day {
		background: #eeedf7;
	}
	&__selected-day {
		background: #1f1f33;
		box-shadow: 0 0 4px 0 #1f1f33;

		.v2dp-day {
			color: #fff;
		}
	}
	&__empty-day {
		// border: 1px solid #fafafa;
	}
	&__event-day {
		border: var(--border-width) solid #e6e6ee;
	}
	&__event-selected-day {
		border: var(--border-width) solid #1f1f33;
	}
	&__selected-offset-day {
		opacity: .4;
	}
	&__disabled-range-day {
		opacity: .2;

		&:hover {
			box-shadow: none;
			cursor: no-drop;
		}
	}
}

.v2dp-day {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	font-weight: 500;
	font-size: var(--font-size-day);

	&__event-day {
		border: var(--border-width) solid #fff;
	}
}
</style>