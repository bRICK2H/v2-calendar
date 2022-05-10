<template>
	<div class="v2dp-month-item"
		:class="{
			'v2dp-month-item__range-day': this.date.isRangeDay,
			'v2dp-month-item__disabled-range-day': this.date.isDisabledToRangeDay,
			'v2dp-month-item__first-range-day': this.date.isFirstRangeDay,
			'v2dp-month-item__last-range-day': this.date.isLastRangeDay,
			'v2dp-month-item__last-disabled-range-day': this.date.isLastDisabledToRangeDay,
			'v2dp-month-item__clear-from-next-day': this.date.isClearFromNextDay,
		}"
		@click="select"
	>
			<div class="v2dp-day-container"
				:class="[setClassItem, setClassCurrentMonth]"
			>
				<span class="v2dp-day"
				:class="{ 'v2dp-day__event-day': date.isEventDay }">
					{{ date.day }}
				</span>
			</div>

			<span class="v2dp-month-slot-area">
				<slot></slot>
			</span>
	</div>
</template>

<script>
export default {
	name: 'VMonthItem',
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
		setClassItem() {
			if (!this.isMarkedDay) return null
			const ITEM = 'v2dp-day-container'

			return {
				[`${ITEM}__empty-day`]: this.date.isEmptyDay,
				[`${ITEM}__event-day`]: this.date.isEventDay,
				[`${ITEM}__current-day`]: this.date.isCurrentDay,
				[`${ITEM}__selected-day`]: this.date.isSelectedDay,
				[`${ITEM}__event-selected-day`]: this.date.isEventSelectedDay,
				[`${ITEM}__visible-current-month`]: this.date.isVisibleCurrentMonth,
				[`${ITEM}__selected-offset-day`]: !this.date.isVisibleCurrentMonth && this.date.isSelectedDay,
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
.v2dp-month-item {
	flex: 0 1 calc(100% / 7);
	height: var(--height);
	display: flex;
	justify-content: center;
	align-items: center;

	margin-bottom: 2px;

	&:nth-child(7n - 6) {
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
	}

	&:nth-child(7n) {
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
	}

	&__visible-current-month {
		color: #000;
	}
	&__current-day {
		background: #eeedf7;
	}

	&__range-day {
		// background: #d3efff;
		background: #4BBAC5;
	}
	&__first-range-day {
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
	}
	&__last-range-day {
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
	}
	&__last-disabled-range-day {
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
	}
	&__clear-from-next-day {
		border: 1px solid red !important;
	}
	
	&__disabled-range-day {
		background: #f1f1f1;
		cursor: no-drop;

		&:hover {
			box-shadow: none;
		}
	}
}
.v2dp-day-container {
	width: 90%;
	height: 90%;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #b7b7cc;
	transition: box-shadow .2s;
	cursor: pointer;

	&:hover {
		border: 1px solid transparent;
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
		border: 1px solid #fafafa;
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

	// &__range-day {
	// 	background: #d3efff;
	// }
	// &__disabled-range-day {
	// 	background: rgb(241, 241, 241);
	// 	cursor: no-drop;

	// 	&:hover {
	// 		box-shadow: none;
	// 	}
	// }
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

// .v2dp-month-slot-area {
// 	width: 100%;
// 	height: 100%;
// 	position: absolute;
// 	top: 0;
// 	left: 0;
// 	border-radius: var(--border-radius-inner);
// }
</style>