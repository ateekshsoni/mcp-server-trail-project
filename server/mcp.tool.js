//mcp tool file for create post
import { config } from "dotenv";
import { TwitterApi } from "twitter-api-v2";
config();
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

export async function createPost(status) {
  try {
    const newPost = await twitterClient.v2.tweet(status);

    return {
      content: [
        {
          type: text,
          text: `Tweet created with ID: ${newPost.data.id} and text: ${newPost.data.text} with status : ${status}`,
        },
      ],
    };
  } catch (err) {
    console.log(err);
  }
}
