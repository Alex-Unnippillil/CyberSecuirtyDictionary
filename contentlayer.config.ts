import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Term = defineDocumentType(() => ({
  name: 'Term',
  filePathPattern: `terms/*.yaml`,
  contentType: 'data',
  fields: {
    term: { type: 'string', required: true },
    definition: { type: 'string', required: true },
  },
}))

export const Acronym = defineDocumentType(() => ({
  name: 'Acronym',
  filePathPattern: `acronyms/*.yaml`,
  contentType: 'data',
  fields: {
    acronym: { type: 'string', required: true },
    definition: { type: 'string', required: true },
  },
}))

export const Source = defineDocumentType(() => ({
  name: 'Source',
  filePathPattern: `sources/*.yaml`,
  contentType: 'data',
  fields: {
    name: { type: 'string', required: true },
    url: { type: 'string', required: true },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Term, Acronym, Source],
})
