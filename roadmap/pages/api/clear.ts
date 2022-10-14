import type { NextApiRequest, NextApiResponse } from 'next'

import redis from '../../lib/redis'

export default async function clear(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //const features = (await redis.del('features'))
  return res.status(200)
}
