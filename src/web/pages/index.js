// TODO: refactor conversion code (specify mp4 codecs, limit file conversions to only relevant)
// TODO: dont show preview for mp4 unless codec is H264
// TODO: use shorthand for functions where possible
// TODO: put reducer in redux (dont persist state)
// TODO: convert 'set name' feature to dropdown with options (name, random words, uuid, shortcode)
// TODO: use database for tags (unique name + description)

import { useState, useEffect, useReducer } from 'react'
import asyncForEach from 'toolbelt/util/async-for-each'
import uuid from 'toolbelt/util/uuid'

const ACTIONS = {
  GET_FILES: 'GET_FILES',
  RESET_FILES: 'RESET_FILES',
  UPDATE_FILE: 'UPDATE_FILE',
  GET_GLOBAL_TAGS: 'GET_GLOBAL_TAGS',
  GET_GLOBAL_CONVERSION: 'GET_GLOBAL_CONVERSION',
  TOGGLE_GLOBAL_CONVERSIONS: 'TOGGLE_GLOBAL_CONVERSIONS',
  TOGGLE_IS_DISPLAYING_CONVERSIONS: 'TOGGLE_IS_DISPLAYING_CONVERSIONS',
  GET_CONVERSION: 'GET_CONVERSION',
  TOGGLE_CONVERSIONS: 'TOGGLE_CONVERSIONS',
  GET_GLOBAL_MIRROR: 'GET_GLOBAL_MIRROR',
  TOGGLE_GLOBAL_MIRRORS: 'TOGGLE_GLOBAL_MIRRORS',
  TOGGLE_IS_DISPLAYING_MIRRORS: 'TOGGLE_IS_DISPLAYING_MIRRORS',
  GET_MIRROR: 'GET_MIRROR',
  TOGGLE_MIRRORS: 'TOGGLE_MIRRORS',
  TOGGLE_GLOBAL_EXPAND: 'TOGGLE_GLOBAL_EXPAND',
  SET_NAMES_TO_FILE_NAME: 'SET_NAMES_TO_FILE_NAME',
  SET_NAMES_TO_UUID: 'SET_NAMES_TO_UUID',
  SET_NAME_TO_FILE_NAME: 'SET_NAME_TO_FILE_NAME',
  SET_NAME_TO_UUID: 'SET_NAME_TO_UUID',
}

const INVALID_ACTION_ERROR = 'Reducer did not receive a valid action.'

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
      // conversions: getConversions (file.type, state.globalConversions), // FIXME
      conversions: {},
      // mirrors: getMirrors (file.type, state.globalMirrors), // FIXME
      mirrors: {},
    }))
    // .filter (file => !!getConversionType (file.mime)) // FIXME
})

const resetFiles = state => ({
  ...state,
  files: [],
})

const getGlobalTags = (state, globalTags) => ({
  ...state,
  globalTags,
})

const updateFile = (state, { index, value, key }) => {
  const files = [...state.files]

  if (
    key === 'isDisplayingInfo'
      || key === 'isOverridingConversions'
      || key === 'isOverridingMirrors'
  ) {
    files[index][key] = !files[index][key]
  } else {
    files[index][key] = value
  }

  return {
    ...state,
    files,
  }
}

const getGlobalConversion = (state, { selector, isEnabled }) => {
  const globalConversions = { ...state.globalConversions }

  globalConversions[selector] = isEnabled

  return {
    ...state,
    globalConversions,
  }
}

const toggleGlobalConversions = (state, isEnabled) => {
  const globalConversions = { ...state.globalConversions }

  Object.keys (globalConversions)
    .forEach (key => (globalConversions[key] = isEnabled))

  return {
    ...state,
    globalConversions,
  }
}

const toggleIsDisplayingConversions = state => ({
  ...state,
  isDisplayingConversions: !state.isDisplayingConversions,
})

const getConversion = (state, { index, selector, isEnabled }) => {
  const files = [...state.files]

  files[index].conversions[selector] = isEnabled

  return {
    ...state,
    files,
  }
}

const toggleConversions = (state, { index, isEnabled }) => {
  const { conversions } = state.files[index]
  const files = [...state.files]

  Object.keys (conversions)
    .forEach (key => (files[index].conversions[key] = isEnabled))

  return {
    ...state,
    files,
  }
}

const getGlobalMirror = (state, { selector, isEnabled }) => {
  const globalMirrors = { ...state.globalMirrors }

  globalMirrors[selector] = isEnabled

  return {
    ...state,
    globalMirrors,
  }
}

const toggleGlobalMirrors = (state, isEnabled) => {
  const globalMirrors = { ...state.globalMirrors }

  Object.keys (globalMirrors)
    .forEach (key => (globalMirrors[key] = isEnabled))

  return {
    ...state,
    globalMirrors,
  }
}

const toggleIsDisplayingMirrors = state => ({
  ...state,
  isDisplayingMirrors: !state.isDisplayingMirrors,
})

const getMirror = (state, { index, selector, isEnabled }) => {
  const files = [...state.files]

  files[index].mirrors[selector] = isEnabled

  return {
    ...state,
    files,
  }
}

const toggleMirrors = (state, { index, isEnabled }) => {
  const { mirrors } = state.files[index]
  const files = [...state.files]

  Object.keys (mirrors)
    .forEach (key => (files[index].mirrors[key] = isEnabled))

  return {
    ...state,
    files,
  }
}

const toggleGlobalExpand = (state, payload) => ({
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

    case ACTIONS.GET_GLOBAL_TAGS:
      return getGlobalTags (state, payload)

    case ACTIONS.GET_GLOBAL_CONVERSION:
      return getGlobalConversion (state, payload)

    case ACTIONS.TOGGLE_GLOBAL_CONVERSIONS:
      return toggleGlobalConversions (state, payload)

    case ACTIONS.TOGGLE_IS_DISPLAYING_CONVERSIONS:
      return toggleIsDisplayingConversions (state)

    case ACTIONS.GET_CONVERSION:
      return getConversion (state, payload)

    case ACTIONS.TOGGLE_CONVERSIONS:
      return toggleConversions (state, payload)

    case ACTIONS.TOGGLE_GLOBAL_MIRRORS:
      return toggleGlobalMirrors (state, payload)

    case ACTIONS.GET_GLOBAL_MIRROR:
      return getGlobalMirror (state, payload)

    case ACTIONS.TOGGLE_IS_DISPLAYING_MIRRORS:
      return toggleIsDisplayingMirrors (state)

    case ACTIONS.GET_MIRROR:
      return getMirror (state, payload)

    case ACTIONS.TOGGLE_MIRRORS:
      return toggleMirrors (state, payload)

    case ACTIONS.TOGGLE_GLOBAL_EXPAND:
      return toggleGlobalExpand (state, payload)

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
  // globalConversions: DEFAULT_GLOBAL_CONVERSIONS,
  // globalMirrors: DEFAULT_GLOBAL_MIRRORS,
  globalConversions: {}, // FIXME
  globalMirrors: {}, // FIXME
  isDisplayingConversions: false,
  isDisplayingMirrors: false,
}

const Page = () => {
  const [state, _dispatch] = useReducer (reducer, initialState)
  const dispatch = action => {
    console.log ('action:', action)
    _dispatch (action)
  }
  console.log ('state:', state)

  const onSubmit = () => {
    const submissions = state.files.map (item => ({
      file: item.file,
      data: {
        file: item.file.name,
        name: item.name,
        description: item.description,
        tags: [...new Set ([...state.globalTags.split (/\s+/), ...item.tags.split (/\s+/)])],
        conversions: item.isOverridingConversions
          ? item.conversions
          : item.conversions,
          // : getConversions (item.mime, state.globalConversions), // FIXME
        mirrors: item.isOverridingMirrors
          ? item.mirrors
          : item.mirrors,
          // : getMirrors (item.mime, state.globalMirrors), // FIXME
      },
    }))

    console.log (submissions)

    dispatch ({ type: ACTIONS.RESET_FILES })
  }

  const onSelectFiles = async ({ target: { files } }) => {
    const items = []

    await asyncForEach (files, async file => {
    })

    dispatch ({ type: ACTIONS.GET_FILES, payload: files })
  }

  const onChangeGlobalTags = ({ target: { value } }) => {
    dispatch ({ type: ACTIONS.GET_GLOBAL_TAGS, payload: value })
  }

  const onChangeGlobalConversion = selector => ({ target: { checked }}) => {
    const payload = { selector, isEnabled: checked }

    dispatch ({ type: ACTIONS.GET_GLOBAL_CONVERSION, payload })
  }

  const onChangeGlobalMirror = selector => ({ target: { checked }}) => {
    const payload = { selector, isEnabled: checked }

    dispatch ({ type: ACTIONS.GET_GLOBAL_MIRROR, payload })
  }

  const onClickToggleGlobalConversions = isEnabled => () => {
    dispatch ({ type: ACTIONS.TOGGLE_GLOBAL_CONVERSIONS, payload: isEnabled })
  }

  const onClickToggleGlobalMirrors = isEnabled => () => {
    dispatch ({ type: ACTIONS.TOGGLE_GLOBAL_MIRRORS, payload: isEnabled })
  }

  const onChangeConversion = (selector, index) => ({ target: { checked }}) => {
    const payload = { selector, index, isEnabled: checked }

    dispatch ({ type: ACTIONS.GET_CONVERSION, payload })
  }

  const onChangeMirror = (selector, index) => ({ target: { checked }}) => {
    const payload = { selector, index, isEnabled: checked }

    dispatch ({ type: ACTIONS.GET_MIRROR, payload })
  }

  const onClickToggleConversions = (index, isEnabled) => () => {
    const payload = { index, isEnabled }

    dispatch ({ type: ACTIONS.TOGGLE_CONVERSIONS, payload })
  }

  const onClickToggleMirrors = (index, isEnabled) => () => {
    const payload = { index, isEnabled }

    dispatch ({ type: ACTIONS.TOGGLE_MIRRORS, payload })
  }

  const onClickToggleIsDisplayingConversions = () => {
    dispatch ({ type: ACTIONS.TOGGLE_IS_DISPLAYING_CONVERSIONS })
  }

  const onClickToggleIsDisplayingMirrors = () => {
    dispatch ({ type: ACTIONS.TOGGLE_IS_DISPLAYING_MIRRORS })
  }

  const onClickToggleGlobalExpand = payload => () => {
    dispatch ({ type: ACTIONS.TOGGLE_GLOBAL_EXPAND, payload })
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

  const renderGlobalConversionOptions = () => {
    let options

    if (state.isDisplayingConversions) {
      const list = [] // FIXME
      // const list = getConversionOptions ().map (option => {
      //   const id = `all-${option.selector}`
      //   const value = state.globalConversions[option.selector]

      //   return (
      //     <div key={id}>
      //       <input
      //         style={{ marginRight: '6px' }}
      //         id={id}
      //         type='checkbox'
      //         checked={value}
      //         onChange={onChangeGlobalConversion (option.selector)}
      //       />
      //       <label htmlFor={id}>{option.name}</label>
      //     </div>
      //   )
      // })

      let toggles

      if (Object.keys (state.globalConversions).length > 1) {
        toggles = (
          <div>
            <button onClick={onClickToggleGlobalConversions (true)}>
              enable all
            </button>
            <button onClick={onClickToggleGlobalConversions (false)}>
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

  const renderGlobalMirrorOptions = () => {
    let options

    if (state.isDisplayingMirrors) {
      const list = Object.keys (state.globalMirrors).map (key => {
        const id = `all-${key}`
        const value = state.globalMirrors[key]

        return (
          <div key={id}>
            <input
              style={{ marginRight: '6px' }}
              id={id}
              type='checkbox'
              checked={value}
              onChange={onChangeGlobalMirror (key)}
            />
            <label htmlFor={id}>{key}</label>
          </div>
        )
      })

      let toggles

      if (Object.keys (state.globalMirrors).length > 1) {
        toggles = (
          <div>
            <button onClick={onClickToggleGlobalMirrors (true)}>
              enable all
            </button>
            <button onClick={onClickToggleGlobalMirrors (false)}>
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

  const renderConversionOptions = (item, index) => {
    const { file, conversions, isOverridingConversions, mime } = item
    let options

    if (isOverridingConversions) {
      const list = [] // FIXME
      // const list = getConversionOptions (mime).map (option => {
      //   const id = `${file.name}-${option.selector}`
      //   const value = conversions[option.selector]

      //   return (
      //     <div key={id}>
      //       <input
      //         style={{ marginRight: '6px' }}
      //         id={id}
      //         type='checkbox'
      //         checked={value}
      //         onChange={onChangeConversion (option.selector, index)}
      //       />
      //       <label htmlFor={id}>{option.name}</label>
      //     </div>
      //   )
      // })

      let toggles

      if (Object.keys (conversions).length > 1) {
        toggles = (
          <div>
            <button onClick={onClickToggleConversions (index, true)}>
              enable all
            </button>
            <button onClick={onClickToggleConversions (index, false)}>
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
          <button onClick={onChangeFile (index, 'isOverridingConversions')}>
            {
              isOverridingConversions
                ? 'disable override conversions'
                : 'enable override conversions'
            }
          </button>
        </div>
        <div>{options}</div>
      </>
    )
  }

  const renderMirrorOptions = (item, index) => {
    const { file, mirrors, isOverridingMirrors } = item
    let options

    if (isOverridingMirrors) {
      const list = Object.keys (mirrors).map (key => {
        const id = `${file.name}-${key}`
        const value = mirrors[key]

        return (
          <div key={id}>
            <input
              style={{ marginRight: '6px' }}
              id={id}
              type='checkbox'
              checked={value}
              onChange={onChangeMirror (key, index)}
            />
            <label htmlFor={id}>{key}</label>
          </div>
        )
      })

      let toggles

      if (Object.keys (mirrors).length > 1) {
        toggles = (
          <div>
            <button onClick={onClickToggleMirrors (index, true)}>
              enable all
            </button>
            <button onClick={onClickToggleMirrors (index, false)}>
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
          <button onClick={onChangeFile (index, 'isOverridingMirrors')}>
            {
              isOverridingMirrors
                ? 'disable override mirrors'
                : 'enable override mirrors'
            }
          </button>
        </div>
        <div>{options}</div>
      </>
    )
  }

  const renderPreview = ({ preview, mime }) => {
    // const displayType = getDisplayType (mime)
    const displayType = '' // FIXME
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
      />
    )

    if (element) return (
      <a href={preview} rel="noopener noreferrer" target="_blank">{element}</a>
    )
  }

  const renderExpandOptions = () => {
    if (state.files.length > 0) return (
      <div style={{ marginBottom: '32px' }}>
        <button onClick={onClickToggleGlobalExpand (false)}>collapse all</button>
        <button onClick={onClickToggleGlobalExpand (true)}>expand all</button>
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
          {renderConversionOptions (item, index)}
          {renderMirrorOptions (item, index)}
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
        onChange={onChangeGlobalTags}
        style={{ display: 'block' }}
      />
      <div>
        <button onClick={onClickSetNamesToFileName}>set names to file name</button>
        <button onClick={onClickSetNamesToUUID}>set names to uuid</button>
      </div>
      {renderGlobalConversionOptions ()}
      {renderGlobalMirrorOptions ()}
      <button style={{ marginBottom: '32px' }} onClick={onSubmit}>submit</button>
      {renderExpandOptions ()}
      {renderFiles ()}
    </>
  )
}

export default Page

// Page.getInitialProps =
//   async () => {
//     return { phrase: 'hello world' }
//   }

// const DEFAULT_GLOBAL_CONVERSIONS = {
//   webmToMp4: true,
//   webmToLargeThumbnailWebm: true,
//   webmToMediumThumbnailWebm: true,
//   webmToSmallThumbnailWebm: true,
//   webmToLargeThumbnailPng: true,
//   webmToMediumThumbnailPng: true,
//   webmToSmallThumbnailPng: true,
//   webmToLargeThumbnailPngSlideshow: true,
//   webmToMediumThumbnailPngSlideshow: true,
//   webmToSmallThumbnailPngSlideshow: true,
//   mp4ToWebm: true,
//   mp4ToLargeThumbnailMp4: true,
//   mp4ToMediumThumbnailMp4: true,
//   mp4ToSmallThumbnailMp4: true,
//   mp4ToLargeThumbnailPng: true,
//   mp4ToMediumThumbnailPng: true,
//   mp4ToSmallThumbnailPng: true,
//   mp4ToLargeThumbnailPngSlideshow: true,
//   mp4ToMediumThumbnailPngSlideshow: true,
//   mp4ToSmallThumbnailPngSlideshow: true,
//   jpgToPng: true,
//   pngToLargeThumbnailPng: true,
//   pngToMediumThumbnailPng: true,
//   pngToSmallThumbnailPng: true,
//   gifToWebm: true,
//   gifToMp4: true,
//   flvToWebm: true,
//   flvToMp4: true,
//   movToWebm: true,
//   movToMp4: true,
//   aviToWebm: true,
//   aviToMp4: true,
//   wmvToWebm: true,
//   wmvToMp4: true,
// }
//
// const DEFAULT_GLOBAL_MIRRORS = {
//   imgur: false,
//   gfycat: false,
// }


// const getConversionOptions = mime => {
//   const options = []
//   const conversionType = getConversionType (mime)
//
//   if (mime === 'video/flv' || !mime) {
//     options.push ({
//       name: 'FLV to WEBM',
//       selector: 'flvToWebm',
//     })
//
//     options.push ({
//       name: 'FLV to MP4',
//       selector: 'flvToMp4',
//     })
//   }
//
//   if (mime === 'video/quicktime' || !mime) {
//     options.push ({
//       name: 'MOV to WEBM',
//       selector: 'movToWebm',
//     })
//
//     options.push ({
//       name: 'MOV to MP4',
//       selector: 'movToMp4',
//     })
//   }
//
//   if (mime === 'video/avi' || mime === 'video/x-msvideo' || mime === 'video/msvideo' || !mime) {
//     options.push ({
//       name: 'AVI to WEBM',
//       selector: 'aviToWebm',
//     })
//
//     options.push ({
//       name: 'AVI to MP4',
//       selector: 'aviToMp4',
//     })
//   }
//
//   if (mime === 'video/x-ms-wmv' || !mime) {
//     options.push ({
//       name: 'WMV to WEBM',
//       selector: 'wmvToWebm',
//     })
//
//     options.push ({
//       name: 'WMV to MP4',
//       selector: 'wmvToMp4',
//     })
//   }
//
//   if (mime === 'image/gif' || !mime) {
//     options.push ({
//       name: 'GIF to WEBM',
//       selector: 'gifToWebm',
//     })
//
//     options.push ({
//       name: 'GIF to MP4',
//       selector: 'gifToMp4',
//     })
//   }
//
//   if (mime === 'image/jpeg' || !mime) {
//     options.push ({
//       name: 'JPG to PNG',
//       selector: 'jpgToPng',
//     })
//   }
//
//   if (conversionType === 'image' || !mime) {
//     options.push ({
//       name: 'PNG to Large Thumbnail PNG',
//       selector: 'pngToLargeThumbnailPng',
//     })
//
//     options.push ({
//       name: 'PNG to Medium Thumbnail PNG',
//       selector: 'pngToMediumThumbnailPng',
//     })
//
//     options.push ({
//       name: 'PNG to Small Thumbnail PNG',
//       selector: 'pngToSmallThumbnailPng',
//     })
//   }
//
//   if (conversionType === 'video' || !mime) {
//     options.push ({
//       name: 'WEBM to MP4',
//       selector: 'webmToMp4',
//     })
//
//     options.push ({
//       name: 'WEBM to Large Thumbnail WEBM',
//       selector: 'webmToLargeThumbnailWebm',
//     })
//
//     options.push ({
//       name: 'WEBM to Medium Thumbnail WEBM',
//       selector: 'webmToMediumThumbnailWebm',
//     })
//
//     options.push ({
//       name: 'WEBM to Small Thumbnail WEBM',
//       selector: 'webmToSmallThumbnailWebm',
//     })
//
//     options.push ({
//       name: 'WEBM to Large Thumbnail PNG',
//       selector: 'webmToLargeThumbnailPng',
//     })
//
//     options.push ({
//       name: 'WEBM to Medium Thumbnail PNG',
//       selector: 'webmToMediumThumbnailPng',
//     })
//
//     options.push ({
//       name: 'WEBM to Small Thumbnail PNG',
//       selector: 'webmToSmallThumbnailPng',
//     })
//
//     options.push ({
//       name: 'WEBM to Large Thumbnail PNG Slideshow',
//       selector: 'webmToLargeThumbnailPngSlideshow',
//     })
//
//     options.push ({
//       name: 'WEBM to Medium Thumbnail PNG Slideshow',
//       selector: 'webmToMediumThumbnailPngSlideshow',
//     })
//
//     options.push ({
//       name: 'WEBM to Small Thumbnail PNG Slideshow',
//       selector: 'webmToSmallThumbnailPngSlideshow',
//     })
//
//     options.push ({
//       name: 'MP4 to WEBM',
//       selector: 'mp4ToWebm',
//     })
//
//     options.push ({
//       name: 'MP4 to Large Thumbnail MP4',
//       selector: 'mp4ToLargeThumbnailMp4',
//     })
//
//     options.push ({
//       name: 'MP4 to Medium Thumbnail MP4',
//       selector: 'mp4ToMediumThumbnailMp4',
//     })
//
//     options.push ({
//       name: 'MP4 to Small Thumbnail MP4',
//       selector: 'mp4ToSmallThumbnailMp4',
//     })
//
//     options.push ({
//       name: 'MP4 to Large Thumbnail PNG',
//       selector: 'mp4ToLargeThumbnailPng',
//     })
//
//     options.push ({
//       name: 'MP4 to Medium Thumbnail PNG',
//       selector: 'mp4ToMediumThumbnailPng',
//     })
//
//     options.push ({
//       name: 'MP4 to Small Thumbnail PNG',
//       selector: 'mp4ToSmallThumbnailPng',
//     })
//
//     options.push ({
//       name: 'MP4 to Large Thumbnail PNG Slideshow',
//       selector: 'webmToLargeThumbnailPngSlideshow',
//     })
//
//     options.push ({
//       name: 'MP4 to Medium Thumbnail PNG Slideshow',
//       selector: 'webmToMediumThumbnailPngSlideshow',
//     })
//
//     options.push ({
//       name: 'MP4 to Small Thumbnail PNG Slideshow',
//       selector: 'webmToSmallThumbnailPngSlideshow',
//     })
//   }
//
//   return options
// }
//
// const getConversionType = mime => {
//   switch (mime) {
//     case 'image/jpeg':
//     case 'image/png':
//       return 'image'
//     case 'video/webm':
//     case 'video/mp4':
//     case 'video/x-flv':
//     case 'video/quicktime':
//     case 'video/avi':
//     case 'video/x-msvideo':
//     case 'video/msvideo':
//     case 'video/x-ms-wmv':
//     case 'image/gif':
//       return 'video'
//   }
// }
//
// const getDisplayType = mime => {
//   switch (mime) {
//     case 'image/jpeg':
//     case 'image/png':
//     case 'image/gif':
//       return 'image'
//     case 'video/webm':
//     case 'video/mp4':
//       return 'video'
//   }
// }
//
// const getConversions = (mime, state) => {
//   const options = getConversionOptions (mime)
//
//   return options.reduce ((accumulator, current) => {
//     accumulator[current.selector] = state[current.selector]
//
//     return accumulator
//   }, {})
// }
//
// const getMirrors = (mime, state) => {
//   const conversionType = getConversionType (mime)
//
//   if (conversionType === 'image') return {
//     imgur: state.imgur,
//   }
//
//   if (conversionType === 'video') return {
//     gfycat: state.gfycat,
//   }
// }

