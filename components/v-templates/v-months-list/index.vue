<template>
	<div class="v2dp-months-list"
		ref="v2dp-months-list"
		:style="{
			'--height-cell': heightCell,
			'--font-size-day': fontSizeDay,
		}"
	>
		<div class="v2dp-cell-months"
			v-for="(month, i) of months"
			:key="month"
			@click="$emit('close-months', i)"
		>
			{{ month }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'V2MonthsList',
	props: {
		months: {
			type: Array,
			default: () => ([])
		},
	},
	data: () => ({
		heightCell: 0,
		fontSizeDay: 0
	}),
	methods: {
		сalculatedSizes() {
			const weekList = this.$refs['v2dp-months-list']

			if (weekList) {
				// По окончанию разобраться с высостой
				const width = Math.floor(weekList.offsetWidth / 4.05)

				this.heightCell = `${width}px`
				this.fontSizeDay = `${Math.floor(width * .22)}px`
				// this.widthDay = `${Math.floor(width / 1.13)}px`
				// this.borderWidth = `${Math.floor(width * .06)}px`
				// this.fontSizeDayWeek = `${Math.floor(width * .26)}px`
				// this.heightDay = `${Math.floor((width * 1.7) / 1.13)}px`
			}
		}
	},
	watch: {
		width() {
			this.сalculatedSizes()
		},
	},
	mounted() {
		this.сalculatedSizes()
		window.addEventListener('resize', this.сalculatedSizes)
	},
}
</script>

<style lang="scss">
	.v2dp-months-list {
		display: flex;
		flex-wrap: wrap;
	}
	.v2dp-cell-months {
		flex: 1 1 calc((100% / 3) - 4px);
		height: var(--height-cell);
		border: 2px solid #dfdfdf;
		margin: 2px;
		border-radius: 8px;
		font-size: var(--font-size-day);
		cursor: pointer;

		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>