<template>
	<div class="v2dp-week-item"
		:class="[setClassItem, setClassCurrentWeek]"
		@click="$emit('select-date')"
	>
		<div class="v2dp-week-item-content"
			:class="{ 'v2dp-week-item-content__event-day': date.isEventDay }"
		>
			<span class="v2dp-week-item-name">
				{{ date.name }}
			</span>
			<span class="v2dp-week-item-day">
				{{ date.day }}
			</span>
		</div>

		<div class="v2dp-week-slot-area">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'VWeekItem',
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
		setClassCurrentWeek() {
			return {
				'v2dp-week-item__visible-current-week': this.date.isVisibleCurrentWeek
			}
		},
		setClassItem() {
			if (!this.isMarkedDay) return null
			const ITEM = 'v2dp-week-item'
			
			return {
				[`${ITEM}__empty-day`]: this.date.isEmptyDay,
				[`${ITEM}__event-day`]: this.date.isEventDay,
				[`${ITEM}__current-day`]: this.date.isCurrentDay,
				[`${ITEM}__selected-day`]: this.date.isSelectedDay,
				[`${ITEM}__event-selected-day`]: this.date.isEventSelectedDay,
				[`${ITEM}__visible-current-week`]: this.date.isVisibleCurrentWeek,
				[`${ITEM}__selected-offset-day`]: !this.date.isVisibleCurrentWeek && this.date.isSelectedDay,
			}
		}
	}
}
</script>

<style lang="scss">
	.v2dp-week-item {
		flex: 0 1 calc(100% / 7 - 7px);
		height: var(--height);
		border-radius: var(--border-radius-outer);
		transition: box-shadow .2s;
		color: #b7b7cc;
		position: relative;
		cursor: pointer;
		
		&:not(:last-of-type) {
			margin-right: 7px;
		}
		&:hover {
			box-shadow: 0 0 8px 0 #1f1f33;
		}
		&:active {
			box-shadow: 0 0 4px 0 #1f1f33;
		}

		&__visible-current-week {
			color: #000;
		}
		&__current-day {
			background: #eeedf7;
		}
		&__selected-day {
			background: #1f1f33;

			.v2dp-week-item-name,
			.v2dp-week-item-day {
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
	}
	.v2dp-week-item-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: var(--border-radius-inner);
		
		&__event-day {
			border: var(--border-width) solid #fff;
		}
	}
	.v2dp-week-item-name {
		font-size: var(--font-size-day-week);
		color: #b7b7cc;
	}
	.v2dp-week-item-day {
		font-size: var(--font-size-day);
	}

	.v2dp-week-slot-area {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: var(--border-radius-inner);
	}
</style>