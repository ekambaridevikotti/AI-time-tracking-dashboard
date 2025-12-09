// Save activity
function addActivity(userId, date, activity) {
  const data = JSON.parse(localStorage.getItem('timeTracker')) || {};
  if(!data[userId]) data[userId] = {};
  if(!data[userId][date]) data[userId][date] = [];

  let totalMinutes = data[userId][date].reduce((sum, a) => sum + a.minutes, 0);
  if(totalMinutes + activity.minutes > 1440){
    alert("Cannot exceed 1440 minutes for a day");
    return false;
  }

  data[userId][date].push(activity);
  localStorage.setItem('timeTracker', JSON.stringify(data));
  return true;
}

// Get activities
function getActivities(userId, date){
  const data = JSON.parse(localStorage.getItem('timeTracker')) || {};
  return data[userId] && data[userId][date] ? data[userId][date] : [];
}

// Delete activity
function deleteActivity(userId, date, index){
  const data = JSON.parse(localStorage.getItem('timeTracker')) || {};
  if(data[userId] && data[userId][date]){
    data[userId][date].splice(index,1);
    localStorage.setItem('timeTracker', JSON.stringify(data));
  }
}

// Update activity
function updateActivity(userId, date, index, updatedActivity){
  const data = JSON.parse(localStorage.getItem('timeTracker')) || {};
  if(data[userId] && data[userId][date]){
    let totalMinutes = data[userId][date].reduce((sum, a) => sum + a.minutes, 0) - data[userId][date][index].minutes;
    if(totalMinutes + updatedActivity.minutes > 1440){
      alert("Cannot exceed 1440 minutes for a day");
      return false;
    }
    data[userId][date][index] = updatedActivity;
    localStorage.setItem('timeTracker', JSON.stringify(data));
    return true;
  }
}
