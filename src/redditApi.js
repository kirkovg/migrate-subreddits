import fetch from 'node-fetch';

export async function requestOAuthToken(username, password, clientId, clientSecret) {
  const params = new URLSearchParams();
  params.set('username', username);
  params.set('password', password);
  params.set('grant_type', 'password');

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    body: params,
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ":" + clientSecret).toString('base64')
    }
  });

  const data = await response.json();
  return data['access_token'];
}

export async function getSubscribedSubreddits(accessToken, clientId, username) {
  const defaultRequestUrl = 'https://oauth.reddit.com/subreddits/mine/subscriber?limit=100';
  let requestUrl = defaultRequestUrl;
  const options = {
    headers: {
      'Authorization': 'bearer ' + accessToken,
      'User-Agent': clientId + '/0.1 by ' + username
    }
  };
  let after;
  let subredditNames = [];

  do {
    let response = await fetch(requestUrl, options);
    let jsonData = await response.json();
    after = jsonData.data.after;
    subredditNames = subredditNames.concat(jsonData.data.children.map(subreddit => subreddit.data.name));
    requestUrl = defaultRequestUrl + '&after=' + after + '&count=' + subredditNames.length;
  } while (after !== null);

  return subredditNames;
}


export async function subscribeSubreddits(subreddits, accessToken, clientId, username) {
  for (const subreddit of subreddits) {
    const params = new URLSearchParams();
    params.set('sr', subreddit);
    params.set('action', 'sub');
    const options = {
      method: 'POST',
      body: params,
      headers: {
        'Authorization': 'bearer ' + accessToken,
        'User-Agent': clientId + '/0.1 by ' + username
      }
    };

    const response = await fetch('https://oauth.reddit.com/api/subscribe', options);
    console.log(response.status, 'Subreddit: ' + subreddit);
  }
}