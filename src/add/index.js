import uuid from 'toolbelt/util/uuid'
import getCurrentTime from 'toolbelt/util/get-current-time'
import Service from 'service'

import { SCHEMAS, NAMES } from '../../constants'

const add = {
  type: 'request',
  method: 'post',
  callback: async ({ Collection, req, res, db }) => {
    const media = await Collection (
      NAMES.GALLERY_MEDIA,
      SCHEMAS.GALLERY_MEDIA,
    )

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

export default Service (add)

