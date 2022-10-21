import type { NextApiRequest, NextApiResponse } from 'next'

import redis from '../../lib/redis'

export default async function clear(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  redis.flushall()
  res.status(200).json({});
}
