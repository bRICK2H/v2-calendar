<template>
	<div class="v2dp-month-item"
		:class="[setClassItem, setClassCurrentMonth]"
		@click="$emit('select-date')"
	>
			<span class="v2dp-month-day"
				:class="{ 'v2dp-month-day__pre-selected-days': date.isPreSelectedDays }"
			>
				{{ date.day }}
			</span>

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
		}
	},
	computed: {
		setClassCurrentMonth() {
			return {
				'v2dp-month-item__visible-current-month': this.date.isVisibleCurrentMonth
			}
		},
		setClassItem() {
			if (!this.isMarkedDay) return null
			const ITEM = 'v2dp-month-item'

			return {
				[`${ITEM}__empty-day`]: this.date.isEmptyDay,
				[`${ITEM}__current-day`]: this.date.isCurrentDay,
				[`${ITEM}__selected-day`]: this.date.isSelectedDay,
				[`${ITEM}__pre-selected-day`]: this.date.isPreSelectedDay,
				[`${ITEM}__pre-selected-days`]: this.date.isPreSelectedDays,
				[`${ITEM}__visible-current-month`]: this.date.isVisibleCurrentMonth,
				[`${ITEM}__selected-offset-day`]: !this.date.isVisibleCurrentMonth && this.date.isSelectedDay,
			}
		}
	}
}
</script>

<style lang="scss">
.v2dp-month-item {
	flex: 0 1 calc(100% / 7 - 7px);
	height: var(--height);
	border-radius: 50%;
	transition: box-shadow .2s;
	color: #b7b7cc;
	position: relative;
	cursor: pointer;

	&:not(:nth-child(7n + 7)) {
		margin: 0 7px 7px 0;
	}
	&:nth-last-child(-n + 7) {
		margin-bottom: 0;
	}
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

		.v2dp-month-day {
			color: #fff;
		}
	}
	&__empty-day {
		border: 1px solid #fafafa;
	}
	&__pre-selected-days {
		border: var(--border-width) solid #e6e6ee;
	}
	&__pre-selected-day {
		border: var(--border-width) solid #1f1f33;
	}
	&__selected-offset-day {
		opacity: .4;
	}
}
.v2dp-month-day {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	border-radius: 50%;
	top: 0;
	left: 0;
	font-size: var(--font-size-day);

	&__pre-selected-days {
		border: var(--border-width) solid #fff;
	}
}

.v2dp-month-slot-area {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	border-radius: var(--border-radius-inner);
}
</style>