import ReactTags from "react-tag-autocomplete"
import * as React from "react"
import { Tag } from "../../types"
import './AutocomplitableTags.css'

export default ({
                  tags,
                  suggestions,
                  onTagAdd,
                  onTagRemove
                }: { tags: Array<Tag>, suggestions: Array<Tag>, onTagAdd: (tag: Tag) => void, onTagRemove: (index: number) => void }) => {

  return <ReactTags
    tags={tags}
    suggestions={suggestions}
    allowNew={true}
    onDelete={onTagRemove}
    onAddition={onTagAdd}
    placeholderText={"Добавить тег"}
  />
}
