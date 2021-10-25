import {getSubscribedSubreddits, requestOAuthToken, subscribeSubreddits} from './redditApi.js';

/**
 * Migrates all subreddits from your old account to a new one.
 */
export async function migrateSubreddits() {
  const subreddits = await gatherSubredditsFromTheOldAccount();
  await migrateToNewAccount(subreddits);
}

/**
 * Gathers all the subreddits where the user has a subscription in his old account.
 */
async function gatherSubredditsFromTheOldAccount() {
  const oldUsername = process.env.OLD_USERNAME;
  const clientId = process.env.CLIENT_ID;
  const token = await requestOAuthToken(oldUsername, process.env.OLD_PASSWORD, clientId, process.env.CLIENT_SECRET);
  return await getSubscribedSubreddits(token, clientId, oldUsername);
}

/**
 * Migrate the list of subreddits to the new account.
 */
async function migrateToNewAccount(subreddits) {
  const newUsername = process.env.NEW_USERNAME;
  const clientId = process.env.NEW_CLIENT_ID;
  const token = await requestOAuthToken(newUsername, process.env.NEW_PASSWORD, clientId, process.env.NEW_CLIENT_SECRET);
  await subscribeSubreddits(subreddits, token, clientId, newUsername);
}