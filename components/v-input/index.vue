<template>
	<div class="v2dp-input-container">

		<input class="v2dp-input-item"
			type="text"
			placeholder="Выберите дату"
			:value="value"
			@input="$emit('input', $event.target.value)"
		>
		
		<img class="v2dp-input-icon"
			src="../../assets/img/svg/calendar.svg"
			alt="calendar"
			@click="$emit('toggle-calendar')"
		>

	</div>
</template>

<script>
export default {
	name: 'VInput',
	props: {
		value: null
	}
}
</script>

<style lang="scss">
	.v2dp-input-container {
		max-width: 300px;
		margin: 5px;
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

	.v2dp-input-icon {
		position: absolute;
		right: 12px;
		cursor: pointer;
		opacity: .4;
		transition: opacity .2s;

		&:hover {
			opacity: 1;
		}
	}
</style>