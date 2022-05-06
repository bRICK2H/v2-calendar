<template>
	<div class="v2dp-controls">
		<p class="v2dp-controls-date">
			{{ getMonth }} {{ currYear }}
		</p>

		<div class="v2dp-controls-buttons">
			<button class="v2dp-controls-current"
				@click="$emit('offset', { side: 0, days: 0, name })"
			>
				<img class="v2dp-controls-icon-current"
					:style="setStyleOffsetSpace"
					src="../../assets/img/svg/curr-day.svg"
					alt="curr-day" 
				>
			</button>
			<button class="v2dp-controls-prevent"
				@click="$emit('offset', { side: -1, days: 7, name })"
			>
				<img class="v2dp-controls-icon-toggle"
					src="../../assets/img/svg/prev-day.svg"
					alt="prev-day"
				>
			</button>
			<button class="v2dp-controls-next"
				@click="$emit('offset', { side: 1, days: 7, name })"
			>
				<img class="v2dp-controls-icon-toggle"
					src="../../assets/img/svg/next-day.svg"
					alt="next-day"
				>
			</button>
		</div>
	</div>
</template>

<script>
import {
	splitDate,
	getDayWeekFirst
} from '../../functions'

export default {
	name: 'VControls',
	props: {
		selectedDate: null,
		switchedDate: null,
		name: {
			type: String,
			default: 'from'
		},
		currMonth: {
			type: Number,
			default: ''
		},
		currYear: {
			type: Number,
			default: ''
		},
		todaysDate: {
			type: Date,
			default: new Date()
		},
		months: {
			type: Array,
			default: () => ([])
		},
	},
	computed: {
		getMonth() {
			return this.months[this.currMonth]
		},
		setStyleOffsetSpace() {
			return { opacity: this.isOffsetCurrentSpace ? 1 : .2 }
		},
		isOffsetCurrentSpace() {
			const {
				_year: todayYear,
				_month: todayMonth,
				_dateString: todayDateString
			} = splitDate(this.todaysDate)
			, {
				_day: firstOfWeekDay
			} = splitDate(getDayWeekFirst(this.todaysDate))
			, {
				_day: firstSwitchOfWeekDay
			} = splitDate(this.switchedDate)
			, {
				_dateString: selectedDateString
			} = splitDate(this.selectedDate)

			return todayYear !== this.currYear
				|| todayMonth !== this.currMonth
				|| todayDateString !== selectedDateString
				|| (this.subMode === 'week' && firstOfWeekDay !== firstSwitchOfWeekDay)
		},
	}
}
</script>

<style lang="scss">
	.v2dp-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--margin);
		padding: 0 10px;
	}

	.v2dp-controls-date {
		font-size: var(--font-size);
		font-weight: 700;
	}

	.v2dp-controls-buttons {
		display: flex;
		align-items: center;
	}

	.v2dp-controls-prevent,
	.v2dp-controls-current,
	.v2dp-controls-next,
	.v2dp-toggle-sub-mode-button {
		border: none;
		outline: none;
		background: none;
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.v2dp-controls-current {
		margin-right: calc(var(--margin) - 3px);
	}

	.v2dp-controls-prevent {
		margin-right: var(--margin);
	}

	.v2dp-controls-icon-current {
		width: var(--size-circle-current);
		height: var(--size-circle-current);
	}

	.v2dp-controls-icon-toggle {
		width: var(--size-circle-toggle);
		height: var(--size-circle-toggle);
	}

	.v2dp-controls-icon-current,
	.v2dp-controls-icon-toggle {
		border-radius: 50%;
		transition: box-shadow .2s;

		&:hover {
			box-shadow: 0 0 8px 0 #1f1f33;
		}
	}
</style>