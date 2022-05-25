import { TwitterApi } from 'twitter-api-v2';

const CLIENT = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!
});

const { FRONTEND_URL } = process.env;

export const getNewVoucherMessage = (
  voucherId: string,
  price: string
) => `Check out this new art donated to Ukraine on @PoignARTnft

Buy this piece for ${price} ETH — 100% of proceeds will be donated to Ukraine!

#Unchain_Ukraine #StandWithUkraine ${FRONTEND_URL}/voucher/${voucherId}`;

export const getNewMintMessage = (
  voucherId: string,
  price: string
) => `New art just sold on @PoignARTnft for ${price} ETH

100% of proceeds are donated to Ukraine!

#Unchain_Ukraine #StandWithUkraine ${FRONTEND_URL}/voucher/${voucherId}`;

export const tweetMessage = async (body: string) => {
  try {
    await CLIENT.readWrite.v2.tweet(body);
  } catch (error) {
    console.error('Error tweeting message:', error);
  }
};
