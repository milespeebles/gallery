// TODO: server container: db, auth, local / global websocket
// TODO: setup reverse proxy (redbird)
// TODO: setup file server (upload, download)
// TODO: create `web` app (next.js + rxdb)
// TODO: save media to file (and perform transcodes with ffmpeg)
// TODO: add gallery collections: filter, list, page
// TODO: remove query from upload payload (only send 200)
// TODO: setup docker-compose.yml (get REMOTE_URL env var)

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

    console.log (req.file)
    console.log (req.body)

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

export default Service (upload, { remote: process.env.REMOTE_URL })

