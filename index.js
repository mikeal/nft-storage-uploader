import { list } from 'recursive-readdir-async'
import { readFile } from 'fs/promises'
import { NFTStorage, File } from 'nft.storage'

const inmemoryRecursiveDirectory = async (path, token) => {
  if (!path.endsWith('/')) path += '/'
  const results = (await list(path, { realPath: false })).map(({...r}) => {
    // convert to relative paths
    return { ...r, relative: r.fullname.slice(path.length) }
  })
  const files = await Promise.all(results.map(async ({ fullname, relative }) => {
    if (!fullname || !relative) throw new Error('nope')
    return new File([ await readFile(fullname) ], relative)
  }))

  const storage = new NFTStorage({ token })
  const cid = await storage.storeDirectory(files)
  console.log({ cid })
  const status = await storage.status(cid)
  console.log(status)
}

inmemoryRecursiveDirectory(/* local path to directory */, /* nft.storage token */)
