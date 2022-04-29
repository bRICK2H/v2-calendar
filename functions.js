const resetDateTime = date => {
	console.log('reset', date)
	date.setHours(0, 0, 0, 0)
	return date
}

const calcDayOffset = days => {
	return 60 * 60 * 24 * days * 1000
}

const splitDate = date => {
	return {
		_day: date.getDate(),
		_month: date.getMonth(),
		_year: date.getFullYear(),
		_dateString: date.toLocaleDateString()
	}
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

export {
	splitDate,
	calcDayWeek,
	resetDateTime,
	calcDayOffset,
	getDayWeekLast,
	getDayWeekFirst
}