const data = [
  {
    meetings: [
      ['9:00', '10:30'],
      ['12:00', '13:00'],
      ['16:00', '18:00'],
    ],
    dailyBound: ['9:00', '20:00'],
  },
  {
    meetings: [
      ['10:00', '11:30'],
      ['12:30', '14:30'],
      ['14:30', '15:00'],
      ['16:00', '17:00'],
    ],
    dailyBound: ['10:00', '18:30'],
  },
]

// Add the daily bounds as meetings
function addDailyBoundsAsMeetings({ meetings, dailyBound }) {
  return [['00:00', dailyBound[0]], ...meetings, [dailyBound[1], '24:00']]
}

function timeStringToMinuts(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(val => parseInt(val))
  return hours * 60 + minutes
}

function minutesToTimeString(minutes) {
  return Math.floor(minutes / 60) + ':' + (minutes % 60).toString().padStart(2, '0')
}

function findTimeToMeet(meetingTime, ...calenders) {
  const transformedCalenders = calenders.map(addDailyBoundsAsMeetings)

  // Convert the meeting times into minutes
  const allMeetings = transformedCalenders.flat().map(meeting => meeting.map(timeStringToMinuts))

  // Sort the meetings by the start time and then the end time
  allMeetings.sort((a, b) => {
    if (a[0] > b[0]) return 1
    if (a[0] < b[0]) return -1
    return a[1] - b[1]
  })

  // Merge meetings
  for (let i = 0; i < allMeetings.length - 1; i++) {
    const current = allMeetings[i]
    const next = allMeetings[i + 1]

    const meetingsOverlap = current[1] >= next[0]
    if (meetingsOverlap) {
      const newEndTime = Math.max(next[1], current[1])
      const newStartTime = current[0]
      allMeetings.splice(i, 2, [newStartTime, newEndTime])
      i = -1
    }
  }

  // Get the time inbetween all the meetings which is long enough for the meeting
  const freeTime = []
  for (let i = 0; i < allMeetings.length - 1; i++) {
    const currentEnd = allMeetings[i][1]
    const nextStart = allMeetings[i + 1][0]

    const duration = nextStart - currentEnd
    if (duration >= meetingTime) {
      freeTime.push([currentEnd, nextStart])
    }
  }

  // Convert the freetimes to strings
  return freeTime.map(space => space.map(minutesToTimeString))
}

console.log(findTimeToMeet(30, ...data)) // [ [ '11:30', '12:00' ], [ '15:00', '16:00' ], [ '18:00', '18:30' ] ]
