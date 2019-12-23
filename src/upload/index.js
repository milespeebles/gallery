// TODO: get remote URL from env var through docker
// TODO: create `web` app (next.js + rxdb)
// TODO: save media to file (and perform transcodes with ffmpeg)
// TODO: get local and global websocket
// TODO: 

import uuid from 'toolbelt/util/uuid'
import getCurrentTime from 'toolbelt/util/get-current-time'
import Service from 'service'

import { SCHEMAS, NAMES } from '../../constants'

const upload = {
  type: 'request',
  method: 'post',
  collections: [
    {
      name: NAMES.GALLERY_MEDIA,
      schema: SCHEMAS.GALLERY_MEDIA,
    },
  ],
  callback: async ({ req, res, state }) => {
    const media = state[NAMES.GALLERY_MEDIA]

    const time = getCurrentTime ()

    const item = {
      id: uuid (),
      date_added: time,
      date_modified: time,
      ...req.body,
    }

    await media.insert (item)

    const query = await media
      .find ()
      .exec ()

    const payload = query.map (doc => doc.toJSON ())

    res
      .status (200)
      .send (payload)
  },
}

export default Service (upload, { remote: 'http://192.168.50.202:8080/db' })

