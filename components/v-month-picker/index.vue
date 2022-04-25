<template>
	<div class="v2dp-month-picker">
		
		<div class="v2dp-week-names">
			<span v-for="(name, i) of weeks"
				:key="i"
				class="v2dp-week-name"
			>
				{{ name }}
			</span>
		</div>

		<div class="v2dp-month-list">
			<div v-for="item of list"
				:key="item"
				class="v2dp-month-item"
			>
				<span class="v2dp-month-day">
					{{ item }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'VMonthPicker',
	props: {
		weeks: {
			type: Array,
			require: true
		},
		months: {
			type: Array,
			require: true
		},
		todaysDate: {
			type: Date,
			default: new Date
		},
		switchDate: {
			type: null,
			default: new Date
		},
		selectedDate: {
			type: Date,
			default: new Date
		},
		selectedDates: {
			type: Array,
			default: () => ([])
		},
		currMonth: {
			type: Number,
			default: 0
		},
		sideOffset: {
			type: Object,
			require: true
		}
	},
	data: () => ({
		list: [1,2,3,4,5,6,7, 8]
	})
}
</script>

<style lang="scss">
	.v2dp-week-names {
		display: flex;
		justify-content: space-between;
		margin: 10px 0;
	}
	.v2dp-week-name {
		flex: 0 1 calc(100% / 7 - 5px);
		font-size: calc(9px + .5vmin);
		text-align: center;
		color: #b7b7cc;

		&:not(:last-of-type) {
			margin-right: 5px;
		}
	}
	.v2dp-month-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.v2dp-month-item {
		flex: 0 1 calc(100% / 7 - 5px);
		height: 0;
		padding-top: calc(100% / 7 - 7px);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		border: 2px solid transparent;
		transition: box-shadow .2s;
		// color: #b7b7cc;
		position: relative;
		cursor: pointer;

		&:not(:nth-child(-7n + 7)) {
			margin: 0 5px 5px 0;
		}
	}
	.v2dp-month-day {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		font-size: calc(15px + .5vmin);
	}

</style>