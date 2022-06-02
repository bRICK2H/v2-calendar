<template>
	<div class="v2dp-controls">
		<p class="v2dp-controls-date">
			<span class="v2dp-controls-link v2dp-controls-month"
				:class="[
					setClassAdditionalMode,
					setClassControlsMonth,
				]"
				@click="toggle('months')"
			>
				{{ getMonth }}
			</span>

			<span class="v2dp-controls-link v2dp-controls-year"
				:class="[
					setClassAdditionalMode,
					setClassControlsYear,
				]"
				@click="toggle('years')"
			>
				{{ currYear }}
			</span>
		</p>

		<div class="v2dp-controls-buttons">
			<button class="v2dp-controls-current"
				:style="setStyleCurrentControl"
				:disabled="!isOffsetCurrentSpace"
				@click="offset({ side: 0, days: 0, name })"
			>
				<img class="v2dp-controls-icon-current"
					:style="setStyleOffsetSpace"
					src="../../assets/img/svg/curr-day.svg"
					alt="curr-day" 
				>
			</button>

			<template v-if="!isAdditionalMode || additionalMode !== 'months'">
				<button class="v2dp-controls-prevent"
					:disabled="isDisabledLeftControl"
					@click="offset({ side: -1, days: 7, name })"
				>
					<img class="v2dp-controls-icon-toggle v2dp-controls-icon-prevent"
						src="../../assets/img/svg/prev-day.svg"
						alt="prev-day"
						:class="{ 'v2dp-controls-icon-toggle__disabled': isDisabledLeftControl }"
					>
				</button>
				<button class="v2dp-controls-next"
					:disabled="isDisabledRightControl"
					@click="offset({ side: 1, days: 7, name })"
				>
					<img class="v2dp-controls-icon-toggle"
						src="../../assets/img/svg/next-day.svg"
						alt="next-day"
						:class="{'v2dp-controls-icon-toggle__disabled' : isDisabledRightControl }"
					>
				</button>
			</template>
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
		cList: {
			type: Object,
			default: () => ({})
		},
		offsetYear: {
			type: Number,
			default: 0
		},
		months: {
			type: Array,
			default: () => ([])
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
		subMode: {
			type: String,
			default: ''
		},
		additionalMode: {
			type: String,
			default: ''
		},
		isRangeMode: {
			type: Boolean,
			default: false
		},
		isAdditionalMode: {
			type: Boolean,
			default: false
		},
		isOuterAdditionalMode: {
			type: Boolean,
			default: true
		},
	},
	data: () => ({
		mods: ['months', 'years'],
		maxOffsetYear: 100,
		minOffsetYears: -100,
	}),
	computed: {
		getMonth() {
			return this.months[this.currMonth]
		},
		setStyleOffsetSpace() {
			return {
				opacity: this.isOffsetCurrentSpace ? 1 : .2,
				boxShadow: this.isOffsetCurrentSpace ? null : 'none'
			}
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
		isDisabledLeftControl() {
			return this.isAdditionalMode
				? this.offsetYear <= this.minOffsetYears
					|| this.isDisabledToRangeLeftControlYearsMode
				: this.isDisabledToRangeLeftControlMonthDayMode
		},
		isDisabledRightControl() {
			return this.offsetYear >= this.maxOffsetYear
		},
		isDisabledToRangeLeftControlYearsMode() {
			const { from, to } = this.cList
					,	{
					_year: selectedFromYear,
				} = splitDate(from.selectedDate)

			return this.isRangeMode
					&& this.name === 'to'
					&& selectedFromYear + 1 > to.firstYearGrid
		},
		isDisabledToRangeLeftControlMonthDayMode() {
			const { from } = this.cList
				,	{
					_year: selectedFromYear,
					_month: selectedFromMonth
				} = splitDate(from.selectedDate)
				
			return this.isRangeMode
				&& this.name === 'to'
				&& selectedFromYear === this.currYear
				&& selectedFromMonth === this.currMonth
		},
		setClassAdditionalMode() {
			return this.isOuterAdditionalMode
				? 'v2dp-controls-link--additional'
				: null
		},
		setClassControlsMonth() {
			if (!this.isAdditionalMode || !this.isOuterAdditionalMode) return null

			return this.additionalMode === 'months'
				? 'v2dp-controls-link--active' : 'v2dp-controls-link--opacity'
		},
		setClassControlsYear() {
			if (!this.isAdditionalMode || !this.isOuterAdditionalMode) return null
			
			return this.additionalMode === 'years'
				? 'v2dp-controls-link--active' :	'v2dp-controls-link--opacity'
		},
		setStyleCurrentControl() {
			return {
				marginRight: this.additionalMode !== 'months'
					|| (!this.isAdditionalMode || !this.isOuterAdditionalMode)
						? 'calc(var(--margin) - 3px)' : 0
				}
		}
	},
	methods: {
		offset({ side, days, name }) {
			const mode = this.isAdditionalMode
				? this.additionalMode
				: this.subMode

			this.$emit('offset', { side, days, name, mode })
		},
		toggle(mode) {
			if (this.isOuterAdditionalMode) {
				this.$emit('toggle-additional-mode', mode)
			}
		}
	}
}
</script>

<style lang="scss">
	.v2dp-controls {
		height: var(--height-control);
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--margin);
		padding: 0 10px;
	}

	.v2dp-controls-date {
		font-size: var(--font-size);
		font-weight: 700;
		display: flex;
    	align-items: flex-end;
	}

	.v2dp-controls-month {
		margin-right: calc(var(--margin) / 2);
	}

	.v2dp-controls-link {
		display: inline-flex;

		&--additional {
			position: relative;
			cursor: pointer;
	
			&:hover::after {
				transition: background-color .2s;
				background-color: #717177;
			}
	
			&::after {
				content: '';
				width: 100%;
				height: var(--border-width);
				border-radius: var(--border-width);
				background: #dddde4;
	
				position: absolute;
				bottom: -3px;
				left: 0;
			}
		}

		&--active {
			&::after {
				background-color: #717177;
			}
		}
		&--opacity {
			opacity: .5;
			font-size: calc(var(--font-size) * .7);

			&::after {
				height: calc(var(--border-width) * .7);
			}
		}
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

	.v2dp-controls-prevent {
		margin-right: var(--margin);
	}

	.v2dp-controls-icon-current {
		width: var(--size-circle-current);
		height: var(--size-circle-current);
	}

	.v2dp-controls-icon-current,
	.v2dp-controls-icon-toggle {
		border-radius: 50%;
		transition: box-shadow .2s;

		&:hover {
			box-shadow: 0 0 8px 0 #1f1f33;
		}
	}

	.v2dp-controls-icon-toggle {
		width: var(--size-circle-toggle);
		height: var(--size-circle-toggle);

		&__disabled {
			cursor: no-drop;
			opacity: .3;

			&:hover {
				box-shadow: none;
			}
		}
	}
</style>