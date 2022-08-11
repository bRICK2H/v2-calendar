<template>
	<div class="v2dp-input-container"
		:style="setStyleInput"
		@click="$emit('toggle-calendar')"
	>

		<input class="v2dp-input-item"
			type="text"
			placeholder="Выберите дату"
			:value="value"
			:disabled="true"
			@input="$emit('input', $event.target.value)"
		>
		
		<button class="v2dp-calendar-call"
			:class="{ 'v2dp-calendar-call__disabled': isDisabledCalendarToggle }"
			:disabled="isDisabledCalendarToggle"
		>
			<img src="../../assets/img/svg/calendar.svg"
				alt="calendar"
			>
		</button>

	</div>
</template>

<script>
export default {
	name: 'VInput',
	props: {
		value: null,
		width: {
			type: [String, Number],
			default: 300
		},
		isDisabledCalendarToggle: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		setStyleInput() {
			return {
				maxWidth: `${this.width}px`
			}
		}
	}
}
</script>

<style lang="scss">
	.v2dp-input-container {
		width: 100%;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;
	}

	.v2dp-input-item {
		width: 100%;
		height: 44px;
		outline: none;
		border-radius: 8px;
		border: 2px solid #eeedf7;
		padding: 0 44px 0 12px;
		transition: border .2s;

		&:focus {
			border: 2px solid #cfcde5;
		}

		&::placeholder {
			color: #b7b7cc;
		}
	}

	.v2dp-calendar-call {
		border: none;
		opacity: none;
		background: #fff;
		position: absolute;
		right: 12px;
		cursor: pointer;
		opacity: .4;
		transition: opacity .2s;

		&:hover {
			opacity: 1;
		}

		&__disabled {
			cursor: no-drop;

			&:hover {
				opacity: .4;
			}
		}
	}
</style>