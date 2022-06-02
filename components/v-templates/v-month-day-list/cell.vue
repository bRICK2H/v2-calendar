<template>
	<div class="v2dp-cell-month-day"
		:class="seClassCellMonthDay"
	>
		<div class="v2dp-cell-month-day-container"
			:class="[setClassCellMonth, setClassHoverRangeDay]"
		>
			<div class="v2dp-cell-month-day-content"
				:class="setClassCellMonthContent"
				@click="select"
				@mouseenter="over"
			>
				
				<span class="v2dp-cell-month-day-date"
					:class="setClassCellMonthDate"
				>
					<slot name="clear" v-bind="date">
						{{ date.title }}
					</slot>
				</span>
			</div>

			<div class="v2dp-slot-month-day-container"
				:class="date.classes.parent"
			>
				<div v-for="name of date.classes.children"
					:key="`${name}`"
					:class="name"
				></div>

				<slot v-bind="date" />
			</div>
		</div>
	</div>
</template>

<script>
import {
	splitDate,
} from '../../../functions'

export default {
	name: 'VMonthCell',
	props: {
		name: {
			type: String,
			default: 'from'
		},
		date: {
			type: Object,
			default: () => ({})
		},
		cList: {
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
		selectedDate: {
			type: Date,
			default: new Date
		},
		hoverDateRage: null
	},
	computed: {
		seClassCellMonthDay() {
			if (!this.isMarkedDay) return null
			const CELL = 'v2dp-cell-month-day'
			
			return {
				[`${CELL}__offset-day`]: !this.date.isVisibleCurrentMonth,
			}
		},
		setClassHoverRangeDay() {
			if (!this.isMarkedDay || !this.hoverDateRage || !this.isRangeMode) return null

			const CELL = 'v2dp-cell-month-day-container'
				,	{
					_dateString: toSelectedDayString,
				} = splitDate(this.cList.to.selectedDate)
				,	{
					_dateString: fromSelectedDayString,
				} = splitDate(this.cList.from.selectedDate)
				,	{
					_dateString: hoverDayString,
				} = splitDate(this.hoverDateRage)
				,	{
					_dateString: selectedDayString,
				} = splitDate(this.selectedDate)
				,	{
					_dateString: dayString,
				} = splitDate(this.date.date)
				,	isFromHoverRangeDay = this.name === 'from'
						&& hoverDayString !== selectedDayString
						&& this.date.date >= this.hoverDateRage
						&& (
							selectedDayString === toSelectedDayString	
								? this.date.date <= this.selectedDate
								: this.date.date < this.selectedDate
						)
				,	isFirstToHoverRangeDay = this.hoverDateRage
						&& this.name === 'to'
						&& selectedDayString === fromSelectedDayString
						&& dayString === selectedDayString
				,	isFirstFromHoverRangeDay = (isFromHoverRangeDay && dayString === hoverDayString) || isFirstToHoverRangeDay
				,	isLastFromHoverRangeDay = this.hoverDateRage
						&& this.name === 'from'
						&& selectedDayString === toSelectedDayString
						&& dayString === selectedDayString
				,	isToHoverRangeDay = this.name === 'to'
						&& hoverDayString !== selectedDayString
						&& this.date.date <= this.hoverDateRage
						&& (
							selectedDayString === fromSelectedDayString	
								? this.date.date >= this.selectedDate
								: this.date.date > this.selectedDate
						)
				,	isLastToHoverRangeDay = (isToHoverRangeDay && dayString === hoverDayString) || isLastFromHoverRangeDay

			return {
				[`${CELL}__from_hover-range-day`]: isFromHoverRangeDay,
				[`${CELL}__first-from-hover-range-day`]: isFirstFromHoverRangeDay,
				[`${CELL}__to_hover-range-day`]: isToHoverRangeDay,
				[`${CELL}__last-to-hover-range-day`]: isLastToHoverRangeDay,
			}
		},
		setClassCellMonth() {
			if (!this.isMarkedDay) return null
			
			const CELL = 'v2dp-cell-month-day-container'
			const isFromHoverRangeDay = this.hoverDateRage
					&& this.name === 'from'
					&& this.hoverDateRage < this.selectedDate
				,	isToHoverRangeDay = this.hoverDateRage
					&& this.name === 'to'
					&& this.hoverDateRage > this.selectedDate
			
			return {
				[`${CELL}__range-day`]: this.date.isRangeDay,
				[`${CELL}__last-range-day`]: this.date.isLastRangeDay && this.isRangeMode && !isToHoverRangeDay,
				[`${CELL}__first-range-day`]: this.date.isFirstRangeDay && this.isRangeMode && !isFromHoverRangeDay,
				[`${CELL}__hidden-range-to-prev-day`]: this.date.isHiddenRangeToPrevDay,
				[`${CELL}__hidden-range-from-next-day`]: this.date.isHiddenRangeFromNextDay,
			}
		},
		setClassCellMonthContent() {
			if (!this.isMarkedDay) return null

			const CELL_CONTENT = 'v2dp-cell-month-day-content'

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
			const CELL_DATE = 'v2dp-cell-month-day-date'

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
		},
		over() {
			if (!this.date.isDisabledToRangeDay) {
				this.$emit('over-date')
			}
		},
	}
}
</script>

<style lang="scss">
.v2dp-cell-month-day {
	flex: 1 1 100%;
	height: var(--height-cell);
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	
	&__offset-day {
		opacity: .6;
	}
}

.v2dp-cell-month-day-container {
	width: 100%;
	height: var(--height-range);
	display: flex;
	justify-content: center;
	align-items: center;

	&__first-range-day,
	&__first-from-hover-range-day  {
		border-top-left-radius: var(--height-cell);
		border-bottom-left-radius: var(--height-cell);
	}
	&__last-range-day,
	&__last-to-hover-range-day {
		border-top-right-radius: var(--height-cell);
		border-bottom-right-radius: var(--height-cell);
	}
	&__hidden-range-from-next-day,
	&__hidden-range-to-prev-day {
		visibility: hidden;
	}
	&__range-day {
		background: #4bbac5;
	}
	&__from_hover-range-day,
	&__to_hover-range-day {
		transition: background-color .2s;
		background: #b9e6eb;
		opacity: .8;
	}
}

.v2dp-cell-month-day-content {
	width: var(--size-day);
	height: var(--size-day);
	border-radius: 50%;
	transition: box-shadow .2s;
	position: relative;
	z-index: 1;
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

.v2dp-cell-month-day-date {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	font-weight: 500;
	color: #1f1f33;
	font-size: var(--font-size-day);
	position: absolute;
	top: 0;
	left: 0;
	
	&__empty-day {
		border: 1px solid rgba(255, 255, 255, .1);
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

.v2dp-slot-month-day-container {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}
</style>