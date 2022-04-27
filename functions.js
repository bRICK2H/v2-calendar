const calcDayOffset = days => {
	return 60 * 60 * 24 * days * 1000
}

const calcDayWeek = date => {
	const day = date.getDay()
	return day === 0 ? 6 : day - 1
}

const getDayWeekFirst = date => {
	return new Date(
		Date.parse(date) - calcDayOffset(calcDayWeek(date))
	)
}

const getDayWeekLast = date => {
	return new Date(
		Date.parse(date) + calcDayOffset(6 - calcDayWeek(date))
	)
}

const resetDateTime = date => {
	date.setHours(0, 0, 0, 0)
	return date
}

export default {
	calcDayWeek,
	resetDateTime,
	calcDayOffset,
	getDayWeekLast,
	getDayWeekFirst
}