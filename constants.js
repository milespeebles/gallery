const GALLERY_MEDIA = {
  title: 'gallery media schema',
  version: 0,
  description: 'describes a media object',
  type: 'object',
  attachments: {},
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    name: 'string',
    description: 'string',
    date_added: 'string',
    date_modified: 'string',
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    links: {
      type: 'object',
      // imgur,
      // gfycat,
    },
    // versions
    // originals
    // links
  },
}

const GALLERY_LIST = {
  title: 'gallery lists schema',
  version: 0,
  description: 'describes a media list',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    name: 'string',
    description: 'string',
    date_added: 'string',
    date_modified: 'string',
    media: {
      type: 'array',
      items: { type: 'string' },
    },
    // tags
  },
}

const GALLERY_FILTER = {
  title: 'gallery filter schema',
  version: 0,
  description: 'describes a media filter',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    name: 'string',
  },
}

const GALLERY_PAGE = {
  title: 'gallery page schema',
  version: 0,
  description: 'describes a media page',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    name: 'string',
  },
}

export const SCHEMAS = {
  GALLERY_MEDIA,
  GALLERY_LIST,
  GALLERY_FILTER,
  GALLERY_PAGE,
}


export const NAMES = {
  GALLERY_MEDIA: 'gallery_media',
  GALLERY_LISTS: 'gallery_lists',
  GALLERY_FILTERS: 'gallery_filters',
  GALLERY_PAGES: 'gallery_pages',
}

