import { useState, useEffect } from 'react'

const DEFAULT_ALL_CONVERSIONS = {
  webmToMp4: true,
  webmToLargeThumbnailWebm: true,
  webmToMediumThumbnailWebm: true,
  webmToSmallThumbnailWebm: true,
  webmToLargeThumbnailPng: true,
  webmToMediumThumbnailPng: true,
  webmToSmallThumbnailPng: true,
  webmToLargeThumbnailPngSlideshow: true,
  webmToMediumThumbnailPngSlideshow: true,
  webmToSmallThumbnailPngSlideshow: true,
  mp4ToWebm: true,
  mp4ToLargeThumbnailMp4: true,
  mp4ToMediumThumbnailMp4: true,
  mp4ToSmallThumbnailMp4: true,
  mp4ToLargeThumbnailPng: true,
  mp4ToMediumThumbnailPng: true,
  mp4ToSmallThumbnailPng: true,
  mp4ToLargeThumbnailPngSlideshow: true,
  mp4ToMediumThumbnailPngSlideshow: true,
  mp4ToSmallThumbnailPngSlideshow: true,
  jpgToPng: true,
  pngToLargeThumbnailPng: true,
  pngToMediumThumbnailPng: true,
  pngToSmallThumbnailPng: true,
  gifToWebm: true,
  gifToMp4: true,
  flvToWebm: true,
  flvToMp4: true,
  movToWebm: true,
  movToMp4: true,
  aviToWebm: true,
  aviToMp4: true,
  wmvToWebm: true,
  wmvToMp4: true,
}

const DEFAULT_ALL_UPLOADS = {
  imgur: false,
  gfycat: false,
}

const getConversionOptions = mime => {
  const options = []
  const conversionType = getConversionType (mime)

  if (mime === 'video/flv' || !mime) {
    options.push ({
      name: 'FLV to WEBM',
      selector: 'flvToWebm',
    })

    options.push ({
      name: 'FLV to MP4',
      selector: 'flvToMp4',
    })
  }

  if (mime === 'video/quicktime' || !mime) {
    options.push ({
      name: 'MOV to WEBM',
      selector: 'movToWebm',
    })

    options.push ({
      name: 'MOV to MP4',
      selector: 'movToMp4',
    })
  }

  if (mime === 'video/avi' || mime === 'video/x-msvideo' || mime === 'video/msvideo' || !mime) {
    options.push ({
      name: 'AVI to WEBM',
      selector: 'aviToWebm',
    })

    options.push ({
      name: 'AVI to MP4',
      selector: 'aviToMp4',
    })
  }

  if (mime === 'video/x-ms-wmv' || !mime) {
    options.push ({
      name: 'WMV to WEBM',
      selector: 'wmvToWebm',
    })

    options.push ({
      name: 'WMV to MP4',
      selector: 'wmvToMp4',
    })
  }

  if (mime === 'image/gif' || !mime) {
    options.push ({
      name: 'GIF to WEBM',
      selector: 'gifToWebm',
    })

    options.push ({
      name: 'GIF to MP4',
      selector: 'gifToMp4',
    })
  }

  if (conversionType === 'image' || !mime) {
    options.push ({
      name: 'JPG to PNG',
      selector: 'jpgToPng',
    })

    options.push ({
      name: 'PNG to Large Thumbnail PNG',
      selector: 'pngToLargeThumbnailPng',
    })

    options.push ({
      name: 'PNG to Medium Thumbnail PNG',
      selector: 'pngToMediumThumbnailPng',
    })

    options.push ({
      name: 'PNG to Small Thumbnail PNG',
      selector: 'pngToSmallThumbnailPng',
    })
  }

  if (conversionType === 'video' || !mime) {
    options.push ({
      name: 'WEBM to MP4',
      selector: 'webmToMp4',
    })

    options.push ({
      name: 'WEBM to Large Thumbnail WEBM',
      selector: 'webmToLargeThumbnailWebm',
    })

    options.push ({
      name: 'WEBM to Medium Thumbnail WEBM',
      selector: 'webmToMediumThumbnailWebm',
    })

    options.push ({
      name: 'WEBM to Small Thumbnail WEBM',
      selector: 'webmToSmallThumbnailWebm',
    })

    options.push ({
      name: 'WEBM to Large Thumbnail PNG',
      selector: 'webmToLargeThumbnailPng',
    })

    options.push ({
      name: 'WEBM to Medium Thumbnail PNG',
      selector: 'webmToMediumThumbnailPng',
    })

    options.push ({
      name: 'WEBM to Small Thumbnail PNG',
      selector: 'webmToSmallThumbnailPng',
    })

    options.push ({
      name: 'WEBM to Large Thumbnail PNG Slideshow',
      selector: 'webmToLargeThumbnailPngSlideshow',
    })

    options.push ({
      name: 'WEBM to Medium Thumbnail PNG Slideshow',
      selector: 'webmToMediumThumbnailPngSlideshow',
    })

    options.push ({
      name: 'WEBM to Small Thumbnail PNG Slideshow',
      selector: 'webmToSmallThumbnailPngSlideshow',
    })

    options.push ({
      name: 'MP4 to WEBM',
      selector: 'mp4ToWebm',
    })

    options.push ({
      name: 'MP4 to Large Thumbnail MP4',
      selector: 'mp4ToLargeThumbnailMp4',
    })

    options.push ({
      name: 'MP4 to Medium Thumbnail MP4',
      selector: 'mp4ToMediumThumbnailMp4',
    })

    options.push ({
      name: 'MP4 to Small Thumbnail MP4',
      selector: 'mp4ToSmallThumbnailMp4',
    })

    options.push ({
      name: 'MP4 to Large Thumbnail PNG',
      selector: 'mp4ToLargeThumbnailPng',
    })

    options.push ({
      name: 'MP4 to Medium Thumbnail PNG',
      selector: 'mp4ToMediumThumbnailPng',
    })

    options.push ({
      name: 'MP4 to Small Thumbnail PNG',
      selector: 'mp4ToSmallThumbnailPng',
    })

    options.push ({
      name: 'MP4 to Large Thumbnail PNG Slideshow',
      selector: 'webmToLargeThumbnailPngSlideshow',
    })

    options.push ({
      name: 'MP4 to Medium Thumbnail PNG Slideshow',
      selector: 'webmToMediumThumbnailPngSlideshow',
    })

    options.push ({
      name: 'MP4 to Small Thumbnail PNG Slideshow',
      selector: 'webmToSmallThumbnailPngSlideshow',
    })
  }

  return options
}

const getConversionType = mime => {
  switch (mime) {
    case 'image/jpeg':
    case 'image/png':
      return 'image'
    case 'video/webm':
    case 'video/mp4':
    case 'video/x-flv':
    case 'video/quicktime':
    case 'video/avi':
    case 'video/x-msvideo':
    case 'video/msvideo':
    case 'video/x-ms-wmv':
    case 'image/gif':
      return 'video'
  }
}

const getDisplayType = mime => {
  switch (mime) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
      return 'image'
    case 'video/webm':
    case 'video/mp4':
      return 'video'
  }
}

const getConversions = (mime, state) => {
  const options = getConversionOptions (mime)

  return options.reduce ((accumulator, current) => {
    accumulator[current.selector] = state[current.selector]

    return accumulator
  }, {})
}

const getUploads = (mime, state) => {
  const conversionType = getConversionType (mime)

  if (conversionType === 'image') return {
    imgur: state.imgur,
  }

  if (conversionType === 'video') return {
    gfycat: state.gfycat,
  }
}

const Page =
  () => {
    const [files, setFiles] = useState ([])
    const [staged, setStaged] = useState ([])
    const [allTags, setAllTags] = useState ('')
    const [allConversions, setAllConversions] = useState (DEFAULT_ALL_CONVERSIONS)
    const [allUploads, setAllUploads] = useState (DEFAULT_ALL_UPLOADS)
    const [isDisplayingConversions, setIsDisplayingConversions] = useState (false)
    const [isDisplayingUploads, setIsDisplayingUploads] = useState (false)

    useEffect (() => {
      setStaged (
        files
          .map (file => ({
            file,
            name: file.name.replace (/\.[^/.]+$/, ''),
            mime: file.type,
            description: '',
            tags: '',
            preview: URL.createObjectURL (file),
            isOverridingConversions: false,
            isOverridingUploads: false,
            isDisplayingInfo: false,
            conversions: getConversions (file.type, allConversions),
            uploads: getUploads (file.type, allUploads),
          }))
          .filter (staged => !!getConversionType (staged.mime))
      )
    }, [files])

    const onSubmit = () => {
      const submissions = staged.map (item => ({
        file: item.file,
        data: {
          file: item.file.name,
          name: item.name,
          description: item.description,
          tags: [...new Set ([...allTags.split (/\s+/), ...item.tags.split (/\s+/)])],
          conversions: item.isOverridingConversions
            ? item.conversions
            : getConversions (item.mime, allConversions),
          uploads: item.isOverridingUploads
            ? item.uploads
            : getUploads (item.mime, allUploads),
        },
      }))

      console.log (submissions)

      setFiles ([])
    }

    const onStage = ({ target: { files } }) => setFiles ([...files])

    const onChangeAllTags = ({ target: { value } }) =>
      setAllTags (value)

    const onChangeAllConversions = selector => ({ target: { checked }}) => {
      const update = {...allConversions}

      update[selector] = checked

      setAllConversions (update)
    }

    const onChangeAllUploads = selector => ({ target: { checked }}) => {
      const update = {...allUploads}

      update[selector] = checked

      setAllUploads (update)
    }

    const onClickToggleAllConversions = isEnabled => () => {
      const update = {...allConversions}

      Object.keys (allConversions)
        .forEach (key => (update[key] = isEnabled))

      setAllConversions (update)
    }

    const onClickToggleAllUploads = isEnabled => () => {
      const update = {...allUploads}

      Object.keys (allUploads)
        .forEach (key => (update[key] = isEnabled))

      setAllUploads (update)
    }

    const onChangeConversions = (selector, index) => ({ target: { checked }}) => {
      const update = [...staged]

      update[index].conversions[selector] = checked

      setStaged (update)
    }

    const onChangeUploads = (selector, index) => ({ target: { checked }}) => {
      const update = [...staged]

      update[index].uploads[selector] = checked

      setStaged (update)
    }

    const onClickToggleConversions = (index, isEnabled) => () => {
      const { conversions } = staged[index]
      const update = [...staged]

      Object.keys (conversions)
        .forEach (key => (update[index].conversions[key] = isEnabled))

      setStaged (update)
    }

    const onClickToggleUploads = (index, isEnabled) => () => {
      const { uploads } = staged[index]
      const update = [...staged]

      Object.keys (uploads)
        .forEach (key => (update[index].uploads[key] = isEnabled))

      setStaged (update)
    }

    const onChangeName = index => ({ target: { value } }) => {
      const update = [...staged]

      update[index].name = value

      setStaged (update)
    }

    const onChangeDescription = index => ({ target: { value } }) => {
      const update = [...staged]

      update[index].description = value

      setStaged (update)
    }

    const onChangeTags = index => ({ target: { value } }) => {
      const update = [...staged]

      update[index].tags = value

      setStaged (update)
    }

    const onChangeIsDisplayingInfo = index => () => {
      const update = [...staged]

      update[index].isDisplayingInfo = !staged[index].isDisplayingInfo

      setStaged (update)
    }

    const onChangeIsOverridingConversions = index => () => {
      const update = [...staged]

      update[index].isOverridingConversions = !staged[index].isOverridingConversions

      setStaged (update)
    }

    const onChangeIsOverridingUploads = index => () => {
      const update = [...staged]

      update[index].isOverridingUploads = !staged[index].isOverridingUploads

      setStaged (update)
    }

    const renderAllConversionOptions = () => {
      let options

      if (isDisplayingConversions) {
        const list = getConversionOptions ().map (option => {
          const id = `all-${option.selector}`
          const value = allConversions[option.selector]

          return (
            <div key={id}>
              <input
                style={{ marginRight: '6px' }}
                id={id}
                type='checkbox'
                checked={value}
                onChange={onChangeAllConversions (option.selector)}
              />
              <label htmlFor={id}>{option.name}</label>
            </div>
          )
        })

        let toggles

        if (Object.keys (allConversions).length > 1) {
          toggles = (
            <div>
              <button onClick={onClickToggleAllConversions (true)}>
                enable all
              </button>
              <button onClick={onClickToggleAllConversions (false)}>
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
            <button onClick={() => setIsDisplayingConversions (!isDisplayingConversions)}>
              {isDisplayingConversions ? 'hide conversion options' : 'show conversion options'}
            </button>
          </div>
          {options}
        </>
      )
    }

    const renderAllUploadOptions = () => {
      let options

      if (isDisplayingUploads) {
        const list = Object.keys (allUploads).map (key => {
          const id = `all-${key}`
          const value = allUploads[key]

          return (
            <div key={id}>
              <input
                style={{ marginRight: '6px' }}
                id={id}
                type='checkbox'
                checked={value}
                onChange={onChangeAllUploads (key)}
              />
              <label htmlFor={id}>{key}</label>
            </div>
          )
        })

        let toggles

        if (Object.keys (allUploads).length > 1) {
          toggles = (
            <div>
              <button onClick={onClickToggleAllUploads (true)}>
                enable all
              </button>
              <button onClick={onClickToggleAllUploads (false)}>
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
            <button onClick={() => setIsDisplayingUploads (!isDisplayingUploads)}>
              {isDisplayingUploads ? 'hide upload options' : 'show upload options'}
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
        const list = getConversionOptions (mime).map (option => {
          const id = `${file.name}-${option.selector}`
          const value = conversions[option.selector]

          return (
            <div key={id}>
              <input
                style={{ marginRight: '6px' }}
                id={id}
                type='checkbox'
                checked={value}
                onChange={onChangeConversions (option.selector, index)}
              />
              <label htmlFor={id}>{option.name}</label>
            </div>
          )
        })

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
            <button onClick={onChangeIsOverridingConversions (index)}>
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

    const renderUploadOptions = (item, index) => {
      const { file, uploads, isOverridingUploads } = item
      let options

      if (isOverridingUploads) {
        const list = Object.keys (uploads).map (key => {
          const id = `${file.name}-${key}`
          const value = uploads[key]

          return (
            <div key={id}>
              <input
                style={{ marginRight: '6px' }}
                id={id}
                type='checkbox'
                checked={value}
                onChange={onChangeUploads (key, index)}
              />
              <label htmlFor={id}>{key}</label>
            </div>
          )
        })

        let toggles

        if (Object.keys (uploads).length > 1) {
          toggles = (
            <div>
              <button onClick={onClickToggleUploads (index, true)}>
                enable all
              </button>
              <button onClick={onClickToggleUploads (index, false)}>
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
            <button onClick={onChangeIsOverridingUploads (index)}>
              {
                isOverridingUploads
                  ? 'disable override uploads'
                  : 'enable override uploads'
              }
            </button>
          </div>
          <div>{options}</div>
        </>
      )
    }

    const renderPreview = ({ preview, mime }) => {
      const displayType = getDisplayType (mime)
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
          controls={false}
        />
      )

      if (element) return (
        <a href={preview} rel="noopener noreferrer" target="_blank">{element}</a>
      )
    }

    const renderStaged = () => staged.map ((item, index) => {
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
              onChange={onChangeName (index)}
            />
            <label style={{ display: 'block' }} htmlFor={`${key}-description`}>description</label>
            <textarea
              id={`${key}-description`}
              value={item.description}
              onChange={onChangeDescription (index)}
            />
            <label style={{ display: 'block' }} htmlFor={`${key}-tags`}>tags</label>
            <input
              id={`${key}-tags`}
              type='text'
              value={item.tags}
              onChange={onChangeTags (index)}
            />
            {renderConversionOptions (item, index)}
            {renderUploadOptions (item, index)}
          </>
        )
      }

      return (
        <div key={key} style={{ marginBottom: '32px' }}>
          <div
            style={{ fontWeight: 'bold', cursor: 'pointer' }}
            onClick={onChangeIsDisplayingInfo (index)}
          >
            {`${key} ${symbol}`}
          </div>
          {info}
        </div>
      )
    })

    return (
      <>
        <input type='file' multiple onChange={onStage} />
        <label style={{ display: 'block' }} htmlFor='all tags'>all tags</label>
        <input
          id='all-tags'
          type='text'
          value={allTags}
          onChange={onChangeAllTags}
          style={{ display: 'block' }}
        />
        {renderAllConversionOptions ()}
        {renderAllUploadOptions ()}
        <button style={{ marginBottom: '32px' }} onClick={onSubmit}>submit</button>
        {renderStaged ()}
      </>
    )
  }

// Page.getInitialProps =
//   async () => {
//     return { phrase: 'hello world' }
//   }

export default Page
