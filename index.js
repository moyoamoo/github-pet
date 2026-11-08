import { Octokit } from "octokit"
import * as fs from 'fs';
import { resolve } from "dns";

const token = process.env.TOKEN;


// Get an array of commit dates 
const getCommitDates = async (token) => {

  const octokit = new Octokit({
    auth: token
  });

  let q = 'author:moyoamoo';
  let response;
  let commits = [];
  let perPage = 100;
  let sort = "author-date";
  let order = "desc";


  try {
    response = await octokit.request('GET /search/commits', {
      q,
      per_page: perPage,
      sort,
      order,
      headers: {
        'X-GitHub-Api-Version': '2026-03-10'
      }
    })

  } catch (e) {
    console.log("Unable to complete request ")

  }
  const { data } = await octokit.request('GET /rate_limit');
  console.log('Limit:', data.rate.limit);
  console.log('Remaining:', data.rate.remaining);

  // get data from json
  //let _response = fs.readFileSync('response.json');
  //response = JSON.parse(_response);


  // push dAates into ar
  for (let i = 0; i < response.data.items.length; i++) {
    let date = new Date(response.data.items[i].commit.author.date)
    commits.push(date);
  }

  let streak = getStreak(commits);
  console.log(streak);
}

const getStreak = (commits) => {

  let streak = 0;

  // get current date and set hours, minutes, seconds, ms to 0 to get just date 
  let currentDate = new Date();
  currentDate = new Date(currentDate.setHours(0, 0, 0, 0)).toString();
  console.log("Current date " + currentDate);

  // get the date of latest commit 
  let latestCommitDate = new Date(commits[0].setHours(0, 0, 0, 0)).toString();
  console.log("Latest commit date: " + latestCommitDate);

  // get yesterdays date by subtracting one day 
  let yesterdaysDate = subtractDaysFromDate(currentDate, 1).toString();

  // return is there is no streak 
  if (currentDate != latestCommitDate && yesterdaysDate != latestCommitDate) {
    return streak;
  } else {
    streak++;
  }

  for (let i = 1; i < commits.length - 1; i++) {
    let firstDate = new Date(commits[i].setHours(0, 0, 0, 0)).toString();
    console.log("first date " + firstDate);
    let secondDate = new Date(commits[i + 1].setHours(0, 0, 0, 0)).toString();
    console.log("second date " + secondDate);
    let firstDateComparison = subtractDaysFromDate(firstDate, 1).toString();
    console.log("first date - 1  " + firstDateComparison);


    if (firstDateComparison == secondDate) {

      streak++
    } else {
      return streak
    }

  }


}

const subtractDaysFromDate = (currentDate, daysToSubtract) => {

  daysToSubtract = daysToSubtract || 0

  // Instantiate a new object based on the current Date
  const pastDate = new Date(currentDate)

  // Subtract  the number of days
  pastDate.setDate(pastDate.getDate() - daysToSubtract)

  // Set hrs, mins, secs, ms to 0 to get just date
  const formatPastDate = new Date(pastDate.setHours(0, 0, 0, 0));

  return formatPastDate
}


let commitArr = getCommitDates(token);




