/* eslint-env node */

const archiver = require('archiver')
const fs = require('fs')
const hash = require('object-hash')
const moment = require('moment')
const term = require('terminal-kit').terminal


const termln = line => {
  term(`${line}\n`)
}

// const termln = () => {}

let tags = {}
const bases = []

const files = fs.readdirSync('data')
files.forEach(file => {
  const data = fs.readFileSync(`data/${file}`, 'utf8')
  if (file === 'tags.json') {
    tags = JSON.parse(data)
    termln('Tags read.')
  } else if (file === 'current.json') {
    termln('Current passed.')
  } else if (file.indexOf('_') !== 0) {
    const base = JSON.parse(data)
    bases.push(base)
    termln(`Base ${base.path} read.`)
  }
})

// create items
const tagsNameMap = {}
for (const key in tags) {
  const tag = tags[key]
  tagsNameMap[tag.name] = tag
}

const items = ['All'].concat(Object.keys(tagsNameMap))

term.gridMenu(items, (err, response) => {
  const { selectedIndex, selectedText } = response

  const name = moment().format('YYYY-MM-DD--HH-mm-ss-SSSS') + `_${selectedText.replace(/\//g, '-')}`
  const path = `export/${name}`

  const output = fs.createWriteStream(`${path}.zip`)
  const archive = archiver('zip', { level: 1 })
  const list = []

  output.on('close', () => {
    termln(archive.pointer() + ' total bytes')
    termln('archiver has been finalized and the output file descriptor has closed.')
    process.exit()
  })

  output.on('end', () => {
    termln('Data has been drained')
  })

  archive.on('warning', err => {
    if (err.code === 'ENOENT') {
      termln(`warning: ${err}`)
    } else {
      throw err
    }
  })

  archive.on('error', err => {
    throw err
  })

  const progressBar = term.progressBar({
    percent: true,
    eta: true
  })
  archive.on('progress', data => {
    progressBar.update(data.fs.processedBytes / data.fs.totalBytes)
  })

  archive.pipe(output)

  if (selectedIndex === 0) {
    /*
    fs.mkdirSync(path, 0o777)

    const list = []
    const pictureIdMap = {}

    for (const tagId in tags) {
      if (tagId !== '0') {
        const tag = tags[tagId]
        fs.mkdirSync(`${path}/${tag.name.replace(/\//g, '-')}`, 0o777)
        let count = 0
        bases.forEach(base => {
          const pictureIds = base.tagged[tagId]
          if (pictureIds) {
            pictureIds.forEach(pictureId => {
              const picture = base.all[pictureId]
              list.push({
                src: `${base.path}${picture.path}`,
                dest: `${tag.name}/${picture.path}`
              })
              pictureIdMap[pictureId] = picture
              count++
            })
          }
        })
        termln(`${tag.name}: ${count}`)
      }
    }

    termln(`All: ${Object.keys(pictureIdMap).length}`)
    */

    bases.forEach(base => {
      const pictureIdMap = {}
      for (const tagId in base.tagged) {
        if (tagId !== '0') {
          const pictureIds = base.tagged[tagId]
          if (pictureIds) {
            pictureIds.forEach(pictureId => {
              pictureIdMap[pictureId] = true
            })
          }
        }
      }
      for (const pictureId in pictureIdMap) {
        const picture = base.all[pictureId]
        list.push({
          src: `${base.path}${picture.path}`,
          dest: `${hash(base.path)}/${picture.path}`
        })
      }
    })
    list.forEach(({ src, dest }) => {
      archive.file(src, { name: dest })
    })
  } else {
    const tag = tagsNameMap[selectedText]
    const tagId = tag.id

    bases.forEach(base => {
      const pictureIds = base.tagged[tagId]
      if (pictureIds) {
        pictureIds.forEach(pictureId => {
          const picture = base.all[pictureId]
          list.push({
            src: `${base.path}${picture.path}`,
            dest: `${picture.path}`
          })
        })
      }
    })
  }

  list.forEach(({ src, dest }) => {
    archive.file(src, { name: dest })
  })
  if (list.length > 0) {
    archive.finalize()
  } else {
    process.exit()
  }
})
