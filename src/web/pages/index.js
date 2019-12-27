// TODO: dont show preview for mp4 unless codec is H264
// TODO: convert 'set name' feature to dropdown with options (name, random words, uuid, shortcode)
// TODO: use shorthand for functions where possible
// TODO: put reducer in redux (dont persist state)
// TODO: use database for tags (unique name + description)

import { useState, useEffect, useReducer } from 'react'
import uuid from 'toolbelt/util/uuid'

const CONVERSIONS = {
  webmToMp4: 'WEBM to MP4',
  webmToGoodWebm: 'WEBM to Good Quality WEBM',
  webmToOkayWebm: 'WEBM to Okay Quality WEBM',
  webmToPoorWebm: 'WEBM to Poor Quality WEBM',
  webmToLargeThumbnailWebm: 'WEBM to Large Thumbnail WEBM',
  webmToMediumThumbnailWebm: 'WEBM to Medium Thumbnail WEBM',
  webmToSmallThumbnailWebm: 'WEBM to Small Thumbnail WEBM',
  webmToLargeThumbnailPng: 'WEBM to Large Thumbnail PNG',
  webmToMediumThumbnailPng: 'WEBM to Medium Thumbnail PNG',
  webmToSmallThumbnailPng: 'WEBM to Small Thumbnail PNG',
  webmToLargeThumbnailPngSlideshow: 'WEBM to Large Thumbnail PNG Slideshow',
  webmToMediumThumbnailPngSlideshow: 'WEBM to Medium Thumbnail PNG Slideshow',
  webmToSmallThumbnailPngSlideshow: 'WEBM to Small Thumbnail PNG Slideshow',
  ensureH264: 'Ensure H264 MP4',
  mp4ToWebm: 'MP4 to WEBM',
  mp4ToGoodMp4: 'MP4 to Good Quality MP4',
  mp4ToOkayMp4: 'MP4 to Okay Quality MP4',
  mp4ToPoorMp4: 'MP4 to Poor Quality MP4',
  mp4ToLargeThumbnailMp4: 'MP4 to Large Thumbnail MP4',
  mp4ToMediumThumbnailMp4: 'MP4 to Medium Thumbnail MP4',
  mp4ToSmallThumbnailMp4: 'MP4 to Small Thumbnail MP4',
  mp4ToLargeThumbnailPng: 'MP4 to Large Thumbnail PNG',
  mp4ToMediumThumbnailPng: 'MP4 to Medium Thumbnail PNG',
  mp4ToSmallThumbnailPng: 'MP4 to Small Thumbnail PNG',
  mp4ToLargeThumbnailPngSlideshow: 'MP4 to Large Thumbnail PNG Slideshow',
  mp4ToMediumThumbnailPngSlideshow: 'MP4 to Medium Thumbnail PNG Slideshow',
  mp4ToSmallThumbnailPngSlideshow: 'MP4 to Small Thumbnail PNG Slideshow',
  pngToGoodPng: 'PNG to Good Quality PNG',
  pngToOkayPng: 'PNG to Okay Quality PNG',
  pngToPoorPng: 'PNG to Poor Quality PNG',
  pngToLargeThumbnailPng: 'PNG to Large Thumbnail PNG',
  pngToMediumThumbnailPng: 'PNG to Medium Thumbnail PNG',
  pngToSmallThumbnailPng: 'PNG to Small Thumbnail PNG',
  gifToWebm: 'GIF to WEBM',
  gifToMp4: 'WEBM to MP4',
  flvToWebm: 'FLV to WEBM',
  flvToMp4: 'FLV to MP4',
  movToWebm: 'MOV to WEBM',
  movToMp4: 'MOV to MP4',
  aviToWebm: 'AVI to WEBM',
  aviToMp4: 'AVI to MP4',
  wmvToWebm: 'WMV to WEBM',
  wmvToMp4: 'WMV to MP4',
  jpgToPng: 'JPG to PNG',
}

const MIRRORS = {
  imgur: 'imgur',
  gfycat: 'gfycat',
}

const ACTIONS = {
  GET_FILES: 'GET_FILES',
  RESET_FILES: 'RESET_FILES',
  UPDATE_FILE: 'UPDATE_FILE',
  GET_TAGS: 'GET_TAGS',
  TOGGLE_IS_DISPLAYING_CONVERSIONS: 'TOGGLE_IS_DISPLAYING_CONVERSIONS',
  GET_CONVERSION: 'GET_CONVERSION',
  TOGGLE_CONVERSIONS: 'TOGGLE_CONVERSIONS',
  TOGGLE_IS_DISPLAYING_MIRRORS: 'TOGGLE_IS_DISPLAYING_MIRRORS',
  GET_MIRROR: 'GET_MIRROR',
  TOGGLE_MIRRORS: 'TOGGLE_MIRRORS',
  TOGGLE_EXPAND: 'TOGGLE_EXPAND',
  SET_NAMES_TO_FILE_NAME: 'SET_NAMES_TO_FILE_NAME',
  SET_NAMES_TO_UUID: 'SET_NAMES_TO_UUID',
  SET_NAME_TO_FILE_NAME: 'SET_NAME_TO_FILE_NAME',
  SET_NAME_TO_UUID: 'SET_NAME_TO_UUID',
}

const INVALID_ACTION_ERROR = 'Reducer did not receive a valid action.'

const isValidMime = mime =>
  mime === 'image/jpeg'
    || mime === 'image/png'
    || mime === 'video/webm'
    || mime === 'video/mp4'
    || mime === 'video/x-flv'
    || mime === 'video/quicktime'
    || mime === 'video/avi'
    || mime === 'video/x-msvideo'
    || mime === 'video/msvideo'
    || mime === 'video/x-ms-wmv'
    || mime === 'image/gif'

const getDisplayType = mime => {
  if (mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/gif')
    return 'image'

  if (mime === 'video/webm' || mime === 'video/mp4')
    return 'video'
}

const getFiles = (state, files) => ({
  ...state,
  files: [...files]
    .map (file => ({
      file,
      name: uuid (),
      mime: file.type,
      description: '',
      tags: '',
      preview: URL.createObjectURL (file),
      isOverridingConversions: false,
      isOverridingMirrors: false,
      isDisplayingInfo: false,
      displayType: getDisplayType (file.type),
    }))
    .filter (({ mime }) => isValidMime (mime))
})

const resetFiles = state => ({
  ...state,
  files: [],
})

const getTags = (state, globalTags) => ({
  ...state,
  globalTags,
})

const updateFile = (state, { index, value, key }) => {
  const files = [...state.files]

  if (key === 'isDisplayingInfo') {
    files[index][key] = !files[index][key]
  } else {
    files[index][key] = value
  }

  return {
    ...state,
    files,
  }
}

const getConversion = (state, { selector, isEnabled }) => {
  const conversions = { ...state.conversions }

  conversions[selector] = isEnabled

  return {
    ...state,
    conversions,
  }
}

const toggleConversions = (state, isEnabled) => {
  const conversions = { ...state.conversions }

  Object.keys (conversions)
    .forEach (key => (conversions[key] = isEnabled))

  return {
    ...state,
    conversions,
  }
}

const toggleIsDisplayingConversions = state => ({
  ...state,
  isDisplayingConversions: !state.isDisplayingConversions,
})

const getMirror = (state, { selector, isEnabled }) => {
  const mirrors = { ...state.mirrors }

  mirrors[selector] = isEnabled

  return {
    ...state,
    mirrors,
  }
}

const toggleMirrors = (state, isEnabled) => {
  const mirrors = { ...state.mirrors }

  Object.keys (mirrors)
    .forEach (key => (mirrors[key] = isEnabled))

  return {
    ...state,
    mirrors,
  }
}

const toggleIsDisplayingMirrors = state => ({
  ...state,
  isDisplayingMirrors: !state.isDisplayingMirrors,
})

const toggleExpand = (state, payload) => ({
  ...state,
  files: state.files.map (item => ({
    ...item,
    isDisplayingInfo: payload,
  }))
})

const setNamesToFileName = state => ({
  ...state,
  files: state.files.map (item => ({
    ...item,
    name: item.file.name.replace (/\.[^/.]+$/, ''),
  })),
})

const setNamesToUUID = state => ({
  ...state,
  files: state.files.map (item => ({
    ...item,
    name: uuid (),
  })),
})

const setNameToFileName = (state, index) => {
  const files = [...state.files]

  files[index].name = files[index].file.name.replace (/\.[^/.]+$/, '')

  return {
    ...state,
    files,
  }
}

const setNameToUUID = (state, index) => {
  const files = [...state.files]

  files[index].name = uuid ()

  return {
    ...state,
    files,
  }
}

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case ACTIONS.GET_FILES:
      return getFiles (state, payload)

    case ACTIONS.RESET_FILES:
      return resetFiles (state)

    case ACTIONS.UPDATE_FILE:
      return updateFile (state, payload)

    case ACTIONS.GET_TAGS:
      return getTags (state, payload)

    case ACTIONS.TOGGLE_IS_DISPLAYING_CONVERSIONS:
      return toggleIsDisplayingConversions (state)

    case ACTIONS.GET_CONVERSION:
      return getConversion (state, payload)

    case ACTIONS.TOGGLE_CONVERSIONS:
      return toggleConversions (state, payload)

    case ACTIONS.TOGGLE_IS_DISPLAYING_MIRRORS:
      return toggleIsDisplayingMirrors (state)

    case ACTIONS.GET_MIRROR:
      return getMirror (state, payload)

    case ACTIONS.TOGGLE_MIRRORS:
      return toggleMirrors (state, payload)

    case ACTIONS.TOGGLE_EXPAND:
      return toggleExpand (state, payload)

    case ACTIONS.SET_NAMES_TO_FILE_NAME:
      return setNamesToFileName (state)

    case ACTIONS.SET_NAMES_TO_UUID:
      return setNamesToUUID (state)

    case ACTIONS.SET_NAME_TO_FILE_NAME:
      return setNameToFileName (state, payload)

    case ACTIONS.SET_NAME_TO_UUID:
      return setNameToUUID (state, payload)

    default:
      throw new Error (INVALID_ACTION_ERROR)
  }
}

const initialState = {
  files: [],
  globalTags: '',
  conversions: Object.keys (CONVERSIONS)
  .reduce ((accumulator, key) => {
    const conversions = { ...accumulator }

    conversions[key] = true

    return conversions
  }, {}),
  mirrors: Object.keys (MIRRORS)
  .reduce ((accumulator, key) => {
    const mirrors = { ...accumulator }

    mirrors[key] = true

    return mirrors
  }, {}),
  isDisplayingConversions: false,
  isDisplayingMirrors: false,
}

const Page = () => {
  const [state, dispatch] = useReducer (reducer, initialState)

  const onSubmit = () => {
    const submissions = state.files.map (item => ({
      file: item.file,
      data: {
        file: item.file.name,
        name: item.name,
        description: item.description,
        tags: [...new Set ([...state.globalTags.split (/\s+/), ...item.tags.split (/\s+/)])],
        conversions: item.conversions,
        mirrors: item.mirrors,
      },
    }))

    console.log (submissions)

    dispatch ({ type: ACTIONS.RESET_FILES })
  }

  const onSelectFiles = ({ target: { files } }) => {
    dispatch ({ type: ACTIONS.GET_FILES, payload: files })
  }

  const onChangeTags = ({ target: { value } }) => {
    dispatch ({ type: ACTIONS.GET_TAGS, payload: value })
  }

  const onChangeConversion = selector => ({ target: { checked }}) => {
    const payload = { selector, isEnabled: checked }

    dispatch ({ type: ACTIONS.GET_CONVERSION, payload })
  }

  const onChangeMirror = selector => ({ target: { checked }}) => {
    const payload = { selector, isEnabled: checked }

    dispatch ({ type: ACTIONS.GET_MIRROR, payload })
  }

  const onClickToggleConversions = isEnabled => () => {
    dispatch ({ type: ACTIONS.TOGGLE_CONVERSIONS, payload: isEnabled })
  }

  const onClickToggleMirrors = isEnabled => () => {
    dispatch ({ type: ACTIONS.TOGGLE_MIRRORS, payload: isEnabled })
  }

  const onClickToggleIsDisplayingConversions = () => {
    dispatch ({ type: ACTIONS.TOGGLE_IS_DISPLAYING_CONVERSIONS })
  }

  const onClickToggleIsDisplayingMirrors = () => {
    dispatch ({ type: ACTIONS.TOGGLE_IS_DISPLAYING_MIRRORS })
  }

  const onClickToggleExpand = payload => () => {
    dispatch ({ type: ACTIONS.TOGGLE_EXPAND, payload })
  }

  const onClickSetNamesToFileName = () => {
    dispatch ({ type: ACTIONS.SET_NAMES_TO_FILE_NAME })
  }

  const onClickSetNamesToUUID = () => {
    dispatch ({ type: ACTIONS.SET_NAMES_TO_UUID })
  }

  const onClickSetNameToFileName = index => () => {
    dispatch ({ type: ACTIONS.SET_NAME_TO_FILE_NAME, payload: index })
  }

  const onClickSetNameToUUID = index => () => {
    dispatch ({ type: ACTIONS.SET_NAME_TO_UUID, payload: index })
  }

  const onChangeFile = (index, key) => ({ target: { value } }) => {
    const payload = { index, value, key }

    dispatch ({ type: ACTIONS.UPDATE_FILE, payload })
  }

  const renderConversionOptions = () => {
    let options

    if (state.isDisplayingConversions) {
      const list = Object.keys (state.conversions).map (key => {
        const id = `all-${key}`
        const value = state.conversions[key]

        return (
          <div key={id}>
            <input
              style={{ marginRight: '6px' }}
              id={id}
              type='checkbox'
              checked={value}
              onChange={onChangeConversion (key)}
            />
            <label htmlFor={id}>{CONVERSIONS[key]}</label>
          </div>
        )
      })

      let toggles

      if (Object.keys (state.conversions).length > 1) {
        toggles = (
          <div>
            <button onClick={onClickToggleConversions (true)}>
              enable all
            </button>
            <button onClick={onClickToggleConversions (false)}>
              disable all
            </button>
          </div>
        )
      }

      options = (
        <div>
          {toggles}
          {list}
        </div>
      )
    }

    return (
      <>
        <div>
          <button onClick={onClickToggleIsDisplayingConversions}>
            {state.isDisplayingConversions ? 'hide conversion options' : 'show conversion options'}
          </button>
        </div>
        {options}
      </>
    )
  }

  const renderMirrorOptions = () => {
    let options

    if (state.isDisplayingMirrors) {
      const list = Object.keys (state.mirrors).map (key => {
        const id = `all-${key}`
        const value = state.mirrors[key]

        return (
          <div key={id}>
            <input
              style={{ marginRight: '6px' }}
              id={id}
              type='checkbox'
              checked={value}
              onChange={onChangeMirror (key)}
            />
            <label htmlFor={id}>{MIRRORS[key]}</label>
          </div>
        )
      })

      let toggles

      if (Object.keys (state.mirrors).length > 1) {
        toggles = (
          <div>
            <button onClick={onClickToggleMirrors (true)}>
              enable all
            </button>
            <button onClick={onClickToggleMirrors (false)}>
              disable all
            </button>
          </div>
        )
      }

      options = (
        <div>
          {toggles}
          {list}
        </div>
      )
    }

    return (
      <>
        <div>
          <button onClick={onClickToggleIsDisplayingMirrors}>
            {state.isDisplayingMirrors ? 'hide mirror options' : 'show mirror options'}
          </button>
        </div>
        {options}
      </>
    )
  }

  const renderPreview = ({ preview, displayType }) => {
    let element

    if (displayType === 'image') element = (
      <img
        style={{ maxWidth: '200px', maxHeight: '200px' }}
        src={preview}
      />
    )

    if (displayType === 'video') element = (
      <video
        style={{ maxWidth: '200px', maxHeight: '200px' }}
        src={preview}
        autoPlay={true}
        muted={true}
        loop={true}
        controls={false}
      >
        <p></p>
      </video>
    )

    if (element) return (
      <a href={preview} rel="noopener noreferrer" target="_blank">{element}</a>
    )
  }

  const renderExpandOptions = () => {
    if (state.files.length > 0) return (
      <div style={{ marginBottom: '32px' }}>
        <button onClick={onClickToggleExpand (false)}>collapse all</button>
        <button onClick={onClickToggleExpand (true)}>expand all</button>
      </div>
    )
  }

  const renderFiles = () => state.files.map ((item, index) => {
    const key = item.file.name
    const symbol = item.isDisplayingInfo ? '(-)' : '(+)'
    let info

    if (item.isDisplayingInfo) {
      info = (
        <>
          {renderPreview (item)}
          <label style={{ display: 'block' }} htmlFor={`${key}-name`}>name</label>
          <input
            id={`${key}-name`}
            type='text'
            value={item.name}
            onChange={onChangeFile (index, 'name')}
          />
          <label style={{ display: 'block' }} htmlFor={`${key}-description`}>description</label>
          <textarea
            id={`${key}-description`}
            value={item.description}
            onChange={onChangeFile (index, 'description')}
          />
          <label style={{ display: 'block' }} htmlFor={`${key}-tags`}>tags</label>
          <input
            id={`${key}-tags`}
            type='text'
            value={item.tags}
            onChange={onChangeFile (index, 'tags')}
          />
          <div>
            <button onClick={onClickSetNameToFileName (index)}>set name to file name</button>
            <button onClick={onClickSetNameToUUID (index)}>set name to uuid</button>
          </div>
        </>
      )
    }

    return (
      <div key={key} style={{ marginBottom: '32px' }}>
        <div
          style={{ fontWeight: 'bold', cursor: 'pointer' }}
          onClick={onChangeFile (index, 'isDisplayingInfo')}
        >
          {`${key} ${symbol}`}
        </div>
        {info}
      </div>
    )
  })

  return (
    <>
      <input type='file' multiple onChange={onSelectFiles} />
      <label style={{ display: 'block' }} htmlFor='all tags'>all tags</label>
      <input
        id='all-tags'
        type='text'
        value={state.globalTags}
        onChange={onChangeTags}
        style={{ display: 'block' }}
      />
      <div>
        <button onClick={onClickSetNamesToFileName}>set names to file name</button>
        <button onClick={onClickSetNamesToUUID}>set names to uuid</button>
      </div>
      {renderConversionOptions ()}
      {renderMirrorOptions ()}
      <button style={{ marginBottom: '32px' }} onClick={onSubmit}>submit</button>
      {renderExpandOptions ()}
      {renderFiles ()}
    </>
  )
}

// Page.getInitialProps =
//   async () => {
//     return { phrase: 'hello world' }
//   }

export default Page

