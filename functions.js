const resetDateTime = date => {
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
		_shortYear: String(date.getFullYear()).slice(2),
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

const getLastDay = date => {
	const {
		_year,
		_month
	} = splitDate(new Date(date))

	return new Date(_year, _month + 1, 0)
}

const getRandomNumber = () => {
	return String(Math.random()).slice(2, 10)
}

const getResetedDateString = date => {
	const d = new Date(date)
		,	tz = d.getTimezoneOffset() * 1000 * 60

	return new Date(d - tz).toJSON()
}

export {
	splitDate,
	getLastDay,
	calcDayWeek,
	resetDateTime,
	calcDayOffset,
	getDayWeekLast,
	getDayWeekFirst,
	getRandomNumber,
	getResetedDateString
}