const calcDayOffset = days => {
	return 60 * 60 * 24 * days * 1000
}

const calcDayWeek = date => {
	const nativeDay = date.getDay()
	return nativeDay === 0 ? 6 : nativeDay - 1
}

export default {
	calcDayWeek,
	calcDayOffset
}