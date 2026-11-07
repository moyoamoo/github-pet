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
  let sort = "committer-date";
  let order = "desc";

  /*
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
    */

  let _response = fs.readFileSync('response.json');
  response = JSON.parse(_response); 
  //console.log(response);
  for (let i = 0; i < response.items.length; i++) {
    //console.log(response.items[i].commit.author.date)

    // date as string
    console.log(JSON.stringify(response.items[i].commit.author.date));

    // convert to date object 
    let date = new Date(response.items[i].commit.author.date)
    //let date = new Date(dateStr)
    commits.push(date);
  }

  let streak = getStreak(commits)
  console.log(streak)

}

const getStreak = (commits) => {
  console.log(commits);
  let currentDate = new Date(Date.now());
  currentDate = currentDate.setHours(0,0,0,0);
  console.log(JSON.stringify(commits[0]));
  let epochLatestCommit = new Date(commits[0]).setHours(0,0,0,0);
  const dayInMs = 86400000;

  let streak = 0;
  console.log(epochLatestCommit);
  // if (new Date(currentDate - 1) !== new Date(epochLatestCommit)) {
  //   return streak;
  // }

  for (let i = 0; i < commits.length - 1; i++) {
    let firstDate = new Date(commits[i]).setHours(0,0,0,0);
    let secondDate = new Date(commits[i + 1]).setHours(0,0,0,0);
    console.log(firstDate + "@@" + secondDate)
    console.log(firstDate  - secondDate <= dayInMs);
    if (firstDate  - secondDate >= dayInMs) {
      return streak
    }
    streak++;
  }
  return streak; 
}


let commitArr = getCommitDates(token);

const currentStreak = getStreak(commitArr);
console.log("Current Streak:" + currentStreak); 





